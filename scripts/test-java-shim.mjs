#!/usr/bin/env node
/**
 * Checks the Java helper classes in lib/java-playground/shim.ts against the real JDK: the formatter against
 * String.format, the Scanner against java.util.Scanner, and the exception message helper against getMessage.
 *
 *   node scripts/test-java-shim.mjs
 *
 * It needs javac and java on the PATH. Exit code 1 when any case differs.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { EXIT_SHIM, FORMAT_SHIM, MESSAGE_SHIM, STDIN_SHIM, stdinConstant } from '../lib/java-playground/shim.ts';

const formats = [
  ['"%d"', '42'], ['"%5d|"', '42'], ['"%-5d|"', '42'], ['"%05d"', '42'], ['"%+d"', '42'], ['"% d"', '42'], ['"%,d"', '1234567'], ['"%,d"', '-1234567'],
  ['"%(d"', '-5'], ['"%d"', '-17'], ['"%08d"', '-17'], ['"%d"', '123456789012L'], ['"%,d"', '999'], ['"%,d"', '1000'],
  ['"%s"', '"text"'], ['"%10s|"', '"text"'], ['"%-10s|"', '"text"'], ['"%.2s"', '"text"'], ['"%S"', '"text"'], ['"%s"', '3.5'], ['"%s"', '7'], ['"%s"', 'true'], ['"%s"', '(Object) null'],
  ['"%c"', "'x'"], ['"%C"', "'x'"], ['"%c"', '65'], ['"%3c|"', "'x'"],
  ['"%b"', 'true'], ['"%b"', '(Object) null'], ['"%B"', 'false'], ['"%b"', '"anything"'],
  ['"%x"', '255'], ['"%X"', '255'], ['"%x"', '-1'], ['"%08x"', '255'], ['"%o"', '8'], ['"%x"', '255L'], ['"%x"', '-1L'],
  ['"%f"', '3.14159'], ['"%.0f"', '2.5'], ['"%.0f"', '3.5'], ['"%.1f"', '0.25'], ['"%.1f"', '0.15'], ['"%.2f"', '3.14159'], ['"%.2f"', '2.0 / 3'], ['"%.2f"', '1.005'], ['"%.2f"', '-0.001'],
  ['"%.3f"', '1e-5'], ['"%.2f"', '1e10'], ['"%.2f"', '123456789.987654321'], ['"%10.3f|"', '3.14159'], ['"%-10.3f|"', '3.14159'], ['"%010.3f"', '-3.14159'], ['"%+.2f"', '3.0'], ['"%,.2f"', '1234567.891'],
  ['"%.2f"', '0.0'], ['"%.2f"', '-0.0'], ['"%f"', '1.0f'], ['"%.2f"', '0.1f'], ['"%.4f"', '100.0'], ['"%.2f"', '99.995'], ['"%.2f"', '0.005'], ['"%.2f"', '1.0 / 3'], ['"%.10f"', '1.0 / 3'], ['"%f"', 'Double.NaN'], ['"%f"', 'Double.POSITIVE_INFINITY'], ['"%f"', 'Double.NEGATIVE_INFINITY'], ['"%8.2f|"', 'Double.NaN'],
  ['"%e"', '12345.678'], ['"%.2e"', '12345.678'], ['"%E"', '0.000123'], ['"%.3e"', '9.9996'], ['"%e"', '0.0'], ['"%.1e"', '-5.55'], ['"%12.4e|"', '123.456'],
  ['"%d%%"', '50'], ['"100%%"'], ['"%n"'], ['"a%nb"'], ['"%d %s"', '1, "x"'], ['"%2$s %1$s"', '"a", "b"'], ['"%s %s %s"', '"a", "b", "c"'], ['"%-6s%6.2f%n"', '"pi", Math.PI'], ['"Total: %d items cost %.1f"', '3, 7.26'],
  ['"%s"', 'new int[0].length'], ['"[%3d][%-3d]"', '5, 5'], ['"%s=%d"', '"k", 3'], ['"%.2f%%"', '12.345'], ['"%5.1f%%"', '99.44'],
];

const scannerScripts = [
  { text: '3 4\nhello world\n', ops: ['int', 'int', 'line', 'line', 'hasLine'] },
  { text: '10 20 30', ops: ['int', 'int', 'int', 'hasInt', 'hasNext'] },
  { text: '  7   8  \n9\n', ops: ['hasInt', 'int', 'int', 'line', 'int', 'hasNext', 'hasLine'] },
  { text: 'abc 12', ops: ['hasInt', 'word', 'hasInt', 'int'] },
  { text: '3.5 -2 1e3', ops: ['double', 'double', 'double', 'hasDouble'] },
  { text: 'true False yes', ops: ['boolean', 'boolean', 'boolean'] },
  { text: 'one\ntwo\n\nfour', ops: ['line', 'line', 'line', 'line', 'hasLine'] },
  { text: '', ops: ['hasNext', 'hasLine', 'hasInt', 'line'] },
  { text: '', ops: ['word'] },
  { text: '5 x', ops: ['int', 'int'] },
  { text: '12345678901 7', ops: ['hasInt', 'long', 'int'] },
  { text: 'name Ada\nage 30\n', ops: ['word', 'word', 'int'] },
  { text: '4\n1 2 3 4\n', ops: ['int', 'int', 'int', 'int', 'int', 'hasNext'] },
  { text: 'a b\r\nc d\r\n', ops: ['line', 'line', 'hasLine'] },
  { text: 'x\n', ops: ['word', 'hasLine', 'line', 'hasLine'] },
];

const opCode = {
  int: 'String.valueOf(s.nextInt())', long: 'String.valueOf(s.nextLong())', double: 'String.valueOf(s.nextDouble())', boolean: 'String.valueOf(s.nextBoolean())',
  word: 's.next()', line: 's.nextLine()', hasInt: 'String.valueOf(s.hasNextInt())', hasDouble: 'String.valueOf(s.hasNextDouble())', hasNext: 'String.valueOf(s.hasNext())', hasLine: 'String.valueOf(s.hasNextLine())',
};

const javaString = (value) => '"' + [...value].map((c) => (c === '"' ? '\\"' : c === '\\' ? '\\\\' : c === '\n' ? '\\n' : c === '\r' ? '\\r' : c)).join('') + '"';

function scannerBody(typeName, ops, label) {
  const lines = ops.map((op) => `        try { out.append(${opCode[op]}); } catch (RuntimeException e) { out.append("<").append(e instanceof ${typeName === 'Scanner' ? 'InputMismatchException' : 'java.util.InputMismatchException'} ? "mismatch" : e instanceof java.util.NoSuchElementException ? "none" : "other").append(">"); }\n        out.append("|");`);
  return `    static String ${label}(${typeName} s) {\n        StringBuilder out = new StringBuilder();\n${lines.join('\n')}\n        return out.toString();\n    }`;
}

let main = '';
formats.forEach(([pattern, args], index) => {
  const arglist = args === undefined ? '' : `, ${args}`;
  main += `        check(${index}, ${pattern}, () -> __Fmt.format(${pattern}${arglist}), () -> String.format(${pattern}${arglist}));\n`;
});
let scannerMethods = '';
scannerScripts.forEach((script, index) => {
  scannerMethods += scannerBody('Scanner', script.ops, `mine${index}`) + '\n' + scannerBody('java.util.Scanner', script.ops, `real${index}`) + '\n';
  main += `        checkScan(${index}, mine${index}(new Scanner(${javaString(script.text)})), real${index}(new java.util.Scanner(${javaString(script.text)})));\n`;
});
main += `        check(900, "msg", () -> String.valueOf(__Ex.msg(new IllegalArgumentException("x: y"))), () -> String.valueOf(new IllegalArgumentException("x: y").getMessage()));\n`;
main += `        check(901, "msg", () -> String.valueOf(__Ex.msg(new RuntimeException())), () -> String.valueOf(new RuntimeException().getMessage()));\n`;

const program = `import java.util.function.Supplier;
public class Main {
    static int failures = 0;
    static int total = 0;
    static void check(int id, String label, Supplier<String> mine, Supplier<String> real) {
        total++;
        String a;
        String b;
        try { a = mine.get(); } catch (RuntimeException e) { a = "<exception>"; }
        try { b = real.get().replace("\\r\\n", "\\n"); } catch (RuntimeException e) { b = "<exception>"; }
        if (!a.equals(b)) { failures++; System.out.println("DIFFERENT #" + id + " " + label + ": mine [" + a + "] jdk [" + b + "]"); }
    }
    static void checkScan(int id, String mine, String real) {
        total++;
        if (!mine.equals(real)) { failures++; System.out.println("DIFFERENT scanner #" + id + ": mine [" + mine + "] jdk [" + real + "]"); }
    }
${scannerMethods}
    public static void main(String[] args) {
${main}        System.out.println(total + " cases, " + failures + " differ");
    }
}
${FORMAT_SHIM}${stdinConstant('')}${STDIN_SHIM}${MESSAGE_SHIM}${EXIT_SHIM}`;

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'java-shim-'));
fs.writeFileSync(path.join(dir, 'Main.java'), program);
const compiled = spawnSync('javac', ['-encoding', 'UTF-8', '-d', dir, path.join(dir, 'Main.java')], { encoding: 'utf8' });
if (compiled.status !== 0) {
  console.log('The shim does not compile with the JDK:\n' + compiled.stderr.split('\n').slice(0, 12).join('\n'));
  process.exit(1);
}
const ran = spawnSync('java', ['-cp', dir, 'Main'], { encoding: 'utf8' });
console.log((ran.stdout + ran.stderr).trim());
fs.rmSync(dir, { recursive: true, force: true });
process.exit(/ 0 differ/.test(ran.stdout) ? 0 : 1);
