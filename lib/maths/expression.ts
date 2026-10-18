/**
 * A safe parser and evaluator for functions of x, for the Visualise component (components/interactive/function-visual.tsx).
 *
 * A reader may type their own function, so this never uses eval or the Function constructor. The text is turned into a
 * small tree (numbers, x, pi, e, + - * / ^, brackets and a fixed list of functions) and the tree is evaluated by a
 * plain recursive function. A bad expression returns an error message in words; nothing here throws into the page.
 *
 *   parseExpression('x^3 - 2*x')       -> { ok: true, evaluate(x), text, tex, ... }
 *   parseExpression('2 +')             -> { ok: false, error: 'Something is missing after "+".' }
 *
 * Accepted: numbers (3, 0.5, .5), x, pi (or π), e, + - * /, ^ (right to left, so 2^3^2 is 2^9), brackets, and the
 * functions sin, cos, tan, exp, ln, sqrt and abs, always with brackets: sin(x). A product can be written by putting
 * things next to each other: 2x, 3(x + 1), x sin(x). Angles are in radians; ln is the natural logarithm.
 */

export type FunctionName = 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt' | 'abs';

export type Node =
  | { type: 'num'; value: number }
  | { type: 'var' }
  | { type: 'const'; name: 'pi' | 'e' }
  | { type: 'neg'; arg: Node }
  | { type: 'bin'; op: '+' | '-' | '*' | '/' | '^'; left: Node; right: Node }
  | { type: 'call'; name: FunctionName; arg: Node };

export type Parsed = {
  ok: true;
  node: Node;
  /** The value at x. It can be NaN or infinite where the function is not defined. */
  evaluate(x: number): number;
  /** The expression written back with the minimum of brackets, for example "3*x^2 - 2". */
  text: string;
  /** The same expression as LaTeX, for example "3x^{2} - 2". */
  tex: string;
};
export type ParseFailure = { ok: false; error: string };
export type ParseResult = Parsed | ParseFailure;

const FUNCTIONS: readonly FunctionName[] = ['sin', 'cos', 'tan', 'exp', 'ln', 'sqrt', 'abs'];
const MAX_LENGTH = 200;
const MAX_DEPTH = 40;

/* ───────── the tokens ───────── */

type Token =
  | { kind: 'num'; value: number; at: number }
  | { kind: 'x' | 'pi' | 'e'; at: number }
  | { kind: 'fn'; name: FunctionName; at: number }
  | { kind: 'op'; op: '+' | '-' | '*' | '/' | '^' | '(' | ')'; at: number };

/** Names, longest first, so that "exp" is read as exp and not as e followed by "xp". */
const NAMES: [string, Token['kind'], FunctionName?][] = [
  ['sqrt', 'fn', 'sqrt'],
  ['sin', 'fn', 'sin'],
  ['cos', 'fn', 'cos'],
  ['tan', 'fn', 'tan'],
  ['exp', 'fn', 'exp'],
  ['abs', 'fn', 'abs'],
  ['ln', 'fn', 'ln'],
  ['pi', 'pi'],
  ['x', 'x'],
  ['e', 'e'],
];

const HELP = 'Use x, pi, e, sin, cos, tan, exp, ln, sqrt or abs.';

function tokenise(source: string): Token[] | string {
  const text = source
    .replace(/−/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .toLowerCase();
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i += 1;
    } else if ((ch >= '0' && ch <= '9') || ch === '.') {
      let j = i;
      while (j < text.length && text[j] >= '0' && text[j] <= '9') j += 1;
      if (text[j] === '.') {
        j += 1;
        while (j < text.length && text[j] >= '0' && text[j] <= '9') j += 1;
      }
      const literal = text.slice(i, j);
      if (literal === '.' || (text[j] === '.' && j > i)) return `"${literal}" is not a number.`;
      tokens.push({ kind: 'num', value: Number(literal), at: i });
      i = j;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^' || ch === '(' || ch === ')') {
      tokens.push({ kind: 'op', op: ch, at: i });
      i += 1;
    } else if (ch >= 'a' && ch <= 'z') {
      const entry = NAMES.find(([name]) => text.startsWith(name, i));
      if (!entry) {
        let j = i;
        while (j < text.length && text[j] >= 'a' && text[j] <= 'z') j += 1;
        const word = text.slice(i, j);
        return word === 'log'
          ? 'There is no "log". Use ln(x) for the natural logarithm.'
          : `Unknown name "${word}". ${HELP}`;
      }
      const [name, kind, fn] = entry;
      tokens.push(kind === 'fn' ? { kind: 'fn', name: fn as FunctionName, at: i } : ({ kind, at: i } as Token));
      i += name.length;
    } else {
      return `The symbol "${ch}" is not allowed. ${HELP}`;
    }
  }
  return tokens;
}

/* ───────── the parser ───────── */

class Failure extends Error {}

function startsOperand(token: Token | undefined): boolean {
  return token !== undefined && (token.kind !== 'op' || token.op === '(');
}

function parseTokens(tokens: Token[]): Node {
  let position = 0;
  let depth = 0;
  const peek = () => tokens[position];

  const operator = (op: string) => {
    const token = peek();
    return token !== undefined && token.kind === 'op' && token.op === op;
  };

  const parseSum = (): Node => {
    let left = parseProduct();
    while (operator('+') || operator('-')) {
      const op = (tokens[position] as { op: '+' | '-' }).op;
      position += 1;
      if (peek() === undefined) throw new Failure(`Something is missing after "${op}".`);
      left = { type: 'bin', op, left, right: parseProduct() };
    }
    return left;
  };

  const parseProduct = (): Node => {
    let left = parseUnary();
    for (;;) {
      if (operator('*') || operator('/')) {
        const op = (tokens[position] as { op: '*' | '/' }).op;
        position += 1;
        if (peek() === undefined) throw new Failure(`Something is missing after "${op}".`);
        left = { type: 'bin', op, left, right: parseUnary() };
      } else if (startsOperand(peek())) {
        // Two things side by side are multiplied: 2x, 3(x + 1), x sin(x). Two numbers side by side are not.
        if (peek()?.kind === 'num' && left.type === 'num') throw new Failure('Put an operator between two numbers, for example 2*3.');
        left = { type: 'bin', op: '*', left, right: parseUnary() };
      } else {
        return left;
      }
    }
  };

  // A minus sign binds more loosely than a power, so -x^2 means -(x^2).
  const parseUnary = (): Node => {
    if (operator('-')) {
      position += 1;
      if (peek() === undefined) throw new Failure('Something is missing after "-".');
      return { type: 'neg', arg: parseUnary() };
    }
    if (operator('+')) {
      position += 1;
      if (peek() === undefined) throw new Failure('Something is missing after "+".');
      return parseUnary();
    }
    return parsePower();
  };

  const parsePower = (): Node => {
    const base = parsePrimary();
    if (operator('^')) {
      position += 1;
      if (peek() === undefined) throw new Failure('Something is missing after "^".');
      // The exponent may carry its own sign and is read right to left: 2^-x, 2^3^2.
      return { type: 'bin', op: '^', left: base, right: parseUnary() };
    }
    return base;
  };

  const parsePrimary = (): Node => {
    const token = peek();
    if (token === undefined) throw new Failure('The expression ends too soon.');
    position += 1;
    switch (token.kind) {
      case 'num':
        return { type: 'num', value: token.value };
      case 'x':
        return { type: 'var' };
      case 'pi':
        return { type: 'const', name: 'pi' };
      case 'e':
        return { type: 'const', name: 'e' };
      case 'fn': {
        if (!operator('(')) throw new Failure(`Write ${token.name} with brackets, for example ${token.name}(x).`);
        position += 1;
        const arg = bracketed();
        return { type: 'call', name: token.name, arg };
      }
      default:
        if (token.op === '(') return bracketed();
        if (token.op === ')') throw new Failure('There is a ")" with no "(" before it.');
        throw new Failure(`Something is missing before "${token.op}".`);
    }
  };

  /** The inside of a bracket; the opening bracket has been read. */
  const bracketed = (): Node => {
    depth += 1;
    if (depth > MAX_DEPTH) throw new Failure('There are too many brackets inside brackets.');
    if (operator(')')) throw new Failure('There is nothing inside the brackets.');
    const inside = parseSum();
    if (!operator(')')) throw new Failure('A bracket is not closed: add a ")".');
    position += 1;
    depth -= 1;
    return inside;
  };

  const result = parseSum();
  if (position < tokens.length) {
    const token = tokens[position];
    if (token.kind === 'op' && token.op === ')') throw new Failure('There is a ")" with no "(" before it.');
    throw new Failure('The expression could not be read after this point.');
  }
  return result;
}

/* ───────── evaluating ───────── */

export function evaluateNode(node: Node, x: number): number {
  switch (node.type) {
    case 'num':
      return node.value;
    case 'var':
      return x;
    case 'const':
      return node.name === 'pi' ? Math.PI : Math.E;
    case 'neg':
      return -evaluateNode(node.arg, x);
    case 'bin': {
      const a = evaluateNode(node.left, x);
      const b = evaluateNode(node.right, x);
      switch (node.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        default:
          return Math.pow(a, b);
      }
    }
    default: {
      const u = evaluateNode(node.arg, x);
      switch (node.name) {
        case 'sin':
          return Math.sin(u);
        case 'cos':
          return Math.cos(u);
        case 'tan':
          return Math.tan(u);
        case 'exp':
          return Math.exp(u);
        case 'ln':
          return u > 0 ? Math.log(u) : u === 0 ? Number.NEGATIVE_INFINITY : Number.NaN;
        case 'sqrt':
          return u >= 0 ? Math.sqrt(u) : Number.NaN;
        default:
          return Math.abs(u);
      }
    }
  }
}

/* ───────── writing it back ───────── */

/** How tightly a node binds: 1 sum, 2 product, 3 sign, 4 power, 5 a single item. */
function binding(node: Node): number {
  switch (node.type) {
    case 'num':
      return node.value < 0 ? 3 : 5;
    case 'var':
    case 'const':
    case 'call':
      return 5;
    case 'neg':
      return 3;
    default:
      return node.op === '+' || node.op === '-' ? 1 : node.op === '*' || node.op === '/' ? 2 : 4;
  }
}

/** A number with at most 12 significant figures, so 0.1 + 0.2 prints as 0.3. */
function numberText(value: number): string {
  if (!Number.isFinite(value)) return value > 0 ? 'inf' : value < 0 ? '-inf' : 'nan';
  return String(Number(value.toPrecision(12)));
}

export function toText(node: Node): string {
  const wrap = (child: Node, needs: boolean) => (needs ? `(${toText(child)})` : toText(child));
  switch (node.type) {
    case 'num':
      return node.value < 0 ? `-${numberText(-node.value)}` : numberText(node.value);
    case 'var':
      return 'x';
    case 'const':
      return node.name;
    case 'neg':
      return `-${wrap(node.arg, binding(node.arg) < 2 || node.arg.type === 'neg' || (node.arg.type === 'num' && node.arg.value < 0))}`;
    case 'call':
      return `${node.name}(${toText(node.arg)})`;
    default: {
      const { op, left, right } = node;
      if (op === '+') return `${toText(left)} + ${toText(right)}`;
      if (op === '-') return `${toText(left)} - ${wrap(right, binding(right) <= 1 || binding(right) === 3)}`;
      if (op === '*') return `${wrap(left, binding(left) < 2)}*${wrap(right, binding(right) < 2 || binding(right) === 3)}`;
      if (op === '/') return `${wrap(left, binding(left) < 2)}/${wrap(right, binding(right) <= 3)}`;
      return `${wrap(left, binding(left) < 5)}^${wrap(right, binding(right) < 4 || binding(right) === 3)}`;
    }
  }
}

export function toTex(node: Node): string {
  const wrap = (child: Node, needs: boolean) => (needs ? `\\left(${toTex(child)}\\right)` : toTex(child));
  switch (node.type) {
    case 'num':
      return node.value < 0 ? `-${numberText(-node.value)}` : numberText(node.value);
    case 'var':
      return 'x';
    case 'const':
      return node.name === 'pi' ? '\\pi' : 'e';
    case 'neg':
      return `-${wrap(node.arg, binding(node.arg) < 2 || node.arg.type === 'neg' || (node.arg.type === 'num' && node.arg.value < 0))}`;
    case 'call': {
      const inner = toTex(node.arg);
      switch (node.name) {
        case 'exp':
          return `e^{${inner}}`;
        case 'sqrt':
          return `\\sqrt{${inner}}`;
        case 'abs':
          return `\\left|${inner}\\right|`;
        default:
          return `\\${node.name}\\left(${inner}\\right)`;
      }
    }
    default: {
      const { op, left, right } = node;
      if (op === '+') return `${toTex(left)} + ${toTex(right)}`;
      if (op === '-') return `${toTex(left)} - ${wrap(right, binding(right) <= 1 || binding(right) === 3)}`;
      if (op === '/') return `\\frac{${toTex(left)}}{${toTex(right)}}`;
      if (op === '^') return `${wrap(left, binding(left) < 5 || (left.type === 'call' && left.name === 'exp'))}^{${toTex(right)}}`;
      // A product: a number in front of a letter or bracket is written as 2x; anything else gets a dot.
      const rightText = wrap(right, binding(right) < 2 || binding(right) === 3);
      const juxtapose = left.type === 'num' && left.value >= 0 && !/^[\d.-]/.test(rightText);
      return `${wrap(left, binding(left) < 2)}${juxtapose ? ' ' : ' \\cdot '}${rightText}`;
    }
  }
}

/* ───────── the entry point ───────── */

/** Read an expression in x. Never throws: a problem comes back as `{ ok: false, error }`. */
export function parseExpression(source: string): ParseResult {
  if (typeof source !== 'string' || source.trim() === '') return { ok: false, error: 'Type a function of x, for example x^2 - 3*x.' };
  if (source.length > MAX_LENGTH) return { ok: false, error: `The expression is longer than ${MAX_LENGTH} characters.` };
  const tokens = tokenise(source);
  if (typeof tokens === 'string') return { ok: false, error: tokens };
  try {
    const node = parseTokens(tokens);
    return { ok: true, node, evaluate: (x: number) => evaluateNode(node, x), text: toText(node), tex: toTex(node) };
  } catch (error) {
    return { ok: false, error: error instanceof Failure ? error.message : 'The expression could not be read.' };
  }
}

/** Build the result for a tree made in code (the derivative, for example). */
export function fromNode(node: Node): Parsed {
  return { ok: true, node, evaluate: (x: number) => evaluateNode(node, x), text: toText(node), tex: toTex(node) };
}

/** True when the tree uses x anywhere. */
export function dependsOnX(node: Node): boolean {
  switch (node.type) {
    case 'var':
      return true;
    case 'num':
    case 'const':
      return false;
    case 'neg':
    case 'call':
      return dependsOnX(node.arg);
    default:
      return dependsOnX(node.left) || dependsOnX(node.right);
  }
}

export const functionNames = FUNCTIONS;
