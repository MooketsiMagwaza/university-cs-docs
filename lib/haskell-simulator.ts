/**
 * A small interpreter for the Haskell subset the CSI243 notes teach, so the notes' examples run in the browser.
 *
 * It reads real Haskell layout (multi-line definitions, guards, where, case, let, do), evaluates lazily
 * (infinite lists work with take), and checks types only as far as a run can notice them. It is not GHC:
 * there is no full type inference, no type classes beyond simple user instances, and Int does not wrap.
 *
 * Public API (kept stable, used by components/interactive/runnable-code.tsx and haskell-playground.tsx):
 *   runHaskell(source)                  runs a program or GHCi-style lines and returns HaskellRunResult
 *   runHaskellWithInput(source, stdin)  the same, with text for getLine, getContents and interact to read
 *
 * The file is one module on purpose: the unit tests and the scan script load it with Node's type stripping,
 * which needs explicit file extensions between modules that the TypeScript settings here do not allow.
 * Sections: errors and tokens, lexer, syntax tree, parser, values, evaluator, library, show and read, runner.
 */

export type HaskellRunResult = {
  ok: boolean;
  output: string;
  elapsedMs: number;
  diagnostic?: {
    kind: 'Parse error' | 'Type error' | 'Runtime error';
    message: string;
    line?: number;
    column?: number;
    hint?: string;
  };
};

type Position = { line: number; column: number };
type ErrorKind = 'Parse error' | 'Type error' | 'Runtime error';

class SimulatorError extends Error {
  kind: ErrorKind;
  position?: Position;
  hint?: string;
  constructor(kind: ErrorKind, message: string, position?: Position, hint?: string) {
    super(message);
    this.kind = kind;
    this.position = position;
    this.hint = hint;
  }
}

const parseError = (message: string, at?: { line: number; col: number }, hint?: string): SimulatorError =>
  new SimulatorError('Parse error', message, at ? { line: at.line, column: at.col } : undefined, hint);
const typeError = (message: string, at?: Position, hint?: string): SimulatorError => new SimulatorError('Type error', message, at, hint);
const runtimeError = (message: string, at?: Position, hint?: string): SimulatorError => new SimulatorError('Runtime error', message, at, hint);

// ---------------------------------------------------------------------------------------------------------
// Lexer
// ---------------------------------------------------------------------------------------------------------

type TokKind = 'id' | 'con' | 'sym' | 'int' | 'float' | 'char' | 'str' | 'sp' | 'kw' | 'prompt' | 'eof';

type Tok = {
  k: TokKind;
  /** The source text. For characters and strings this keeps the quotes, so it never equals a keyword. */
  t: string;
  line: number;
  col: number;
  /** First token on its line: the layout rule looks at these. */
  first: boolean;
  v?: bigint | number | string;
  /** Module qualifier of a qualified name such as Map.insert. */
  q?: string;
  virtual?: boolean;
};

const KEYWORDS = new Set([
  'case', 'class', 'data', 'deriving', 'do', 'else', 'if', 'import', 'in', 'infix', 'infixl', 'infixr',
  'instance', 'let', 'module', 'newtype', 'of', 'then', 'type', 'where',
]);
const SYMBOL_CHARS = '!#$%&*+./<=>?@\\^|-~:';
/** Symbols that are punctuation of the language, not operators a program can define or apply. */
const NON_OPERATORS = new Set(['..', '::', '=', '\\', '|', '<-', '->', '@', '~', '=>']);
const ASCII_NAMES = [
  'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI', 'DLE', 'DC1', 'DC2',
  'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US', 'SP',
]
  .map((name, code) => ({ name, code }))
  .concat([{ name: 'DEL', code: 127 }])
  .sort((a, b) => b.name.length - a.name.length);

const isDigit = (c: string | undefined): boolean => c !== undefined && c >= '0' && c <= '9';
const isIdStart = (c: string | undefined): boolean => c !== undefined && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_');
const isIdChar = (c: string | undefined): boolean => c !== undefined && (isIdStart(c) || isDigit(c) || c === "'");
const isUpper = (c: string | undefined): boolean => c !== undefined && c >= 'A' && c <= 'Z';

/** Reads the escape that follows a backslash at src[j]. Returns the text it stands for and the next index. */
function readEscape(src: string, j: number, at: { line: number; col: number }): [string, number] {
  const c = src[j];
  const simple: Record<string, string> = { a: '\x07', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\v', '\\': '\\', '"': '"', "'": "'" };
  if (c !== undefined && Object.prototype.hasOwnProperty.call(simple, c)) return [simple[c], j + 1];
  if (c === '&') return ['', j + 1];
  if (isDigit(c)) {
    let k = j;
    while (isDigit(src[k])) k += 1;
    return [String.fromCodePoint(Number(src.slice(j, k))), k];
  }
  if (c === 'x' || c === 'X' || c === 'o' || c === 'O') {
    const hex = c === 'x' || c === 'X';
    let k = j + 1;
    const pattern = hex ? /[0-9a-fA-F]/ : /[0-7]/;
    while (src[k] !== undefined && pattern.test(src[k])) k += 1;
    if (k === j + 1) throw parseError('Numeric escape sequence has no digits.', at);
    return [String.fromCodePoint(parseInt(src.slice(j + 1, k), hex ? 16 : 8)), k];
  }
  if (c === '^' && src[j + 1] !== undefined) return [String.fromCharCode(src.charCodeAt(j + 1) - 64), j + 2];
  for (const { name, code } of ASCII_NAMES) {
    if (src.startsWith(name, j)) return [String.fromCharCode(code), j + name.length];
  }
  throw parseError(`Unknown escape sequence \\${c ?? ''}.`, at);
}

function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  const n = src.length;
  let i = 0;
  let line = 1;
  let col = 1;
  let fresh = true;

  const step = (count = 1) => {
    for (let k = 0; k < count; k += 1) {
      const ch = src[i];
      i += 1;
      if (ch === '\n') {
        line += 1;
        col = 1;
        fresh = true;
      } else if (ch === '\t') {
        col += 8 - ((col - 1) % 8);
      } else if (ch !== '\r') {
        col += 1;
      }
    }
  };
  const push = (k: TokKind, t: string, l: number, c: number, extra?: Partial<Tok>) => {
    toks.push({ k, t, line: l, col: c, first: fresh, ...extra });
    fresh = false;
  };

  while (i < n) {
    const ch = src[i];
    if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r' || ch === '\f') {
      step();
      continue;
    }

    if (ch === '-' && src[i + 1] === '-') {
      let j = i;
      while (src[j] === '-') j += 1;
      if (j >= n || !SYMBOL_CHARS.includes(src[j])) {
        while (i < n && src[i] !== '\n') step();
        continue;
      }
    }
    if (ch === '{' && src[i + 1] === '-') {
      const startLine = line;
      const startCol = col;
      let depth = 0;
      while (i < n) {
        if (src[i] === '{' && src[i + 1] === '-') {
          depth += 1;
          step(2);
        } else if (src[i] === '-' && src[i + 1] === '}') {
          depth -= 1;
          step(2);
          if (depth === 0) break;
        } else {
          step();
        }
      }
      if (depth !== 0) throw parseError('Unterminated block comment.', { line: startLine, col: startCol });
      continue;
    }

    const l = line;
    const c = col;

    if (fresh && (src.startsWith('ghci>', i) || src.startsWith('Prelude>', i))) {
      const len = src.startsWith('ghci>', i) ? 5 : 8;
      step(len);
      push('prompt', 'ghci>', l, c);
      continue;
    }

    if (isDigit(ch)) {
      let j = i;
      if (ch === '0' && (src[i + 1] === 'x' || src[i + 1] === 'X') && /[0-9a-fA-F]/.test(src[i + 2] ?? '')) {
        j = i + 2;
        while (/[0-9a-fA-F]/.test(src[j] ?? '')) j += 1;
        const text = src.slice(i, j);
        step(j - i);
        push('int', text, l, c, { v: BigInt(text) });
        continue;
      }
      if (ch === '0' && (src[i + 1] === 'o' || src[i + 1] === 'O') && /[0-7]/.test(src[i + 2] ?? '')) {
        j = i + 2;
        while (/[0-7]/.test(src[j] ?? '')) j += 1;
        const text = src.slice(i, j);
        step(j - i);
        push('int', text, l, c, { v: BigInt(text) });
        continue;
      }
      while (isDigit(src[j])) j += 1;
      let isFloat = false;
      if (src[j] === '.' && isDigit(src[j + 1])) {
        isFloat = true;
        j += 1;
        while (isDigit(src[j])) j += 1;
      }
      if ((src[j] === 'e' || src[j] === 'E') && (isDigit(src[j + 1]) || ((src[j + 1] === '-' || src[j + 1] === '+') && isDigit(src[j + 2])))) {
        isFloat = true;
        j += 2;
        while (isDigit(src[j])) j += 1;
      }
      const text = src.slice(i, j);
      step(j - i);
      push(isFloat ? 'float' : 'int', text, l, c, { v: isFloat ? Number(text) : BigInt(text) });
      continue;
    }

    if (isIdStart(ch)) {
      let j = i;
      while (isIdChar(src[j])) j += 1;
      let word = src.slice(i, j);
      let qualifier: string | undefined;
      let wordIsCon = isUpper(word[0]);

      // Qualified names: Data.Map.insert, Map.!, M.Map.
      while (wordIsCon && src[j] === '.' && (isIdStart(src[j + 1]) || SYMBOL_CHARS.includes(src[j + 1] ?? ' '))) {
        if (isIdStart(src[j + 1])) {
          let k = j + 1;
          while (isIdChar(src[k])) k += 1;
          const next = src.slice(j + 1, k);
          qualifier = qualifier ? `${qualifier}.${word}` : word;
          word = next;
          j = k;
          wordIsCon = isUpper(word[0]);
        } else {
          let k = j + 1;
          while (SYMBOL_CHARS.includes(src[k] ?? ' ')) k += 1;
          const op = src.slice(j + 1, k);
          const full = qualifier ? `${qualifier}.${word}` : word;
          const text = src.slice(i, k);
          step(k - i);
          push('sym', text, l, c, { q: full, v: op });
          word = '';
          break;
        }
      }
      if (word === '') continue;

      const text = src.slice(i, j);
      step(j - i);
      if (qualifier) {
        push(wordIsCon ? 'con' : 'id', text, l, c, { q: qualifier, v: word });
      } else if (wordIsCon) {
        push('con', word, l, c);
      } else if (KEYWORDS.has(word)) {
        push('kw', word, l, c);
      } else {
        push('id', word, l, c);
      }
      continue;
    }

    if (ch === '"') {
      let j = i + 1;
      let value = '';
      while (j < n && src[j] !== '"') {
        if (src[j] === '\n') throw parseError('Unterminated string literal.', { line: l, col: c }, 'A string must close with a quotation mark on the same line.');
        if (src[j] === '\\') {
          if (/\s/.test(src[j + 1] ?? '')) {
            // A string gap: backslash, whitespace, backslash.
            let k = j + 1;
            while (k < n && /\s/.test(src[k])) k += 1;
            if (src[k] !== '\\') throw parseError('Invalid string gap.', { line: l, col: c });
            j = k + 1;
            continue;
          }
          const [text, next] = readEscape(src, j + 1, { line: l, col: c });
          value += text;
          j = next;
        } else {
          value += src[j];
          j += 1;
        }
      }
      if (src[j] !== '"') throw parseError('Unterminated string literal.', { line: l, col: c }, 'A string must close with a quotation mark.');
      const text = src.slice(i, j + 1);
      step(j + 1 - i);
      push('str', text, l, c, { v: value });
      continue;
    }

    if (ch === "'") {
      let j = i + 1;
      let value: string;
      if (src[j] === '\\') {
        const [text, next] = readEscape(src, j + 1, { line: l, col: c });
        value = text;
        j = next;
      } else {
        const cp = src.codePointAt(j);
        if (cp === undefined || src[j] === "'" || src[j] === '\n') throw parseError('Invalid character literal.', { line: l, col: c });
        value = String.fromCodePoint(cp);
        j += value.length;
      }
      if (src[j] !== "'") throw parseError('A character literal must contain exactly one character.', { line: l, col: c }, 'Use double quotation marks for text.');
      const text = src.slice(i, j + 1);
      step(j + 1 - i);
      push('char', text, l, c, { v: value });
      continue;
    }

    if (ch === '(' || ch === ')' || ch === '[' || ch === ']' || ch === ',' || ch === ';' || ch === '{' || ch === '}' || ch === '`') {
      step();
      push('sp', ch, l, c);
      continue;
    }

    if (SYMBOL_CHARS.includes(ch)) {
      let j = i;
      while (j < n && SYMBOL_CHARS.includes(src[j])) j += 1;
      const text = src.slice(i, j);
      step(j - i);
      push('sym', text, l, c);
      continue;
    }

    throw parseError(`Unexpected character ${JSON.stringify(ch)}.`, { line: l, col: c }, 'Check for a missing quote, bracket, or unsupported Haskell syntax.');
  }

  toks.push({ k: 'eof', t: '', line, col: 0, first: true });
  return toks;
}

// ---------------------------------------------------------------------------------------------------------
// Syntax tree
// ---------------------------------------------------------------------------------------------------------

type Type =
  | { kind: 'con'; name: string; args: Type[]; nc?: boolean }
  | { kind: 'var'; name: string; nc?: boolean }
  | { kind: 'fun'; from: Type; to: Type; nc?: boolean }
  | { kind: 'list'; elem: Type; nc?: boolean }
  | { kind: 'tuple'; items: Type[]; nc?: boolean };

type Pat =
  | { kind: 'var'; name: string }
  | { kind: 'wild' }
  | { kind: 'lit'; value: bigint | number | Char }
  | { kind: 'str'; value: string }
  | { kind: 'con'; name: string; args: Pat[]; pos: Position }
  | { kind: 'rec'; name: string; fields: { name: string; pat: Pat }[]; pos: Position }
  | { kind: 'tuple'; items: Pat[] }
  | { kind: 'list'; items: Pat[] }
  | { kind: 'as'; name: string; pat: Pat }
  | { kind: 'bang'; pat: Pat }
  | { kind: 'lazy'; pat: Pat };

type Qual = { kind: 'bool'; e: Expr } | { kind: 'gen'; pat: Pat; e: Expr } | { kind: 'let'; decls: Decl[] };
type GuardAlt = { quals: Qual[]; body: Expr };
type Rhs = { guards: GuardAlt[]; where: Decl[] };
type Clause = { pats: Pat[]; rhs: Rhs; pos: Position };
type Alt = { pat: Pat; rhs: Rhs };
type Stmt = { kind: 'bind'; pat: Pat; e: Expr; pos: Position } | { kind: 'let'; decls: Decl[] } | { kind: 'expr'; e: Expr };

type Expr =
  | { kind: 'lit'; value: Value; pos: Position }
  | { kind: 'var'; name: string; pos: Position }
  | { kind: 'app'; fn: Expr; args: Expr[]; pos: Position }
  | { kind: 'lam'; clause: Clause; pos: Position }
  | { kind: 'lamcase'; alts: Alt[]; pos: Position }
  | { kind: 'let'; decls: Decl[]; body: Expr }
  | { kind: 'if'; c: Expr; t: Expr; f: Expr; pos: Position }
  | { kind: 'case'; scrut: Expr; alts: Alt[]; pos: Position }
  | { kind: 'do'; stmts: Stmt[]; pos: Position }
  | { kind: 'list'; items: Expr[] }
  | { kind: 'range'; from: Expr; then?: Expr; to?: Expr; pos: Position }
  | { kind: 'comp'; out: Expr; quals: Qual[] }
  | { kind: 'tuple'; items: Expr[] }
  | { kind: 'secl'; op: Expr; arg: Expr }
  | { kind: 'secr'; op: Expr; arg: Expr }
  | { kind: 'typed'; expr: Expr; type: Type; pos: Position }
  | { kind: 'reccon'; name: string; fields: { name: string; e: Expr }[]; pos: Position }
  | { kind: 'recupd'; expr: Expr; fields: { name: string; e: Expr }[]; pos: Position };

type ConDecl = { name: string; fields: Type[]; names: string[] | null };

type Decl =
  | { kind: 'sig'; names: string[]; type: Type }
  | { kind: 'clause'; name: string; pats: Pat[]; rhs: Rhs; pos: Position }
  | { kind: 'fun'; name: string; clauses: Clause[]; pos: Position }
  | { kind: 'patbind'; pat: Pat; rhs: Rhs; pos: Position }
  | { kind: 'data'; name: string; params: string[]; cons: ConDecl[]; deriving: string[]; pos: Position }
  | { kind: 'type'; name: string; params: string[]; type: Type }
  | { kind: 'class'; name: string; tyvar: string; sigs: { name: string; type: Type }[]; defaults: Decl[]; pos: Position }
  | { kind: 'instance'; cls: string; type: Type; body: Decl[]; pos: Position }
  | { kind: 'import'; module: string; qualified: boolean; alias?: string; names?: string[]; hiding: boolean; pos: Position }
  | { kind: 'expr'; e: Expr; pos: Position }
  | { kind: 'ghcilet'; decls: Decl[] };

const posOf = (t: { line: number; col: number }): Position => ({ line: t.line, column: t.col });

function mkApp(fn: Expr, args: Expr[], pos: Position): Expr {
  if (fn.kind === 'app') return { kind: 'app', fn: fn.fn, args: [...fn.args, ...args], pos: fn.pos };
  return { kind: 'app', fn, args, pos };
}

const simpleRhs = (body: Expr): Rhs => ({ guards: [{ quals: [], body }], where: [] });

// ---------------------------------------------------------------------------------------------------------
// Parser (layout is handled here: blocks open at the column of their first token)
// ---------------------------------------------------------------------------------------------------------

type Assoc = 'l' | 'r' | 'n';
type Fixity = { prec: number; assoc: Assoc };

const fx = (prec: number, assoc: Assoc): Fixity => ({ prec, assoc });
const DEFAULT_FIXITIES: Record<string, Fixity> = {
  '.': fx(9, 'r'), '!!': fx(9, 'l'),
  '^': fx(8, 'r'), '^^': fx(8, 'r'), '**': fx(8, 'r'),
  '*': fx(7, 'l'), '/': fx(7, 'l'), quot: fx(7, 'l'), rem: fx(7, 'l'), div: fx(7, 'l'), mod: fx(7, 'l'),
  '+': fx(6, 'l'), '-': fx(6, 'l'), '<>': fx(6, 'r'),
  ':': fx(5, 'r'), '++': fx(5, 'r'), '\\\\': fx(5, 'n'),
  '==': fx(4, 'n'), '/=': fx(4, 'n'), '<': fx(4, 'n'), '<=': fx(4, 'n'), '>': fx(4, 'n'), '>=': fx(4, 'n'),
  elem: fx(4, 'n'), notElem: fx(4, 'n'),
  '<$>': fx(4, 'l'), '<$': fx(4, 'l'), '<*>': fx(4, 'l'), '*>': fx(4, 'l'), '<*': fx(4, 'l'),
  '&&': fx(3, 'r'), '||': fx(2, 'r'), '<|>': fx(3, 'l'),
  '>>': fx(1, 'l'), '>>=': fx(1, 'l'), '=<<': fx(1, 'r'), '&': fx(1, 'l'), '<=<': fx(1, 'r'), '>=>': fx(1, 'r'),
  '$': fx(0, 'r'), '$!': fx(0, 'r'), seq: fx(0, 'r'), on: fx(0, 'l'),
};

type OpInfo = { name: string; fix: Fixity; expr: Expr; pos: Position };
type SeqItem = { x: Expr } | { op: OpInfo } | { neg: Position };
type Mark = { i: number; ctx: { col: number; explicit: boolean }[]; semiAt: number; semiDepth: number };

function prescanFixities(toks: Tok[]): Map<string, Fixity> {
  const table = new Map<string, Fixity>(Object.entries(DEFAULT_FIXITIES));
  for (let i = 0; i < toks.length; i += 1) {
    const t = toks[i];
    if (t.k !== 'kw' || (t.t !== 'infixl' && t.t !== 'infixr' && t.t !== 'infix')) continue;
    const assoc: Assoc = t.t === 'infixl' ? 'l' : t.t === 'infixr' ? 'r' : 'n';
    let j = i + 1;
    let prec = 9;
    if (toks[j].k === 'int') {
      prec = Number(toks[j].v);
      j += 1;
    }
    while (j < toks.length) {
      const o = toks[j];
      if (o.k === 'sym') table.set(o.t, fx(prec, assoc));
      else if (o.k === 'sp' && o.t === '`' && toks[j + 1]) {
        table.set(toks[j + 1].t, fx(prec, assoc));
        j += 2;
      } else if (!(o.k === 'sp' && o.t === ',')) break;
      j += 1;
    }
  }
  return table;
}

class Parser {
  toks: Tok[];
  i = 0;
  ctx: { col: number; explicit: boolean }[] = [];
  semiAt = -1;
  semiDepth = -1;
  fixities: Map<string, Fixity>;

  constructor(toks: Tok[], fixities: Map<string, Fixity>) {
    this.toks = toks;
    this.fixities = fixities;
  }

  // ---- token access with layout ---------------------------------------------------------------------

  real(): Tok {
    return this.toks[this.i];
  }

  private virt(text: string, at: Tok): Tok {
    return { k: 'sp', t: text, line: at.line, col: at.col, first: false, virtual: true };
  }

  peek(): Tok {
    const t = this.toks[this.i];
    const top = this.ctx[this.ctx.length - 1];
    if (top && !top.explicit) {
      if (t.k === 'eof') return this.virt('v}', t);
      if (t.first) {
        if (t.col < top.col) return this.virt('v}', t);
        if (t.col === top.col && !(this.semiAt === this.i && this.semiDepth === this.ctx.length)) return this.virt('v;', t);
      }
    }
    return t;
  }

  next(): Tok {
    const t = this.peek();
    if (t.virtual) {
      if (t.t === 'v;') {
        this.semiAt = this.i;
        this.semiDepth = this.ctx.length;
      } else {
        this.ctx.pop();
      }
      return t;
    }
    if (t.k !== 'eof') this.i += 1;
    return t;
  }

  mark(): Mark {
    return { i: this.i, ctx: this.ctx.slice(), semiAt: this.semiAt, semiDepth: this.semiDepth };
  }

  reset(m: Mark) {
    this.i = m.i;
    this.ctx = m.ctx.slice();
    this.semiAt = m.semiAt;
    this.semiDepth = m.semiDepth;
  }

  isKw(text: string): boolean {
    const t = this.peek();
    return t.k === 'kw' && t.t === text;
  }
  isSym(text: string): boolean {
    const t = this.peek();
    return t.k === 'sym' && t.t === text && t.q === undefined;
  }
  isSp(text: string): boolean {
    const t = this.peek();
    return t.k === 'sp' && t.t === text && !t.virtual;
  }

  fail(at: Tok = this.peek(), detail?: string): SimulatorError {
    if (at.k === 'eof' || at.virtual) {
      return parseError(detail ?? 'parse error: the code ended before it was complete.', at.k === 'eof' ? { line: this.lastLine(), col: 1 } : at, 'Check the indentation, parentheses and that every definition has its right-hand side.');
    }
    return parseError(detail ?? `parse error on input ‘${at.t}’`, at, 'Check the spelling, parentheses and indentation near this symbol.');
  }

  private lastLine(): number {
    const last = this.toks[this.toks.length - 1];
    return last ? last.line : 1;
  }

  expectKw(text: string): Tok {
    if (!this.isKw(text)) throw this.fail(this.peek(), `parse error: expected ‘${text}’ but found ‘${this.peek().t || 'the end of the code'}’`);
    return this.next();
  }
  expectSym(text: string): Tok {
    if (!this.isSym(text)) throw this.fail(this.peek(), `parse error: expected ‘${text}’ but found ‘${this.peek().t || 'the end of the code'}’`);
    return this.next();
  }
  expectSp(text: string): Tok {
    if (!this.isSp(text)) throw this.fail(this.peek(), `parse error: expected ‘${text}’ but found ‘${this.peek().t || 'the end of the code'}’`);
    return this.next();
  }

  /** `if` inside `do` may put then and else on lines level with the if: skip the virtual semicolon before them. */
  skipSemiBefore(kw: string) {
    const t = this.peek();
    if (t.virtual && t.t === 'v;') {
      const r = this.real();
      if (r.k === 'kw' && r.t === kw) this.next();
    }
  }

  // ---- blocks -----------------------------------------------------------------------------------------

  block<T>(item: () => T): T[] {
    const items: T[] = [];
    const t = this.real();
    const isSemi = (p: Tok) => (p.virtual && p.t === 'v;') || (p.k === 'sp' && p.t === ';' && !p.virtual);

    if (t.k === 'sp' && t.t === '{') {
      this.i += 1;
      this.ctx.push({ col: 0, explicit: true });
      for (;;) {
        while (this.isSp(';')) this.next();
        if (this.isSp('}')) {
          this.i += 1;
          break;
        }
        if (this.real().k === 'eof') throw this.fail(this.real(), 'parse error: missing closing brace ‘}’.');
        items.push(item());
        if (this.isSp(';') || this.isSp('}')) continue;
        throw this.fail();
      }
      this.ctx.pop();
      return items;
    }

    const enclosing = this.ctx[this.ctx.length - 1];
    if (t.k === 'eof' || (enclosing && !enclosing.explicit && t.col <= enclosing.col && t.first)) return items;

    this.ctx.push({ col: t.col, explicit: false });
    this.semiAt = this.i;
    this.semiDepth = this.ctx.length;
    for (;;) {
      let p = this.peek();
      while (isSemi(p)) {
        this.next();
        p = this.peek();
      }
      if (p.virtual && p.t === 'v}') {
        this.next();
        break;
      }
      if (!this.canStartItem(p)) {
        this.ctx.pop();
        break;
      }
      items.push(item());
      p = this.peek();
      if (isSemi(p)) continue;
      if (p.virtual && p.t === 'v}') {
        this.next();
        break;
      }
      // The parse-error rule: something that cannot continue this item closes the implicit block.
      this.ctx.pop();
      break;
    }
    return items;
  }

  private canStartItem(p: Tok): boolean {
    if (p.k === 'eof') return false;
    if (p.k === 'sp' && !p.virtual && (p.t === ')' || p.t === ']' || p.t === ',' || p.t === '}')) return false;
    if (p.k === 'kw' && (p.t === 'in' || p.t === 'then' || p.t === 'else' || p.t === 'of' || p.t === 'where')) return false;
    return true;
  }

  parseDeclBlock(): Decl[] {
    return groupClauses(this.block(() => this.parseDecl()).flat());
  }

  // ---- declarations -----------------------------------------------------------------------------------

  parseTop(): Decl[] {
    if (this.real().k === 'kw' && this.real().t === 'module') {
      while (!(this.real().k === 'kw' && this.real().t === 'where') && this.real().k !== 'eof') this.i += 1;
      if (this.real().k === 'eof') throw this.fail(this.real(), 'parse error: a module header needs ‘where’.');
      this.i += 1;
    }
    const decls = this.block(() => this.parseDecl()).flat();
    if (this.real().k !== 'eof') throw this.fail(this.real());
    return groupClauses(decls);
  }

  parseDecl(): Decl[] {
    const t = this.peek();
    if (t.k === 'prompt') {
      this.next();
      return this.parseGhciLine();
    }
    if (t.k === 'kw' && !t.virtual) {
      switch (t.t) {
        case 'data':
        case 'newtype':
          return [this.parseData()];
        case 'type':
          return [this.parseTypeSynonym()];
        case 'class':
          return [this.parseClass()];
        case 'instance':
          return [this.parseInstance()];
        case 'import':
          return [this.parseImport()];
        case 'infix':
        case 'infixl':
        case 'infixr':
          this.skipItem();
          return [];
        case 'let':
          return [this.parseLetStatement()];
        case 'if':
        case 'case':
        case 'do':
          return [this.parseExprStatement()];
        default:
          break;
      }
    }
    if (t.k === 'sym' && t.t === '\\') return [this.parseExprStatement()];
    return this.parseBindingOrExpression();
  }

  private skipItem() {
    for (;;) {
      const p = this.peek();
      if (p.k === 'eof' || p.virtual || (p.k === 'sp' && p.t === ';')) return;
      this.next();
    }
  }

  private parseExprStatement(): Decl {
    const start = this.peek();
    const e = this.parseExp();
    return { kind: 'expr', e, pos: posOf(start) };
  }

  /** `let` outside a do block: with `in` it is an expression; without, a GHCi-style binding that takes effect in order. */
  private parseLetStatement(): Decl {
    const start = this.next();
    const decls = this.parseDeclBlock();
    if (this.isKw('in')) {
      this.next();
      const body = this.parseExp();
      return { kind: 'expr', e: { kind: 'let', decls, body }, pos: posOf(start) };
    }
    return { kind: 'ghcilet', decls };
  }

  /** What follows `ghci>`: a let (or a definition) that takes effect in order, or an expression to print. */
  private parseGhciLine(): Decl[] {
    if (this.isKw('let')) return [this.parseLetStatement()];
    // At the prompt, `maxBound :: Int` is an expression with an annotation, not a signature.
    if (this.signatureNames() && !this.scanItem().equals) return [this.parseExprStatement()];
    const found = this.parseDecl();
    const isBinding = (d: Decl) => d.kind === 'clause' || d.kind === 'patbind' || d.kind === 'sig';
    if (found.length === 1 && isBinding(found[0])) {
      // `ghci> f 0 = 1; f n = n * f (n - 1)` is one definition written on one line.
      const decls = [...found];
      while (this.isSp(';')) {
        const mark = this.mark();
        this.next();
        const more = this.parseDecl();
        if (!more.every(isBinding)) {
          this.reset(mark);
          break;
        }
        decls.push(...more);
      }
      return [{ kind: 'ghcilet', decls: groupClauses(decls) }];
    }
    return found;
  }

  private scanItem(): { equals: boolean } {
    const top = this.ctx[this.ctx.length - 1];
    const col = top && !top.explicit ? top.col : 0;
    let depth = 0;
    let equals = false;
    for (let j = this.i; j < this.toks.length; j += 1) {
      const t = this.toks[j];
      if (t.k === 'eof') break;
      if (j > this.i && ((t.first && t.col <= col && col > 0) || t.k === 'prompt')) break;
      if (t.k === 'sp') {
        if (t.t === '(' || t.t === '[' || t.t === '{') depth += 1;
        else if (t.t === ')' || t.t === ']' || t.t === '}') depth -= 1;
        else if (t.t === ';' && depth === 0) break;
      } else if (t.k === 'sym' && depth === 0 && t.q === undefined) {
        if (t.t === '=' || t.t === '|') equals = true;
      }
    }
    return { equals };
  }

  /** `f, g ::` or `(+++) ::` at the cursor: returns the names without consuming anything if it is not a signature. */
  private signatureNames(): string[] | null {
    let j = this.i;
    const names: string[] = [];
    for (;;) {
      const t = this.toks[j];
      if (t.k === 'id' && t.q === undefined) {
        names.push(t.t);
        j += 1;
      } else if (t.k === 'sp' && t.t === '(' && this.toks[j + 1]?.k === 'sym' && this.toks[j + 2]?.k === 'sp' && this.toks[j + 2].t === ')') {
        names.push(this.toks[j + 1].t);
        j += 3;
      } else {
        return null;
      }
      const sep = this.toks[j];
      if (sep.k === 'sp' && sep.t === ',') {
        j += 1;
        continue;
      }
      if (sep.k === 'sym' && sep.t === '::') return names;
      return null;
    }
  }

  parseBindingOrExpression(): Decl[] {
    const start = this.peek();
    const names = this.signatureNames();
    if (names) {
      // Consume the names and the '::'.
      while (!this.isSym('::')) this.next();
      this.next();
      return [{ kind: 'sig', names, type: this.parseType() }];
    }
    if (!this.scanItem().equals) return [this.parseExprStatement()];
    return [this.parseBinding(start)];
  }

  private parseBinding(start: Tok): Decl {
    const pos = posOf(start);
    const mark = this.mark();
    const t = this.peek();

    if (t.k === 'id' && t.t !== '_' && t.q === undefined) {
      const after = this.toks[this.i + 1];
      if (!(after && after.k === 'sym' && after.t === '@')) {
        this.next();
        const pats: Pat[] = [];
        let ok = true;
        try {
          while (this.startsApat()) pats.push(this.parseApat());
        } catch (error) {
          if (!(error instanceof SimulatorError)) throw error;
          ok = false;
        }
        if (ok && (this.isSym('=') || this.isSym('|'))) {
          return { kind: 'clause', name: t.t, pats, rhs: this.parseRhs('='), pos };
        }
        this.reset(mark);
      }
    }

    if (this.isSp('(') && this.toks[this.i + 1]?.k === 'sym' && this.toks[this.i + 2]?.t === ')') {
      const opTok = this.toks[this.i + 1];
      this.i += 3;
      const pats: Pat[] = [];
      while (this.startsApat()) pats.push(this.parseApat());
      return { kind: 'clause', name: opTok.t, pats, rhs: this.parseRhs('='), pos };
    }

    // (f . g) x = ...: an infix definition in parentheses, with more arguments after it.
    if (this.isSp('(')) {
      const before = this.mark();
      try {
        this.next();
        const first = this.parseOpPat();
        const inner = this.tryVarOperator();
        if (inner) {
          const second = this.parseOpPat();
          this.expectSp(')');
          const more: Pat[] = [];
          while (this.startsApat()) more.push(this.parseApat());
          if (this.isSym('=') || this.isSym('|')) return { kind: 'clause', name: inner, pats: [first, second, ...more], rhs: this.parseRhs('='), pos };
        }
      } catch (error) {
        if (!(error instanceof SimulatorError)) throw error;
      }
      this.reset(before);
    }

    const left = this.parseOpPat();
    const op = this.tryVarOperator();
    if (op) {
      const right = this.parseOpPat();
      return { kind: 'clause', name: op, pats: [left, right], rhs: this.parseRhs('='), pos };
    }
    return { kind: 'patbind', pat: left, rhs: this.parseRhs('='), pos };
  }

  /** A function operator in a definition: a symbol that is not a constructor, or a backticked name. */
  private tryVarOperator(): string | null {
    const t = this.peek();
    if (t.virtual) return null;
    if (t.k === 'sym' && !NON_OPERATORS.has(t.t) && !t.t.startsWith(':')) {
      this.next();
      return t.t;
    }
    if (t.k === 'sp' && t.t === '`' && this.toks[this.i + 1]?.k === 'id' && this.toks[this.i + 2]?.t === '`') {
      const name = this.toks[this.i + 1].t;
      this.i += 3;
      return name;
    }
    return null;
  }

  parseRhs(eq: '=' | '->'): Rhs {
    const guards: GuardAlt[] = [];
    if (this.isSym('|')) {
      while (this.isSym('|')) {
        this.next();
        const quals = this.parseQuals();
        this.expectSym(eq);
        guards.push({ quals, body: this.parseExp() });
      }
    } else {
      this.expectSym(eq);
      guards.push({ quals: [], body: this.parseExp() });
    }
    let where: Decl[] = [];
    if (this.isKw('where')) {
      this.next();
      where = this.parseDeclBlock();
    }
    return { guards, where };
  }

  parseQuals(): Qual[] {
    const quals = [this.parseQual()];
    while (this.isSp(',')) {
      this.next();
      quals.push(this.parseQual());
    }
    return quals;
  }

  parseQual(): Qual {
    if (this.isKw('let')) {
      this.next();
      const decls = this.parseDeclBlock();
      if (this.isKw('in')) {
        this.next();
        return { kind: 'bool', e: { kind: 'let', decls, body: this.parseExp() } };
      }
      return { kind: 'let', decls };
    }
    const generator = this.tryGenerator();
    if (generator) return generator;
    return { kind: 'bool', e: this.parseExp() };
  }

  private tryGenerator(): { kind: 'gen'; pat: Pat; e: Expr } | null {
    const mark = this.mark();
    try {
      const pat = this.parsePattern();
      if (this.isSym('<-')) {
        this.next();
        return { kind: 'gen', pat, e: this.parseExp() };
      }
    } catch (error) {
      if (!(error instanceof SimulatorError)) throw error;
    }
    this.reset(mark);
    return null;
  }

  private parseData(): Decl {
    const start = this.next();
    const nameTok = this.next();
    if (nameTok.k !== 'con') throw this.fail(nameTok, `parse error: ${start.t} needs a type name that starts with a capital letter.`);
    const params: string[] = [];
    while (this.peek().k === 'id') params.push(this.next().t);
    const cons: ConDecl[] = [];
    if (this.isSym('=')) {
      this.next();
      cons.push(this.parseConDecl());
      while (this.isSym('|')) {
        this.next();
        cons.push(this.parseConDecl());
      }
    }
    return { kind: 'data', name: nameTok.t, params, cons, deriving: this.parseDeriving(), pos: posOf(start) };
  }

  private parseConDecl(): ConDecl {
    const t = this.next();
    if (t.k !== 'con') throw this.fail(t, 'parse error: a constructor name must start with a capital letter.');
    const fields: Type[] = [];
    let names: string[] | null = null;
    if (this.isSp('{')) {
      this.next();
      names = [];
      while (!this.isSp('}')) {
        const group: string[] = [this.next().t];
        while (this.isSp(',')) {
          this.next();
          group.push(this.next().t);
        }
        this.expectSym('::');
        if (this.isSym('!')) this.next();
        const ty = this.parseType();
        for (const name of group) {
          names.push(name);
          fields.push(ty);
        }
        if (this.isSp(',')) this.next();
      }
      this.expectSp('}');
    } else {
      while (this.startsAType()) {
        if (this.isSym('!')) this.next();
        fields.push(this.parseAType());
      }
    }
    return { name: t.t, fields, names };
  }

  private parseDeriving(): string[] {
    const names: string[] = [];
    while (this.isKw('deriving')) {
      this.next();
      if (this.peek().k === 'id' && ['stock', 'anyclass', 'newtype'].includes(this.peek().t)) this.next();
      if (this.isSp('(')) {
        this.next();
        while (!this.isSp(')')) {
          const t = this.next();
          if (t.k === 'con') names.push(t.v !== undefined ? String(t.v) : t.t);
          else if (t.k === 'eof') throw this.fail(t);
        }
        this.next();
      } else {
        const t = this.next();
        if (t.k === 'con') names.push(t.v !== undefined ? String(t.v) : t.t);
      }
    }
    return names;
  }

  private parseTypeSynonym(): Decl {
    this.next();
    const nameTok = this.next();
    if (nameTok.k !== 'con') throw this.fail(nameTok, 'parse error: a type synonym needs a name that starts with a capital letter.');
    const params: string[] = [];
    while (this.peek().k === 'id') params.push(this.next().t);
    this.expectSym('=');
    return { kind: 'type', name: nameTok.t, params, type: this.parseType() };
  }

  private parseClass(): Decl {
    const start = this.next();
    const head = this.parseType();
    while (!this.isKw('where') && !this.peek().virtual && this.peek().k !== 'eof' && !this.isSp(';')) this.next();
    let body: Decl[] = [];
    if (this.isKw('where')) {
      this.next();
      body = this.parseDeclBlock();
    }
    if (head.kind !== 'con' || head.args.length !== 1 || head.args[0].kind !== 'var') {
      throw parseError('Only classes with one type variable are supported here.', start);
    }
    const sigs: { name: string; type: Type }[] = [];
    for (const d of body) if (d.kind === 'sig') for (const name of d.names) sigs.push({ name, type: d.type });
    return { kind: 'class', name: head.name, tyvar: head.args[0].name, sigs, defaults: body.filter((d) => d.kind === 'fun'), pos: posOf(start) };
  }

  private parseInstance(): Decl {
    const start = this.next();
    const head = this.parseType();
    let body: Decl[] = [];
    if (this.isKw('where')) {
      this.next();
      body = this.parseDeclBlock();
    }
    if (head.kind !== 'con' || head.args.length < 1) throw parseError('This instance declaration is not in a supported form.', start);
    return { kind: 'instance', cls: head.name, type: head.args[0], body, pos: posOf(start) };
  }

  private parseImport(): Decl {
    const start = this.next();
    let qualified = false;
    if (this.peek().k === 'id' && this.peek().t === 'qualified') {
      this.next();
      qualified = true;
    }
    const modTok = this.next();
    if (modTok.k !== 'con') throw this.fail(modTok, 'parse error: import needs a module name such as Data.Char.');
    if (this.peek().k === 'id' && this.peek().t === 'qualified') {
      this.next();
      qualified = true;
    }
    let alias: string | undefined;
    if (this.peek().k === 'id' && this.peek().t === 'as') {
      this.next();
      alias = this.next().t;
    }
    let hiding = false;
    if (this.peek().k === 'id' && this.peek().t === 'hiding') {
      this.next();
      hiding = true;
    }
    let names: string[] | undefined;
    if (this.isSp('(')) {
      this.next();
      names = [];
      let depth = 1;
      while (depth > 0) {
        const t = this.next();
        if (t.k === 'eof') throw this.fail(t);
        if (t.k === 'sp' && t.t === '(') {
          depth += 1;
          const inner = this.real();
          if (depth === 2 && inner.k === 'sym' && this.toks[this.i + 1]?.t === ')') names.push(inner.t);
        } else if (t.k === 'sp' && t.t === ')') depth -= 1;
        else if (depth === 1 && (t.k === 'id' || t.k === 'con')) names.push(t.t);
      }
    }
    return { kind: 'import', module: modTok.t, qualified, alias, names, hiding, pos: posOf(start) };
  }

  // ---- types ------------------------------------------------------------------------------------------

  parseType(): Type {
    const t = this.parseBType();
    if (this.isSym('=>')) {
      this.next();
      return this.parseType();
    }
    if (this.isSym('->')) {
      this.next();
      return { kind: 'fun', from: t, to: this.parseType() };
    }
    return t;
  }

  private parseBType(): Type {
    const head = this.parseAType();
    const args: Type[] = [];
    while (this.startsAType()) args.push(this.parseAType());
    if (args.length === 0) return head;
    if (head.kind === 'con') return { kind: 'con', name: head.name, args: [...head.args, ...args] };
    return { kind: 'con', name: '@app', args: [head, ...args] };
  }

  private startsAType(): boolean {
    const t = this.peek();
    if (t.virtual) return false;
    if (t.k === 'con' || t.k === 'id') return true;
    if (t.k === 'sp') return t.t === '(' || t.t === '[';
    return t.k === 'sym' && t.t === '!';
  }

  private parseAType(): Type {
    const t = this.next();
    if (t.k === 'con') return { kind: 'con', name: t.v !== undefined ? String(t.v) : t.t, args: [] };
    if (t.k === 'id') return { kind: 'var', name: t.t };
    if (t.k === 'sym' && t.t === '!') return this.parseAType();
    if (t.k === 'sp' && t.t === '[') {
      if (this.isSp(']')) {
        this.next();
        return { kind: 'con', name: '[]', args: [] };
      }
      const elem = this.parseType();
      this.expectSp(']');
      return { kind: 'list', elem };
    }
    if (t.k === 'sp' && t.t === '(') {
      if (this.isSp(')')) {
        this.next();
        return { kind: 'tuple', items: [] };
      }
      if (this.isSym('->')) {
        this.next();
        this.expectSp(')');
        return { kind: 'con', name: '->', args: [] };
      }
      if (this.isSp(',')) {
        let commas = 0;
        while (this.isSp(',')) {
          this.next();
          commas += 1;
        }
        this.expectSp(')');
        return { kind: 'con', name: `(${','.repeat(commas)})`, args: [] };
      }
      const first = this.parseType();
      if (this.isSp(',')) {
        const items = [first];
        while (this.isSp(',')) {
          this.next();
          items.push(this.parseType());
        }
        this.expectSp(')');
        return { kind: 'tuple', items };
      }
      this.expectSp(')');
      return first;
    }
    throw this.fail(t);
  }

  // ---- patterns ---------------------------------------------------------------------------------------

  parsePattern(): Pat {
    return this.parseOpPat();
  }

  private parseOpPat(): Pat {
    const left = this.parseLPat();
    const t = this.peek();
    if (!t.virtual && t.k === 'sym' && t.t.startsWith(':') && !NON_OPERATORS.has(t.t) && t.t !== '::') {
      this.next();
      const right = this.parseOpPat();
      return { kind: 'con', name: t.t, args: [left, right], pos: posOf(t) };
    }
    if (!t.virtual && t.k === 'sp' && t.t === '`' && this.toks[this.i + 1]?.k === 'con' && this.toks[this.i + 2]?.t === '`') {
      const name = this.toks[this.i + 1].t;
      this.i += 3;
      const right = this.parseOpPat();
      return { kind: 'con', name, args: [left, right], pos: posOf(t) };
    }
    return left;
  }

  private parseLPat(): Pat {
    const t = this.peek();
    if (t.k === 'sym' && t.t === '-' && (this.toks[this.i + 1].k === 'int' || this.toks[this.i + 1].k === 'float')) {
      this.next();
      const n = this.next();
      return { kind: 'lit', value: -(n.v as bigint | number) as bigint | number };
    }
    if (t.k === 'con' && !t.virtual) {
      const next = this.toks[this.i + 1];
      if (!(next && next.k === 'sp' && next.t === '{' && !next.virtual)) {
        this.next();
        const name = t.q !== undefined ? String(t.v) : t.t;
        const args: Pat[] = [];
        while (this.startsApat()) args.push(this.parseApat());
        return { kind: 'con', name, args, pos: posOf(t) };
      }
    }
    return this.parseApat();
  }

  private isBang(t: Tok): boolean {
    if (t.k !== 'sym' || t.t !== '!') return false;
    const after = this.toks[this.i + 1];
    return Boolean(after) && after.line === t.line && after.col === t.col + 1 && (after.k === 'id' || after.k === 'con' || (after.k === 'sp' && (after.t === '(' || after.t === '[')));
  }

  startsApat(): boolean {
    const t = this.peek();
    if (t.virtual) return false;
    switch (t.k) {
      case 'id':
      case 'con':
      case 'int':
      case 'float':
      case 'char':
      case 'str':
        return true;
      case 'sp':
        return t.t === '(' || t.t === '[';
      case 'sym':
        return t.t === '~' || this.isBang(t);
      default:
        return false;
    }
  }

  parseApat(): Pat {
    const t = this.next();
    switch (t.k) {
      case 'id': {
        if (t.t === '_') return { kind: 'wild' };
        if (this.isSym('@')) {
          this.next();
          return { kind: 'as', name: t.t, pat: this.parseApat() };
        }
        return { kind: 'var', name: t.q !== undefined ? String(t.v) : t.t };
      }
      case 'con': {
        const name = t.q !== undefined ? String(t.v) : t.t;
        if (this.isSp('{') && !this.peek().virtual) {
          this.next();
          const fields: { name: string; pat: Pat }[] = [];
          while (!this.isSp('}')) {
            const f = this.next();
            if (f.k !== 'id') throw this.fail(f);
            if (this.isSym('=')) {
              this.next();
              fields.push({ name: f.t, pat: this.parsePattern() });
            } else {
              fields.push({ name: f.t, pat: { kind: 'var', name: f.t } });
            }
            if (this.isSp(',')) this.next();
          }
          this.expectSp('}');
          return { kind: 'rec', name, fields, pos: posOf(t) };
        }
        return { kind: 'con', name, args: [], pos: posOf(t) };
      }
      case 'int':
      case 'float':
        return { kind: 'lit', value: t.v as bigint | number };
      case 'char':
        return { kind: 'lit', value: { k: 'c', v: t.v as string } };
      case 'str':
        return { kind: 'str', value: t.v as string };
      case 'sym':
        if (t.t === '~') return { kind: 'lazy', pat: this.parseApat() };
        if (t.t === '!') return { kind: 'bang', pat: this.parseApat() };
        throw this.fail(t);
      case 'sp': {
        if (t.t === '(') {
          if (this.isSp(')')) {
            this.next();
            return { kind: 'tuple', items: [] };
          }
          const first = this.parsePattern();
          if (this.isSp(',')) {
            const items = [first];
            while (this.isSp(',')) {
              this.next();
              items.push(this.parsePattern());
            }
            this.expectSp(')');
            return { kind: 'tuple', items };
          }
          this.expectSp(')');
          return first;
        }
        if (t.t === '[') {
          const items: Pat[] = [];
          if (!this.isSp(']')) {
            items.push(this.parsePattern());
            while (this.isSp(',')) {
              this.next();
              items.push(this.parsePattern());
            }
          }
          this.expectSp(']');
          return { kind: 'list', items };
        }
        throw this.fail(t);
      }
      default:
        throw this.fail(t);
    }
  }

  // ---- expressions ------------------------------------------------------------------------------------

  parseExp(): Expr {
    const e = this.parseInfix();
    if (this.isSym('::')) {
      const t = this.next();
      return { kind: 'typed', expr: e, type: this.parseType(), pos: posOf(t) };
    }
    return e;
  }

  private parseInfix(): Expr {
    const { items } = this.parseInfixSeq(false);
    return this.resolve(items);
  }

  private parseInfixSeq(allowTrailing: boolean): { items: SeqItem[]; trailing: OpInfo | null } {
    const items: SeqItem[] = [];
    for (;;) {
      const t = this.peek();
      if (t.k === 'sym' && t.t === '-' && t.q === undefined && !t.virtual) {
        this.next();
        items.push({ neg: posOf(t) });
        continue;
      }
      items.push({ x: this.parseOperand() });
      const op = this.tryOperator();
      if (!op) return { items, trailing: null };
      if (allowTrailing && this.isSp(')')) return { items, trailing: op };
      items.push({ op });
    }
  }

  private tryOperator(): OpInfo | null {
    const t = this.peek();
    if (t.virtual) return null;
    if (t.k === 'sym' && !NON_OPERATORS.has(t.t)) {
      this.next();
      const base = t.q !== undefined ? String(t.v) : t.t;
      return { name: t.t, fix: this.fixities.get(base) ?? fx(9, 'l'), expr: { kind: 'var', name: t.t, pos: posOf(t) }, pos: posOf(t) };
    }
    if (t.k === 'sp' && t.t === '`') {
      const id = this.toks[this.i + 1];
      if ((id.k === 'id' || id.k === 'con') && this.toks[this.i + 2]?.t === '`') {
        this.i += 3;
        const base = id.q !== undefined ? String(id.v) : id.t;
        return { name: id.t, fix: this.fixities.get(base) ?? fx(9, 'l'), expr: { kind: 'var', name: id.t, pos: posOf(id) }, pos: posOf(id) };
      }
    }
    return null;
  }

  /** Haskell 2010 section 10.6: resolves a flat run of operands and operators using their fixities. */
  private resolve(items: SeqItem[]): Expr {
    let idx = 0;
    const cannotMix = (a: string, fa: Fixity, b: string, fb: Fixity, at: Position): SimulatorError => {
      const word = (f: Fixity) => `${f.assoc === 'l' ? 'infixl' : f.assoc === 'r' ? 'infixr' : 'infix'} ${f.prec}`;
      return new SimulatorError('Parse error', `cannot mix ‘${a}’ [${word(fa)}] and ${b === 'prefix -' ? "prefix `-'" : `‘${b}’`} [${word(fb)}] in the same infix expression`, at, 'Put parentheses around one of the operations, for example 9 + (-7).');
    };
    const negate = (e: Expr, at: Position): Expr => {
      if (e.kind === 'lit' && (typeof e.value === 'bigint' || typeof e.value === 'number')) return { kind: 'lit', value: -e.value as bigint | number, pos: e.pos };
      return { kind: 'app', fn: { kind: 'var', name: 'negate', pos: at }, args: [e], pos: at };
    };
    const combine = (op: OpInfo, left: Expr, right: Expr): Expr => {
      if (op.name === '$') return mkApp(left, [right], op.pos);
      return { kind: 'app', fn: op.expr, args: [left, right], pos: op.pos };
    };

    const parseNeg = (op1: { name: string; fix: Fixity }): Expr => {
      const item = items[idx];
      if (item === undefined) throw parseError('parse error: an operator needs an operand after it.');
      if ('x' in item) {
        idx += 1;
        return parse1(op1, item.x);
      }
      if ('neg' in item) {
        if (op1.fix.prec >= 6) throw cannotMix(op1.name, op1.fix, 'prefix -', fx(6, 'l'), item.neg);
        idx += 1;
        const operand = parseNeg({ name: 'prefix -', fix: fx(6, 'l') });
        return parse1(op1, negate(operand, item.neg));
      }
      throw parseError('parse error: two operators in a row.', { line: item.op.pos.line, col: item.op.pos.column });
    };
    const parse1 = (op1: { name: string; fix: Fixity }, first: Expr): Expr => {
      let left = first;
      for (;;) {
        if (idx >= items.length) return left;
        const item = items[idx] as { op: OpInfo };
        const op2 = item.op;
        if (op1.fix.prec === op2.fix.prec && (op1.fix.assoc !== op2.fix.assoc || op1.fix.assoc === 'n')) {
          throw cannotMix(op1.name, op1.fix, op2.name, op2.fix, op2.pos);
        }
        if (op1.fix.prec > op2.fix.prec || (op1.fix.prec === op2.fix.prec && op1.fix.assoc === 'l')) return left;
        idx += 1;
        const right = parseNeg(op2);
        left = combine(op2, left, right);
      }
    };
    return parseNeg({ name: '', fix: fx(-1, 'n') });
  }

  private parseOperand(): Expr {
    const t = this.peek();
    if (t.k === 'kw' && !t.virtual) {
      switch (t.t) {
        case 'let':
          return this.parseLet();
        case 'if':
          return this.parseIf();
        case 'case':
          return this.parseCase();
        case 'do':
          return this.parseDo();
        default:
          break;
      }
    }
    if (t.k === 'sym' && t.t === '\\' && !t.virtual) return this.parseLambda();
    return this.parseFexp();
  }

  private startsAexp(): boolean {
    const t = this.peek();
    if (t.virtual) return false;
    switch (t.k) {
      case 'id':
      case 'con':
      case 'int':
      case 'float':
      case 'char':
      case 'str':
        return true;
      case 'sp':
        return t.t === '(' || t.t === '[';
      default:
        return false;
    }
  }

  private parseFexp(): Expr {
    const start = this.peek();
    const head = this.parseAexp();
    const args: Expr[] = [];
    while (this.startsAexp()) args.push(this.parseAexp());
    return args.length > 0 ? mkApp(head, args, posOf(start)) : head;
  }

  private parseAexp(): Expr {
    let e = this.parseAtom();
    // Record construction and update: Point { x = 1 }, p { x = 2 }
    while (this.isSp('{') && this.toks[this.i + 1]?.k === 'id' && this.toks[this.i + 2]?.t === '=') {
      const open = this.next();
      const fields: { name: string; e: Expr }[] = [];
      while (!this.isSp('}')) {
        const f = this.next();
        if (f.k !== 'id') throw this.fail(f);
        this.expectSym('=');
        fields.push({ name: f.t, e: this.parseExp() });
        if (this.isSp(',')) this.next();
      }
      this.expectSp('}');
      e = e.kind === 'var' && /^[A-Z]/.test(e.name) ? { kind: 'reccon', name: e.name, fields, pos: posOf(open) } : { kind: 'recupd', expr: e, fields, pos: posOf(open) };
    }
    return e;
  }

  private parseAtom(): Expr {
    const t = this.next();
    const pos = posOf(t);
    switch (t.k) {
      case 'id':
      case 'con':
        return { kind: 'var', name: t.q !== undefined ? `${t.q}.${String(t.v)}` : t.t, pos };
      case 'int':
        return { kind: 'lit', value: t.v as bigint, pos };
      case 'float':
        return { kind: 'lit', value: t.v as number, pos };
      case 'char':
        return { kind: 'lit', value: { k: 'c', v: t.v as string }, pos };
      case 'str':
        return { kind: 'lit', value: stringToList(t.v as string), pos };
      case 'sp':
        if (t.t === '(') return this.parseParen(t);
        if (t.t === '[') return this.parseBracket(t);
        throw this.fail(t);
      default:
        throw this.fail(t);
    }
  }

  private parseParen(open: Tok): Expr {
    const pos = posOf(open);
    if (this.isSp(')')) {
      this.next();
      return { kind: 'tuple', items: [] };
    }
    if (this.isSp(',')) {
      let commas = 0;
      while (this.isSp(',')) {
        this.next();
        commas += 1;
      }
      this.expectSp(')');
      return { kind: 'var', name: `(${','.repeat(commas)})`, pos };
    }

    // An operator first: (+), (+ 1), (`div` 2), (- 5) is negation.
    const t = this.peek();
    const startsWithOperator = !t.virtual && ((t.k === 'sym' && !NON_OPERATORS.has(t.t) && !(t.t === '-' && t.q === undefined)) || (t.k === 'sp' && t.t === '`'));
    if (startsWithOperator) {
      const op = this.tryOperator() as OpInfo;
      if (this.isSp(')')) {
        this.next();
        return op.expr;
      }
      const arg = this.parseInfix();
      this.expectSp(')');
      return { kind: 'secr', op: op.expr, arg };
    }
    if (t.k === 'sym' && t.t === '-' && this.toks[this.i + 1]?.t === ')') {
      this.i += 2;
      return { kind: 'var', name: '-', pos };
    }

    const { items, trailing } = this.parseInfixSeq(true);
    if (trailing) {
      this.expectSp(')');
      return { kind: 'secl', op: trailing.expr, arg: this.resolve(items) };
    }
    let first = this.resolve(items);
    if (this.isSym('::')) {
      const c = this.next();
      first = { kind: 'typed', expr: first, type: this.parseType(), pos: posOf(c) };
    }
    if (this.isSp(',')) {
      const parts = [first];
      while (this.isSp(',')) {
        this.next();
        parts.push(this.parseExp());
      }
      this.expectSp(')');
      return { kind: 'tuple', items: parts };
    }
    this.expectSp(')');
    return first;
  }

  private parseBracket(open: Tok): Expr {
    const pos = posOf(open);
    if (this.isSp(']')) {
      this.next();
      return { kind: 'lit', value: NIL, pos };
    }
    const first = this.parseExp();
    if (this.isSym('..')) {
      this.next();
      const to = this.isSp(']') ? undefined : this.parseExp();
      this.expectSp(']');
      return { kind: 'range', from: first, to, pos };
    }
    if (this.isSym('|')) {
      this.next();
      const quals = this.parseQuals();
      this.expectSp(']');
      return { kind: 'comp', out: first, quals };
    }
    const items = [first];
    while (this.isSp(',')) {
      this.next();
      items.push(this.parseExp());
      if (items.length === 2 && this.isSym('..')) {
        this.next();
        const to = this.isSp(']') ? undefined : this.parseExp();
        this.expectSp(']');
        return { kind: 'range', from: first, then: items[1], to, pos };
      }
    }
    this.expectSp(']');
    return { kind: 'list', items: floatenList(items) };
  }

  private parseLet(): Expr {
    this.next();
    const decls = this.parseDeclBlock();
    this.skipSemiBefore('in');
    this.expectKw('in');
    return { kind: 'let', decls, body: this.parseExp() };
  }

  private parseIf(): Expr {
    const start = this.next();
    const c = this.parseExp();
    this.skipSemiBefore('then');
    this.expectKw('then');
    const t = this.parseExp();
    this.skipSemiBefore('else');
    this.expectKw('else');
    const f = this.parseExp();
    return { kind: 'if', c, t, f, pos: posOf(start) };
  }

  private parseCase(): Expr {
    const start = this.next();
    const scrut = this.parseExp();
    this.expectKw('of');
    const alts = this.block(() => this.parseAlt());
    return { kind: 'case', scrut, alts, pos: posOf(start) };
  }

  private parseAlt(): Alt {
    const pat = this.parsePattern();
    return { pat, rhs: this.parseRhs('->') };
  }

  private parseLambda(): Expr {
    const start = this.next();
    if (this.isKw('case')) {
      this.next();
      return { kind: 'lamcase', alts: this.block(() => this.parseAlt()), pos: posOf(start) };
    }
    const pats: Pat[] = [];
    while (this.startsApat()) pats.push(this.parseApat());
    if (pats.length === 0) throw this.fail(this.peek(), 'parse error: a lambda needs at least one parameter before ->.');
    this.expectSym('->');
    const body = this.parseExp();
    return { kind: 'lam', clause: { pats, rhs: simpleRhs(body), pos: posOf(start) }, pos: posOf(start) };
  }

  private parseDo(): Expr {
    const start = this.next();
    const stmts = this.block(() => this.parseStmt());
    if (stmts.length === 0) throw this.fail(this.peek(), 'parse error: empty do block.');
    return { kind: 'do', stmts, pos: posOf(start) };
  }

  private parseStmt(): Stmt {
    if (this.isKw('let')) {
      this.next();
      const decls = this.parseDeclBlock();
      if (this.isKw('in')) {
        this.next();
        return { kind: 'expr', e: { kind: 'let', decls, body: this.parseExp() } };
      }
      return { kind: 'let', decls };
    }
    const start = this.peek();
    const gen = this.tryGenerator();
    if (gen) return { kind: 'bind', pat: gen.pat, e: gen.e, pos: posOf(start) };
    return { kind: 'expr', e: this.parseExp() };
  }
}

/** [1, 2.5] has the same type throughout, so its whole numbers are Doubles too. */
function floatenList(items: Expr[]): Expr[] {
  const hasFloat = items.some((item) => item.kind === 'lit' && typeof item.value === 'number');
  if (!hasFloat) return items;
  return items.map((item) => (item.kind === 'lit' && typeof item.value === 'bigint' ? { ...item, value: Number(item.value) } : item));
}

/** Joins the equations of one function (consecutive clauses with the same name) into a single declaration. */
function groupClauses(decls: Decl[]): Decl[] {
  const out: Decl[] = [];
  for (const d of decls) {
    if (d.kind !== 'clause') {
      out.push(d);
      continue;
    }
    const previous = out[out.length - 1];
    const clause: Clause = { pats: d.pats, rhs: d.rhs, pos: d.pos };
    if (previous && previous.kind === 'fun' && previous.name === d.name) {
      if (previous.clauses[0].pats.length !== d.pats.length) {
        throw parseError(`Equations for ‘${d.name}’ have different numbers of arguments`, { line: d.pos.line, col: d.pos.column }, 'Every equation of a function must take the same number of arguments.');
      }
      previous.clauses.push(clause);
    } else {
      out.push({ kind: 'fun', name: d.name, clauses: [clause], pos: d.pos });
    }
  }
  return out;
}

function parseModule(source: string): Decl[] {
  const toks = lex(source);
  return new Parser(toks, prescanFixities(toks)).parseTop();
}

// ---------------------------------------------------------------------------------------------------------
// Values and the run state
// ---------------------------------------------------------------------------------------------------------

type Char = { k: 'c'; v: string };
type Nil = { k: 'nil'; s: boolean };
type Cons = { k: 'cons'; h: Lazy; t: Lazy; d?: Type };
type Tup = { k: 'tup'; items: Lazy[] };
type TypeInfo = { name: string; cons: ConInfo[]; derives: Set<string>; params: string[] };
type ConInfo = { name: string; arity: number; index: number; type: TypeInfo; fields: string[] | null; fieldTypes: Type[] };
type ConVal = { k: 'con'; info: ConInfo; args: Lazy[] };
type Fn = { k: 'fn'; name: string; arity: number; call?: (args: Lazy[]) => Value; clauses?: Clause[]; env?: Scope; cheap?: boolean };
type Pap = { k: 'pap'; fn: Fn; args: Lazy[] };
type IOAct = { k: 'io'; run: () => Lazy };
type PureVal = { k: 'pure'; v: Lazy };
type Value = bigint | number | boolean | Char | Nil | Cons | Tup | ConVal | Fn | Pap | IOAct | PureVal;
type Lazy = Value | Thunk;
type Obj = Exclude<Value, bigint | number | boolean>;

const NIL: Nil = { k: 'nil', s: false };
const SNIL: Nil = { k: 'nil', s: true };
const UNIT: Tup = { k: 'tup', items: [] };

class Scope {
  vars: Map<string, Lazy>;
  parent: Scope | null;
  constructor(parent: Scope | null) {
    this.vars = new Map();
    this.parent = parent;
  }
  get(name: string): Lazy | undefined {
    let scope: Scope | null = this;
    while (scope !== null) {
      const v = scope.vars.get(name);
      if (v !== undefined) return v;
      scope = scope.parent;
    }
    return undefined;
  }
}

class Thunk {
  state = 0;
  value: Value | undefined = undefined;
  expr: Expr | null;
  env: Scope | null;
  fn: (() => Value) | null;
  constructor(expr: Expr | null, env: Scope | null, fn: (() => Value) | null = null) {
    this.expr = expr;
    this.env = env;
    this.fn = fn;
  }
}

type ClassInfo = { name: string; tyvar: string; methods: Map<string, { dispatch: number; arity: number }>; defaults: Map<string, Fn> };

type RunState = {
  steps: number;
  maxSteps: number;
  deadline: number;
  out: string[];
  outLength: number;
  stdin: string;
  stdinPos: number;
  cons: Map<string, ConInfo>;
  types: Map<string, TypeInfo>;
  synonyms: Map<string, { params: string[]; type: Type }>;
  classes: Map<string, ClassInfo>;
  /** class name, then type name, then method name. */
  instances: Map<string, Map<string, Map<string, Lazy>>>;
  hint: Type | null;
  lib: Scope | null;
};

const MAX_OUTPUT = 200_000;

function newState(stdin: string): RunState {
  return {
    steps: 0,
    maxSteps: 2_500_000,
    deadline: Date.now() + 3000,
    out: [],
    outLength: 0,
    stdin,
    stdinPos: 0,
    cons: new Map(),
    types: new Map(),
    synonyms: new Map(),
    classes: new Map(),
    instances: new Map(),
    hint: null,
    lib: null,
  };
}

let R: RunState = newState('');

const LIMIT_HINT = 'This usually means the recursion does not reach a base case, or an infinite list was demanded without take.';

function tick(): void {
  R.steps += 1;
  if (R.steps > R.maxSteps) throw runtimeError('Evaluation limit exceeded.', undefined, LIMIT_HINT);
  if ((R.steps & 2047) === 0 && Date.now() > R.deadline) {
    throw runtimeError('The program ran for too long and was stopped.', undefined, LIMIT_HINT);
  }
}

function force(x: Lazy): Value {
  if (!(x instanceof Thunk)) return x;
  if (x.state === 2) return x.value as Value;
  if (x.state === 1) throw runtimeError('<<loop>>', undefined, 'A value is defined in terms of itself, so it can never be calculated.');
  x.state = 1;
  try {
    if (x.fn) tick();
    const v = x.fn ? x.fn() : ev(x.expr as Expr, x.env as Scope);
    x.value = v;
    x.state = 2;
    x.expr = null;
    x.env = null;
    x.fn = null;
    return v;
  } catch (error) {
    x.state = 0;
    throw error;
  }
}

const lazy = (fn: () => Value): Thunk => new Thunk(null, null, fn);

// ---- building values ---------------------------------------------------------------------------------

const charCache = new Map<string, Char>();
function mkChar(v: string): Char {
  let c = charCache.get(v);
  if (!c) {
    c = { k: 'c', v };
    if (charCache.size < 5000) charCache.set(v, c);
  }
  return c;
}

function stringToList(s: string, tail: Value = SNIL): Value {
  const chars = Array.from(s);
  let list: Value = tail;
  for (let i = chars.length - 1; i >= 0; i -= 1) list = { k: 'cons', h: mkChar(chars[i]), t: list };
  return list;
}

function fromArray(items: Lazy[], tail: Value = NIL): Value {
  let list: Value = tail;
  for (let i = items.length - 1; i >= 0; i -= 1) list = { k: 'cons', h: items[i], t: list };
  return list;
}

const mkTuple = (...items: Lazy[]): Tup => ({ k: 'tup', items });

function mkType(name: string, cons: { name: string; arity: number }[], params: string[] = [], derives: string[] = ['Show', 'Eq', 'Ord']): TypeInfo {
  const type: TypeInfo = { name, cons: [], derives: new Set(derives), params };
  cons.forEach((c, index) => type.cons.push({ name: c.name, arity: c.arity, index, type, fields: null, fieldTypes: [] }));
  return type;
}

const MAYBE_T = mkType('Maybe', [{ name: 'Nothing', arity: 0 }, { name: 'Just', arity: 1 }], ['a'], ['Show', 'Eq', 'Ord', 'Functor']);
const EITHER_T = mkType('Either', [{ name: 'Left', arity: 1 }, { name: 'Right', arity: 1 }], ['a', 'b']);
const ORDERING_T = mkType('Ordering', [{ name: 'LT', arity: 0 }, { name: 'EQ', arity: 0 }, { name: 'GT', arity: 0 }], [], ['Show', 'Eq', 'Ord', 'Enum', 'Bounded']);
const DOWN_T = mkType('Down', [{ name: 'Down', arity: 1 }], ['a']);
const BUILTIN_TYPES = [MAYBE_T, EITHER_T, ORDERING_T, DOWN_T];

const NOTHING: ConVal = { k: 'con', info: MAYBE_T.cons[0], args: [] };
const just = (x: Lazy): ConVal => ({ k: 'con', info: MAYBE_T.cons[1], args: [x] });
const LEFT = (x: Lazy): ConVal => ({ k: 'con', info: EITHER_T.cons[0], args: [x] });
const RIGHT = (x: Lazy): ConVal => ({ k: 'con', info: EITHER_T.cons[1], args: [x] });
const LT: ConVal = { k: 'con', info: ORDERING_T.cons[0], args: [] };
const EQ: ConVal = { k: 'con', info: ORDERING_T.cons[1], args: [] };
const GT: ConVal = { k: 'con', info: ORDERING_T.cons[2], args: [] };
const ordering = (n: number): ConVal => (n < 0 ? LT : n > 0 ? GT : EQ);

// ---- inspecting values ------------------------------------------------------------------------------

function describe(v: Value): string {
  if (typeof v === 'bigint') return 'Integer';
  if (typeof v === 'number') return 'Double';
  if (typeof v === 'boolean') return 'Bool';
  switch (v.k) {
    case 'c':
      return 'Char';
    case 'nil':
      return v.s ? 'String' : '[a]';
    case 'cons': {
      const head = v.h instanceof Thunk ? (v.h.state === 2 ? v.h.value : undefined) : v.h;
      if (head !== undefined) {
        const inner = describe(head);
        return inner === 'Char' ? 'String' : `[${inner}]`;
      }
      return '[a]';
    }
    case 'tup':
      return v.items.length === 0 ? '()' : `(${v.items.map((item) => (item instanceof Thunk ? (item.state === 2 ? describe(item.value as Value) : 'a') : describe(item))).join(', ')})`;
    case 'con':
      return v.info.type.name;
    case 'fn':
    case 'pap':
      return 'a -> b';
    case 'io':
      return 'IO a';
    case 'pure':
      return 'm a';
  }
}

const mismatch = (expected: string, actual: Value, at?: Position, hint?: string): SimulatorError =>
  typeError(`Couldn't match expected type ‘${expected}’ with actual type ‘${describe(actual)}’.`, at, hint);

function expectBool(v: Value, at?: Position): boolean {
  if (typeof v !== 'boolean') throw mismatch('Bool', v, at, 'A condition or a guard must be True or False.');
  return v;
}

function expectNum(v: Value, at?: Position): bigint | number {
  if (typeof v === 'bigint' || typeof v === 'number') return v;
  throw typeError(`No instance for (Num ${describe(v)}) arising from a use of an arithmetic operator.`, at, 'Arithmetic needs numbers on both sides; convert text with read, or numbers to text with show.');
}

function expectInt(v: Value, at?: Position): bigint {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number') throw typeError('No instance for (Integral Double) arising from a use of an integer operation.', at, 'div, mod, take and similar functions need whole numbers; use floor, round or truncate first.');
  throw typeError(`No instance for (Integral ${describe(v)}).`, at);
}

const toDouble = (v: bigint | number): number => (typeof v === 'bigint' ? Number(v) : v);

function expectChar(v: Value): string {
  if (typeof v === 'object' && v.k === 'c') return v.v;
  throw mismatch('Char', v);
}

function expectFn(v: Value, at?: Position): Fn | Pap {
  if (typeof v === 'object' && (v.k === 'fn' || v.k === 'pap')) return v;
  throw typeError(`Couldn't match expected type ‘a -> b’ with actual type ‘${describe(v)}’.`, at, `The value ${safeShow(v)} is being used like a function. Check the argument order.`);
}

function safeShow(v: Value): string {
  try {
    return showValue(v, 0);
  } catch {
    return describe(v);
  }
}

/** Forces the spine of a list into an array (the elements stay lazy). */
function toArray(list: Lazy, at?: Position): Lazy[] {
  const out: Lazy[] = [];
  let cur = force(list);
  for (;;) {
    if (typeof cur === 'object') {
      if (cur.k === 'nil') return out;
      if (cur.k === 'cons') {
        tick();
        out.push(cur.h);
        if (out.length > 1_000_000) throw runtimeError('The list is too long for the practice runner.', at);
        cur = force(cur.t);
        continue;
      }
    }
    throw mismatch('[a]', cur, at);
  }
}

function listToString(list: Lazy): string {
  let s = '';
  let cur = force(list);
  for (;;) {
    if (typeof cur === 'object') {
      if (cur.k === 'nil') return s;
      if (cur.k === 'cons') {
        s += expectChar(force(cur.h));
        if (s.length > MAX_OUTPUT) throw runtimeError('The text is too long for the practice runner.');
        cur = force(cur.t);
        continue;
      }
    }
    throw mismatch('String', cur);
  }
}

/** A list that ends the way `like` ended (a string stays a string, even when empty). */
const endLike = (like: Value): Value => (typeof like === 'object' && like.k === 'nil' ? like : NIL);

// ---------------------------------------------------------------------------------------------------------
// Pattern matching, equality and ordering
// ---------------------------------------------------------------------------------------------------------

function numericEqual(a: bigint | number, b: bigint | number): boolean {
  if (typeof a === 'bigint' && typeof b === 'bigint') return a === b;
  return toDouble(a) === toDouble(b);
}

function matchPat(p: Pat, v: Lazy, sc: Scope): boolean {
  switch (p.kind) {
    case 'var':
      sc.vars.set(p.name, v);
      return true;
    case 'wild':
      return true;
    case 'bang':
      force(v);
      return matchPat(p.pat, v, sc);
    case 'lazy': {
      // ~pattern always matches; its variables are matched when first used.
      let matched: Scope | null = null;
      const inner = p.pat;
      const getMatch = (): Scope => {
        if (matched) return matched;
        const m = new Scope(null);
        if (!matchPat(inner, v, m)) throw runtimeError('Irrefutable pattern failed');
        matched = m;
        return m;
      };
      for (const name of patVars(inner)) sc.vars.set(name, lazy(() => force(getMatch().vars.get(name) as Lazy)));
      return true;
    }
    case 'as':
      sc.vars.set(p.name, v);
      return matchPat(p.pat, v, sc);
    case 'lit': {
      const x = force(v);
      if (typeof p.value === 'object') {
        if (typeof x === 'object' && x.k === 'c') return x.v === p.value.v;
        throw mismatch('Char', x);
      }
      if (typeof x === 'bigint' || typeof x === 'number') return numericEqual(p.value, x);
      throw typeError(`No instance for (Num ${describe(x)}) arising from the literal ‘${p.value}’`);
    }
    case 'str': {
      let cur = force(v);
      for (const ch of p.value) {
        if (typeof cur !== 'object' || cur.k !== 'cons') {
          if (typeof cur === 'object' && cur.k === 'nil') return false;
          throw mismatch('String', cur);
        }
        const head = force(cur.h);
        if (typeof head !== 'object' || head.k !== 'c') throw mismatch('Char', head);
        if (head.v !== ch) return false;
        cur = force(cur.t);
      }
      return typeof cur === 'object' && cur.k === 'nil';
    }
    case 'tuple': {
      const x = force(v);
      if (typeof x !== 'object' || x.k !== 'tup' || x.items.length !== p.items.length) {
        throw typeError(`Couldn't match expected type ‘${p.items.length === 0 ? '()' : `(${p.items.map(() => 'a').join(', ')})`}’ with actual type ‘${describe(x)}’.`);
      }
      for (let i = 0; i < p.items.length; i += 1) if (!matchPat(p.items[i], x.items[i], sc)) return false;
      return true;
    }
    case 'list': {
      let cur = force(v);
      for (const item of p.items) {
        if (typeof cur !== 'object' || (cur.k !== 'cons' && cur.k !== 'nil')) throw mismatch('[a]', cur);
        if (cur.k === 'nil') return false;
        if (!matchPat(item, cur.h, sc)) return false;
        cur = force(cur.t);
      }
      return typeof cur === 'object' && cur.k === 'nil';
    }
    case 'con': {
      const x = force(v);
      if (p.name === ':') {
        if (typeof x !== 'object' || (x.k !== 'cons' && x.k !== 'nil')) throw mismatch('[a]', x);
        if (x.k === 'nil') return false;
        return matchPat(p.args[0], x.h, sc) && matchPat(p.args[1], x.t, sc);
      }
      if (p.name === 'True' || p.name === 'False') {
        if (typeof x !== 'boolean') throw mismatch('Bool', x);
        return x === (p.name === 'True');
      }
      if (typeof x !== 'object' || x.k !== 'con') {
        const info = R.cons.get(p.name);
        throw mismatch(info ? info.type.name : 'a', x);
      }
      const info = R.cons.get(p.name);
      if (info && info.type.name !== x.info.type.name) throw mismatch(info.type.name, x);
      if (x.info.name !== p.name) return false;
      if (p.args.length !== x.args.length) {
        throw typeError(`The constructor ‘${p.name}’ should have ${x.args.length} argument${x.args.length === 1 ? '' : 's'}, but has been given ${p.args.length}.`, p.pos);
      }
      for (let i = 0; i < p.args.length; i += 1) if (!matchPat(p.args[i], x.args[i], sc)) return false;
      return true;
    }
    case 'rec': {
      const x = force(v);
      if (typeof x !== 'object' || x.k !== 'con') throw mismatch('a record', x);
      if (x.info.name !== p.name) return false;
      for (const field of p.fields) {
        const at = x.info.fields ? x.info.fields.indexOf(field.name) : -1;
        if (at < 0) throw typeError(`Constructor ‘${p.name}’ does not have field ‘${field.name}’`, p.pos);
        if (!matchPat(field.pat, x.args[at], sc)) return false;
      }
      return true;
    }
  }
}

function patVars(p: Pat, out: string[] = []): string[] {
  switch (p.kind) {
    case 'var':
      out.push(p.name);
      break;
    case 'as':
      out.push(p.name);
      patVars(p.pat, out);
      break;
    case 'bang':
    case 'lazy':
      patVars(p.pat, out);
      break;
    case 'con':
      p.args.forEach((a) => patVars(a, out));
      break;
    case 'rec':
      p.fields.forEach((f) => patVars(f.pat, out));
      break;
    case 'tuple':
    case 'list':
      p.items.forEach((a) => patVars(a, out));
      break;
    default:
      break;
  }
  return out;
}

/** The instance method a user wrote for this value's type, if any. */
function userMethod(cls: string, method: string, v: Value): Lazy | undefined {
  if (R.instances.size === 0) return undefined;
  const byType = R.instances.get(cls);
  if (!byType) return undefined;
  const tn = typeNameOf(v);
  const methods = byType.get(tn) ?? (tn === 'Integer' ? byType.get('Int') : undefined) ?? (tn === 'Double' ? byType.get('Float') : undefined);
  return methods?.get(method);
}

function typeNameOf(v: Value): string {
  if (typeof v === 'bigint') return 'Integer';
  if (typeof v === 'number') return 'Double';
  if (typeof v === 'boolean') return 'Bool';
  switch (v.k) {
    case 'c':
      return 'Char';
    case 'nil':
    case 'cons':
      return '[]';
    case 'tup':
      return v.items.length === 0 ? '()' : `(${','.repeat(v.items.length - 1)})`;
    case 'con':
      return v.info.type.name;
    default:
      return '->';
  }
}

function derivesClass(v: ConVal, cls: string): boolean {
  return v.info.type.derives.has(cls);
}

function valuesEqual(a: Lazy, b: Lazy): boolean {
  const x = force(a);
  const y = force(b);
  if (typeof x === 'bigint') {
    if (typeof y === 'bigint') return x === y;
    if (typeof y === 'number') return Number(x) === y;
    throw mismatch(describe(x), y);
  }
  if (typeof x === 'number') {
    if (typeof y === 'number') return x === y;
    if (typeof y === 'bigint') return x === Number(y);
    throw mismatch(describe(x), y);
  }
  if (typeof x === 'boolean') {
    if (typeof y !== 'boolean') throw mismatch('Bool', y);
    return x === y;
  }
  if (typeof y !== 'object') throw mismatch(describe(x), y);
  switch (x.k) {
    case 'c':
      if (y.k !== 'c') throw mismatch('Char', y);
      return x.v === y.v;
    case 'nil':
    case 'cons': {
      let l: Value = x;
      let r: Value = y;
      for (;;) {
        if (typeof l !== 'object' || typeof r !== 'object' || (l.k !== 'nil' && l.k !== 'cons') || (r.k !== 'nil' && r.k !== 'cons')) {
          throw mismatch('[a]', typeof l === 'object' && (l.k === 'nil' || l.k === 'cons') ? r : l);
        }
        if (l.k === 'nil' || r.k === 'nil') return l.k === 'nil' && r.k === 'nil';
        tick();
        if (!valuesEqual(l.h, r.h)) return false;
        l = force(l.t);
        r = force(r.t);
      }
    }
    case 'tup': {
      if (y.k !== 'tup' || x.items.length !== y.items.length) throw mismatch(describe(x), y);
      for (let i = 0; i < x.items.length; i += 1) if (!valuesEqual(x.items[i], y.items[i])) return false;
      return true;
    }
    case 'con': {
      if (y.k !== 'con') throw mismatch(x.info.type.name, y);
      const eq = userMethod('Eq', '==', x);
      if (eq) return expectBool(apply(force(eq), [x, y]));
      const ne = userMethod('Eq', '/=', x);
      if (ne) return !expectBool(apply(force(ne), [x, y]));
      if (x.info.type.name !== y.info.type.name) throw mismatch(x.info.type.name, y);
      if (!derivesClass(x, 'Eq') && x.info.type.name !== 'Maybe' && R.instances.get('Eq') === undefined) {
        throw typeError(`No instance for (Eq ${x.info.type.name}) arising from a use of ‘==’`, undefined, `Add deriving (Eq) to the data declaration of ${x.info.type.name}.`);
      }
      if (x.info.name !== y.info.name) return false;
      for (let i = 0; i < x.args.length; i += 1) if (!valuesEqual(x.args[i], y.args[i])) return false;
      return true;
    }
    default:
      throw typeError(`No instance for (Eq (${describe(x)})) arising from a use of ‘==’`, undefined, 'Functions cannot be compared for equality.');
  }
}

function compareValues(a: Lazy, b: Lazy): number {
  const x = force(a);
  const y = force(b);
  if (typeof x === 'bigint' || typeof x === 'number') {
    if (typeof y !== 'bigint' && typeof y !== 'number') throw mismatch(describe(x), y);
    if (typeof x === 'bigint' && typeof y === 'bigint') return x < y ? -1 : x > y ? 1 : 0;
    const p = toDouble(x);
    const q = toDouble(y);
    return p < q ? -1 : p > q ? 1 : 0;
  }
  if (typeof x === 'boolean') {
    if (typeof y !== 'boolean') throw mismatch('Bool', y);
    return x === y ? 0 : x ? 1 : -1;
  }
  if (typeof y !== 'object') throw mismatch(describe(x), y);
  switch (x.k) {
    case 'c': {
      if (y.k !== 'c') throw mismatch('Char', y);
      const p = x.v.codePointAt(0) as number;
      const q = y.v.codePointAt(0) as number;
      return p < q ? -1 : p > q ? 1 : 0;
    }
    case 'nil':
    case 'cons': {
      let l: Value = x;
      let r: Value = y;
      for (;;) {
        if (typeof l !== 'object' || typeof r !== 'object' || (l.k !== 'nil' && l.k !== 'cons') || (r.k !== 'nil' && r.k !== 'cons')) {
          throw mismatch('[a]', typeof l === 'object' && (l.k === 'nil' || l.k === 'cons') ? r : l);
        }
        if (l.k === 'nil') return r.k === 'nil' ? 0 : -1;
        if (r.k === 'nil') return 1;
        tick();
        const c = compareValues(l.h, r.h);
        if (c !== 0) return c;
        l = force(l.t);
        r = force(r.t);
      }
    }
    case 'tup': {
      if (y.k !== 'tup' || x.items.length !== y.items.length) throw mismatch(describe(x), y);
      for (let i = 0; i < x.items.length; i += 1) {
        const c = compareValues(x.items[i], y.items[i]);
        if (c !== 0) return c;
      }
      return 0;
    }
    case 'con': {
      if (y.k !== 'con') throw mismatch(x.info.type.name, y);
      const cmp = userMethod('Ord', 'compare', x);
      if (cmp) {
        const r = force(apply(force(cmp), [x, y]));
        if (typeof r === 'object' && r.k === 'con') return r.info.index - 1;
      }
      const le = userMethod('Ord', '<=', x);
      if (le) {
        if (expectBool(apply(force(le), [x, y]))) return expectBool(apply(force(le), [y, x])) ? 0 : -1;
        return 1;
      }
      if (x.info.type.name !== y.info.type.name) throw mismatch(x.info.type.name, y);
      if (x.info.type === DOWN_T) return -compareValues(x.args[0], y.args[0]);
      if (!derivesClass(x, 'Ord') && R.instances.get('Ord') === undefined) {
        throw typeError(`No instance for (Ord ${x.info.type.name}) arising from a use of a comparison`, undefined, `Add deriving (Ord) to the data declaration of ${x.info.type.name}.`);
      }
      if (x.info.index !== y.info.index) return x.info.index < y.info.index ? -1 : 1;
      for (let i = 0; i < x.args.length; i += 1) {
        const c = compareValues(x.args[i], y.args[i]);
        if (c !== 0) return c;
      }
      return 0;
    }
    default:
      throw typeError(`No instance for (Ord (${describe(x)})) arising from a comparison`, undefined, 'Functions cannot be compared.');
  }
}

// ---------------------------------------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------------------------------------

const SKIP: Nil = { k: 'nil', s: false };

function notInScope(name: string, at?: Position): SimulatorError {
  if (/^[A-Z]/.test(name)) return typeError(`Data constructor not in scope: ${name}`, at, 'Check the spelling, or define the type with a data declaration.');
  return typeError(`Variable not in scope: ${name}`, at, 'Check the spelling, import the module that defines it, or define it before using it.');
}

function notAFunction(v: Value, at?: Position): SimulatorError {
  return typeError(`Couldn't match expected type ‘a -> b’ with actual type ‘${describe(v)}’.`, at, `The value ${safeShow(v)} is being used like a function. Check the argument order and the number of arguments.`);
}

function apply(f: Value, args: Lazy[], at?: Position): Value {
  let fn: Value = f;
  let rest = args;
  for (;;) {
    if (typeof fn === 'object') {
      if (fn.k === 'pap') {
        rest = fn.args.concat(rest);
        fn = fn.fn;
        continue;
      }
      if (fn.k === 'fn') {
        if (rest.length < fn.arity) return rest.length === 0 ? fn : { k: 'pap', fn, args: rest };
        if (rest.length === fn.arity) return callExact(fn, rest);
        const result = callExact(fn, rest.slice(0, fn.arity));
        rest = rest.slice(fn.arity);
        fn = result;
        continue;
      }
    }
    throw notAFunction(fn, at);
  }
}

function callExact(fn: Fn, args: Lazy[]): Value {
  if (fn.clauses) {
    const c = enter(fn, args);
    return ev(c.expr, c.env);
  }
  return (fn.call as (a: Lazy[]) => Value)(args);
}

type Picked = { expr: Expr; env: Scope };

function enter(fn: Fn, args: Lazy[]): Picked {
  const clauses = fn.clauses as Clause[];
  for (const c of clauses) {
    const sc = new Scope(fn.env as Scope);
    let ok = true;
    for (let i = 0; i < c.pats.length; i += 1) {
      if (!matchPat(c.pats[i], args[i], sc)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const pick = pickRhs(c.rhs, sc);
    if (pick) return pick;
  }
  throw runtimeError(`Non-exhaustive patterns in function ${fn.name}`, clauses[0].pos, `No equation of ${fn.name} matches these arguments. Add a case for them, or end the guards with otherwise.`);
}

function pickRhs(rhs: Rhs, scope: Scope): Picked | null {
  const sc = rhs.where.length > 0 ? bindDecls(rhs.where, scope) : scope;
  for (const g of rhs.guards) {
    if (g.quals.length === 0) return { expr: g.body, env: sc };
    const inner = testQuals(g.quals, sc);
    if (inner) return { expr: g.body, env: inner };
  }
  return null;
}

/** Runs guard qualifiers in order. Returns the scope they build, or null when one of them fails. */
function testQuals(quals: Qual[], scope: Scope): Scope | null {
  let sc = new Scope(scope);
  for (const q of quals) {
    if (q.kind === 'bool') {
      if (!expectBool(ev(q.e, sc), exprPos(q.e))) return null;
    } else if (q.kind === 'gen') {
      if (!matchPat(q.pat, delay(q.e, sc), sc)) return null;
    } else {
      sc = bindDecls(q.decls, sc);
    }
  }
  return sc;
}

function exprPos(e: Expr): Position | undefined {
  return 'pos' in e ? e.pos : undefined;
}

function pickAlt(alts: Alt[], scrut: Lazy, env: Scope, at: Position): Picked {
  for (const alt of alts) {
    const sc = new Scope(env);
    if (!matchPat(alt.pat, scrut, sc)) continue;
    const pick = pickRhs(alt.rhs, sc);
    if (pick) return pick;
  }
  throw runtimeError('Non-exhaustive patterns in case', at, 'No alternative matches this value. Add a final _ alternative to catch everything else.');
}

function makeLambda(clause: Clause, env: Scope): Fn {
  return { k: 'fn', name: '\\lambda', arity: clause.pats.length, clauses: [clause], env };
}

const SPECULATIVE = new Set(['+', '-', '*', '==', '/=', '<', '<=', '>', '>=']);

function readyValue(e: Expr, env: Scope): Value | undefined {
  if (e.kind === 'lit') return typeof e.value === 'bigint' || typeof e.value === 'number' ? e.value : undefined;
  if (e.kind === 'var') {
    const v = env.get(e.name);
    if (v === undefined) return undefined;
    const value = v instanceof Thunk ? (v.state === 2 ? v.value : undefined) : v;
    return typeof value === 'bigint' || typeof value === 'number' ? value : undefined;
  }
  return undefined;
}

/** A lazy value for the expression. Cheap arithmetic on values already known is done now, so an accumulator never grows a chain of thunks. */
function delay(e: Expr, env: Scope): Lazy {
  switch (e.kind) {
    case 'lit':
      return e.value;
    case 'var': {
      const v = env.get(e.name);
      if (v !== undefined) return v;
      break;
    }
    case 'lam':
      return makeLambda(e.clause, env);
    case 'app':
      if (e.args.length === 2 && e.fn.kind === 'var' && SPECULATIVE.has(e.fn.name)) {
        const op = env.get(e.fn.name);
        if (typeof op === 'object' && !(op instanceof Thunk) && op.k === 'fn' && op.cheap) {
          const a = readyValue(e.args[0], env);
          const b = readyValue(e.args[1], env);
          if (a !== undefined && b !== undefined) {
            try {
              tick();
              return (op.call as (args: Lazy[]) => Value)([a, b]);
            } catch (error) {
              if (!(error instanceof SimulatorError)) throw error;
            }
          }
        }
      }
      break;
    default:
      break;
  }
  return new Thunk(e, env);
}

function ev(e0: Expr, env0: Scope): Value {
  let e: Expr = e0;
  let env: Scope = env0;
  outer: for (;;) {
    tick();
    switch (e.kind) {
      case 'lit':
        return e.value;
      case 'var': {
        const v = env.get(e.name);
        if (v === undefined) throw notInScope(e.name, e.pos);
        return force(v);
      }
      case 'app': {
        const pos = e.pos;
        let fn = ev(e.fn, env);
        let args: Lazy[] = e.args.map((a) => delay(a, env));
        for (;;) {
          if (typeof fn === 'object') {
            if (fn.k === 'pap') {
              args = fn.args.concat(args);
              fn = fn.fn;
              continue;
            }
            if (fn.k === 'fn') {
              if (args.length < fn.arity) return { k: 'pap', fn, args };
              if (args.length === fn.arity) {
                if (fn.clauses) {
                  const c = enter(fn, args);
                  e = c.expr;
                  env = c.env;
                  continue outer;
                }
                return (fn.call as (a: Lazy[]) => Value)(args);
              }
              const result = callExact(fn, args.slice(0, fn.arity));
              args = args.slice(fn.arity);
              fn = result;
              continue;
            }
          }
          throw notAFunction(fn, pos);
        }
      }
      case 'if': {
        const c = ev(e.c, env);
        if (typeof c !== 'boolean') throw mismatch('Bool', c, e.pos, 'The condition of if must be True or False.');
        e = c ? e.t : e.f;
        continue;
      }
      case 'let':
        env = bindDecls(e.decls, env);
        e = e.body;
        continue;
      case 'case': {
        const pick = pickAlt(e.alts, delay(e.scrut, env), env, e.pos);
        e = pick.expr;
        env = pick.env;
        continue;
      }
      case 'lam':
        return makeLambda(e.clause, env);
      case 'lamcase': {
        const alts = e.alts;
        const at = e.pos;
        const scope = env;
        return { k: 'fn', name: '\\case', arity: 1, call: ([x]) => {
          const pick = pickAlt(alts, x, scope, at);
          return ev(pick.expr, pick.env);
        } };
      }
      case 'do':
        return evalDo(e.stmts, 0, env);
      case 'list':
        return fromArray(e.items.map((item) => delay(item, env)));
      case 'tuple':
        return e.items.length === 0 ? UNIT : { k: 'tup', items: e.items.map((item) => delay(item, env)) };
      case 'range':
        return evalRange(e, env);
      case 'comp': {
        const r = compStep(e.out, e.quals, 0, env, NIL);
        return r === SKIP ? NIL : r;
      }
      case 'secl':
        return apply(ev(e.op, env), [delay(e.arg, env)]);
      case 'secr': {
        const op = ev(e.op, env);
        const arg = delay(e.arg, env);
        return { k: 'fn', name: 'section', arity: 1, call: ([x]) => apply(op, [x, arg]) };
      }
      case 'typed':
        return evalTyped(e, env);
      case 'reccon':
        return evalRecordConstruction(e, env);
      case 'recupd':
        return evalRecordUpdate(e, env);
    }
  }
}

// ---- declarations -------------------------------------------------------------------------------------

function bindDecls(decls: Decl[], parent: Scope): Scope {
  const sc = new Scope(parent);
  bindInto(decls, sc);
  return sc;
}

function bindInto(decls: Decl[], sc: Scope): void {
  const sigs = new Map<string, Type>();
  for (const d of decls) if (d.kind === 'sig') for (const name of d.names) sigs.set(name, d.type);
  for (const d of decls) {
    if (d.kind === 'fun') {
      sc.vars.set(d.name, makeBinding(d, sc, sigs.get(d.name)));
    } else if (d.kind === 'patbind') {
      const rhs = d.rhs;
      const whole = lazy(() => {
        const pick = pickRhs(rhs, sc);
        if (!pick) throw runtimeError('Non-exhaustive guards in a pattern binding', d.pos);
        return ev(pick.expr, pick.env);
      });
      let matched: Scope | null = null;
      const getMatch = (): Scope => {
        if (matched) return matched;
        const m = new Scope(null);
        if (!matchPat(d.pat, whole, m)) throw runtimeError('Irrefutable pattern failed: the value does not match the pattern on the left of =', d.pos);
        matched = m;
        return m;
      };
      for (const name of patVars(d.pat)) {
        const sig = sigs.get(name);
        const thunk = lazy(() => force((getMatch().vars.get(name)) as Lazy));
        sc.vars.set(name, sig ? coerceLazy(sig, thunk) : thunk);
      }
    }
  }
}

function makeBinding(d: { name: string; clauses: Clause[] }, sc: Scope, sig: Type | undefined): Lazy {
  const clauses = d.clauses;
  const arity = clauses[0].pats.length;
  if (arity === 0) {
    const clause = clauses[clauses.length - 1];
    const thunk = lazy(() => {
      const pick = pickRhs(clause.rhs, sc);
      if (!pick) throw runtimeError(`Non-exhaustive guards in ${d.name}`, clause.pos);
      return ev(pick.expr, pick.env);
    });
    return sig ? coerceLazy(sig, thunk) : thunk;
  }
  const fn: Fn = { k: 'fn', name: d.name, arity, clauses, env: sc };
  return sig ? coerceBinding(sig, fn) : fn;
}

// ---- types: the parts of a signature the runner acts on ----------------------------------------------

function substituteType(t: Type, params: string[], args: Type[]): Type {
  switch (t.kind) {
    case 'var': {
      const at = params.indexOf(t.name);
      return at >= 0 ? args[at] : t;
    }
    case 'con':
      return { kind: 'con', name: t.name, args: t.args.map((a) => substituteType(a, params, args)) };
    case 'fun':
      return { kind: 'fun', from: substituteType(t.from, params, args), to: substituteType(t.to, params, args) };
    case 'list':
      return { kind: 'list', elem: substituteType(t.elem, params, args) };
    case 'tuple':
      return { kind: 'tuple', items: t.items.map((a) => substituteType(a, params, args)) };
  }
}

const CHAR_T: Type = { kind: 'con', name: 'Char', args: [] };

function expandType(t: Type, depth = 0): Type {
  if (depth < 20 && t.kind === 'con') {
    if (t.name === 'String' && t.args.length === 0) return { kind: 'list', elem: CHAR_T };
    if (t.name === '[]' && t.args.length === 1) return { kind: 'list', elem: t.args[0] };
    const syn = R.synonyms.get(t.name);
    if (syn && t.args.length === syn.params.length) return expandType(substituteType(syn.type, syn.params, t.args), depth + 1);
  }
  return t;
}

function isCharType(t: Type): boolean {
  const x = expandType(t);
  return x.kind === 'con' && x.name === 'Char';
}

function needsCoerce(t0: Type): boolean {
  if (t0.nc !== undefined) return t0.nc;
  t0.nc = false;
  const t = expandType(t0);
  let r = false;
  switch (t.kind) {
    case 'con':
      r = t.name === 'Double' || t.name === 'Float' || ((t.name === 'Maybe' || t.name === 'Either') && t.args.some(needsCoerce));
      break;
    case 'list':
      r = isCharType(t.elem) || needsCoerce(t.elem);
      break;
    case 'tuple':
      r = t.items.some(needsCoerce);
      break;
    case 'fun':
      r = needsCoerce(t.from) || needsCoerce(t.to);
      break;
    default:
      break;
  }
  t0.nc = r;
  return r;
}

function coerceLazy(t: Type, v: Lazy): Lazy {
  if (!needsCoerce(t)) return v;
  if (v instanceof Thunk) {
    if (v.state === 2) return coerceValue(t, v.value as Value);
    return lazy(() => coerceValue(t, force(v)));
  }
  return coerceValue(t, v);
}

/** Applies what a type signature says about numbers and strings: Double values print as 2.0, an empty String prints as "". */
function coerceValue(t0: Type, v: Value): Value {
  const t = expandType(t0);
  switch (t.kind) {
    case 'con':
      if (t.name === 'Double') return typeof v === 'bigint' ? Number(v) : v;
      if (t.name === 'Float') {
        const d = typeof v === 'bigint' ? Number(v) : v;
        return typeof d === 'number' ? Math.fround(d) : d;
      }
      if (typeof v === 'object' && v.k === 'con') {
        if (t.name === 'Maybe' && v.info.name === 'Just') return just(coerceLazy(t.args[0], v.args[0]));
        if (t.name === 'Either' && v.info.name === 'Left') return LEFT(coerceLazy(t.args[0], v.args[0]));
        if (t.name === 'Either' && v.info.name === 'Right') return RIGHT(coerceLazy(t.args[1], v.args[0]));
      }
      return v;
    case 'list': {
      if (typeof v !== 'object') return v;
      if (v.k === 'nil') return isCharType(t.elem) ? SNIL : v.s ? NIL : v;
      if (v.k === 'cons') {
        if (isCharType(t.elem) || !needsCoerce(t.elem) || v.d === t.elem) return v;
        const tail = v.t;
        return { k: 'cons', h: coerceLazy(t.elem, v.h), t: lazy(() => coerceValue(t, force(tail))), d: t.elem };
      }
      return v;
    }
    case 'tuple':
      if (typeof v === 'object' && v.k === 'tup' && v.items.length === t.items.length) {
        return { k: 'tup', items: v.items.map((item, i) => coerceLazy(t.items[i], item)) };
      }
      return v;
    case 'fun': {
      if (typeof v !== 'object' || (v.k !== 'fn' && v.k !== 'pap')) return v;
      const from = t.from;
      const to = t.to;
      const f = v;
      return { k: 'fn', name: v.k === 'fn' ? v.name : v.fn.name, arity: 1, call: ([x]) => coerceValue(to, apply(f, [coerceLazy(from, x)])) };
    }
    default:
      return v;
  }
}

/** A function with a signature: coerce the arguments it receives and the result it returns. */
function coerceBinding(sig: Type, fn: Fn): Value {
  if (!needsCoerce(sig)) return fn;
  const params: Type[] = [];
  let rest = expandType(sig);
  while (params.length < fn.arity && rest.kind === 'fun') {
    params.push(rest.from);
    rest = expandType(rest.to);
  }
  if (params.length < fn.arity) return fn;
  if (!params.some(needsCoerce) && !needsCoerce(rest)) return fn;
  const result = rest;
  return { k: 'fn', name: fn.name, arity: fn.arity, call: (args) => coerceValue(result, apply(fn, args.map((a, i) => coerceLazy(params[i], a)))) };
}

const HINTED = new Set(['read', 'readMaybe', 'readLn', 'fromIntegral', 'toEnum']);

function boundOf(max: boolean, type: Type): Value {
  const t = expandType(type);
  if (t.kind === 'con') {
    if (t.name === 'Int') return max ? 9223372036854775807n : -9223372036854775808n;
    if (t.name === 'Char') return mkChar(max ? '\u{10FFFF}' : '\0');
    if (t.name === 'Bool') return max;
    const info = R.types.get(t.name) ?? BUILTIN_TYPES.find((b) => b.name === t.name);
    if (info && info.cons.every((c) => c.arity === 0) && info.cons.length > 0) return conValue(info.cons[max ? info.cons.length - 1 : 0]);
  }
  throw typeError(`Ambiguous type variable arising from a use of ‘${max ? 'maxBound' : 'minBound'}’`, undefined, 'Write an annotation such as (maxBound :: Int).');
}

/** [minBound .. maxBound :: Day]: the annotation on one end gives the type of the other. */
function evalRange(e: Expr & { kind: 'range' }, env: Scope, elementType?: Type): Value {
  const ends = [e.from, e.then, e.to];
  const annotated = ends.find((end): end is Expr & { kind: 'typed' } => end !== undefined && end.kind === 'typed');
  const type = annotated ? annotated.type : elementType;
  const evalEnd = (end: Expr): Value => {
    if (type && end.kind === 'var' && (end.name === 'minBound' || end.name === 'maxBound')) return boundOf(end.name === 'maxBound', type);
    return ev(end, env);
  };
  return enumRange(evalEnd(e.from), e.then ? evalEnd(e.then) : undefined, e.to ? evalEnd(e.to) : undefined, e.pos);
}

function evalTyped(e: Expr & { kind: 'typed' }, env: Scope): Value {
  const inner = e.expr;
  if (inner.kind === 'range') {
    const listType = expandType(e.type);
    return evalRange(inner, env, listType.kind === 'list' ? listType.elem : undefined);
  }
  if (inner.kind === 'var' && (inner.name === 'maxBound' || inner.name === 'minBound')) return boundOf(inner.name === 'maxBound', e.type);
  const head = inner.kind === 'app' ? inner.fn : inner;
  const previous = R.hint;
  if (head.kind === 'var' && HINTED.has(head.name)) R.hint = e.type;
  let v: Value;
  try {
    v = ev(inner, env);
  } finally {
    R.hint = previous;
  }
  return coerceValue(e.type, v);
}

function conValue(info: ConInfo): Value {
  return { k: 'con', info, args: [] };
}

function evalRecordConstruction(e: Expr & { kind: 'reccon' }, env: Scope): Value {
  const info = R.cons.get(e.name);
  if (!info || !info.fields) throw typeError(`Constructor ‘${e.name}’ does not have named fields`, e.pos);
  const args: Lazy[] = info.fields.map((field) => {
    const given = e.fields.find((f) => f.name === field);
    if (given) return delay(given.e, env);
    return lazy(() => {
      throw runtimeError(`Missing field in record construction: ${field}`, e.pos);
    });
  });
  for (const f of e.fields) if (!info.fields.includes(f.name)) throw typeError(`Constructor ‘${e.name}’ does not have field ‘${f.name}’`, e.pos);
  return { k: 'con', info, args };
}

function evalRecordUpdate(e: Expr & { kind: 'recupd' }, env: Scope): Value {
  const base = ev(e.expr, env);
  if (typeof base !== 'object' || base.k !== 'con' || !base.info.fields) throw typeError('Record update applied to a value that has no named fields', e.pos);
  const fields = base.info.fields;
  const args = base.args.slice();
  for (const f of e.fields) {
    const at = fields.indexOf(f.name);
    if (at < 0) throw typeError(`No constructor has field ‘${f.name}’`, e.pos);
    args[at] = delay(f.e, env);
  }
  return { k: 'con', info: base.info, args };
}

// ---- ranges and comprehensions ------------------------------------------------------------------------

function lazyCons(head: Lazy, tail: () => Value): Value {
  return { k: 'cons', h: head, t: lazy(tail) };
}

function enumRange(from: Value, then: Value | undefined, to: Value | undefined, at?: Position): Value {
  const numeric = (x: Value | undefined) => x === undefined || typeof x === 'bigint' || typeof x === 'number';
  if ((typeof from === 'bigint' || typeof from === 'number') && numeric(then) && numeric(to)) {
    const allInteger = typeof from === 'bigint' && (then === undefined || typeof then === 'bigint') && (to === undefined || typeof to === 'bigint');
    if (allInteger) {
      const start = from as bigint;
      const step = then === undefined ? 1n : (then as bigint) - start;
      const end = to as bigint | undefined;
      const go = (cur: bigint): Value => {
        if (end !== undefined && ((step >= 0n && cur > end) || (step < 0n && cur < end))) return NIL;
        return lazyCons(cur, () => go(cur + step));
      };
      return go(start);
    }
    const a = toDouble(from as bigint | number);
    const step = then === undefined ? 1 : toDouble(then as bigint | number) - a;
    const limit = to === undefined ? undefined : toDouble(to as bigint | number) + step / 2;
    const go = (k: number): Value => {
      const cur = a + k * step;
      if (limit !== undefined && ((step >= 0 && cur > limit) || (step < 0 && cur < limit))) return NIL;
      return lazyCons(cur, () => go(k + 1));
    };
    return go(0);
  }
  if (typeof from === 'object' && from.k === 'c') {
    const code = (x: Value) => (expectChar(x).codePointAt(0) as number);
    const start = code(from);
    const step = then === undefined ? 1 : code(then) - start;
    const end = to === undefined ? 0x10ffff : code(to);
    const go = (cur: number): Value => {
      if ((step >= 0 && cur > end) || (step < 0 && cur < end) || cur > 0x10ffff || cur < 0) return SNIL;
      return lazyCons(mkChar(String.fromCodePoint(cur)), () => go(cur + step));
    };
    return go(start);
  }
  const enumIndex = (x: Value): { index: number; info: TypeInfo | null } => {
    if (typeof x === 'boolean') return { index: x ? 1 : 0, info: null };
    if (typeof x === 'object' && x.k === 'con') return { index: x.info.index, info: x.info.type };
    throw typeError(`No instance for (Enum ${describe(x)}) arising from a range`, at);
  };
  const first = enumIndex(from);
  const second = then === undefined ? undefined : enumIndex(then);
  const last = to === undefined ? undefined : enumIndex(to);
  const count = first.info ? first.info.cons.length : 2;
  const step = second ? second.index - first.index : 1;
  const build = (i: number): Value => (first.info ? conValue(first.info.cons[i]) : i === 1);
  const go = (cur: number): Value => {
    const bound = last ? last.index : step >= 0 ? count - 1 : 0;
    if (cur < 0 || cur >= count || (step >= 0 && cur > bound) || (step < 0 && cur < bound)) return NIL;
    return lazyCons(build(cur), () => go(cur + step));
  };
  return go(first.index);
}

function compStep(out: Expr, quals: Qual[], qi: number, env: Scope, tail: Lazy): Value {
  if (qi === quals.length) return { k: 'cons', h: delay(out, env), t: tail };
  const q = quals[qi];
  if (q.kind === 'bool') return expectBool(ev(q.e, env), exprPos(q.e)) ? compStep(out, quals, qi + 1, env, tail) : SKIP;
  if (q.kind === 'let') return compStep(out, quals, qi + 1, bindDecls(q.decls, env), tail);
  return compGen(out, quals, qi, q, delay(q.e, env), env, tail);
}

function compGen(out: Expr, quals: Qual[], qi: number, q: Qual & { kind: 'gen' }, list: Lazy, env: Scope, tail: Lazy): Value {
  let cur = list;
  for (;;) {
    const l = force(cur);
    if (typeof l !== 'object' || (l.k !== 'nil' && l.k !== 'cons')) throw mismatch('[a]', l, exprPos(q.e));
    if (l.k === 'nil') return SKIP;
    const sc = new Scope(env);
    if (matchPat(q.pat, l.h, sc)) {
      const rest = l.t;
      const inner = lazy(() => {
        const r = compGen(out, quals, qi, q, rest, env, tail);
        return r === SKIP ? force(tail) : r;
      });
      const r = compStep(out, quals, qi + 1, sc, inner);
      if (r !== SKIP) return r;
    }
    cur = l.t;
  }
}

// ---- do blocks and monads -----------------------------------------------------------------------------

function runIO(v: Value): Lazy {
  if (typeof v === 'object') {
    if (v.k === 'io') return v.run();
    if (v.k === 'pure') return v.v;
  }
  throw mismatch('IO t', v, undefined, 'A statement in a do block that runs in main must be an IO action such as putStrLn or print.');
}

/** `return x` has no type to tell which monad it is for; once its context is known it becomes that monad's value. */
function settle(v: Value, like: 'Maybe' | 'Either' | 'list'): Value {
  if (typeof v === 'object' && v.k === 'pure') {
    if (like === 'Maybe') return just(v.v);
    if (like === 'Either') return RIGHT(v.v);
    return fromArray([v.v]);
  }
  return v;
}

function bindM(m: Lazy, k: (x: Lazy) => Value): Value {
  const mv = force(m);
  if (typeof mv === 'object') {
    switch (mv.k) {
      case 'io':
        return { k: 'io', run: () => runIO(k(mv.run())) };
      case 'pure':
        return k(mv.v);
      case 'con':
        if (mv.info.type === MAYBE_T) return mv.info.index === 0 ? mv : settle(k(mv.args[0]), 'Maybe');
        if (mv.info.type === EITHER_T) return mv.info.index === 0 ? mv : settle(k(mv.args[0]), 'Either');
        break;
      case 'nil':
        return mv;
      case 'cons': {
        const results: Lazy[] = [];
        for (const x of toArray(mv)) {
          const r = settle(k(x), 'list');
          results.push(...toArray(r));
        }
        return fromArray(results);
      }
      default:
        break;
    }
  }
  throw mismatch('IO t', mv, undefined, 'The left side of <- or >>= must be an action such as getLine, a Maybe, or a list.');
}

function evalDo(stmts: Stmt[], i: number, env: Scope): Value {
  const s = stmts[i];
  const last = i === stmts.length - 1;
  switch (s.kind) {
    case 'expr':
      if (last) return ev(s.e, env);
      return bindM(delay(s.e, env), () => evalDo(stmts, i + 1, env));
    case 'bind':
      if (last) throw parseError('The last statement in a do block must be an expression', { line: s.pos.line, col: s.pos.column });
      return bindM(delay(s.e, env), (x) => {
        const sc = new Scope(env);
        if (!matchPat(s.pat, x, sc)) throw runtimeError('Pattern match failure in do expression', s.pos);
        return evalDo(stmts, i + 1, sc);
      });
    case 'let': {
      if (last) throw parseError('The last statement in a do block must be an expression');
      return evalDo(stmts, i + 1, bindDecls(s.decls, env));
    }
  }
}

// ---------------------------------------------------------------------------------------------------------
// Library: natives
// ---------------------------------------------------------------------------------------------------------

type LibEntry = { mod: string; name: string; value: Lazy };
const LIB = new Map<string, LibEntry>();

/** Data.Map and Data.Set share names with each other and with the Prelude, so their entries are keyed by module too. */
const libKey = (mod: string, name: string): string => (mod === 'Data.Map' || mod === 'Data.Set' ? `${mod}.${name}` : name);

function def(mod: string, name: string, arity: number, call: (args: Lazy[]) => Value, cheap = false): void {
  LIB.set(libKey(mod, name), { mod, name, value: { k: 'fn', name, arity, call, cheap } });
}
function defValue(mod: string, name: string, value: Lazy): void {
  LIB.set(libKey(mod, name), { mod, name, value });
}

function asList(v: Value, at?: Position): Nil | Cons {
  // Every step along a list counts, so a loop over a cyclic list (repeat, cycle) still reaches the time limit.
  tick();
  if (typeof v === 'object' && (v.k === 'nil' || v.k === 'cons')) return v;
  throw mismatch('[a]', v, at);
}

/** The empty list that fits `list`, without forcing anything: a string stays a string. */
function nilFor(list: Lazy): Nil {
  const v = list instanceof Thunk ? (list.state === 2 ? list.value : undefined) : list;
  if (v === undefined || typeof v !== 'object') return NIL;
  if (v.k === 'nil') return v;
  if (v.k === 'cons') {
    const h = v.h instanceof Thunk ? (v.h.state === 2 ? v.h.value : undefined) : v.h;
    if (h !== undefined && typeof h === 'object' && h.k === 'c') return SNIL;
  }
  return NIL;
}

function emit(text: string): void {
  R.out.push(text);
  R.outLength += text.length;
  if (R.outLength > MAX_OUTPUT) throw runtimeError('The program printed too much for the practice runner.', undefined, 'Print a smaller part of the result, for example with take.');
}

const applyF = (f: Value, ...args: Lazy[]): Value => apply(f, args);
const callBool = (f: Value, x: Lazy): boolean => expectBool(apply(f, [x]));

// ---- numbers ---------------------------------------------------------------------------------------

function arith(op: string, a: Value, b: Value, big: (x: bigint, y: bigint) => bigint, dbl: (x: number, y: number) => number): Value {
  if (typeof a === 'bigint' && typeof b === 'bigint') return big(a, b);
  const aNum = typeof a === 'bigint' || typeof a === 'number';
  const bNum = typeof b === 'bigint' || typeof b === 'number';
  if (aNum && bNum) return dbl(toDouble(a as bigint | number), toDouble(b as bigint | number));
  const user = typeof a === 'object' ? userMethod('Num', op, a) : typeof b === 'object' ? userMethod('Num', op, b) : undefined;
  if (user) return apply(force(user), [a, b]);
  throw typeError(`No instance for (Num ${describe(aNum ? b : a)}) arising from a use of ‘${op}’`, undefined, 'Arithmetic needs numbers on both sides; convert text with read, or numbers to text with show.');
}

function divBig(a: bigint, b: bigint): bigint {
  if (b === 0n) throw runtimeError('divide by zero');
  const q = a / b;
  return a % b !== 0n && a < 0n !== b < 0n ? q - 1n : q;
}
function modBig(a: bigint, b: bigint): bigint {
  if (b === 0n) throw runtimeError('divide by zero');
  const r = a % b;
  return r !== 0n && r < 0n !== b < 0n ? r + b : r;
}
function quotBig(a: bigint, b: bigint): bigint {
  if (b === 0n) throw runtimeError('divide by zero');
  return a / b;
}
function remBig(a: bigint, b: bigint): bigint {
  if (b === 0n) throw runtimeError('divide by zero');
  return a % b;
}
function gcdBig(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}
function roundHalfEven(x: number): number {
  const r = Math.round(x);
  return Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r;
}
function toBigInt(x: number): bigint {
  if (!Number.isFinite(x)) throw runtimeError(`Cannot convert ${x} to an integer.`);
  return BigInt(x);
}
function power(base: bigint | number, exponent: bigint): bigint | number {
  if (exponent < 0n) throw runtimeError('Negative exponent');
  if (typeof base === 'number') return Math.pow(base, Number(exponent));
  if (exponent > 100_000n && base !== 0n && base !== 1n && base !== -1n) throw runtimeError('That power is too large for the practice runner.');
  return base ** exponent;
}

function num1(name: string, f: (x: number) => number): void {
  def('Prelude', name, 1, ([a]) => f(toDouble(expectNum(force(a)))));
}

function defineNumbers(): void {
  def('Prelude', '+', 2, ([a, b]) => arith('+', force(a), force(b), (x, y) => x + y, (x, y) => x + y), true);
  def('Prelude', '-', 2, ([a, b]) => arith('-', force(a), force(b), (x, y) => x - y, (x, y) => x - y), true);
  def('Prelude', '*', 2, ([a, b]) => arith('*', force(a), force(b), (x, y) => x * y, (x, y) => x * y), true);
  def('Prelude', '/', 2, ([a, b]) => {
    const x = force(a);
    const y = force(b);
    if ((typeof x === 'bigint' || typeof x === 'number') && (typeof y === 'bigint' || typeof y === 'number')) return toDouble(x) / toDouble(y);
    const user = typeof x === 'object' ? userMethod('Fractional', '/', x) : undefined;
    if (user) return apply(force(user), [x, y]);
    throw typeError(`No instance for (Fractional ${describe(typeof x === 'object' ? x : y)}) arising from a use of ‘/’`, undefined, 'Division with / needs numbers.');
  });
  def('Prelude', 'div', 2, ([a, b]) => divBig(expectInt(force(a)), expectInt(force(b))));
  def('Prelude', 'mod', 2, ([a, b]) => modBig(expectInt(force(a)), expectInt(force(b))));
  def('Prelude', 'quot', 2, ([a, b]) => quotBig(expectInt(force(a)), expectInt(force(b))));
  def('Prelude', 'rem', 2, ([a, b]) => remBig(expectInt(force(a)), expectInt(force(b))));
  def('Prelude', 'divMod', 2, ([a, b]) => mkTuple(divBig(expectInt(force(a)), expectInt(force(b))), modBig(expectInt(force(a)), expectInt(force(b)))));
  def('Prelude', 'quotRem', 2, ([a, b]) => mkTuple(quotBig(expectInt(force(a)), expectInt(force(b))), remBig(expectInt(force(a)), expectInt(force(b)))));
  def('Prelude', '^', 2, ([a, b]) => {
    const exponent = force(b);
    if (typeof exponent !== 'bigint') throw typeError(`No instance for (Integral ${describe(exponent)}) arising from the exponent of ‘^’`, undefined, 'The exponent of ^ must be a whole number; use ** for a Double exponent.');
    return power(expectNum(force(a)), exponent);
  });
  def('Prelude', '^^', 2, ([a, b]) => Math.pow(toDouble(expectNum(force(a))), Number(expectInt(force(b)))));
  def('Prelude', '**', 2, ([a, b]) => Math.pow(toDouble(expectNum(force(a))), toDouble(expectNum(force(b)))));
  def('Prelude', 'negate', 1, ([a]) => {
    const x = force(a);
    if (typeof x === 'bigint') return -x;
    if (typeof x === 'number') return -x;
    const user = typeof x === 'object' ? userMethod('Num', 'negate', x) : undefined;
    if (user) return apply(force(user), [x]);
    throw typeError(`No instance for (Num ${describe(x)}) arising from a use of ‘negate’`);
  });
  def('Prelude', 'abs', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? (x < 0n ? -x : x) : Math.abs(x);
  });
  def('Prelude', 'signum', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? (x < 0n ? -1n : x > 0n ? 1n : 0n) : Math.sign(x);
  });
  def('Prelude', 'subtract', 2, ([a, b]) => arith('-', force(b), force(a), (x, y) => x - y, (x, y) => x - y));
  def('Prelude', 'even', 1, ([a]) => modBig(expectInt(force(a)), 2n) === 0n);
  def('Prelude', 'odd', 1, ([a]) => modBig(expectInt(force(a)), 2n) !== 0n);
  def('Prelude', 'gcd', 2, ([a, b]) => gcdBig(expectInt(force(a)), expectInt(force(b))));
  def('Prelude', 'lcm', 2, ([a, b]) => {
    const x = expectInt(force(a));
    const y = expectInt(force(b));
    if (x === 0n || y === 0n) return 0n;
    const r = (x / gcdBig(x, y)) * y;
    return r < 0n ? -r : r;
  });
  def('Prelude', 'fromIntegral', 1, ([a]) => expectNum(force(a)));
  def('Prelude', 'toInteger', 1, ([a]) => expectNum(force(a)));
  def('Prelude', 'fromInteger', 1, ([a]) => expectNum(force(a)));
  def('Prelude', 'realToFrac', 1, ([a]) => toDouble(expectNum(force(a))));
  def('Prelude', 'fromRational', 1, ([a]) => toDouble(expectNum(force(a))));
  def('Prelude', 'truncate', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? x : toBigInt(Math.trunc(x));
  });
  def('Prelude', 'round', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? x : toBigInt(roundHalfEven(x));
  });
  def('Prelude', 'floor', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? x : toBigInt(Math.floor(x));
  });
  def('Prelude', 'ceiling', 1, ([a]) => {
    const x = expectNum(force(a));
    return typeof x === 'bigint' ? x : toBigInt(Math.ceil(x));
  });
  num1('sqrt', Math.sqrt);
  num1('exp', Math.exp);
  num1('log', Math.log);
  num1('sin', Math.sin);
  num1('cos', Math.cos);
  num1('tan', Math.tan);
  num1('asin', Math.asin);
  num1('acos', Math.acos);
  num1('atan', Math.atan);
  num1('sinh', Math.sinh);
  num1('cosh', Math.cosh);
  num1('tanh', Math.tanh);
  def('Prelude', 'atan2', 2, ([a, b]) => Math.atan2(toDouble(expectNum(force(a))), toDouble(expectNum(force(b)))));
  def('Prelude', 'logBase', 2, ([a, b]) => Math.log(toDouble(expectNum(force(b)))) / Math.log(toDouble(expectNum(force(a)))));
  def('Prelude', 'isNaN', 1, ([a]) => Number.isNaN(toDouble(expectNum(force(a)))));
  def('Prelude', 'isInfinite', 1, ([a]) => {
    const x = toDouble(expectNum(force(a)));
    return x === Infinity || x === -Infinity;
  });
  defValue('Prelude', 'pi', Math.PI);

  def('Prelude', '==', 2, ([a, b]) => valuesEqual(a, b), true);
  def('Prelude', '/=', 2, ([a, b]) => !valuesEqual(a, b), true);
  def('Prelude', '<', 2, ([a, b]) => compareValues(a, b) < 0, true);
  def('Prelude', '<=', 2, ([a, b]) => compareValues(a, b) <= 0, true);
  def('Prelude', '>', 2, ([a, b]) => compareValues(a, b) > 0, true);
  def('Prelude', '>=', 2, ([a, b]) => compareValues(a, b) >= 0, true);
  def('Prelude', 'compare', 2, ([a, b]) => ordering(compareValues(a, b)));
  def('Prelude', 'max', 2, ([a, b]) => (compareValues(a, b) >= 0 ? force(a) : force(b)));
  def('Prelude', 'min', 2, ([a, b]) => (compareValues(a, b) <= 0 ? force(a) : force(b)));

  def('Prelude', 'succ', 1, ([a]) => stepEnum(force(a), 1));
  def('Prelude', 'pred', 1, ([a]) => stepEnum(force(a), -1));
  def('Prelude', 'fromEnum', 1, ([a]) => {
    const x = force(a);
    if (typeof x === 'bigint') return x;
    if (typeof x === 'number') return toBigInt(Math.trunc(x));
    if (typeof x === 'boolean') return x ? 1n : 0n;
    if (typeof x === 'object' && x.k === 'c') return BigInt(x.v.codePointAt(0) as number);
    if (typeof x === 'object' && x.k === 'con') return BigInt(x.info.index);
    throw typeError(`No instance for (Enum ${describe(x)}) arising from a use of ‘fromEnum’`);
  });
  def('Prelude', 'toEnum', 1, ([a]) => {
    const n = expectInt(force(a));
    const hint = R.hint ? expandType(R.hint) : null;
    if (hint && hint.kind === 'con') {
      if (hint.name === 'Char') return mkChar(String.fromCodePoint(Number(n)));
      if (hint.name === 'Bool') return n !== 0n;
      const info = R.types.get(hint.name) ?? BUILTIN_TYPES.find((t) => t.name === hint.name);
      if (info && n >= 0n && Number(n) < info.cons.length) return conValue(info.cons[Number(n)]);
      if (info) throw runtimeError(`Prelude.Enum.${hint.name}.toEnum: bad argument`);
    }
    return n;
  });
  def('Prelude', 'enumFrom', 1, ([a]) => enumRange(force(a), undefined, undefined));
  def('Prelude', 'enumFromTo', 2, ([a, b]) => enumRange(force(a), undefined, force(b)));
  def('Prelude', 'enumFromThen', 2, ([a, b]) => enumRange(force(a), force(b), undefined));
  def('Prelude', 'enumFromThenTo', 3, ([a, b, c]) => enumRange(force(a), force(b), force(c)));
}

function stepEnum(x: Value, d: number): Value {
  if (typeof x === 'bigint') return x + BigInt(d);
  if (typeof x === 'number') return x + d;
  if (typeof x === 'boolean') {
    if (d > 0 && !x) return true;
    if (d < 0 && x) return false;
    throw runtimeError(`Prelude.Enum.Bool.${d > 0 ? 'succ' : 'pred'}: bad argument`);
  }
  if (x.k === 'c') return mkChar(String.fromCodePoint((x.v.codePointAt(0) as number) + d));
  if (x.k === 'con') {
    const cons = x.info.type.cons;
    const i = x.info.index + d;
    if (i < 0 || i >= cons.length) throw runtimeError(`Prelude.Enum.${x.info.type.name}.${d > 0 ? 'succ' : 'pred'}: bad argument`);
    return conValue(cons[i]);
  }
  throw typeError(`No instance for (Enum ${describe(x)})`);
}

// ---- lists -----------------------------------------------------------------------------------------

function mapList(f: Value, list: Lazy): Value {
  const l = asList(force(list));
  if (l.k === 'nil') return l;
  return { k: 'cons', h: lazy(() => apply(f, [l.h])), t: lazy(() => mapList(f, l.t)) };
}

function filterList(p: Value, list: Lazy): Value {
  let cur = list;
  for (;;) {
    const l = asList(force(cur));
    if (l.k === 'nil') return l;
    if (callBool(p, l.h)) {
      const rest = l.t;
      return { k: 'cons', h: l.h, t: lazy(() => filterList(p, rest)) };
    }
    cur = l.t;
  }
}

function append(a: Lazy, b: Lazy): Value {
  const l = asList(force(a));
  if (l.k === 'nil') return force(b);
  return { k: 'cons', h: l.h, t: lazy(() => append(l.t, b)) };
}

function takeList(n: bigint, list: Lazy): Value {
  if (n <= 0n) return nilFor(list);
  const l = asList(force(list));
  if (l.k === 'nil') return l;
  return { k: 'cons', h: l.h, t: lazy(() => takeList(n - 1n, l.t)) };
}

function dropList(n: bigint, list: Lazy): Value {
  let cur = force(list);
  let k = n;
  while (k > 0n) {
    const l = asList(cur);
    if (l.k === 'nil') return l;
    cur = force(l.t);
    k -= 1n;
  }
  return cur;
}

function takeWhileList(p: Value, list: Lazy): Value {
  const l = asList(force(list));
  if (l.k === 'nil') return l;
  if (!callBool(p, l.h)) return nilFor(l);
  return { k: 'cons', h: l.h, t: lazy(() => takeWhileList(p, l.t)) };
}

function zipWithLists(f: (a: Lazy, b: Lazy) => Lazy, xs: Lazy, ys: Lazy): Value {
  const a = asList(force(xs));
  if (a.k === 'nil') return NIL;
  const b = asList(force(ys));
  if (b.k === 'nil') return NIL;
  return { k: 'cons', h: f(a.h, b.h), t: lazy(() => zipWithLists(f, a.t, b.t)) };
}

function concatLists(outerList: Lazy): Value {
  let cur = outerList;
  for (;;) {
    const outer = asList(force(cur));
    if (outer.k === 'nil') return NIL;
    const inner = asList(force(outer.h));
    if (inner.k === 'nil') {
      cur = outer.t;
      continue;
    }
    return { k: 'cons', h: inner.h, t: lazy(() => append(inner.t, lazy(() => concatLists(outer.t)))) };
  }
}

function foldrLazy(f: Value, z: Lazy, list: Lazy): Value {
  const l = asList(force(list));
  if (l.k === 'nil') return force(z);
  return apply(f, [l.h, lazy(() => foldrLazy(f, z, l.t))]);
}

function iterateList(f: Value, x: Lazy): Value {
  return { k: 'cons', h: x, t: lazy(() => iterateList(f, lazy(() => apply(f, [x])))) };
}

function sortValues(items: Lazy[], compare: (a: Lazy, b: Lazy) => number): Lazy[] {
  return items.slice().sort(compare);
}

function orderingToNumber(v: Value): number {
  if (typeof v === 'object' && v.k === 'con' && v.info.type === ORDERING_T) return v.info.index - 1;
  throw mismatch('Ordering', v);
}

function foldlList(f: Value, init: Lazy, list: Lazy): Value {
  let acc = force(init);
  for (const x of toArray(list)) acc = apply(f, [acc, x]);
  return acc;
}

function listLength(list: Lazy): bigint {
  let n = 0n;
  let cur = force(list);
  for (;;) {
    const l = asList(cur);
    if (l.k === 'nil') return n;
    n += 1n;
    cur = force(l.t);
    if ((Number(n) & 1023) === 0) tick();
  }
}

function emptyListError(name: string): SimulatorError {
  return runtimeError(`Prelude.${name}: empty list`);
}

function splitLines(text: string): string[] {
  if (text === '') return [];
  const parts = text.split('\n');
  if (parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function defineLists(): void {
  def('Prelude', 'head', 1, ([a]) => {
    const l = asList(force(a));
    if (l.k === 'nil') throw emptyListError('head');
    return force(l.h);
  });
  def('Prelude', 'tail', 1, ([a]) => {
    const l = asList(force(a));
    if (l.k === 'nil') throw emptyListError('tail');
    return force(l.t);
  });
  def('Prelude', 'last', 1, ([a]) => {
    let l = asList(force(a));
    if (l.k === 'nil') throw emptyListError('last');
    for (;;) {
      const next = asList(force(l.t));
      if (next.k === 'nil') return force(l.h);
      l = next;
    }
  });
  def('Prelude', 'init', 1, ([a]) => {
    const items = toArray(a);
    if (items.length === 0) throw emptyListError('init');
    return fromArray(items.slice(0, -1), nilFor(a));
  });
  def('Prelude', 'null', 1, ([a]) => asList(force(a)).k === 'nil');
  def('Prelude', 'length', 1, ([a]) => listLength(a));
  def('Prelude', '!!', 2, ([a, b]) => {
    const n = expectInt(force(b));
    if (n < 0n) throw runtimeError('Prelude.!!: negative index');
    let cur = asList(force(a));
    let i = n;
    for (;;) {
      if (cur.k === 'nil') throw runtimeError('Prelude.!!: index too large');
      if (i === 0n) return force(cur.h);
      cur = asList(force(cur.t));
      i -= 1n;
    }
  });
  def('Prelude', 'reverse', 1, ([a]) => fromArray(toArray(a).reverse(), nilFor(a)));
  def('Prelude', '++', 2, ([a, b]) => append(a, b));
  def('Prelude', 'concat', 1, ([a]) => concatLists(a));
  def('Prelude', 'concatMap', 2, ([f, xs]) => concatLists(lazy(() => mapList(force(f), xs))));
  def('Prelude', 'map', 2, ([f, xs]) => mapList(force(f), xs));
  def('Prelude', 'filter', 2, ([p, xs]) => filterList(force(p), xs));
  def('Prelude', 'foldr', 3, ([f, z, xs]) => {
    const fn = force(f);
    if (typeof fn === 'object' && fn.k === 'fn' && fn.cheap) {
      // A strict arithmetic operator needs the whole list anyway: fold from the right in a loop, not a deep recursion.
      const items = toArray(xs);
      let acc = force(z);
      for (let i = items.length - 1; i >= 0; i -= 1) acc = apply(fn, [items[i], acc]);
      return acc;
    }
    return foldrLazy(fn, z, xs);
  });
  def('Prelude', 'foldl', 3, ([f, z, xs]) => foldlList(force(f), z, xs));
  def('Data.List', "foldl'", 3, ([f, z, xs]) => foldlList(force(f), z, xs));
  def('Prelude', 'foldl1', 2, ([f, xs]) => {
    const items = toArray(xs);
    if (items.length === 0) throw emptyListError('foldl1');
    return foldlList(force(f), items[0], fromArray(items.slice(1)));
  });
  def('Prelude', 'sum', 1, ([xs]) => {
    let total: Value = 0n;
    for (const x of toArray(xs)) total = arith('+', total, force(x), (p, q) => p + q, (p, q) => p + q);
    return total;
  });
  def('Prelude', 'product', 1, ([xs]) => {
    let total: Value = 1n;
    for (const x of toArray(xs)) total = arith('*', total, force(x), (p, q) => p * q, (p, q) => p * q);
    return total;
  });
  def('Prelude', 'maximum', 1, ([xs]) => {
    const items = toArray(xs);
    if (items.length === 0) throw emptyListError('maximum');
    let best = items[0];
    for (const x of items.slice(1)) if (compareValues(x, best) >= 0) best = x;
    return force(best);
  });
  def('Prelude', 'minimum', 1, ([xs]) => {
    const items = toArray(xs);
    if (items.length === 0) throw emptyListError('minimum');
    let best = items[0];
    for (const x of items.slice(1)) if (compareValues(x, best) < 0) best = x;
    return force(best);
  });
  def('Prelude', 'elem', 2, ([x, xs]) => {
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (valuesEqual(x, cur.h)) return true;
      cur = asList(force(cur.t));
    }
    return false;
  });
  def('Prelude', 'notElem', 2, ([x, xs]) => {
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (valuesEqual(x, cur.h)) return false;
      cur = asList(force(cur.t));
    }
    return true;
  });
  def('Prelude', 'and', 1, ([xs]) => {
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (!expectBool(force(cur.h))) return false;
      cur = asList(force(cur.t));
    }
    return true;
  });
  def('Prelude', 'or', 1, ([xs]) => {
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (expectBool(force(cur.h))) return true;
      cur = asList(force(cur.t));
    }
    return false;
  });
  def('Prelude', 'all', 2, ([p, xs]) => {
    const f = force(p);
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (!callBool(f, cur.h)) return false;
      cur = asList(force(cur.t));
    }
    return true;
  });
  def('Prelude', 'any', 2, ([p, xs]) => {
    const f = force(p);
    let cur = asList(force(xs));
    while (cur.k === 'cons') {
      if (callBool(f, cur.h)) return true;
      cur = asList(force(cur.t));
    }
    return false;
  });
  def('Prelude', 'take', 2, ([n, xs]) => takeList(expectInt(force(n)), xs));
  def('Prelude', 'drop', 2, ([n, xs]) => dropList(expectInt(force(n)), xs));
  def('Prelude', 'takeWhile', 2, ([p, xs]) => takeWhileList(force(p), xs));
  def('Prelude', 'dropWhile', 2, ([p, xs]) => {
    const f = force(p);
    let cur = asList(force(xs));
    while (cur.k === 'cons' && callBool(f, cur.h)) cur = asList(force(cur.t));
    return cur;
  });
  def('Prelude', 'replicate', 2, ([n, x]) => {
    const count = expectInt(force(n));
    if (count > 1_000_000n) throw runtimeError('replicate is limited to a million copies in the practice runner.');
    return fromArray(Array.from({ length: Number(count > 0n ? count : 0n) }, () => x));
  });
  def('Prelude', 'repeat', 1, ([x]) => {
    const cell: Cons = { k: 'cons', h: x, t: NIL };
    cell.t = cell;
    return cell;
  });
  def('Prelude', 'cycle', 1, ([xs]) => {
    const items = toArray(xs);
    if (items.length === 0) throw emptyListError('cycle');
    const go = (i: number): Value => ({ k: 'cons', h: items[i % items.length], t: lazy(() => go(i + 1)) });
    return go(0);
  });
  def('Prelude', 'iterate', 2, ([f, x]) => iterateList(force(f), x));
  def('Prelude', 'zip', 2, ([xs, ys]) => zipWithLists((a, b) => mkTuple(a, b), xs, ys));
  def('Prelude', 'zipWith', 3, ([f, xs, ys]) => {
    const fn = force(f);
    return zipWithLists((a, b) => lazy(() => apply(fn, [a, b])), xs, ys);
  });
  def('Prelude', 'lines', 1, ([s]) => fromArray(splitLines(listToString(s)).map((line) => stringToList(line))));
  def('Prelude', 'unlines', 1, ([ss]) => stringToList(toArray(ss).map((s) => `${listToString(s)}\n`).join('')));
  def('Prelude', 'words', 1, ([s]) => fromArray(listToString(s).split(/\s+/).filter((w) => w !== '').map((w) => stringToList(w))));
  def('Prelude', 'unwords', 1, ([ss]) => stringToList(toArray(ss).map((s) => listToString(s)).join(' ')));

  def('Data.List', 'sort', 1, ([xs]) => fromArray(sortValues(toArray(xs), compareValues), nilFor(xs)));
  def('Data.List', 'sortBy', 2, ([cmp, xs]) => {
    const f = force(cmp);
    return fromArray(sortValues(toArray(xs), (a, b) => orderingToNumber(apply(f, [a, b]))), nilFor(xs));
  });
  def('Data.List', 'sortOn', 2, ([key, xs]) => {
    const f = force(key);
    const keyed = toArray(xs).map((x) => ({ x, k: lazy(() => apply(f, [x])) }));
    return fromArray(keyed.sort((a, b) => compareValues(a.k, b.k)).map((p) => p.x), nilFor(xs));
  });
  def('Data.List', 'genericLength', 1, ([xs]) => listLength(xs));
  def('Data.List', 'isPrefixOf', 2, ([p, s]) => {
    let a = asList(force(p));
    let b = asList(force(s));
    while (a.k === 'cons') {
      if (b.k === 'nil' || !valuesEqual(a.h, b.h)) return false;
      a = asList(force(a.t));
      b = asList(force(b.t));
    }
    return true;
  });
  def('Data.List', 'isSuffixOf', 2, ([p, s]) => {
    const a = toArray(p);
    const b = toArray(s);
    if (a.length > b.length) return false;
    const offset = b.length - a.length;
    return a.every((x, i) => valuesEqual(x, b[offset + i]));
  });
  def('Data.List', 'isInfixOf', 2, ([p, s]) => {
    const a = toArray(p);
    const b = toArray(s);
    for (let start = 0; start + a.length <= b.length; start += 1) {
      if (a.every((x, i) => valuesEqual(x, b[start + i]))) return true;
    }
    return false;
  });
  def('Data.List', 'nub', 1, ([xs]) => {
    const kept: Lazy[] = [];
    for (const x of toArray(xs)) if (!kept.some((k) => valuesEqual(k, x))) kept.push(x);
    return fromArray(kept, nilFor(xs));
  });
  def('Data.List', 'intercalate', 2, ([sep, xss]) => {
    const parts = toArray(xss);
    const out: Lazy[] = [];
    const s = toArray(sep);
    parts.forEach((part, i) => {
      if (i > 0) out.push(...s);
      out.push(...toArray(part));
    });
    return fromArray(out, nilFor(sep));
  });
  def('Data.List', 'intersperse', 2, ([sep, xs]) => {
    const out: Lazy[] = [];
    toArray(xs).forEach((x, i) => {
      if (i > 0) out.push(sep);
      out.push(x);
    });
    return fromArray(out, nilFor(xs));
  });
}

// ---- characters, control, input and output, monads ---------------------------------------------------

const io = (run: () => Lazy): IOAct => ({ k: 'io', run });
const pureOf = (v: Lazy): PureVal => ({ k: 'pure', v });

function charTest(name: string, test: (ch: string) => boolean): void {
  def('Data.Char', name, 1, ([c]) => test(expectChar(force(c))));
}

function fmapValue(f: Value, m: Value): Value {
  if (typeof m === 'object') {
    switch (m.k) {
      case 'io':
        return io(() => {
          const r = m.run();
          return lazy(() => apply(f, [r]));
        });
      case 'pure':
        return pureOf(lazy(() => apply(f, [m.v])));
      case 'nil':
        return m;
      case 'cons':
        return mapList(f, m);
      case 'tup':
        if (m.items.length === 2) return mkTuple(m.items[0], lazy(() => apply(f, [m.items[1]])));
        break;
      case 'fn':
      case 'pap':
        return { k: 'fn', name: 'fmap', arity: 1, call: ([x]) => apply(f, [lazy(() => apply(m, [x]))]) };
      case 'con': {
        if (m.info.type === MAYBE_T) return m.info.index === 0 ? m : just(lazy(() => apply(f, [m.args[0]])));
        if (m.info.type === EITHER_T) return m.info.index === 0 ? m : RIGHT(lazy(() => apply(f, [m.args[0]])));
        if (m.info.type === MAP_T) {
          return mapOf(toArray(m.args[0]).map((entry) => {
            const { key, value } = pairParts(entry);
            return mkTuple(key, lazy(() => apply(f, [value])));
          }));
        }
        const user = userMethod('Functor', 'fmap', m);
        if (user) return apply(force(user), [f, m]);
        throw typeError(`No instance for (Functor ${m.info.type.name}) arising from a use of ‘fmap’`, undefined, `Write an instance Functor ${m.info.type.name} where fmap = ...`);
      }
      default:
        break;
    }
  }
  throw typeError(`No instance for (Functor ${describe(m)}) arising from a use of ‘fmap’`);
}

function apValue(mf: Value, mx: Value): Value {
  if (typeof mf === 'object') {
    switch (mf.k) {
      case 'pure':
        return fmapValue(force(mf.v), mx);
      case 'io':
        return io(() => {
          const f = mf.run();
          const x = runIO(mx);
          return lazy(() => apply(force(f), [x]));
        });
      case 'con':
        if (mf.info.type === MAYBE_T) return mf.info.index === 0 ? mf : fmapValue(force(mf.args[0]), mx);
        if (mf.info.type === EITHER_T) return mf.info.index === 0 ? mf : fmapValue(force(mf.args[0]), mx);
        break;
      case 'nil':
        return mf;
      case 'cons': {
        const out: Lazy[] = [];
        for (const f of toArray(mf)) for (const x of toArray(mx)) out.push(lazy(() => apply(force(f), [x])));
        return fromArray(out);
      }
      default:
        break;
    }
  }
  throw typeError(`No instance for (Applicative ${describe(mf)}) arising from a use of ‘<*>’`);
}

function readLine(): string {
  if (R.stdinPos >= R.stdin.length) throw runtimeError('Prelude.getLine: end of file', undefined, 'The program asked for a line of input but there was none.');
  const end = R.stdin.indexOf('\n', R.stdinPos);
  const line = end < 0 ? R.stdin.slice(R.stdinPos) : R.stdin.slice(R.stdinPos, end);
  R.stdinPos = end < 0 ? R.stdin.length : end + 1;
  return line.replace(/\r$/, '');
}

function mapMImpl(f: Value, xs: Lazy, collect: boolean): Value {
  const items = toArray(xs);
  if (items.length === 0) return pureOf(collect ? NIL : UNIT);
  const first = apply(f, [items[0]]);
  if (typeof first === 'object' && (first.k === 'io' || first.k === 'pure')) {
    return io(() => {
      const results: Lazy[] = [];
      for (let i = 0; i < items.length; i += 1) {
        const r = runIO(i === 0 ? first : apply(f, [items[i]]));
        if (collect) results.push(r);
      }
      return collect ? fromArray(results) : UNIT;
    });
  }
  const go = (i: number, acc: Lazy[]): Value => {
    if (i === items.length) return pureOf(collect ? fromArray(acc) : UNIT);
    return bindM(i === 0 ? first : lazy(() => apply(f, [items[i]])), (r) => go(i + 1, collect ? [...acc, r] : acc));
  };
  return go(0, []);
}

function foldMImpl(f: Value, init: Lazy, xs: Lazy): Value {
  const items = toArray(xs);
  const go = (i: number, acc: Lazy): Value => {
    if (i === items.length) return pureOf(acc);
    return bindM(lazy(() => apply(f, [acc, items[i]])), (r) => go(i + 1, r));
  };
  if (items.length > 0) {
    const first = apply(f, [init, items[0]]);
    if (typeof first === 'object' && first.k === 'io') {
      return io(() => {
        let acc: Lazy = init;
        for (const x of items) acc = runIO(apply(f, [acc, x]));
        return acc;
      });
    }
  }
  return go(0, init);
}

function appendValues(a: Value, b: Lazy): Value {
  if (typeof a === 'object') {
    if (a.k === 'nil' || a.k === 'cons') return append(a, b);
    if (a.k === 'con') {
      if (a.info.type === ORDERING_T) return a.info.index === 1 ? force(b) : a;
      const user = userMethod('Semigroup', '<>', a);
      if (user) return apply(force(user), [a, b]);
    }
  }
  throw typeError(`No instance for (Semigroup ${describe(a)}) arising from a use of ‘<>’`);
}

function defineMore(): void {
  // Characters.
  def('Data.Char', 'ord', 1, ([c]) => BigInt(expectChar(force(c)).codePointAt(0) as number));
  def('Data.Char', 'chr', 1, ([n]) => {
    const code = expectInt(force(n));
    if (code < 0n || code > 0x10ffffn) throw runtimeError('Prelude.chr: bad argument');
    return mkChar(String.fromCodePoint(Number(code)));
  });
  def('Data.Char', 'toUpper', 1, ([c]) => {
    const ch = expectChar(force(c));
    const up = ch.toUpperCase();
    return mkChar(Array.from(up).length === 1 ? up : ch);
  });
  def('Data.Char', 'toLower', 1, ([c]) => {
    const ch = expectChar(force(c));
    const low = ch.toLowerCase();
    return mkChar(Array.from(low).length === 1 ? low : ch);
  });
  charTest('isUpper', (ch) => /\p{Lu}/u.test(ch));
  charTest('isLower', (ch) => /\p{Ll}/u.test(ch));
  charTest('isAlpha', (ch) => /\p{L}/u.test(ch));
  charTest('isLetter', (ch) => /\p{L}/u.test(ch));
  charTest('isDigit', (ch) => ch >= '0' && ch <= '9');
  charTest('isAlphaNum', (ch) => /[\p{L}\p{N}]/u.test(ch));
  charTest('isSpace', (ch) => /^\s$/u.test(ch));
  charTest('isPunctuation', (ch) => /\p{P}/u.test(ch));
  charTest('isSymbol', (ch) => /\p{S}/u.test(ch));
  charTest('isControl', (ch) => /\p{Cc}/u.test(ch));
  charTest('isPrint', (ch) => !/[\p{C}\p{Zl}\p{Zp}]/u.test(ch));
  charTest('isAscii', (ch) => (ch.codePointAt(0) as number) < 128);
  charTest('isHexDigit', (ch) => /^[0-9a-fA-F]$/.test(ch));
  charTest('isOctDigit', (ch) => /^[0-7]$/.test(ch));
  charTest('isSeparator', (ch) => /\p{Z}/u.test(ch));
  def('Data.Char', 'digitToInt', 1, ([c]) => {
    const ch = expectChar(force(c));
    if (!/^[0-9a-fA-F]$/.test(ch)) throw runtimeError(`Char.digitToInt: not a digit ${showValue(mkChar(ch), 0)}`);
    return BigInt(parseInt(ch, 16));
  });
  def('Data.Char', 'intToDigit', 1, ([n]) => {
    const d = expectInt(force(n));
    if (d < 0n || d > 15n) throw runtimeError(`Char.intToDigit: not a digit ${d}`);
    return mkChar(Number(d).toString(16));
  });

  // Functions and control.
  def('Prelude', 'id', 1, ([x]) => force(x));
  def('Prelude', 'const', 2, ([x]) => force(x));
  def('Prelude', 'flip', 3, ([f, x, y]) => apply(force(f), [y, x]));
  def('Prelude', '.', 3, ([f, g, x]) => apply(force(f), [lazy(() => apply(force(g), [x]))]));
  def('Prelude', '$', 2, ([f, x]) => apply(force(f), [x]));
  def('Prelude', '$!', 2, ([f, x]) => {
    force(x);
    return apply(force(f), [x]);
  });
  def('Data.Function', '&', 2, ([x, f]) => apply(force(f), [x]));
  def('Data.Function', 'on', 4, ([f, g, x, y]) => apply(force(f), [lazy(() => apply(force(g), [x])), lazy(() => apply(force(g), [y]))]));
  def('Data.Ord', 'comparing', 3, ([f, x, y]) => {
    const fn = force(f);
    return ordering(compareValues(lazy(() => apply(fn, [x])), lazy(() => apply(fn, [y]))));
  });
  def('Data.Ord', 'Down', 1, ([x]) => ({ k: 'con', info: DOWN_T.cons[0], args: [x] }));
  def('Prelude', 'curry', 3, ([f, x, y]) => apply(force(f), [mkTuple(x, y)]));
  def('Prelude', 'uncurry', 2, ([f, p]) => {
    const pair = force(p);
    if (typeof pair !== 'object' || pair.k !== 'tup' || pair.items.length !== 2) throw mismatch('(a, b)', pair);
    return apply(force(f), [pair.items[0], pair.items[1]]);
  });
  def('Prelude', 'fst', 1, ([p]) => {
    const pair = force(p);
    if (typeof pair !== 'object' || pair.k !== 'tup' || pair.items.length !== 2) throw mismatch('(a, b)', pair, undefined, 'fst and snd work on pairs, not on longer tuples.');
    return force(pair.items[0]);
  });
  def('Prelude', 'snd', 1, ([p]) => {
    const pair = force(p);
    if (typeof pair !== 'object' || pair.k !== 'tup' || pair.items.length !== 2) throw mismatch('(a, b)', pair, undefined, 'fst and snd work on pairs, not on longer tuples.');
    return force(pair.items[1]);
  });
  def('Data.Tuple', 'swap', 1, ([p]) => {
    const pair = force(p);
    if (typeof pair !== 'object' || pair.k !== 'tup' || pair.items.length !== 2) throw mismatch('(a, b)', pair);
    return mkTuple(pair.items[1], pair.items[0]);
  });
  def('Prelude', 'not', 1, ([a]) => !expectBool(force(a)));
  def('Prelude', '&&', 2, ([a, b]) => expectBool(force(a)) && expectBool(force(b)));
  def('Prelude', '||', 2, ([a, b]) => expectBool(force(a)) || expectBool(force(b)));
  defValue('Prelude', 'otherwise', true);
  def('Prelude', 'seq', 2, ([a, b]) => {
    force(a);
    return force(b);
  });
  def('Prelude', 'error', 1, ([msg]) => {
    throw runtimeError(listToString(msg));
  });
  def('Prelude', 'errorWithoutStackTrace', 1, ([msg]) => {
    throw runtimeError(listToString(msg));
  });
  defValue('Prelude', 'undefined', lazy(() => {
    throw runtimeError('Prelude.undefined');
  }));
  def('Prelude', 'show', 1, ([a]) => stringToList(showValue(force(a), 0)));
  def('Prelude', 'read', 1, ([s]) => readValue(listToString(s), R.hint));
  def('Text.Read', 'readMaybe', 1, ([s]) => {
    const hint = R.hint ? expandType(R.hint) : null;
    const inner = hint && hint.kind === 'con' && hint.name === 'Maybe' ? hint.args[0] : null;
    const r = tryRead(listToString(s), inner);
    return r === undefined ? NOTHING : just(r);
  });
  def('Prelude', ':', 2, ([h, t]) => ({ k: 'cons', h, t }));
  for (let n = 2; n <= 7; n += 1) def('Prelude', `(${','.repeat(n - 1)})`, n, (items) => ({ k: 'tup', items }));

  // Functor, Applicative, Monad.
  def('Prelude', 'fmap', 2, ([f, m]) => fmapValue(force(f), force(m)));
  def('Prelude', '<$>', 2, ([f, m]) => fmapValue(force(f), force(m)));
  def('Prelude', '<$', 2, ([x, m]) => fmapValue({ k: 'fn', name: 'const', arity: 1, call: () => force(x) }, force(m)));
  def('Prelude', '<*>', 2, ([mf, mx]) => apValue(force(mf), force(mx)));
  def('Prelude', '*>', 2, ([a, b]) => bindM(a, () => force(b)));
  def('Prelude', '<*', 2, ([a, b]) => bindM(a, (x) => bindM(b, () => pureOf(x))));
  def('Prelude', 'pure', 1, ([x]) => pureOf(x));
  def('Prelude', 'return', 1, ([x]) => pureOf(x));
  def('Prelude', '>>=', 2, ([m, f]) => bindM(m, (x) => apply(force(f), [x])));
  def('Prelude', '>>', 2, ([m, n]) => bindM(m, () => force(n)));
  def('Prelude', '=<<', 2, ([f, m]) => bindM(m, (x) => apply(force(f), [x])));
  def('Prelude', '<>', 2, ([a, b]) => appendValues(force(a), b));
  def('Prelude', 'mappend', 2, ([a, b]) => appendValues(force(a), b));
  def('Prelude', 'mconcat', 1, ([xs]) => concatLists(xs));
  def('Prelude', 'mapM_', 2, ([f, xs]) => mapMImpl(force(f), xs, false));
  def('Prelude', 'mapM', 2, ([f, xs]) => mapMImpl(force(f), xs, true));
  def('Prelude', 'traverse', 2, ([f, xs]) => mapMImpl(force(f), xs, true));
  def('Data.Foldable', 'traverse_', 2, ([f, xs]) => mapMImpl(force(f), xs, false));
  def('Prelude', 'sequence_', 1, ([xs]) => mapMImpl({ k: 'fn', name: 'id', arity: 1, call: ([x]) => force(x) }, xs, false));
  def('Prelude', 'sequence', 1, ([xs]) => mapMImpl({ k: 'fn', name: 'id', arity: 1, call: ([x]) => force(x) }, xs, true));
  def('Prelude', 'sequenceA', 1, ([xs]) => mapMImpl({ k: 'fn', name: 'id', arity: 1, call: ([x]) => force(x) }, xs, true));
  def('Control.Monad', 'forM_', 2, ([xs, f]) => mapMImpl(force(f), xs, false));
  def('Control.Monad', 'forM', 2, ([xs, f]) => mapMImpl(force(f), xs, true));
  def('Data.Foldable', 'for_', 2, ([xs, f]) => mapMImpl(force(f), xs, false));
  def('Control.Monad', 'when', 2, ([c, act]) => (expectBool(force(c)) ? force(act) : pureOf(UNIT)));
  def('Control.Monad', 'unless', 2, ([c, act]) => (expectBool(force(c)) ? pureOf(UNIT) : force(act)));
  def('Control.Monad', 'replicateM_', 2, ([n, act]) => mapMImpl({ k: 'fn', name: 'const', arity: 1, call: () => force(act) }, fromArray(Array.from({ length: Number(expectInt(force(n))) }, () => UNIT)), false));
  def('Control.Monad', 'replicateM', 2, ([n, act]) => mapMImpl({ k: 'fn', name: 'const', arity: 1, call: () => force(act) }, fromArray(Array.from({ length: Number(expectInt(force(n))) }, () => UNIT)), true));
  def('Control.Monad', 'foldM', 3, ([f, z, xs]) => foldMImpl(force(f), z, xs));
  def('Control.Monad', 'forever', 1, ([act]) => io(() => {
    for (;;) runIO(force(act));
  }));
  def('Control.Monad', 'void', 1, ([m]) => fmapValue({ k: 'fn', name: 'const', arity: 1, call: () => UNIT }, force(m)));

  // Input and output.
  def('Prelude', 'putStrLn', 1, ([s]) => io(() => {
    emit(`${listToString(s)}\n`);
    return UNIT;
  }));
  def('Prelude', 'putStr', 1, ([s]) => io(() => {
    emit(listToString(s));
    return UNIT;
  }));
  def('Prelude', 'putChar', 1, ([c]) => io(() => {
    emit(expectChar(force(c)));
    return UNIT;
  }));
  def('Prelude', 'print', 1, ([x]) => io(() => {
    emit(`${showValue(force(x), 0)}\n`);
    return UNIT;
  }));
  defValue('Prelude', 'getLine', io(() => stringToList(readLine())));
  defValue('Prelude', 'getContents', io(() => {
    const rest = R.stdin.slice(R.stdinPos);
    R.stdinPos = R.stdin.length;
    return stringToList(rest);
  }));
  defValue('Prelude', 'getChar', io(() => {
    if (R.stdinPos >= R.stdin.length) throw runtimeError('Prelude.getChar: end of file');
    const ch = R.stdin[R.stdinPos];
    R.stdinPos += 1;
    return mkChar(ch);
  }));
  def('Prelude', 'interact', 1, ([f]) => io(() => {
    const rest = R.stdin.slice(R.stdinPos);
    R.stdinPos = R.stdin.length;
    emit(listToString(apply(force(f), [stringToList(rest)])));
    return UNIT;
  }));
  defValue('Prelude', 'readLn', io(() => readValue(readLine(), R.hint)));
  defValue('System.IO', 'stdout', UNIT);
  defValue('System.IO', 'stderr', UNIT);
  defValue('System.IO', 'stdin', UNIT);
  defValue('System.IO', 'NoBuffering', UNIT);
  defValue('System.IO', 'LineBuffering', UNIT);
  def('System.IO', 'BlockBuffering', 1, () => UNIT);
  def('System.IO', 'hSetBuffering', 2, () => pureOf(UNIT));
  def('System.IO', 'hSetEcho', 2, () => pureOf(UNIT));
  def('System.IO', 'hFlush', 1, () => pureOf(UNIT));
  def('System.IO', 'hClose', 1, () => pureOf(UNIT));
  def('System.IO', 'hPutStrLn', 2, ([, s]) => io(() => {
    emit(`${listToString(s)}\n`);
    return UNIT;
  }));
  def('System.IO', 'hPutStr', 2, ([, s]) => io(() => {
    emit(listToString(s));
    return UNIT;
  }));
  def('System.IO', 'hGetLine', 1, () => io(() => stringToList(readLine())));
  defValue('System.IO', 'isEOF', io(() => R.stdinPos >= R.stdin.length));
  def('Text.Printf', 'printf', 1, ([fmt]) => {
    const template = listToString(fmt);
    const count = (template.replace(/%%/g, '').match(/%[-+ 0#]*\d*(?:\.\d+)?[a-zA-Z]/g) ?? []).length;
    const render = (args: Lazy[]) => io(() => {
      emit(formatPrintf(template, args));
      return UNIT;
    });
    if (count === 0) return render([]);
    return { k: 'fn', name: 'printf', arity: count, call: (args) => render(args) };
  });
}

// ---- Data.Map and Data.Set --------------------------------------------------------------------------
// Both are kept as a sorted Haskell list inside one constructor, so show, ==, and compare work without extra code.

const MAP_T = mkType('Map', [{ name: 'fromList', arity: 1 }], ['k', 'v']);
const SET_T = mkType('Set', [{ name: 'fromList', arity: 1 }], ['a']);

const mapOf = (entries: Lazy[]): ConVal => ({ k: 'con', info: MAP_T.cons[0], args: [fromArray(entries)] });
const setOf = (items: Lazy[]): ConVal => ({ k: 'con', info: SET_T.cons[0], args: [fromArray(items)] });

function expectContainer(v: Value, type: TypeInfo): Lazy[] {
  if (typeof v === 'object' && v.k === 'con' && v.info.type === type) return toArray(v.args[0]);
  throw mismatch(type === MAP_T ? 'Map k v' : 'Set a', v);
}

function pairParts(entry: Lazy): { key: Lazy; value: Lazy } {
  const pair = force(entry);
  if (typeof pair !== 'object' || pair.k !== 'tup' || pair.items.length !== 2) throw mismatch('(k, v)', pair);
  return { key: pair.items[0], value: pair.items[1] };
}

/** Where a key belongs in a sorted array of entries, and whether it is already there. */
function locate(entries: Lazy[], key: Lazy, keyOf: (entry: Lazy) => Lazy): { index: number; found: boolean } {
  let low = 0;
  let high = entries.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    const c = compareValues(keyOf(entries[mid]), key);
    if (c === 0) return { index: mid, found: true };
    if (c < 0) low = mid + 1;
    else high = mid;
  }
  return { index: low, found: false };
}

const entryKey = (entry: Lazy): Lazy => pairParts(entry).key;
const sameKey = (item: Lazy): Lazy => item;

function mapInsert(entries: Lazy[], key: Lazy, value: Lazy, combine?: (old: Lazy) => Lazy): Lazy[] {
  const where = locate(entries, key, entryKey);
  const next = entries.slice();
  const entry = (v: Lazy): Lazy => mkTuple(key, v);
  if (where.found) next[where.index] = entry(combine ? combine(pairParts(entries[where.index]).value) : value);
  else next.splice(where.index, 0, entry(value));
  return next;
}

function setInsert(items: Lazy[], item: Lazy): Lazy[] {
  const where = locate(items, item, sameKey);
  if (where.found) return items;
  const next = items.slice();
  next.splice(where.index, 0, item);
  return next;
}

function defineContainers(): void {
  const M = 'Data.Map';
  const S = 'Data.Set';
  const entriesOf = (m: Lazy): Lazy[] => expectContainer(force(m), MAP_T);
  const itemsOf = (s: Lazy): Lazy[] => expectContainer(force(s), SET_T);

  defValue(M, 'empty', mapOf([]));
  def(M, 'singleton', 2, ([k, v]) => mapOf([mkTuple(k, v)]));
  def(M, 'fromList', 1, ([xs]) => {
    let entries: Lazy[] = [];
    for (const x of toArray(xs)) {
      const { key, value } = pairParts(x);
      entries = mapInsert(entries, key, value);
    }
    return mapOf(entries);
  });
  def(M, 'fromListWith', 2, ([f, xs]) => {
    const fn = force(f);
    let entries: Lazy[] = [];
    for (const x of toArray(xs)) {
      const { key, value } = pairParts(x);
      entries = mapInsert(entries, key, value, (old) => lazy(() => apply(fn, [value, old])));
    }
    return mapOf(entries);
  });
  def(M, 'insert', 3, ([k, v, m]) => mapOf(mapInsert(entriesOf(m), k, v)));
  def(M, 'insertWith', 4, ([f, k, v, m]) => {
    const fn = force(f);
    return mapOf(mapInsert(entriesOf(m), k, v, (old) => lazy(() => apply(fn, [v, old]))));
  });
  def(M, 'delete', 2, ([k, m]) => {
    const entries = entriesOf(m);
    const where = locate(entries, k, entryKey);
    if (!where.found) return mapOf(entries);
    return mapOf([...entries.slice(0, where.index), ...entries.slice(where.index + 1)]);
  });
  def(M, 'lookup', 2, ([k, m]) => {
    const entries = entriesOf(m);
    const where = locate(entries, k, entryKey);
    return where.found ? just(pairParts(entries[where.index]).value) : NOTHING;
  });
  def(M, 'member', 2, ([k, m]) => locate(entriesOf(m), k, entryKey).found);
  def(M, 'notMember', 2, ([k, m]) => !locate(entriesOf(m), k, entryKey).found);
  def(M, 'findWithDefault', 3, ([d, k, m]) => {
    const entries = entriesOf(m);
    const where = locate(entries, k, entryKey);
    return force(where.found ? pairParts(entries[where.index]).value : d);
  });
  def(M, 'size', 1, ([m]) => BigInt(entriesOf(m).length));
  def(M, 'null', 1, ([m]) => entriesOf(m).length === 0);
  def(M, 'toList', 1, ([m]) => fromArray(entriesOf(m)));
  def(M, 'toAscList', 1, ([m]) => fromArray(entriesOf(m)));
  def(M, 'assocs', 1, ([m]) => fromArray(entriesOf(m)));
  def(M, 'keys', 1, ([m]) => fromArray(entriesOf(m).map((e) => pairParts(e).key)));
  def(M, 'elems', 1, ([m]) => fromArray(entriesOf(m).map((e) => pairParts(e).value)));
  def(M, 'adjust', 3, ([f, k, m]) => {
    const fn = force(f);
    const entries = entriesOf(m);
    const where = locate(entries, k, entryKey);
    if (!where.found) return mapOf(entries);
    return mapOf(mapInsert(entries, k, k, (old) => lazy(() => apply(fn, [old]))));
  });
  def(M, 'map', 2, ([f, m]) => {
    const fn = force(f);
    return mapOf(entriesOf(m).map((e) => {
      const { key, value } = pairParts(e);
      return mkTuple(key, lazy(() => apply(fn, [value])));
    }));
  });
  def(M, 'filter', 2, ([p, m]) => {
    const fn = force(p);
    return mapOf(entriesOf(m).filter((e) => callBool(fn, pairParts(e).value)));
  });
  def(M, 'foldr', 3, ([f, z, m]) => {
    const fn = force(f);
    const entries = entriesOf(m);
    let acc: Lazy = z;
    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const value = pairParts(entries[i]).value;
      const rest = acc;
      acc = lazy(() => apply(fn, [value, rest]));
    }
    return force(acc);
  });
  def(M, 'union', 2, ([a, b]) => {
    let entries = entriesOf(b);
    for (const e of entriesOf(a)) {
      const { key, value } = pairParts(e);
      entries = mapInsert(entries, key, value);
    }
    return mapOf(entries);
  });
  def(M, 'unionWith', 3, ([f, a, b]) => {
    const fn = force(f);
    let entries = entriesOf(a);
    for (const e of entriesOf(b)) {
      const { key, value } = pairParts(e);
      entries = mapInsert(entries, key, value, (old) => lazy(() => apply(fn, [old, value])));
    }
    return mapOf(entries);
  });

  defValue(S, 'empty', setOf([]));
  def(S, 'singleton', 1, ([x]) => setOf([x]));
  def(S, 'fromList', 1, ([xs]) => {
    let items: Lazy[] = [];
    for (const x of toArray(xs)) items = setInsert(items, x);
    return setOf(items);
  });
  def(S, 'insert', 2, ([x, s]) => setOf(setInsert(itemsOf(s), x)));
  def(S, 'delete', 2, ([x, s]) => {
    const items = itemsOf(s);
    const where = locate(items, x, sameKey);
    if (!where.found) return setOf(items);
    return setOf([...items.slice(0, where.index), ...items.slice(where.index + 1)]);
  });
  def(S, 'member', 2, ([x, s]) => locate(itemsOf(s), x, sameKey).found);
  def(S, 'notMember', 2, ([x, s]) => !locate(itemsOf(s), x, sameKey).found);
  def(S, 'size', 1, ([s]) => BigInt(itemsOf(s).length));
  def(S, 'null', 1, ([s]) => itemsOf(s).length === 0);
  def(S, 'toList', 1, ([s]) => fromArray(itemsOf(s)));
  def(S, 'toAscList', 1, ([s]) => fromArray(itemsOf(s)));
  def(S, 'elems', 1, ([s]) => fromArray(itemsOf(s)));
  def(S, 'union', 2, ([a, b]) => {
    let items = itemsOf(b);
    for (const x of itemsOf(a)) items = setInsert(items, x);
    return setOf(items);
  });
  def(S, 'intersection', 2, ([a, b]) => {
    const other = itemsOf(b);
    return setOf(itemsOf(a).filter((x) => locate(other, x, sameKey).found));
  });
  def(S, 'difference', 2, ([a, b]) => {
    const other = itemsOf(b);
    return setOf(itemsOf(a).filter((x) => !locate(other, x, sameKey).found));
  });
  def(S, 'map', 2, ([f, s]) => {
    const fn = force(f);
    let items: Lazy[] = [];
    for (const x of itemsOf(s)) items = setInsert(items, lazy(() => apply(fn, [x])));
    return setOf(items);
  });
  def(S, 'filter', 2, ([p, s]) => {
    const fn = force(p);
    return setOf(itemsOf(s).filter((x) => callBool(fn, x)));
  });
}

function formatPrintf(template: string, args: Lazy[]): string {
  let next = 0;
  return template.replace(/%%|%([-+ 0#]*)(\d*)(?:\.(\d+))?([a-zA-Z])/g, (whole, flags: string, width: string, precision: string | undefined, conv: string) => {
    if (whole === '%%') return '%';
    const arg = force(args[next]);
    next += 1;
    let text: string;
    switch (conv) {
      case 'd':
      case 'i':
        text = String(expectInt(arg));
        if (flags.includes('+') && !text.startsWith('-')) text = `+${text}`;
        break;
      case 'f':
      case 'F':
        text = toDouble(expectNum(arg)).toFixed(precision === undefined ? 6 : Number(precision));
        if (flags.includes('+') && !text.startsWith('-')) text = `+${text}`;
        break;
      case 'e':
        text = toDouble(expectNum(arg)).toExponential(precision === undefined ? 6 : Number(precision)).replace(/e([+-])(\d)$/, 'e$1$2');
        break;
      case 'g':
        text = String(toDouble(expectNum(arg)));
        break;
      case 's':
        text = typeof arg === 'object' && (arg.k === 'nil' || arg.k === 'cons') ? listToString(arg) : showValue(arg, 0);
        if (precision !== undefined) text = text.slice(0, Number(precision));
        break;
      case 'c':
        text = expectChar(arg);
        break;
      case 'x':
        text = expectInt(arg).toString(16);
        break;
      case 'X':
        text = expectInt(arg).toString(16).toUpperCase();
        break;
      case 'o':
        text = expectInt(arg).toString(8);
        break;
      case 'b':
        text = expectInt(arg).toString(2);
        break;
      case 'v':
        text = showValue(arg, 0);
        break;
      default:
        throw runtimeError(`printf: bad formatting char ${JSON.stringify(conv)}`);
    }
    const w = width === '' ? 0 : Number(width);
    if (text.length >= w) return text;
    if (flags.includes('-')) return text.padEnd(w);
    if (flags.includes('0') && /[dfFeixXob]/.test(conv)) {
      const sign = /^[+-]/.test(text) ? text[0] : '';
      return sign + text.slice(sign.length).padStart(w - sign.length, '0');
    }
    return text.padStart(w);
  });
}

// ---- library written in Haskell ---------------------------------------------------------------------

const HASKELL_LIBRARY: { mod: string; source: string }[] = [
  {
    mod: 'Prelude',
    source: `
foldr1 _ [x] = x
foldr1 f (x:xs) = f x (foldr1 f xs)
foldr1 _ [] = error "Prelude.foldr1: empty list"
scanl f q [] = [q]
scanl f q (x:xs) = q : scanl f (f q x) xs
scanl1 f (x:xs) = scanl f x xs
scanl1 _ [] = []
scanr _ q0 [] = [q0]
scanr f q0 (x:xs) = f x q : qs
  where qs@(q:_) = scanr f q0 xs
scanr1 _ [] = []
scanr1 _ [x] = [x]
scanr1 f (x:xs) = f x q : qs
  where qs@(q:_) = scanr1 f xs
span _ xs@[] = (xs, xs)
span p xs@(x:xs')
  | p x = let (ys, zs) = span p xs' in (x:ys, zs)
  | otherwise = ([], xs)
break p = span (not . p)
splitAt n xs = (take n xs, drop n xs)
lookup _ [] = Nothing
lookup key ((x,y):rest)
  | key == x = Just y
  | otherwise = lookup key rest
unzip xs = (map fst xs, map snd xs)
unzip3 xs = (map (\\(a,_,_) -> a) xs, map (\\(_,b,_) -> b) xs, map (\\(_,_,c) -> c) xs)
zip3 (a:as) (b:bs) (c:cs) = (a,b,c) : zip3 as bs cs
zip3 _ _ _ = []
zipWith3 f (a:as) (b:bs) (c:cs) = f a b c : zipWith3 f as bs cs
zipWith3 _ _ _ _ = []
until p f x
  | p x = x
  | otherwise = until p f (f x)
maybe d _ Nothing = d
maybe _ f (Just x) = f x
either f _ (Left x) = f x
either _ g (Right y) = g y
asTypeOf x _ = x
liftA2 f a b = fmap f a <*> b
`,
  },
  {
    mod: 'Data.Function',
    source: `
fix f = let x = f x in x
`,
  },
  {
    mod: 'Data.Foldable',
    source: `
toList xs = xs
foldr' = foldr
`,
  },
  {
    mod: 'Control.Monad',
    source: `
join m = m >>= id
liftM = fmap
zipWithM_ f xs ys = sequence_ (zipWith f xs ys)
zipWithM f xs ys = sequence (zipWith f xs ys)
filterM p xs = fmap (map fst . filter snd) (mapM (\\x -> fmap (\\keep -> (x, keep)) (p x)) xs)
`,
  },
  {
    mod: 'Data.List',
    source: `
group = groupBy (==)
groupBy _ [] = []
groupBy eq (x:xs) = (x:ys) : groupBy eq zs
  where (ys, zs) = span (eq x) xs
partition p xs = (filter p xs, filter (not . p) xs)
transpose [] = []
transpose ([] : xss) = transpose xss
transpose ((x:xs) : xss) = (x : [h | (h:_) <- xss]) : transpose (xs : [t | (_:t) <- xss])
subsequences xs = [] : nonEmptySubsequences xs
nonEmptySubsequences [] = []
nonEmptySubsequences (x:xs) = [x] : foldr f [] (nonEmptySubsequences xs)
  where f ys r = ys : (x : ys) : r
permutations xs0 = xs0 : perms xs0 []
  where
    perms [] _ = []
    perms (t:ts) is = foldr interleave (perms ts (t:is)) (permutations is)
      where
        interleave xs r = let (_, zs) = interleave' id xs r in zs
        interleave' _ [] r = (ts, r)
        interleave' f (y:ys) r = let (us, zs) = interleave' (f . (y:)) ys r in (y : us, f (t : y : us) : zs)
tails [] = [[]]
tails xs@(_:xs') = xs : tails xs'
inits xs = [] : (case xs of { [] -> []; (x:xs') -> map (x:) (inits xs') })
delete _ [] = []
delete x (y:ys) = if x == y then ys else y : delete x ys
deleteBy _ _ [] = []
deleteBy eq x (y:ys) = if eq x y then ys else y : deleteBy eq x ys
insert x [] = [x]
insert x (y:ys) = if x <= y then x : y : ys else y : insert x ys
insertBy _ x [] = [x]
insertBy cmp x ys@(y:ys') = case cmp x y of { GT -> y : insertBy cmp x ys'; _ -> x : ys }
nubBy _ [] = []
nubBy eq (x:xs) = x : nubBy eq (filter (\\y -> not (eq x y)) xs)
xs \\\\ ys = foldl (flip delete) xs ys
union xs ys = xs ++ foldl (flip delete) (nub ys) xs
intersect xs ys = [x | x <- xs, x \`elem\` ys]
maximumBy cmp = foldl1 (\\x y -> case cmp x y of { GT -> x; _ -> y })
minimumBy cmp = foldl1 (\\x y -> case cmp x y of { GT -> y; _ -> x })
unfoldr f b = case f b of { Nothing -> []; Just (a, b') -> a : unfoldr f b' }
find p xs = case filter p xs of { [] -> Nothing; (x:_) -> Just x }
findIndex p xs = case [i | (i, x) <- zip [0..] xs, p x] of { [] -> Nothing; (i:_) -> Just i }
elemIndex x = findIndex (== x)
elemIndices x xs = [i | (i, y) <- zip [0..] xs, y == x]
findIndices p xs = [i | (i, x) <- zip [0..] xs, p x]
stripPrefix [] ys = Just ys
stripPrefix (x:xs) (y:ys) | x == y = stripPrefix xs ys
stripPrefix _ _ = Nothing
dropWhileEnd p = foldr (\\x xs -> if p x && null xs then [] else x : xs) []
isSubsequenceOf [] _ = True
isSubsequenceOf _ [] = False
isSubsequenceOf a@(x:a') (y:b) | x == y = isSubsequenceOf a' b | otherwise = isSubsequenceOf a b
uncons [] = Nothing
uncons (x:xs) = Just (x, xs)
singleton x = [x]
zip4 (a:as) (b:bs) (c:cs) (d:ds) = (a,b,c,d) : zip4 as bs cs ds
zip4 _ _ _ _ = []
`,
  },
  {
    mod: 'Data.Maybe',
    source: `
fromMaybe d Nothing = d
fromMaybe _ (Just x) = x
fromJust (Just x) = x
fromJust Nothing = error "Maybe.fromJust: Nothing"
isJust (Just _) = True
isJust Nothing = False
isNothing Nothing = True
isNothing _ = False
catMaybes ms = [x | Just x <- ms]
mapMaybe f xs = catMaybes (map f xs)
listToMaybe [] = Nothing
listToMaybe (x:_) = Just x
maybeToList Nothing = []
maybeToList (Just x) = [x]
`,
  },
  {
    mod: 'Data.Either',
    source: `
lefts es = [x | Left x <- es]
rights es = [x | Right x <- es]
partitionEithers es = (lefts es, rights es)
isLeft (Left _) = True
isLeft _ = False
isRight (Right _) = True
isRight _ = False
fromLeft _ (Left x) = x
fromLeft d _ = d
fromRight _ (Right x) = x
fromRight d _ = d
`,
  },
];

const KNOWN_MODULES = new Set([
  'Prelude', 'Data.List', 'Data.Char', 'Data.Maybe', 'Data.Either', 'Data.Function', 'Data.Ord', 'Data.Tuple', 'Data.Foldable',
  'Data.Map', 'Data.Set', 'Control.Monad', 'System.IO', 'Text.Read', 'Text.Printf',
]);

let libraryScope: Scope | null = null;

/** Builds the library once: the natives above, then the functions written in Haskell, which close over the library only. */
function ensureLibrary(): Scope {
  if (libraryScope) return libraryScope;
  defineNumbers();
  defineLists();
  defineMore();
  defineContainers();
  for (const type of BUILTIN_TYPES) for (const info of type.cons) if (type !== DOWN_T) defValue('Prelude', info.name, info.arity === 0 ? conValue(info) : ({ k: 'fn', name: info.name, arity: info.arity, call: (args: Lazy[]) => ({ k: 'con', info, args }) } as Fn));
  defValue('Prelude', 'True', true);
  defValue('Prelude', 'False', false);
  for (const bound of ['minBound', 'maxBound']) {
    defValue('Prelude', bound, lazy(() => {
      throw typeError(`Ambiguous type variable arising from a use of ‘${bound}’`, undefined, `Write an annotation such as (${bound} :: Int).`);
    }));
  }

  const scope = new Scope(null);
  for (const [key, entry] of LIB) scope.vars.set(key, entry.value);
  const saved = R;
  R = newState('');
  try {
    for (const part of HASKELL_LIBRARY) {
      const decls = parseModule(part.source);
      bindInto(decls, scope);
      for (const d of decls) if (d.kind === 'fun') LIB.set(d.name, { mod: part.mod, name: d.name, value: scope.vars.get(d.name) as Lazy });
    }
  } finally {
    R = saved;
  }
  libraryScope = scope;
  return scope;
}

// ---------------------------------------------------------------------------------------------------------
// show and read
// ---------------------------------------------------------------------------------------------------------

function showDouble(x: number): string {
  if (Number.isNaN(x)) return 'NaN';
  if (x === Infinity) return 'Infinity';
  if (x === -Infinity) return '-Infinity';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const negative = x < 0;
  const a = Math.abs(x);
  // A value that survived Math.fround is a Float: show the digits a Float needs.
  let text = a.toExponential();
  if (Math.fround(a) === a) {
    for (let digits = 1; digits <= 9; digits += 1) {
      const candidate = a.toExponential(digits - 1);
      if (Math.fround(Number(candidate)) === a) {
        text = candidate;
        break;
      }
    }
  }
  const [mantissa, exponentText] = text.split('e');
  const digits = mantissa.replace('.', '').replace(/0+$/, '') || '0';
  const e10 = Number(exponentText);
  let body: string;
  if (a >= 0.1 && a < 1e7) {
    if (e10 >= 0) {
      const whole = digits.slice(0, e10 + 1).padEnd(e10 + 1, '0');
      const fraction = digits.slice(e10 + 1) || '0';
      body = `${whole}.${fraction}`;
    } else {
      body = `0.${'0'.repeat(-e10 - 1)}${digits}`;
    }
  } else {
    body = `${digits[0]}.${digits.slice(1) || '0'}e${e10}`;
  }
  return negative ? `-${body}` : body;
}

const CONTROL_NAMES = ASCII_NAMES.reduce<Record<number, string>>((table, { name, code }) => {
  table[code] = name;
  return table;
}, {});

function escapeForShow(ch: string, inString: boolean): { text: string; numeric: boolean; name: string } {
  const code = ch.codePointAt(0) as number;
  switch (ch) {
    case '\\':
      return { text: '\\\\', numeric: false, name: '' };
    case '\n':
      return { text: '\\n', numeric: false, name: '' };
    case '\t':
      return { text: '\\t', numeric: false, name: '' };
    case '\r':
      return { text: '\\r', numeric: false, name: '' };
    case '\x07':
      return { text: '\\a', numeric: false, name: '' };
    case '\b':
      return { text: '\\b', numeric: false, name: '' };
    case '\f':
      return { text: '\\f', numeric: false, name: '' };
    case '\v':
      return { text: '\\v', numeric: false, name: '' };
    case '"':
      return { text: inString ? '\\"' : '"', numeric: false, name: '' };
    case "'":
      return { text: inString ? "'" : "\\'", numeric: false, name: '' };
    default:
      break;
  }
  if (code < 32 || code === 127) {
    const name = CONTROL_NAMES[code];
    return { text: `\\${name}`, numeric: false, name };
  }
  if (code > 126) return { text: `\\${code}`, numeric: true, name: '' };
  return { text: ch, numeric: false, name: '' };
}

function showString(chars: string[]): string {
  let out = '"';
  let previous: { numeric: boolean; name: string } = { numeric: false, name: '' };
  for (const ch of chars) {
    const esc = escapeForShow(ch, true);
    if ((previous.numeric && ch >= '0' && ch <= '9') || (previous.name === 'SO' && ch === 'H')) out += '\\&';
    out += esc.text;
    previous = esc;
  }
  return `${out}"`;
}

function showList(v: Cons): string {
  const first = force(v.h);
  if (typeof first === 'object' && first.k === 'c') {
    const chars: string[] = [];
    let cur: Value = v;
    while (typeof cur === 'object' && cur.k === 'cons') {
      chars.push(expectChar(force(cur.h)));
      if (chars.length > MAX_OUTPUT) throw runtimeError('The string is too long to show in the practice runner.');
      cur = force(cur.t);
    }
    return showString(chars);
  }
  const items: Value[] = [];
  let length = 0;
  let cur: Value = v;
  while (typeof cur === 'object' && cur.k === 'cons') {
    tick();
    const item = force(cur.h);
    items.push(item);
    length += 2;
    if (length > MAX_OUTPUT) {
      throw runtimeError('The list is too long to show in the practice runner.', undefined, 'Use take to request a finite prefix before printing an infinite list.');
    }
    cur = force(cur.t);
  }
  // Every element of a list has one type, so a list holding a Double shows its whole numbers as Doubles too.
  const asDouble = items.some((item) => typeof item === 'number') && items.some((item) => typeof item === 'bigint');
  const parts = items.map((item) => (asDouble && typeof item === 'bigint' ? showDouble(Number(item)) : showValue(item, 0)));
  return `[${parts.join(',')}]`;
}

function showValue(v: Value, prec: number): string {
  if (typeof v === 'bigint') return v < 0n && prec > 6 ? `(${v})` : String(v);
  if (typeof v === 'number') {
    const text = showDouble(v);
    return (v < 0 || Object.is(v, -0)) && prec > 6 ? `(${text})` : text;
  }
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  switch (v.k) {
    case 'c': {
      const esc = escapeForShow(v.v, false);
      return `'${esc.text}'`;
    }
    case 'nil':
      return v.s ? '""' : '[]';
    case 'cons':
      return showList(v);
    case 'tup':
      return `(${v.items.map((item) => showValue(force(item), 0)).join(',')})`;
    case 'con':
      return showConstructor(v, prec);
    case 'fn':
    case 'pap':
      throw typeError('No instance for (Show (a -> b)) arising from a use of ‘show’', undefined, 'Functions cannot be shown. Apply the function to its arguments first.');
    case 'io':
      throw typeError('No instance for (Show (IO a)) arising from a use of ‘show’', undefined, 'An IO action is run, not shown. Use <- inside a do block to get its result.');
    case 'pure':
      throw typeError('No instance for (Show (m a)) arising from a use of ‘show’');
  }
}

function showConstructor(v: ConVal, prec: number): string {
  const custom = userMethod('Show', 'show', v);
  if (custom) return listToString(apply(force(custom), [v]));
  const info = v.info;
  if (info.type === MAP_T || info.type === SET_T) {
    const body = `fromList ${showValue(force(v.args[0]), 0)}`;
    return prec > 10 ? `(${body})` : body;
  }
  if (!info.type.derives.has('Show')) {
    throw typeError(`No instance for (Show ${info.type.name}) arising from a use of ‘show’`, undefined, `Add deriving (Show) to the data declaration of ${info.type.name}, or write an instance Show ${info.type.name}.`);
  }
  if (info.arity === 0) return info.name;
  if (info.fields) {
    const body = `${info.name} {${info.fields.map((field, i) => `${field} = ${showValue(force(v.args[i]), 0)}`).join(', ')}}`;
    return prec >= 11 ? `(${body})` : body;
  }
  if (info.name.startsWith(':') && info.arity === 2) {
    const body = `${showValue(force(v.args[0]), 10)} ${info.name} ${showValue(force(v.args[1]), 10)}`;
    return prec > 9 ? `(${body})` : body;
  }
  const body = `${info.name} ${v.args.map((a) => showValue(force(a), 11)).join(' ')}`;
  return prec > 10 ? `(${body})` : body;
}

// ---- read ------------------------------------------------------------------------------------------

class Reader {
  text: string;
  pos = 0;
  constructor(text: string) {
    this.text = text;
  }

  skip(): void {
    while (this.pos < this.text.length && /\s/.test(this.text[this.pos])) this.pos += 1;
  }

  done(): boolean {
    this.skip();
    return this.pos >= this.text.length;
  }

  peekIs(s: string): boolean {
    this.skip();
    return this.text.startsWith(s, this.pos);
  }

  eat(s: string): boolean {
    if (this.peekIs(s)) {
      this.pos += s.length;
      return true;
    }
    return false;
  }

  value(atom: boolean): Value | undefined {
    this.skip();
    const rest = this.text.slice(this.pos);
    const number = rest.match(/^-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/);
    if (number) {
      this.pos += number[0].length;
      return /[.eE]/.test(number[0]) ? Number(number[0]) : BigInt(number[0]);
    }
    if (this.peekIs('"')) {
      this.pos += 1;
      let out = '';
      while (this.pos < this.text.length && this.text[this.pos] !== '"') {
        if (this.text[this.pos] === '\\') {
          try {
            const [s, next] = readEscape(this.text, this.pos + 1, { line: 1, col: 1 });
            out += s;
            this.pos = next;
          } catch {
            return undefined;
          }
        } else {
          out += this.text[this.pos];
          this.pos += 1;
        }
      }
      if (this.text[this.pos] !== '"') return undefined;
      this.pos += 1;
      return stringToList(out);
    }
    if (this.peekIs("'")) {
      try {
        const m = this.text.slice(this.pos).match(/^'(\\.[^']*|[^'\\])'/);
        if (!m) return undefined;
        this.pos += m[0].length;
        const inner = m[1];
        if (inner[0] === '\\') return mkChar(readEscape(inner, 1, { line: 1, col: 1 })[0]);
        return mkChar(inner);
      } catch {
        return undefined;
      }
    }
    if (this.eat('(')) {
      if (this.eat(')')) return UNIT;
      const first = this.value(false);
      if (first === undefined) return undefined;
      if (this.eat(')')) return first;
      const items: Lazy[] = [first];
      while (this.eat(',')) {
        const next = this.value(false);
        if (next === undefined) return undefined;
        items.push(next);
      }
      return this.eat(')') ? { k: 'tup', items } : undefined;
    }
    if (this.eat('[')) {
      const items: Lazy[] = [];
      if (this.eat(']')) return NIL;
      for (;;) {
        const item = this.value(false);
        if (item === undefined) return undefined;
        items.push(item);
        if (this.eat(',')) continue;
        return this.eat(']') ? fromArray(items) : undefined;
      }
    }
    const name = rest.match(/^[A-Z][A-Za-z0-9_']*/);
    if (name) {
      this.pos += name[0].length;
      if (name[0] === 'True') return true;
      if (name[0] === 'False') return false;
      const info = R.cons.get(name[0]);
      if (!info) return undefined;
      if (info.arity === 0) return conValue(info);
      if (atom) return undefined;
      if (info.fields) {
        // Record syntax, as show writes it: Student {name = "Kago", mark = 72}
        if (!this.eat('{')) return undefined;
        const fieldValues: Lazy[] = [];
        for (let i = 0; i < info.fields.length; i += 1) {
          if (i > 0 && !this.eat(',')) return undefined;
          if (!this.eat(info.fields[i]) || !this.eat('=')) return undefined;
          const fieldValue = this.value(false);
          if (fieldValue === undefined) return undefined;
          fieldValues.push(fieldValue);
        }
        return this.eat('}') ? { k: 'con', info, args: fieldValues } : undefined;
      }
      const args: Lazy[] = [];
      for (let i = 0; i < info.arity; i += 1) {
        const arg = this.value(true);
        if (arg === undefined) return undefined;
        args.push(arg);
      }
      return { k: 'con', info, args };
    }
    return undefined;
  }
}

function tryRead(text: string, hint: Type | null): Value | undefined {
  const reader = new Reader(text);
  const v = reader.value(false);
  if (v === undefined || !reader.done()) return undefined;
  if (hint) {
    const t = expandType(hint);
    if (t.kind === 'con') {
      if (t.name === 'Int' || t.name === 'Integer') return typeof v === 'bigint' ? v : undefined;
      if (t.name === 'Double' || t.name === 'Float') return typeof v === 'bigint' || typeof v === 'number' ? toDouble(v) : undefined;
      if (t.name === 'Bool') return typeof v === 'boolean' ? v : undefined;
    }
    if (t.kind === 'list' && isCharType(t.elem) && !(typeof v === 'object' && (v.k === 'nil' || v.k === 'cons'))) return undefined;
  }
  return v;
}

function readValue(text: string, hint: Type | null): Value {
  const v = tryRead(text, hint);
  if (v === undefined) throw runtimeError('Prelude.read: no parse', undefined, 'read needs text that looks like the value you want, for example "42" for an Integer.');
  return v;
}

// ---------------------------------------------------------------------------------------------------------
// Checking names before anything runs
// ---------------------------------------------------------------------------------------------------------

type Bound = { names: Set<string>; parent: Bound | null } | null;

type LiteralFamily = 'number' | 'char' | 'string' | 'bool';
const FAMILY_TYPE: Record<LiteralFamily, string> = { number: 'Integer', char: 'Char', string: '[Char]', bool: 'Bool' };

/** The type a literal plainly has, when the expression is nothing but a literal. */
function literalFamily(e: Expr): LiteralFamily | null {
  if (e.kind === 'var') return e.name === 'True' || e.name === 'False' ? 'bool' : null;
  if (e.kind !== 'lit') return null;
  const v = e.value;
  if (typeof v === 'bigint' || typeof v === 'number') return 'number';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'object') {
    if (v.k === 'c') return 'char';
    if (v.k === 'nil') return v.s ? 'string' : null;
    if (v.k === 'cons') return typeof v.h === 'object' && !(v.h instanceof Thunk) && v.h.k === 'c' ? 'string' : null;
  }
  return null;
}

/** Expressions that must have one type (the items of a list, the branches of an if): plain literals of different types cannot. */
function sameLiteralType(exprs: Expr[], hint: string): void {
  let first: { family: LiteralFamily } | null = null;
  for (const e of exprs) {
    const family = literalFamily(e);
    if (family === null) continue;
    if (first === null) first = { family };
    else if (family !== first.family) {
      throw typeError(`Couldn't match expected type ‘${FAMILY_TYPE[first.family]}’ with actual type ‘${FAMILY_TYPE[family]}’.`, exprPos(e), hint);
    }
  }
}

function checkScopes(decls: Decl[], isGlobal: (name: string) => boolean): void {
  const bound = (b: Bound, name: string): boolean => {
    for (let s = b; s; s = s.parent) if (s.names.has(name)) return true;
    return isGlobal(name);
  };
  const extend = (b: Bound, names: string[]): Bound => ({ names: new Set(names), parent: b });
  const boundByDecls = (ds: Decl[]): string[] => {
    const names: string[] = [];
    for (const d of ds) {
      if (d.kind === 'fun') names.push(d.name);
      else if (d.kind === 'patbind') names.push(...patVars(d.pat));
    }
    return names;
  };
  const pattern = (p: Pat): void => {
    switch (p.kind) {
      case 'con':
        if (p.name !== ':' && p.name !== 'True' && p.name !== 'False' && !R.cons.has(p.name)) throw notInScope(p.name, p.pos);
        p.args.forEach(pattern);
        break;
      case 'rec':
        if (!R.cons.has(p.name)) throw notInScope(p.name, p.pos);
        p.fields.forEach((f) => pattern(f.pat));
        break;
      case 'tuple':
      case 'list':
        p.items.forEach(pattern);
        break;
      case 'as':
      case 'bang':
      case 'lazy':
        pattern(p.pat);
        break;
      default:
        break;
    }
  };

  const expr = (e: Expr, b: Bound): void => {
    switch (e.kind) {
      case 'lit':
        return;
      case 'var':
        if (!bound(b, e.name)) throw notInScope(e.name, e.pos);
        return;
      case 'app':
        expr(e.fn, b);
        e.args.forEach((a) => expr(a, b));
        if (e.fn.kind === 'var' && e.fn.name === ':' && e.args.length === 2) {
          const head = literalFamily(e.args[0]);
          if (literalFamily(e.args[1]) === 'string' && head !== null && head !== 'char') {
            throw typeError(`Couldn't match expected type ‘Char’ with actual type ‘${FAMILY_TYPE[head]}’.`, exprPos(e.args[0]), 'A string is a list of characters, so only a Char can be put in front of it.');
          }
        }
        return;
      case 'lam':
        clause(e.clause, b);
        return;
      case 'lamcase':
        e.alts.forEach((a) => alt(a, b));
        return;
      case 'let': {
        const nb = extend(b, boundByDecls(e.decls));
        declarations(e.decls, nb);
        expr(e.body, nb);
        return;
      }
      case 'if':
        expr(e.c, b);
        expr(e.t, b);
        expr(e.f, b);
        sameLiteralType([e.t, e.f], 'Both branches of an if must have the same type.');
        return;
      case 'case':
        expr(e.scrut, b);
        e.alts.forEach((a) => alt(a, b));
        sameLiteralType(e.alts.flatMap((a) => a.rhs.guards.map((g) => g.body)), 'Every alternative of a case must have the same type.');
        return;
      case 'do': {
        let cur = b;
        for (const s of e.stmts) {
          if (s.kind === 'expr') expr(s.e, cur);
          else if (s.kind === 'bind') {
            expr(s.e, cur);
            pattern(s.pat);
            cur = extend(cur, patVars(s.pat));
          } else {
            cur = extend(cur, boundByDecls(s.decls));
            declarations(s.decls, cur);
          }
        }
        return;
      }
      case 'list':
      case 'tuple':
        e.items.forEach((item) => expr(item, b));
        if (e.kind === 'list') sameLiteralType(e.items, 'All the elements of a list must have the same type.');
        return;
      case 'range':
        expr(e.from, b);
        if (e.then) expr(e.then, b);
        if (e.to) expr(e.to, b);
        return;
      case 'comp': {
        let cur = b;
        for (const q of e.quals) cur = qualifier(q, cur);
        expr(e.out, cur);
        return;
      }
      case 'secl':
      case 'secr':
        expr(e.op, b);
        expr(e.arg, b);
        return;
      case 'typed':
        expr(e.expr, b);
        return;
      case 'reccon':
        if (!R.cons.has(e.name)) throw notInScope(e.name, e.pos);
        e.fields.forEach((f) => expr(f.e, b));
        return;
      case 'recupd':
        expr(e.expr, b);
        e.fields.forEach((f) => expr(f.e, b));
        return;
    }
  };
  const qualifier = (q: Qual, b: Bound): Bound => {
    if (q.kind === 'bool') {
      expr(q.e, b);
      return b;
    }
    if (q.kind === 'gen') {
      expr(q.e, b);
      pattern(q.pat);
      return extend(b, patVars(q.pat));
    }
    const nb = extend(b, boundByDecls(q.decls));
    declarations(q.decls, nb);
    return nb;
  };
  const rhs = (r: Rhs, b: Bound): void => {
    sameLiteralType(r.guards.map((g) => g.body), 'Every result of a function must have the same type.');
    const wb = r.where.length > 0 ? extend(b, boundByDecls(r.where)) : b;
    declarations(r.where, wb);
    for (const g of r.guards) {
      let cur = wb;
      for (const q of g.quals) cur = qualifier(q, cur);
      expr(g.body, cur);
    }
  };
  const clause = (c: Clause, b: Bound): void => {
    c.pats.forEach(pattern);
    rhs(c.rhs, extend(b, c.pats.flatMap((p) => patVars(p))));
  };
  const alt = (a: Alt, b: Bound): void => {
    pattern(a.pat);
    rhs(a.rhs, extend(b, patVars(a.pat)));
  };
  const declarations = (ds: Decl[], b: Bound): void => {
    for (const d of ds) {
      if (d.kind === 'fun') {
        sameLiteralType(d.clauses.flatMap((c) => c.rhs.guards.map((g) => g.body)), 'Every equation of a function must return the same type.');
        d.clauses.forEach((c) => clause(c, b));
      }
      else if (d.kind === 'patbind') {
        pattern(d.pat);
        rhs(d.rhs, b);
      }
    }
  };

  for (const d of decls) {
    switch (d.kind) {
      case 'fun':
      case 'patbind':
        declarations([d], null);
        break;
      case 'expr':
        expr(d.e, null);
        break;
      case 'ghcilet':
        declarations(d.decls, null);
        break;
      case 'instance':
        declarations(d.body, extend(null, boundByDecls(d.body)));
        break;
      case 'class':
        declarations(d.defaults, extend(null, boundByDecls(d.defaults)));
        break;
      default:
        break;
    }
  }
}

// ---------------------------------------------------------------------------------------------------------
// Loading a program and running it
// ---------------------------------------------------------------------------------------------------------

function selectorFor(field: string): Fn {
  return {
    k: 'fn',
    name: field,
    arity: 1,
    call: ([r]) => {
      const v = force(r);
      if (typeof v === 'object' && v.k === 'con' && v.info.fields) {
        const at = v.info.fields.indexOf(field);
        if (at >= 0) return force(v.args[at]);
      }
      throw runtimeError(`No match in record selector ${field}`);
    },
  };
}

function declareData(d: Decl & { kind: 'data' }, scope: Scope): void {
  // `data Maybe a = Nothing | Just a` in the notes shows how the Prelude defines the type; keep using the real one.
  const builtin = BUILTIN_TYPES.find((t) => t.name === d.name);
  if (builtin && builtin.cons.length === d.cons.length && builtin.cons.every((c, i) => c.name === d.cons[i].name && c.arity === d.cons[i].fields.length)) return;
  const type: TypeInfo = { name: d.name, cons: [], derives: new Set(d.deriving), params: d.params };
  d.cons.forEach((c, index) => {
    const info: ConInfo = { name: c.name, arity: c.fields.length, index, type, fields: c.names, fieldTypes: c.fields };
    type.cons.push(info);
    R.cons.set(c.name, info);
  });
  R.types.set(d.name, type);
  for (const info of type.cons) {
    if (info.arity === 0) {
      scope.vars.set(info.name, conValue(info));
    } else {
      scope.vars.set(info.name, {
        k: 'fn',
        name: info.name,
        arity: info.arity,
        call: (args) => ({ k: 'con', info, args: args.map((a, i) => coerceLazy(info.fieldTypes[i], a)) }),
      });
    }
    if (info.fields) for (const field of info.fields) scope.vars.set(field, selectorFor(field));
  }
}

function instanceTypeName(t: Type): string {
  if (t.kind === 'con') return t.name === 'String' ? '[]' : t.name;
  if (t.kind === 'list') return '[]';
  if (t.kind === 'tuple') return t.items.length === 0 ? '()' : `(${','.repeat(t.items.length - 1)})`;
  return '->';
}

function declareClass(d: Decl & { kind: 'class' }, scope: Scope): void {
  const info: ClassInfo = { name: d.name, tyvar: d.tyvar, methods: new Map(), defaults: new Map() };
  R.classes.set(d.name, info);
  // A default method's body calls the class methods by name, so it must not see itself as a local binding.
  for (const def of d.defaults) if (def.kind === 'fun') info.defaults.set(def.name, makeBinding(def, scope, undefined) as Fn);
  for (const sig of d.sigs) {
    let dispatch = -1;
    let arity = 0;
    let cur: Type = sig.type;
    while (cur.kind === 'fun') {
      if (dispatch < 0 && cur.from.kind === 'var' && cur.from.name === d.tyvar) dispatch = arity;
      arity += 1;
      cur = cur.to;
    }
    info.methods.set(sig.name, { dispatch, arity });
    const name = sig.name;
    scope.vars.set(name, {
      k: 'fn',
      name,
      arity: Math.max(dispatch + 1, 1),
      call: (args) => {
        if (dispatch < 0) {
          throw typeError(`The class method ‘${name}’ has no argument of the class type, so the practice runner cannot choose an instance for it`, undefined, 'Give the method a parameter whose type is the class variable.');
        }
        const v = force(args[dispatch]);
        const impl = lookupInstanceMethod(d.name, name, v);
        if (!impl) throw typeError(`No instance for (${d.name} ${describe(v)}) arising from a use of ‘${name}’`, undefined, `Write an instance ${d.name} for that type.`);
        return apply(force(impl), args);
      },
    });
  }
}

function lookupInstanceMethod(cls: string, method: string, v: Value): Lazy | undefined {
  const user = userMethod(cls, method, v);
  if (user) return user;
  return R.classes.get(cls)?.defaults.get(method);
}

function declareInstance(d: Decl & { kind: 'instance' }, scope: Scope): void {
  let byType = R.instances.get(d.cls);
  if (!byType) {
    byType = new Map();
    R.instances.set(d.cls, byType);
  }
  const name = instanceTypeName(d.type);
  const methods = byType.get(name) ?? new Map<string, Lazy>();
  byType.set(name, methods);
  // Methods close over the program, not over each other: inside an instance, show means the class method.
  const sigs = new Map<string, Type>();
  for (const part of d.body) if (part.kind === 'sig') for (const name of part.names) sigs.set(name, part.type);
  for (const part of d.body) if (part.kind === 'fun') methods.set(part.name, makeBinding(part, scope, sigs.get(part.name)));
  const type = R.types.get(name);
  if (type && ['Show', 'Eq', 'Ord'].includes(d.cls)) type.derives.add(d.cls);
}

function moduleExports(name: string): Map<string, Lazy> {
  const out = new Map<string, Lazy>();
  for (const entry of LIB.values()) if (entry.mod === name) out.set(entry.name, entry.value);
  return out;
}

function applyImport(d: Decl & { kind: 'import' }, scope: Scope): void {
  const moduleName = d.module === 'Data.Map.Strict' ? 'Data.Map' : d.module;
  if (!KNOWN_MODULES.has(moduleName)) {
    throw typeError(`Could not find module ‘${d.module}’`, d.pos, 'This practice runner includes Prelude, Data.List, Data.Char, Data.Maybe, Data.Either, Data.Function, Data.Ord, Data.Tuple, Data.Map, Data.Set, Control.Monad, System.IO, Text.Read and Text.Printf. Modules of your own are not available here.');
  }
  if (moduleName === 'Prelude' && d.hiding) {
    for (const name of d.names ?? []) scope.vars.delete(name);
    return;
  }
  const own = moduleExports(moduleName);
  // Data.List and the like also export the list functions of the Prelude, so a qualified L.map works.
  const all = moduleName === 'Data.Map' || moduleName === 'Data.Set' ? own : new Map([...moduleExports('Prelude'), ...own]);

  let unqualified = new Map(own);
  if (d.names && !d.hiding) {
    unqualified = new Map();
    for (const name of d.names) {
      const value = all.get(name);
      if (value === undefined) {
        if (/^[A-Z]/.test(name)) continue;
        throw typeError(`Module ‘${d.module}’ does not export ‘${name}’`, d.pos);
      }
      unqualified.set(name, value);
    }
  } else if (d.hiding) {
    for (const name of d.names ?? []) unqualified.delete(name);
  }
  if (!d.qualified) for (const [name, value] of unqualified) scope.vars.set(name, value);

  const prefix = d.alias ?? d.module;
  for (const [name, value] of all) scope.vars.set(`${prefix}.${name}`, value);
}

function seedBuiltinTypes(): void {
  for (const type of BUILTIN_TYPES) {
    R.types.set(type.name, type);
    for (const info of type.cons) R.cons.set(info.name, info);
  }
}

function statementResult(value: Value): void {
  if (typeof value === 'object' && (value.k === 'io' || value.k === 'pure')) {
    const result = force(runIO(value));
    if (!(typeof result === 'object' && result.k === 'tup' && result.items.length === 0)) emit(`${showValue(result, 0)}\n`);
    return;
  }
  emit(`${showValue(value, 0)}\n`);
}

type Execution = { output: string };

function loadAndRun(source: string): Execution {
  const decls = parseModule(source);
  const library = ensureLibrary();
  R.lib = library;
  seedBuiltinTypes();

  let scope = new Scope(null);
  for (const entry of LIB.values()) if (entry.mod === 'Prelude') scope.vars.set(entry.name, entry.value);
  for (const d of decls) if (d.kind === 'import') applyImport(d, scope);
  const root = scope;

  for (const d of decls) if (d.kind === 'type') R.synonyms.set(d.name, { params: d.params, type: d.type });
  for (const d of decls) if (d.kind === 'data') declareData(d, root);
  for (const d of decls) if (d.kind === 'class') declareClass(d, root);
  bindInto(decls.filter((d) => d.kind === 'fun' || d.kind === 'patbind' || d.kind === 'sig'), root);

  const extra = new Set<string>(['it']);
  for (const d of decls) if (d.kind === 'ghcilet') for (const e of d.decls) if (e.kind === 'fun') extra.add(e.name); else if (e.kind === 'patbind') patVars(e.pat).forEach((n) => extra.add(n));
  checkScopes(decls, (name) => root.get(name) !== undefined || extra.has(name));

  for (const d of decls) if (d.kind === 'instance') declareInstance(d, root);

  // A file with a main runs it. Lines in the style of a GHCi session (ghci> lines, bare expressions) run in order
  // and then leave main alone, as GHCi does until you type main.
  const sessionStyle = decls.some((d) => d.kind === 'ghcilet' || d.kind === 'expr');
  let ran = false;
  let mainDone = false;
  const runMain = () => {
    if (mainDone) return;
    const main = root.vars.get('main');
    if (main === undefined) return;
    mainDone = true;
    ran = true;
    runIO(force(main));
  };
  for (const d of decls) {
    if (d.kind === 'ghcilet') {
      scope = bindDecls(d.decls, scope);
      ran = true;
    } else if (d.kind === 'expr') {
      const value = ev(d.e, scope);
      statementResult(value);
      scope = new Scope(scope);
      scope.vars.set('it', value);
      ran = true;
    } else if (d.kind === 'fun' && d.name === 'main' && !sessionStyle) {
      runMain();
    }
  }
  if (!ran && !sessionStyle && root.vars.has('main')) runMain();

  let output = R.out.join('');
  if (output.endsWith('\n')) output = output.slice(0, -1);
  if (!ran) {
    const defined = decls.some((d) => d.kind === 'fun' || d.kind === 'patbind' || d.kind === 'data' || d.kind === 'class' || d.kind === 'instance');
    output = defined ? 'Definitions loaded. Add an expression or print statement to see a result.' : 'No output.';
  }
  return { output };
}

const clock = (): number => (typeof performance === 'undefined' ? Date.now() : performance.now());

function execute(source: string, stdin: string): HaskellRunResult {
  const started = clock();
  R = newState(stdin);
  try {
    if (!source.trim()) throw parseError('There is no code to run.', { line: 1, col: 1 }, 'Choose an example or type an expression.');
    const { output } = loadAndRun(source);
    return { ok: true, output, elapsedMs: Math.max(0, clock() - started) };
  } catch (error) {
    let failure: SimulatorError;
    if (error instanceof SimulatorError) failure = error;
    else if (error instanceof RangeError) {
      failure = runtimeError('Stack overflow: the recursion went too deep.', undefined, 'This usually means the recursion does not reach a base case. Recursion nested more than a few thousand calls deep is also too deep for the browser; use a loop-style helper with an accumulator.');
    } else {
      failure = runtimeError(error instanceof Error ? `Simulator problem: ${error.message}` : 'Unknown simulator failure.');
    }
    return {
      ok: false,
      // Whatever the program had printed before it stopped, exactly as printed.
      output: R.out.join(''),
      elapsedMs: Math.max(0, clock() - started),
      diagnostic: {
        kind: failure.kind,
        message: failure.message,
        line: failure.position?.line,
        column: failure.position?.column,
        hint: failure.hint,
      },
    };
  }
}

export function runHaskell(source: string): HaskellRunResult {
  return execute(source, '');
}

/** Like runHaskell, with text for getLine, getContents, interact and readLn to read. */
export function runHaskellWithInput(source: string, stdin: string): HaskellRunResult {
  return execute(source, stdin);
}
