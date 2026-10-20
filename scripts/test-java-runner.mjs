#!/usr/bin/env node
/**
 * Runs Java programs through the SAME in-browser runner the site uses (the TeaVM compiler and runtime in
 * public/java-playground, driven the way lib/java-playground/runner.ts drives them) inside a headless Chromium,
 * and reports which programs pass and why the others fail. It starts a small static server for public/, so it
 * does not need the Next.js dev server.
 *
 *   node scripts/test-java-runner.mjs                    every case: probes, playground examples, notes examples
 *   node scripts/test-java-runner.mjs --only probes      one group: probes | playground | notes
 *   node scripts/test-java-runner.mjs --match printf     only the cases whose name contains the text
 *   node scripts/test-java-runner.mjs --verbose          print every case, not only the failures
 *   node scripts/test-java-runner.mjs --json out.json    write every result
 *   node scripts/test-java-runner.mjs --write docs/plans/java-runner-support.md   write the support table
 *   node scripts/test-java-runner.mjs --fresh            a fresh page (and compiler) for every case
 *
 * A "probe" is a tiny program that uses one Java feature a student commonly reaches for, so the result is a
 * support matrix. The notes examples carry the output the page shows, and must print exactly that.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback = '') => (args.includes(name) ? args[args.indexOf(name) + 1] ?? fallback : fallback);
const verbose = args.includes('--verbose');
const fresh = args.includes('--fresh');
const only = option('--only');
const match = option('--match').toLowerCase();
const jsonOut = option('--json');
const writeTo = option('--write');

const wrap = (body, extra = '') => `${extra}public class Main {\n    public static void main(String[] args) {\n${body.split('\n').map((l) => '        ' + l).join('\n')}\n    }\n}\n`;

/** One feature per probe. `expect` is the exact output when the probe should work in a teaching runner. */
const probes = [
  { name: 'println and string concatenation', code: wrap('System.out.println("a" + 1 + 2.5);'), expect: 'a12.5' },
  { name: 'printf with %d %s %.2f', code: wrap('System.out.printf("%d %s %.2f%n", 7, "x", 3.14159);'), expect: '7 x 3.14' },
  { name: 'String.format with width and padding', code: wrap('System.out.println(String.format("[%5d][%-5s][%05d]", 42, "ab", 7));'), expect: '[   42][ab   ][00007]' },
  { name: 'StringBuilder', code: wrap('StringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 3; i++) sb.append(i).append(",");\nsb.reverse();\nSystem.out.println(sb);'), expect: ',2,1,0' },
  { name: 'ArrayList and for-each', code: wrap('java.util.List<Integer> xs = new java.util.ArrayList<>();\nxs.add(3); xs.add(1); xs.add(2);\njava.util.Collections.sort(xs);\nfor (int x : xs) System.out.print(x + " ");\nSystem.out.println();'), expect: '1 2 3 ' },
  { name: 'HashMap and entrySet', code: wrap('java.util.Map<String,Integer> m = new java.util.HashMap<>();\nm.put("a", 1); m.put("b", 2);\nint s = 0;\nfor (java.util.Map.Entry<String,Integer> e : m.entrySet()) s += e.getValue();\nSystem.out.println(s);'), expect: '3' },
  { name: 'TreeMap, LinkedList, ArrayDeque, PriorityQueue', code: wrap('java.util.TreeMap<Integer,String> t = new java.util.TreeMap<>(); t.put(2,"b"); t.put(1,"a");\njava.util.LinkedList<Integer> l = new java.util.LinkedList<>(); l.addFirst(1); l.addLast(2);\njava.util.ArrayDeque<Integer> d = new java.util.ArrayDeque<>(); d.push(1); d.push(2);\njava.util.PriorityQueue<Integer> q = new java.util.PriorityQueue<>(); q.add(5); q.add(1);\nSystem.out.println(t.firstKey() + " " + l.getFirst() + " " + d.pop() + " " + q.poll());'), expect: '1 1 2 1' },
  { name: 'Arrays.toString, Arrays.sort, 2D array', code: wrap('int[] a = {3,1,2};\njava.util.Arrays.sort(a);\nint[][] g = new int[2][3];\ng[1][2] = 9;\nSystem.out.println(java.util.Arrays.toString(a) + " " + java.util.Arrays.deepToString(g));'), expect: '[1, 2, 3] [[0, 0, 0], [0, 0, 9]]' },
  { name: 'interface, abstract class, polymorphism', code: 'interface Shape { double area(); }\nclass Sq implements Shape { double s; Sq(double s){this.s=s;} public double area(){return s*s;} }\npublic class Main {\n    public static void main(String[] args) {\n        Shape x = new Sq(3);\n        System.out.println(x.area());\n    }\n}\n', expect: '9.0' },
  { name: 'generic class and generic method', code: 'class Box<T> { T v; Box(T v){this.v=v;} T get(){return v;} }\npublic class Main {\n    static <T> T first(T[] a) { return a[0]; }\n    public static void main(String[] args) {\n        System.out.println(new Box<String>("hi").get() + first(new Integer[]{7}));\n    }\n}\n', expect: 'hi7' },
  { name: 'static nested and inner class, anonymous class', code: 'public class Main {\n    static class N { int v = 1; }\n    class I { int w = 2; }\n    public static void main(String[] args) {\n        Runnable r = new Runnable() { public void run() { System.out.println("anon"); } };\n        r.run();\n        System.out.println(new N().v + new Main().new I().w);\n    }\n}\n', expect: 'anon\n3' },
  { name: 'lambda and functional interface', code: wrap('java.util.function.Function<Integer,Integer> f = x -> x * 2;\njava.util.function.BiFunction<Integer,Integer,Integer> g = (a, b) -> a + b;\nSystem.out.println(f.apply(4) + g.apply(1, 2));'), expect: '11' },
  { name: 'streams (IntStream.range, filter, sum)', code: wrap('System.out.println(java.util.stream.IntStream.range(0, 10).filter(i -> i % 2 == 0).sum());'), expect: '20' },
  { name: 'enum with values() and switch', code: 'enum Day { MON, TUE }\npublic class Main {\n    public static void main(String[] args) {\n        for (Day d : Day.values()) {\n            switch (d) { case MON: System.out.println("m"); break; default: System.out.println("other"); }\n        }\n    }\n}\n', expect: 'm\nother' },
  { name: 'record (Java 16)', code: 'record P(int x, int y) {}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new P(1, 2));\n    }\n}\n', expect: 'P[x=1, y=2]' },
  { name: 'var (Java 10) and enhanced switch (Java 14)', code: wrap('var n = 3;\nString s = switch (n) { case 3 -> "three"; default -> "other"; };\nSystem.out.println(s);'), expect: 'three' },
  { name: 'text block (Java 15)', code: wrap('String s = """\n    hi\n    there""";\nSystem.out.println(s);'), expect: 'hi\nthere' },
  { name: 'List.of and Map.of (Java 9)', code: wrap('System.out.println(java.util.List.of(1, 2).size() + java.util.Map.of("a", 1).get("a"));'), expect: '3' },
  { name: 'Optional', code: wrap('System.out.println(java.util.Optional.of(5).map(x -> x + 1).orElse(0));'), expect: '6' },
  { name: 'Math functions and integer overflow', code: wrap('System.out.println(Math.sqrt(16) + " " + Math.pow(2, 10) + " " + Math.abs(-3) + " " + (Integer.MAX_VALUE + 1));'), expect: '4.0 1024.0 3 -2147483648' },
  { name: 'Integer.parseInt, valueOf, toBinaryString, Character methods', code: wrap('System.out.println(Integer.parseInt("42") + Integer.valueOf(8) + " " + Integer.toBinaryString(10) + " " + Character.isDigit(\'7\') + Character.toUpperCase(\'a\'));'), expect: '50 1010 trueA' },
  { name: 'String methods (split, substring, indexOf, compareTo, equalsIgnoreCase, join)', code: wrap('String s = "a,b,c";\nSystem.out.println(s.split(",").length + s.substring(2) + s.indexOf("b") + "x".compareTo("y") + "A".equalsIgnoreCase("a") + String.join("-", "p", "q"));'), expect: '3b,c2-1true' + 'p-q' },
  { name: 'long, double and BigInteger arithmetic', code: wrap('long f = 1; for (int i = 1; i <= 20; i++) f *= i;\nSystem.out.println(f + " " + new java.math.BigInteger("123456789012345678901234567890").multiply(java.math.BigInteger.TWO));'), expect: '2432902008176640000 246913578024691357802469135780' },
  { name: 'exceptions: try/catch/finally and custom exception', code: 'class MyEx extends Exception { MyEx(String m){super(m);} }\npublic class Main {\n    static void f() throws MyEx { throw new MyEx("boom"); }\n    public static void main(String[] args) {\n        try { f(); } catch (MyEx e) { System.out.println(e.getMessage()); } finally { System.out.println("done"); }\n        try { int[] a = new int[1]; a[2] = 1; } catch (ArrayIndexOutOfBoundsException e) { System.out.println("aioobe"); }\n        try { Object o = null; o.toString(); } catch (NullPointerException e) { System.out.println("npe"); }\n        try { System.out.println(1 / (args.length)); } catch (ArithmeticException e) { System.out.println("arith"); }\n    }\n}\n', expect: 'boom\ndone\naioobe\nnpe\narith' },
  { name: 'uncaught exception', code: wrap('throw new IllegalStateException("bad");'), expectError: true },
  { name: 'stack trace printing', code: wrap('try { throw new RuntimeException("x"); } catch (Exception e) { e.printStackTrace(); System.out.println("after"); }'), expectContains: 'after' },
  { name: 'recursion depth 5000 (factorial style)', code: 'public class Main {\n    static int d(int n) { return n == 0 ? 0 : 1 + d(n - 1); }\n    public static void main(String[] args) { System.out.println(d(5000)); }\n}\n', expect: '5000' },
  { name: 'recursion depth 20000', code: 'public class Main {\n    static int d(int n) { return n == 0 ? 0 : 1 + d(n - 1); }\n    public static void main(String[] args) { System.out.println(d(20000)); }\n}\n', expect: '20000' },
  { name: 'infinite recursion gives StackOverflowError', code: 'public class Main {\n    static int d(int n) { return d(n + 1); }\n    public static void main(String[] args) {\n        try { d(0); } catch (StackOverflowError e) { System.out.println("so"); }\n    }\n}\n', expect: 'so' },
  { name: 'large array (1,000,000 ints) and loop', code: wrap('int[] a = new int[1000000];\nlong s = 0;\nfor (int i = 0; i < a.length; i++) { a[i] = i; s += a[i]; }\nSystem.out.println(s);'), expect: '499999500000' },
  { name: 'nested loops 3000 x 3000', code: wrap('long c = 0;\nfor (int i = 0; i < 3000; i++) for (int j = 0; j < 3000; j++) c += (i ^ j) & 1;\nSystem.out.println(c);'), expectContains: '' },
  { name: 'object allocation: 200,000 small objects', code: 'import java.util.*;\npublic class Main {\n    static class P { int x; P(int x){this.x=x;} }\n    public static void main(String[] args) {\n        List<P> l = new ArrayList<>();\n        for (int i = 0; i < 200000; i++) l.add(new P(i));\n        System.out.println(l.size());\n    }\n}\n', expect: '200000' },
  { name: 'Scanner(System.in) with no input', code: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(sc.hasNextInt());\n    }\n}\n', expect: 'false', note: 'the runner gives programs no standard input' },
  { name: 'Scanner(System.in).nextInt() (typical student program)', code: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(n * 2);\n    }\n}\n', expectError: true, note: 'no stdin: expected to fail, but must fail readably' },
  { name: 'BufferedReader(System.in)', code: 'import java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader r = new BufferedReader(new InputStreamReader(System.in));\n        System.out.println(r.readLine());\n    }\n}\n', expectContains: 'null' },
  { name: 'Scanner over a String', code: 'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner("3 4");\n        System.out.println(sc.nextInt() + sc.nextInt());\n    }\n}\n', expect: '7' },
  { name: 'Random with a seed', code: wrap('java.util.Random r = new java.util.Random(42);\nSystem.out.println(r.nextInt(100));'), expect: '0' },
  { name: 'Math.random', code: wrap('double d = Math.random();\nSystem.out.println(d >= 0 && d < 1);'), expect: 'true' },
  { name: 'System.currentTimeMillis and nanoTime', code: wrap('long a = System.currentTimeMillis(); long b = System.nanoTime();\nSystem.out.println(a > 0 && b != 0);'), expect: 'true' },
  { name: 'LocalDate', code: wrap('System.out.println(java.time.LocalDate.of(2026, 10, 20).getDayOfWeek());'), expect: 'TUESDAY' },
  { name: 'Thread.sleep', code: wrap('try { Thread.sleep(50); } catch (InterruptedException e) {}\nSystem.out.println("slept");'), expect: 'slept' },
  { name: 'new Thread(...).start() and join', code: wrap('Thread t = new Thread(() -> System.out.println("t"));\nt.start();\ntry { t.join(); } catch (InterruptedException e) {}\nSystem.out.println("main");'), expect: 't\nmain' },
  { name: 'synchronized and AtomicInteger', code: wrap('java.util.concurrent.atomic.AtomicInteger a = new java.util.concurrent.atomic.AtomicInteger();\nsynchronized (a) { a.incrementAndGet(); }\nSystem.out.println(a.get());'), expect: '1' },
  { name: 'System.exit(0)', code: wrap('System.out.println("before");\nSystem.exit(0);'), expect: 'before' },
  { name: 'package declaration', code: 'package demo;\npublic class Main {\n    public static void main(String[] args) { System.out.println("p"); }\n}\n', expect: 'p' },
  { name: 'main in a class not called Main', code: 'public class Hello {\n    public static void main(String[] args) { System.out.println("h"); }\n}\n', expect: 'h', note: 'the runner compiles Main.java' },
  { name: 'two top-level classes, main in the second', code: 'class A { }\npublic class Main {\n    public static void main(String[] args) { System.out.println(new A() != null); }\n}\n', expect: 'true' },
  { name: 'a compile error is reported', code: wrap('int x = "no";'), expectCompileError: true },
  { name: 'a missing semicolon is reported', code: wrap('int x = 1\nSystem.out.println(x);'), expectCompileError: true },
  { name: 'System.err output', code: wrap('System.err.println("e");\nSystem.out.println("o");'), expectContains: 'o' },
  { name: 'getClass().getName() and reflection-free instanceof', code: wrap('Object o = "s";\nSystem.out.println(o.getClass().getName() + " " + (o instanceof String));'), expect: 'java.lang.String true' },
  { name: 'hashCode and equals of Strings, Objects.hash', code: wrap('System.out.println("ab".hashCode() + " " + java.util.Objects.hash(1, 2));'), expect: '3105 994' },
  { name: 'interface default and static methods', code: 'interface G { default String hi() { return "hi"; } static int one() { return 1; } }\npublic class Main implements G {\n    public static void main(String[] args) { System.out.println(new Main().hi() + G.one()); }\n}\n', expect: 'hi1' },
  { name: 'varargs and ternary chains', code: 'public class Main {\n    static int sum(int... xs) { int s = 0; for (int x : xs) s += x; return s; }\n    public static void main(String[] args) { System.out.println(sum(1, 2, 3) > 5 ? "big" : "small"); }\n}\n', expect: 'big' },
  { name: 'char arithmetic and casting', code: wrap('char c = \'a\'; c += 2;\nSystem.out.println(c + " " + (int) c + " " + (char) (c + 1) + " " + (int) 3.99 + " " + (long) 1e10);'), expect: 'c 99 d 3 10000000000' },
  { name: 'string switch and do-while', code: wrap('String s = "b"; int i = 0;\ndo { i++; } while (i < 3);\nswitch (s) { case "a": System.out.println("A"); break; case "b": System.out.println("B" + i); break; }'), expect: 'B3' },
  { name: 'Iterator and ConcurrentModificationException', code: wrap('java.util.List<Integer> l = new java.util.ArrayList<>(java.util.Arrays.asList(1, 2, 3));\ntry { for (Integer x : l) if (x == 1) l.remove(x); } catch (java.util.ConcurrentModificationException e) { System.out.println("cme"); }\njava.util.Iterator<Integer> it = l.iterator(); System.out.println(it.next());'), expectContains: '' },
  { name: 'Comparable and Comparator sorting objects', code: 'import java.util.*;\npublic class Main {\n    static class P implements Comparable<P> { int a; P(int a){this.a=a;} public int compareTo(P o){return a-o.a;} public String toString(){return "P"+a;} }\n    public static void main(String[] args) {\n        List<P> l = new ArrayList<>(Arrays.asList(new P(3), new P(1)));\n        Collections.sort(l);\n        l.sort(Comparator.comparingInt((P p) -> -p.a));\n        System.out.println(l);\n    }\n}\n', expect: '[P3, P1]' },
];

/** The playground examples (lib/java-playground/examples.ts) and the notes' Java blocks. */
async function loadPlaygroundExamples() {
  const module = await import(pathToFileURL(path.join(root, 'lib/java-playground/examples.ts')).href);
  return module.JAVA_PLAYGROUND_EXAMPLES.map((e) => ({ name: `playground: ${e.label}`, code: e.code }));
}

function loadNotesExamples() {
  const cases = [];
  const tag = /<JavaTryIt>\n\n```java\n([\s\S]*?)\n```\n\n```text\n([\s\S]*?)\n```\n\n<\/JavaTryIt>/g;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mdx')) {
        const text = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
        for (const m of text.matchAll(tag)) {
          const line = text.slice(0, m.index).split('\n').length;
          cases.push({ name: `notes: ${path.relative(root, full).replace(/\\/g, '/').replace('content/docs/', '')}:${line}`, code: m[1], expect: m[2] });
        }
      }
    }
  };
  for (const course of ['sem1/csi141', 'sem2/csi142']) walk(path.join(root, 'content/docs', course));
  return cases;
}

const harness = `<!doctype html><meta charset="utf-8"><title>java runner harness</title><script type="module">
let compilerWorker, compilerReady, requestId = 1;
const resetCompiler = () => { compilerWorker?.terminate(); compilerWorker = undefined; compilerReady = undefined; };
function waitForMessage(worker, matches, onMessage, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error('The Java compiler did not respond in time.')); }, timeoutMs);
    const handleMessage = (event) => { onMessage(event.data); if (matches(event.data)) { cleanup(); resolve(event.data); } };
    const handleError = (event) => { cleanup(); reject(new Error(event.message || 'The Java compiler worker crashed.')); };
    const cleanup = () => { clearTimeout(timer); worker.removeEventListener('message', handleMessage); worker.removeEventListener('error', handleError); };
    worker.addEventListener('message', handleMessage); worker.addEventListener('error', handleError);
  });
}
async function getCompiler() {
  if (compilerReady) return compilerReady;
  compilerReady = (async () => {
    const worker = new Worker('/java-playground/compiler-worker.js', { type: 'module' });
    compilerWorker = worker;
    await waitForMessage(worker, (m) => m.command === 'initialized', () => {}, 45000);
    const id = String(requestId++);
    const loaded = waitForMessage(worker, (m) => m.id === id && (m.command === 'ok' || m.command === 'error'), () => {}, 60000);
    worker.postMessage({ id, command: 'load-classlib', url: '/java-playground/compile-classlib-teavm.bin', runtimeUrl: '/java-playground/runtime-classlib-teavm.bin' });
    const response = await loaded;
    if (response.command !== 'ok') throw new Error(response.text || 'The Java standard library could not be loaded.');
    return worker;
  })().catch((error) => { resetCompiler(); throw error; });
  return compilerReady;
}
function execute(script) {
  return new Promise((resolve) => {
    const worker = new Worker('/java-playground/executor-worker.js?v=4', { type: 'module' });
    const lines = []; let chars = 0; let settled = false;
    const finish = (result) => { if (settled) return; settled = true; clearTimeout(timer); worker.terminate(); resolve({ lines, ...result }); };
    const timer = setTimeout(() => finish({ error: 'Stopped after 5 seconds. The program may contain an infinite loop.', timedOut: true }), 5000);
    worker.addEventListener('message', (event) => {
      const m = event.data;
      if (m.type === 'line' && m.stream) {
        chars += (m.text || '').length + 1;
        if (lines.length >= 500 || chars > 65536) { finish({ error: 'Output limit exceeded (500 lines or 64 KiB).' }); return; }
        lines.push({ stream: m.stream, text: m.text || '' });
      } else if (m.type === 'done') finish({ error: m.error });
    });
    worker.addEventListener('error', (event) => finish({ error: 'Java runtime worker crashed: ' + (event.message || 'unknown error') }));
    const bytes = new Uint8Array(script instanceof ArrayBuffer ? script : script.buffer ? script : script); const copy = bytes.slice();
    worker.postMessage({ code: copy }, [copy.buffer]);
  });
}
window.resetCompiler = resetCompiler;
window.runJava = async (code) => {
  const started = performance.now(); const diagnostics = [];
  try {
    const worker = await getCompiler();
    const id = String(requestId++);
    const completed = waitForMessage(worker, (m) => m.id === id && (m.command === 'compilation-complete' || m.command === 'error'),
      (m) => { if (m.id === id && (m.command === 'compiler-diagnostic' || m.command === 'diagnostic')) diagnostics.push((m.severity || 'error').toUpperCase() + ' ' + (m.lineNumber > 0 ? 'line ' + m.lineNumber : m.fileName || 'compiler') + ': ' + (m.message || m.text || '')); }, 60000);
    worker.postMessage({ id, command: 'compile', text: code });
    const response = await completed;
    if (response.command === 'error') return { ok: false, lines: [], diagnostics, error: response.text || 'Compilation failed.', stage: 'compile', ms: performance.now() - started };
    if (response.status !== 'successful' || !response.script) return { ok: false, lines: [], diagnostics, error: diagnostics.length ? undefined : 'Compilation failed.', stage: 'compile', ms: performance.now() - started };
    const execution = await execute(response.script);
    return { ok: !execution.error, lines: execution.lines, diagnostics, error: execution.error, timedOut: execution.timedOut, stage: 'run', ms: performance.now() - started };
  } catch (error) {
    resetCompiler();
    return { ok: false, lines: [], diagnostics, error: 'Java compiler worker failed: ' + (error instanceof Error ? error.message : String(error)), stage: 'worker', ms: performance.now() - started };
  }
};
window.harnessReady = true;
</script>`;

const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.bin': 'application/octet-stream', '.html': 'text/html', '.txt': 'text/plain', '.md': 'text/plain' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (url === '/__harness.html') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(harness);
    return;
  }
  const file = path.join(root, 'public', url);
  if (!file.startsWith(path.join(root, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let cases = [];
if (!only || only === 'probes') cases.push(...probes.map((p) => ({ ...p, group: 'probes' })));
if (!only || only === 'playground') cases.push(...(await loadPlaygroundExamples()).map((p) => ({ ...p, group: 'playground' })));
if (!only || only === 'notes') cases.push(...loadNotesExamples().map((p) => ({ ...p, group: 'notes' })));

if (match) cases = cases.filter((c) => c.name.toLowerCase().includes(match));

const browser = await chromium.launch({ headless: true });
let page;
async function openPage() {
  if (page) await page.close().catch(() => {});
  page = await browser.newPage();
  page.on('pageerror', () => {});
  await page.goto(`${base}/__harness.html`);
  await page.waitForFunction('window.harnessReady === true');
}
await openPage();

const results = [];
let crashed = 0;
for (const [index, testCase] of cases.entries()) {
  if (fresh && index > 0) await openPage();
  let result;
  try {
    result = await Promise.race([
      page.evaluate((code) => window.runJava(code), testCase.code),
      new Promise((resolve) => setTimeout(() => resolve({ ok: false, stage: 'worker', error: 'No answer after 150 s (page hung)', lines: [], diagnostics: [] }), 150000)),
    ]);
  } catch (error) {
    crashed += 1;
    result = { ok: false, stage: 'page', error: `The browser page died: ${String(error.message).split('\n')[0]}`, lines: [], diagnostics: [] };
    await openPage();
  }
  const output = result.lines.map((l) => l.text).join('\n');
  let verdict = 'pass';
  let cause = '';
  if (testCase.expectCompileError) {
    if (result.stage === 'compile' && result.diagnostics.some((d) => d.startsWith('ERROR'))) verdict = 'pass';
    else { verdict = 'fail'; cause = 'a compile error was not reported'; }
  } else if (testCase.expectError) {
    if (!result.ok) verdict = 'pass';
    else { verdict = 'fail'; cause = 'ran without the expected error'; }
  } else if (result.stage === 'compile') {
    verdict = 'fail';
    cause = `does not compile: ${(result.diagnostics.find((d) => d.startsWith('ERROR')) ?? result.error ?? '').slice(0, 140)}`;
  } else if (result.stage === 'worker' || result.stage === 'page') {
    verdict = 'fail';
    cause = `the runner broke: ${(result.error ?? '').slice(0, 140)}`;
  } else if (result.timedOut) {
    verdict = 'fail';
    cause = 'timed out (5 s)';
  } else if (!result.ok) {
    verdict = 'fail';
    cause = `runtime error: ${(result.error ?? '').split('\n')[0].slice(0, 140)}`;
  } else if (testCase.expect !== undefined && output.replace(/\n$/, '') !== testCase.expect.replace(/\n$/, '')) {
    verdict = 'fail';
    cause = `output differs: got ${JSON.stringify(output.slice(0, 80))}, expected ${JSON.stringify(testCase.expect.slice(0, 80))}`;
  } else if (testCase.expectContains !== undefined && !output.includes(testCase.expectContains)) {
    verdict = 'fail';
    cause = `output lacks ${JSON.stringify(testCase.expectContains)}: got ${JSON.stringify(output.slice(0, 80))}`;
  }
  results.push({ group: testCase.group, name: testCase.name, verdict, cause, ms: Math.round(result.ms ?? 0), note: testCase.note ?? '' });
  if (verdict === 'fail' || verbose) console.log(`${verdict === 'pass' ? 'pass' : 'FAIL'}  [${testCase.group}] ${testCase.name}${cause ? `\n        ${cause}` : ''}`);
}

await browser.close();
server.close();

const groups = [...new Set(results.map((r) => r.group))];
console.log('\nSummary');
for (const g of groups) {
  const rows = results.filter((r) => r.group === g);
  console.log(`  ${g.padEnd(11)} ${rows.filter((r) => r.verdict === 'pass').length} of ${rows.length} pass`);
}
const firstBroken = results.findIndex((r) => /the runner broke|the browser page died/.test(r.cause));
if (firstBroken >= 0) console.log(`  The runner itself broke at case ${firstBroken + 1} ("${results[firstBroken].name}") and ${results.filter((r) => /the runner broke|the browser page died/.test(r.cause)).length} case(s) in all.`);
if (crashed) console.log(`  The browser page crashed ${crashed} time(s).`);

if (jsonOut) fs.writeFileSync(path.resolve(root, jsonOut), JSON.stringify(results, null, 2));
if (writeTo) {
  const lines = ['# Java runner support', '', `Generated by \`node scripts/test-java-runner.mjs --write ${writeTo}\` on ${new Date().toISOString().slice(0, 10)}. Each row ran in the same TeaVM runner the site uses, in headless Chromium.`, ''];
  for (const g of groups) {
    const rows = results.filter((r) => r.group === g);
    lines.push(`## ${g} (${rows.filter((r) => r.verdict === 'pass').length} of ${rows.length} pass)`, '', '| Case | Result | Cause |', '|---|---|---|');
    for (const r of rows) lines.push(`| ${r.name.replace(/\|/g, '\\|')} | ${r.verdict} | ${(r.cause + (r.note ? ` (${r.note})` : '')).replace(/\|/g, '\\|')} |`);
    lines.push('');
  }
  fs.writeFileSync(path.resolve(root, writeTo), lines.join('\n'));
}
process.exit(results.some((r) => r.verdict === 'fail') ? 1 : 0);
