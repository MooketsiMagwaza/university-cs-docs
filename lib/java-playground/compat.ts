import { EXIT_SHIM, FORMAT_SHIM, JOINER_SHIM, MATH_SHIM, MESSAGE_SHIM, NUMBER_SHIM, RANDOM_SHIM, STDIN_SHIM, stdinConstant } from './shim';

/**
 * The in-browser Java compiler (TeaVM) has a smaller class library than a JDK, and a few of its parts crash.
 * This turns a student's program into one that compiles and runs there, without changing what it means:
 *
 *  - printf, String.format and formatted go through a formatter written in Java (TeaVM's fails on %f and %e);
 *  - Scanner and BufferedReader on System.in read the text of the Input box;
 *  - e.getMessage() works (the class library has no Throwable.getMessage);
 *  - System.exit stops the program, Thread.sleep does nothing, Integer::sum and friends become lambdas;
 *  - a package line is removed and a lone public class that is not called Main is renamed to Main.
 *
 * The helper classes are appended after the program, so the line numbers in compiler messages stay the student's.
 */

export type PreparedJava = {
  code: string;
  /** What was changed, for the output panel. */
  notes: string[];
};

const STRING_LITERAL = '"(?:[^"\\\\\\n]|\\\\.)*"';

export function prepareJava(source: string, stdin = ''): PreparedJava {
  const notes: string[] = [];
  let code = source;
  const parts: string[] = [];

  // A package line makes TeaVM compile demo.Main, which then clashes with the next program's Main.
  if (/^\s*package\s+[\w.]+\s*;/m.test(code)) {
    code = code.replace(/^(\s*)package\s+[\w.]+\s*;/m, '$1');
    notes.push('The package line was ignored: the browser runner compiles one file in the default package.');
  }

  // A single public class with another name becomes Main, because the runner compiles Main.java.
  const publicClass = /\bpublic\s+(?:(?:final|abstract)\s+)?(?:class|record|enum)\s+([A-Za-z_]\w*)/.exec(code);
  if (publicClass && publicClass[1] !== 'Main' && !/\b(?:class|record|enum|interface)\s+Main\b/.test(code)) {
    const name = publicClass[1];
    code = code.replace(new RegExp(`\\b${name}\\b`, 'g'), 'Main');
    notes.push(`The class ${name} was renamed Main, because the browser runner compiles Main.java.`);
  }

  // Formatting.
  if (/\b(?:printf|format|formatted)\s*\(/.test(code)) {
    let changed = code;
    changed = changed.replace(/\bSystem\.out\.(?:printf|format)\s*\(/g, '__Fmt.printf(');
    changed = changed.replace(/\bSystem\.err\.(?:printf|format)\s*\(/g, '__Fmt.eprintf(');
    changed = changed.replace(/\bString\.format\s*\(/g, '__Fmt.format(');
    changed = changed.replace(new RegExp(`(${STRING_LITERAL})\\.formatted\\(\\s*\\)`, 'g'), '__Fmt.format($1)');
    changed = changed.replace(new RegExp(`(${STRING_LITERAL})\\.formatted\\(`, 'g'), '__Fmt.format($1, ');
    if (changed !== code) {
      code = changed;
      parts.push(FORMAT_SHIM);
    }
  }

  // Standard input.
  let usesInput = false;
  if (/\bScanner\b/.test(code)) {
    code = code.replace(/^\s*import\s+java\.util\.Scanner\s*;[^\n]*$/gm, '');
    code = code.replace(/^\s*import\s+java\.util\.InputMismatchException\s*;[^\n]*$/gm, '');
    code = code.replace(/\bnew\s+(?:java\.util\.)?Scanner\s*\(\s*System\.in\s*\)/g, 'new Scanner()');
    usesInput = true;
  }
  if (/\bnew\s+(?:java\.io\.)?BufferedReader\s*\(\s*new\s+(?:java\.io\.)?InputStreamReader\s*\(\s*System\.in\s*\)\s*\)/.test(code)) {
    code = code.replace(/\bnew\s+(?:java\.io\.)?BufferedReader\s*\(\s*new\s+(?:java\.io\.)?InputStreamReader\s*\(\s*System\.in\s*\)\s*\)/g, 'new __Reader()');
    usesInput = true;
    parts.push('\nclass __Reader extends java.io.BufferedReader {\n    __Reader() {\n        super(new java.io.StringReader(__Stdin.TEXT));\n    }\n}\n');
  }
  if (/\bSystem\.in\.read\s*\(\s*\)/.test(code)) {
    code = code.replace(/\bSystem\.in\.read\s*\(\s*\)/g, '__In.read()');
    usesInput = true;
  }
  if (usesInput) {
    parts.push(stdinConstant(stdin));
    parts.push(STDIN_SHIM);
  }

  // Exception messages.
  if (/\.(?:getMessage|getLocalizedMessage)\s*\(\s*\)/.test(code)) {
    code = code.replace(/\b([A-Za-z_]\w*)\.(?:getMessage|getLocalizedMessage)\s*\(\s*\)/g, '__Ex.msg($1)');
    parts.push(MESSAGE_SHIM);
  }

  // Exit and sleep.
  let usesSys = false;
  if (/\bSystem\.exit\s*\(/.test(code)) {
    code = code.replace(/\bSystem\.exit\s*\(/g, '__Sys.exit(');
    usesSys = true;
  }
  if (/\bThread\.sleep\s*\(/.test(code)) {
    code = code.replace(/\bThread\.sleep\s*\(/g, '__Sys.sleep(');
    usesSys = true;
    notes.push('Thread.sleep does nothing in the browser runner, so the program does not wait.');
  }
  if (usesSys) parts.push(EXIT_SHIM);

  // Rounding that matches the JDK (TeaVM rounds -2.5 to -3 and log10(1000) comes out as 2.9999999999999996).
  if (/\bMath\.(?:round|rint|log10)\s*\(/.test(code)) {
    code = code.replace(/\bMath\.(round|rint|log10)\s*\(/g, '__Math.$1(');
    parts.push(MATH_SHIM);
  }

  // A seeded Random must print what it prints on a real JVM, so it is the JDK's generator.
  if (/\bRandom\b/.test(code) && !/\b(?:class|interface|enum|record)\s+Random\b/.test(code)) {
    code = code.replace(/^\s*import\s+java\.util\.Random\s*;[^\n]*$/gm, '');
    code = code.replace(/\bjava\.util\.Random\b/g, 'Random');
    code = code.replace(/\b(?:java\.util\.)?Collections\.shuffle\(\s*([^,()]+?)\s*\)/g, '__Util.shuffle($1, new Random())');
    code = code.replace(/\b(?:java\.util\.)?Collections\.shuffle\(/g, '__Util.shuffle(');
    parts.push(RANDOM_SHIM);
  }

  // The JDK's message for a number that does not parse.
  if (/\b(?:Integer\.parseInt|Long\.parseLong)\s*\(/.test(code)) {
    code = code.replace(/\bInteger\.parseInt\s*\(/g, '__Num.parseInt(').replace(/\bLong\.parseLong\s*\(/g, '__Num.parseLong(');
    parts.push(NUMBER_SHIM);
  }

  // StringJoiner is missing from the compile-time class library.
  if (/\bStringJoiner\b/.test(code) && !/\b(?:class|interface|enum|record)\s+StringJoiner\b/.test(code)) {
    code = code.replace(/^\s*import\s+java\.util\.StringJoiner\s*;[^\n]*$/gm, '').replace(/\bjava\.util\.StringJoiner\b/g, 'StringJoiner');
    parts.push(JOINER_SHIM);
  }

  // for (Map.Entry<K, V> e : map.entrySet()) names a type the compile-time class library lacks; var does not.
  code = rewriteEntryLoops(code);

  // Small things the class library lacks.
  code = code.replace(/\bSystem\.lineSeparator\s*\(\s*\)/g, '"\\n"');
  code = code.replace(/\bInteger::sum\b/g, '(__a, __b) -> __a + __b');
  code = code.replace(/\bLong::sum\b/g, '(__a, __b) -> __a + __b');
  code = code.replace(/\bDouble::sum\b/g, '(__a, __b) -> __a + __b');
  code = code.replace(/\bInteger::max\b/g, '(__a, __b) -> Math.max(__a, __b)');
  code = code.replace(/\bInteger::min\b/g, '(__a, __b) -> Math.min(__a, __b)');

  return { code: parts.length ? `${code.replace(/\s*$/, '')}\n${parts.join('')}` : code, notes };
}

/** Turns `for (Map.Entry<K, V> e : x)` into `for (var e : x)`, counting the angle brackets of nested generics. */
export function rewriteEntryLoops(source: string): string {
  const header = /\bfor\s*\(\s*(?:final\s+)?(?:java\.util\.)?(?:Map\.)?Entry\s*</g;
  let out = '';
  let from = 0;
  for (let match = header.exec(source); match; match = header.exec(source)) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < source.length && depth > 0) {
      if (source[index] === '<') depth += 1;
      else if (source[index] === '>') depth -= 1;
      index += 1;
    }
    const after = /^\s+([A-Za-z_]\w*)\s*:/.exec(source.slice(index));
    if (depth !== 0 || !after) continue;
    out += source.slice(from, match.index) + 'for (var ' + after[1] + ' :';
    from = index + after[0].length;
    header.lastIndex = from;
  }
  return out + source.slice(from);
}

/** The names of the top-level types in a program, to notice when the next program no longer has one the last had. */
export function topLevelTypeNames(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(/^\s*(?:public\s+|final\s+|abstract\s+|sealed\s+|non-sealed\s+|static\s+)*(?:class|interface|enum|record)\s+([A-Za-z_]\w*)/gm)) {
    names.add(match[1]);
  }
  return [...names];
}

/** Classes that declare their own main, to say which two clash when the compiler reports several. */
export function classesWithMain(source: string): string[] {
  const found: string[] = [];
  const header = /(?:class|interface|enum|record)\s+([A-Za-z_]\w*)[^{]*\{/g;
  for (const match of source.matchAll(header)) {
    const rest = source.slice(match.index! + match[0].length);
    const next = rest.search(/\n(?:public\s+|final\s+|abstract\s+)*(?:class|interface|enum|record)\s+[A-Za-z_]/);
    const body = next < 0 ? rest : rest.slice(0, next);
    if (/\bstatic\s+void\s+main\s*\(/.test(body)) found.push(match[1]);
  }
  return found;
}

type Hint = { test: RegExp; message: string };

const COMPILER_HINTS: Hint[] = [
  { test: /symbol:\s+class Entry|symbol:\s+class Map\.Entry|cannot find symbol[\s\S]{0,80}Entry/, message: 'Map.Entry is not available in the browser runner. Write for (var e : map.entrySet()) and use e.getKey() and e.getValue().' },
  { test: /symbol:\s+method getClass\(\)/, message: 'getClass() is not available in the browser runner, so a program cannot print a class name.' },
  { test: /symbol:\s+method getCause\(\)/, message: 'getCause() is not available in the browser runner.' },
  { test: /symbol:\s+class StringJoiner|StringJoiner/, message: 'StringJoiner is not available in the browser runner. Use StringBuilder, or String.join.' },
  { test: /symbol:\s+class Thread|Thread|Class .* is not supported on current target|Method is not annotated/, message: 'Threads are not available in the browser runner.' },
  { test: /FileReader|FileWriter|FileInputStream|FileOutputStream|File\b|FileDescriptor|java\.nio\.file/, message: 'Files are not available in the browser runner. Read from the Input box or use a String instead.' },
  { test: /JSByRef|InputStreamReader/, message: 'Reading System.in needs the Scanner or BufferedReader forms the runner understands: new Scanner(System.in) or new BufferedReader(new InputStreamReader(System.in)). Type the input in the Input box.' },
  { test: /invalid method reference/, message: 'The browser runner could not resolve that method reference. Write the lambda out, for example (a, b) -> a + b.' },
  { test: /reference to append is ambiguous/, message: 'The browser runner finds sb.append(someInteger) ambiguous. Convert first: sb.append(String.valueOf(value)).' },
];

/** A readable explanation for a failure, from the compiler diagnostics and the runtime error. */
export function explainJavaFailure(diagnostics: string[], error: string | undefined, source: string): string[] {
  const text = `${diagnostics.join('\n')}\n${error ?? ''}`;
  const out: string[] = [];
  if (/Multiple main methods found/.test(text)) {
    const mains = classesWithMain(source);
    out.push(mains.length > 1
      ? `More than one class has a main method (${mains.join(', ')}). Keep main in one class: the browser runner runs the program from Main.`
      : 'The compiler still held an earlier program. Press Run again.');
  }
  for (const hint of COMPILER_HINTS) if (hint.test.test(text) && !out.includes(hint.message)) out.push(hint.message);
  if (/Maximum call stack size exceeded/.test(text)) {
    out.push('StackOverflowError: the recursion is too deep for the browser runner, which allows only a few thousand nested calls. Use a loop, or a smaller input.');
  }
  if (/dereferencing a null pointer/.test(text)) {
    out.push('NullPointerException: a null reference was used. In the browser runner this cannot be caught with try and catch; check for null first.');
  }
  if (/array element access out of bounds|RuntimeError: index out of bounds/.test(text)) {
    out.push('ArrayIndexOutOfBoundsException: an index was outside the array. In the browser runner this cannot be caught with try and catch.');
  }
  return out;
}
