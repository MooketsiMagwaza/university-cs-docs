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

class SimulatorError extends Error {
  constructor(
    readonly kind: 'Parse error' | 'Type error' | 'Runtime error',
    message: string,
    readonly position?: Position,
    readonly hint?: string,
  ) {
    super(message);
  }
}

type TokenKind = 'number' | 'string' | 'char' | 'identifier' | 'operator' | 'punctuation' | 'eof';

type Token = Position & {
  kind: TokenKind;
  text: string;
  value?: number | string;
};

type Expr =
  | { kind: 'literal'; value: Value; position: Position }
  | { kind: 'variable'; name: string; position: Position }
  | { kind: 'list'; items: Expr[]; position: Position }
  | { kind: 'comprehension'; output: Expr; qualifiers: ComprehensionQualifier[]; position: Position }
  | { kind: 'range'; start: Expr; next?: Expr; end?: Expr; position: Position }
  | { kind: 'tuple'; items: Expr[]; position: Position }
  | { kind: 'application'; fn: Expr; argument: Expr; position: Position }
  | { kind: 'infix'; operator: string; left: Expr; right: Expr; position: Position }
  | { kind: 'lambda'; parameters: string[]; body: Expr; position: Position }
  | { kind: 'if'; condition: Expr; whenTrue: Expr; whenFalse: Expr; position: Position };

type ComprehensionPattern =
  | { kind: 'variable'; name: string; position: Position }
  | { kind: 'tuple'; names: string[]; position: Position };

type ComprehensionQualifier =
  | { kind: 'generator'; pattern: ComprehensionPattern; source: Expr; position: Position }
  | { kind: 'guard'; condition: Expr; position: Position };

type CharValue = { kind: 'char'; value: string };
type TupleValue = { kind: 'tuple'; items: Value[] };
type LazyList = {
  kind: 'lazy-list';
  description: string;
  iterator: () => Iterator<Value>;
};
type SimFunction = {
  kind: 'function';
  name: string;
  arity: number;
  received: Value[];
  invoke: (arguments_: Value[], context: EvalContext) => Value;
};
type Value = number | boolean | string | CharValue | TupleValue | Value[] | LazyList | SimFunction;
type Environment = Map<string, Value>;
type EvalContext = { steps: number; maxSteps: number };

const MULTI_OPERATORS = ['::', '->', '<-', '..', '==', '/=', '<=', '>=', '&&', '||', '++'];
const SINGLE_OPERATORS = new Set(['+', '-', '*', '/', '^', '<', '>', '=', ':', '.', '$']);
const PUNCTUATION = new Set(['(', ')', '[', ']', ',', '|', '\\']);

class Tokenizer {
  private index = 0;
  private line: number;
  private column = 1;

  constructor(
    private readonly source: string,
    baseLine = 1,
  ) {
    this.line = baseLine;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.index < this.source.length) {
      const character = this.source[this.index];

      if (/\s/.test(character)) {
        this.advance(character);
        continue;
      }

      if (character === '-' && this.source[this.index + 1] === '-') {
        while (this.index < this.source.length && this.source[this.index] !== '\n') {
          this.advance(this.source[this.index]);
        }
        continue;
      }

      const position = { line: this.line, column: this.column };

      if (/\d/.test(character)) {
        tokens.push(this.readNumber(position));
        continue;
      }

      if (character === '"') {
        tokens.push(this.readQuoted('string', '"', position));
        continue;
      }

      if (character === "'") {
        tokens.push(this.readQuoted('char', "'", position));
        continue;
      }

      if (/[A-Za-z_]/.test(character)) {
        tokens.push(this.readIdentifier(position));
        continue;
      }

      const multi = MULTI_OPERATORS.find((operator) => this.source.startsWith(operator, this.index));
      if (multi) {
        this.advanceText(multi);
        tokens.push({ kind: 'operator', text: multi, ...position });
        continue;
      }

      if (SINGLE_OPERATORS.has(character)) {
        this.advance(character);
        tokens.push({ kind: 'operator', text: character, ...position });
        continue;
      }

      if (PUNCTUATION.has(character)) {
        this.advance(character);
        tokens.push({ kind: 'punctuation', text: character, ...position });
        continue;
      }

      throw new SimulatorError(
        'Parse error',
        `Unexpected character ${JSON.stringify(character)}.`,
        position,
        'Check for a missing quote, bracket, or unsupported Haskell syntax.',
      );
    }

    tokens.push({ kind: 'eof', text: '', line: this.line, column: this.column });
    return tokens;
  }

  private readNumber(position: Position): Token {
    const start = this.index;
    while (/\d/.test(this.source[this.index] ?? '')) this.advance(this.source[this.index]);
    if (this.source[this.index] === '.' && this.source[this.index + 1] !== '.') {
      this.advance('.');
      while (/\d/.test(this.source[this.index] ?? '')) this.advance(this.source[this.index]);
    }
    const text = this.source.slice(start, this.index);
    return { kind: 'number', text, value: Number(text), ...position };
  }

  private readIdentifier(position: Position): Token {
    const start = this.index;
    while (/[A-Za-z0-9_']/.test(this.source[this.index] ?? '')) this.advance(this.source[this.index]);
    return { kind: 'identifier', text: this.source.slice(start, this.index), ...position };
  }

  private readQuoted(kind: 'string' | 'char', quote: string, position: Position): Token {
    this.advance(quote);
    let value = '';

    while (this.index < this.source.length && this.source[this.index] !== quote) {
      const character = this.source[this.index];
      if (character === '\\') {
        this.advance(character);
        const escaped = this.source[this.index];
        const replacements: Record<string, string> = { n: '\n', r: '\r', t: '\t', '\\': '\\', '"': '"', "'": "'" };
        if (!(escaped in replacements)) {
          throw new SimulatorError('Parse error', `Unknown escape sequence \\${escaped}.`, position);
        }
        value += replacements[escaped];
        this.advance(escaped);
      } else {
        value += character;
        this.advance(character);
      }
    }

    if (this.source[this.index] !== quote) {
      throw new SimulatorError('Parse error', `Unterminated ${kind} literal.`, position);
    }
    this.advance(quote);

    if (kind === 'char' && [...value].length !== 1) {
      throw new SimulatorError('Parse error', 'A character literal must contain exactly one character.', position);
    }

    return { kind, text: value, value, ...position };
  }

  private advance(character: string) {
    this.index += 1;
    if (character === '\n') {
      this.line += 1;
      this.column = 1;
    } else {
      this.column += 1;
    }
  }

  private advanceText(text: string) {
    for (const character of text) this.advance(character);
  }
}

const INFIX: Record<string, { precedence: number; rightAssociative?: boolean }> = {
  '$': { precedence: 0, rightAssociative: true },
  '||': { precedence: 2, rightAssociative: true },
  '&&': { precedence: 3, rightAssociative: true },
  '==': { precedence: 4 },
  '/=': { precedence: 4 },
  '<': { precedence: 4 },
  '<=': { precedence: 4 },
  '>': { precedence: 4 },
  '>=': { precedence: 4 },
  ':': { precedence: 5, rightAssociative: true },
  '++': { precedence: 5, rightAssociative: true },
  '+': { precedence: 6 },
  '-': { precedence: 6 },
  '*': { precedence: 7 },
  '/': { precedence: 7 },
  div: { precedence: 7 },
  mod: { precedence: 7 },
  '^': { precedence: 8, rightAssociative: true },
  '.': { precedence: 9, rightAssociative: true },
};

const APPLICATION_PRECEDENCE = 10;

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Expr {
    const expression = this.parseExpression(0, new Set());
    if (this.current().kind !== 'eof') {
      throw new SimulatorError('Parse error', `Unexpected token ${JSON.stringify(this.current().text)}.`, this.current());
    }
    return expression;
  }

  private parseExpression(minimumPrecedence: number, stopWords: Set<string>): Expr {
    let left = this.parsePrefix(stopWords);

    while (true) {
      const token = this.current();
      if (token.kind === 'eof' || stopWords.has(token.text) || [')', ']', ','].includes(token.text)) break;

      const operator = token.kind === 'operator' || ['div', 'mod'].includes(token.text) ? token.text : undefined;
      const info = operator ? INFIX[operator] : undefined;
      if (operator && info && info.precedence >= minimumPrecedence) {
        this.index += 1;
        const nextMinimum = info.rightAssociative ? info.precedence : info.precedence + 1;
        const right = this.parseExpression(nextMinimum, stopWords);
        left = { kind: 'infix', operator, left, right, position: token };
        continue;
      }

      if (this.startsExpression(token, stopWords) && APPLICATION_PRECEDENCE >= minimumPrecedence) {
        const argument = this.parseExpression(APPLICATION_PRECEDENCE + 1, stopWords);
        left = { kind: 'application', fn: left, argument, position: left.position };
        continue;
      }

      break;
    }

    return left;
  }

  private parsePrefix(stopWords: Set<string>): Expr {
    const token = this.current();

    if (token.kind === 'number') {
      this.index += 1;
      return { kind: 'literal', value: token.value as number, position: token };
    }
    if (token.kind === 'string') {
      this.index += 1;
      return { kind: 'literal', value: token.value as string, position: token };
    }
    if (token.kind === 'char') {
      this.index += 1;
      return { kind: 'literal', value: { kind: 'char', value: token.value as string }, position: token };
    }
    if (token.kind === 'identifier' && token.text === 'True') {
      this.index += 1;
      return { kind: 'literal', value: true, position: token };
    }
    if (token.kind === 'identifier' && token.text === 'False') {
      this.index += 1;
      return { kind: 'literal', value: false, position: token };
    }
    if (token.kind === 'identifier' && token.text === 'if') return this.parseIf();
    if (token.kind === 'identifier') {
      this.index += 1;
      return { kind: 'variable', name: token.text, position: token };
    }
    if (token.kind === 'operator' && token.text === '-') {
      this.index += 1;
      const argument = this.parsePrefix(stopWords);
      return {
        kind: 'application',
        fn: { kind: 'variable', name: 'negate', position: token },
        argument,
        position: token,
      };
    }
    if (token.text === '\\') return this.parseLambda();
    if (token.text === '[') return this.parseList();
    if (token.text === '(') return this.parseParenthesized();

    throw new SimulatorError(
      'Parse error',
      token.kind === 'eof' ? 'The expression ended before it was complete.' : `Expected an expression, but found ${JSON.stringify(token.text)}.`,
      token,
      'Check the parentheses and make sure every function has the arguments it needs.',
    );
  }

  private parseIf(): Expr {
    const start = this.consume('if');
    const condition = this.parseExpression(0, new Set(['then']));
    this.consume('then');
    const whenTrue = this.parseExpression(0, new Set(['else']));
    this.consume('else');
    const whenFalse = this.parseExpression(0, new Set());
    return { kind: 'if', condition, whenTrue, whenFalse, position: start };
  }

  private parseLambda(): Expr {
    const start = this.consume('\\');
    const parameters: string[] = [];
    while (this.current().kind === 'identifier') parameters.push(this.consumeIdentifier().text);
    if (parameters.length === 0) {
      throw new SimulatorError('Parse error', 'A lambda needs at least one parameter before ->.', start);
    }
    this.consume('->');
    const body = this.parseExpression(0, new Set());
    return { kind: 'lambda', parameters, body, position: start };
  }

  private parseList(): Expr {
    const start = this.consume('[');
    if (this.current().text === ']') {
      this.consume(']');
      return { kind: 'list', items: [], position: start };
    }

    const first = this.parseExpression(0, new Set(['|']));
    if (this.current().text === '|') {
      this.consume('|');
      const qualifiers: ComprehensionQualifier[] = [];

      while (true) {
        if (this.isGeneratorStart()) {
          const pattern = this.parseComprehensionPattern();
          const arrow = this.consume('<-');
          qualifiers.push({
            kind: 'generator',
            pattern,
            source: this.parseExpression(0, new Set()),
            position: arrow,
          });
        } else {
          const position = this.current();
          qualifiers.push({ kind: 'guard', condition: this.parseExpression(0, new Set()), position });
        }

        if (this.current().text !== ',') break;
        this.consume(',');
      }

      if (qualifiers.length === 0 || qualifiers[0].kind !== 'generator') {
        throw new SimulatorError(
          'Parse error',
          'A list comprehension needs a generator after the pipe.',
          start,
          'Use a form such as [x * 2 | x <- [1..5]].',
        );
      }
      this.consume(']');
      return { kind: 'comprehension', output: first, qualifiers, position: start };
    }
    if (this.current().text === '..') {
      this.consume('..');
      const end = this.current().text === ']' ? undefined : this.parseExpression(0, new Set());
      this.consume(']');
      return { kind: 'range', start: first, end, position: start };
    }

    const items = [first];
    if (this.current().text === ',') {
      this.consume(',');
      const second = this.parseExpression(0, new Set());
      if (this.current().text === '..') {
        this.consume('..');
        const end = this.current().text === ']' ? undefined : this.parseExpression(0, new Set());
        this.consume(']');
        return { kind: 'range', start: first, next: second, end, position: start };
      }
      items.push(second);
    }
    while (this.current().text === ',') {
      this.consume(',');
      items.push(this.parseExpression(0, new Set()));
    }
    this.consume(']');
    return { kind: 'list', items, position: start };
  }

  private isGeneratorStart() {
    if (this.current().kind === 'identifier' && this.peek(1).text === '<-') return true;
    if (this.current().text !== '(') return false;

    let offset = 1;
    let names = 0;
    while (this.peek(offset).kind === 'identifier') {
      names += 1;
      offset += 1;
      if (this.peek(offset).text !== ',') break;
      offset += 1;
    }
    return names >= 2 && this.peek(offset).text === ')' && this.peek(offset + 1).text === '<-';
  }

  private parseComprehensionPattern(): ComprehensionPattern {
    if (this.current().kind === 'identifier') {
      const name = this.consumeIdentifier();
      return { kind: 'variable', name: name.text, position: name };
    }

    const start = this.consume('(');
    const names = [this.consumeIdentifier().text];
    while (this.current().text === ',') {
      this.consume(',');
      names.push(this.consumeIdentifier().text);
    }
    this.consume(')');
    return { kind: 'tuple', names, position: start };
  }

  private parseParenthesized(): Expr {
    const start = this.consume('(');

    if (this.current().text === ')') {
      throw new SimulatorError('Parse error', 'The unit value () is not part of this practice subset.', start);
    }

    if (this.current().text === ',' && this.peek(1).text === ')') {
      this.index += 2;
      return { kind: 'variable', name: '(,)', position: start };
    }

    if (this.current().kind === 'operator' && this.peek(1).text === ')') {
      const operator = this.current();
      this.index += 2;
      return { kind: 'variable', name: operator.text, position: operator };
    }

    if (this.current().kind === 'operator') {
      const operator = this.current();
      if (operator.text === '-' && this.peek(1).kind === 'number' && this.peek(2).text === ')') {
        this.index += 1;
        const number = this.current();
        this.index += 1;
        this.consume(')');
        return { kind: 'literal', value: -(number.value as number), position: operator };
      }
      if (operator.text in INFIX) {
        this.index += 1;
        const right = this.parseExpression(0, new Set());
        this.consume(')');
        const parameter = '__section';
        return {
          kind: 'lambda',
          parameters: [parameter],
          body: {
            kind: 'infix',
            operator: operator.text,
            left: { kind: 'variable', name: parameter, position: operator },
            right,
            position: operator,
          },
          position: start,
        };
      }
    }

    const first = this.parseExpression(0, new Set());
    if (this.current().text === ',') {
      const items = [first];
      while (this.current().text === ',') {
        this.consume(',');
        items.push(this.parseExpression(0, new Set()));
      }
      this.consume(')');
      return { kind: 'tuple', items, position: start };
    }
    this.consume(')');
    return first;
  }

  private startsExpression(token: Token, stopWords: Set<string>) {
    if (stopWords.has(token.text) || ['then', 'else', 'in'].includes(token.text)) return false;
    return ['number', 'string', 'char', 'identifier'].includes(token.kind) || ['(', '[', '\\'].includes(token.text);
  }

  private consume(text: string): Token {
    const token = this.current();
    if (token.text !== text) {
      throw new SimulatorError('Parse error', `Expected ${JSON.stringify(text)}, but found ${JSON.stringify(token.text)}.`, token);
    }
    this.index += 1;
    return token;
  }

  private consumeIdentifier(): Token {
    const token = this.current();
    if (token.kind !== 'identifier') {
      throw new SimulatorError('Parse error', `Expected a name, but found ${JSON.stringify(token.text)}.`, token);
    }
    this.index += 1;
    return token;
  }

  private current() {
    return this.tokens[this.index];
  }

  private peek(offset: number) {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)];
  }
}

function parseExpression(source: string, line: number): Expr {
  return new Parser(new Tokenizer(source, line).tokenize()).parse();
}

function makeFunction(
  name: string,
  arity: number,
  invoke: (arguments_: Value[], context: EvalContext) => Value,
  received: Value[] = [],
): SimFunction {
  return { kind: 'function', name, arity, invoke, received };
}

function applyFunction(fn: Value, argument: Value, context: EvalContext, position?: Position): Value {
  if (!isFunction(fn)) {
    throw new SimulatorError(
      'Type error',
      `Couldn't match expected type ‘a -> b’ with actual type ‘${typeName(fn)}’.`,
      position,
      `The value ${formatValue(fn)} is being used like a function. Check the argument order.`,
    );
  }
  const received = [...fn.received, argument];
  if (received.length < fn.arity) return makeFunction(fn.name, fn.arity, fn.invoke, received);
  return fn.invoke(received, context);
}

function applyMany(fn: Value, arguments_: Value[], context: EvalContext, position?: Position): Value {
  return arguments_.reduce((current, argument) => applyFunction(current, argument, context, position), fn);
}

function evaluate(expression: Expr, environment: Environment, context: EvalContext): Value {
  context.steps += 1;
  if (context.steps > context.maxSteps) {
    throw new SimulatorError(
      'Runtime error',
      'Evaluation limit exceeded.',
      expression.position,
      'This usually means the recursion does not reach a base case, or an infinite list was demanded without take.',
    );
  }

  switch (expression.kind) {
    case 'literal':
      return expression.value;
    case 'variable': {
      const value = environment.get(expression.name);
      if (value === undefined) {
        throw new SimulatorError(
          'Type error',
          `Variable not in scope: ${expression.name}`,
          expression.position,
          'Check the spelling, or define the function before the expression that uses it.',
        );
      }
      return value;
    }
    case 'list':
      return expression.items.map((item) => evaluate(item, environment, context));
    case 'comprehension': {
      const results: Value[] = [];

      const collect = (qualifierIndex: number, local: Environment): void => {
        if (results.length > 10_000) {
          throw new SimulatorError(
            'Runtime error',
            'The list comprehension produced more than 10,000 values.',
            expression.position,
            'Use a smaller range or add a condition that bounds the result.',
          );
        }
        if (qualifierIndex === expression.qualifiers.length) {
          results.push(evaluate(expression.output, local, context));
          return;
        }

        const qualifier = expression.qualifiers[qualifierIndex];
        if (qualifier.kind === 'guard') {
          if (expectBoolean(evaluate(qualifier.condition, local, context), qualifier.position)) {
            collect(qualifierIndex + 1, local);
          }
          return;
        }

        const source = evaluate(qualifier.source, local, context);
        for (const value of iterable(source)) {
          const next = new Map(local);
          if (qualifier.pattern.kind === 'variable') {
            next.set(qualifier.pattern.name, value);
          } else {
            const tuple = expectTuple(value, qualifier.pattern.names.length);
            qualifier.pattern.names.forEach((name, index) => next.set(name, tuple.items[index]));
          }
          collect(qualifierIndex + 1, next);
        }
      };

      collect(0, new Map(environment));
      return results;
    }
    case 'tuple':
      return { kind: 'tuple', items: expression.items.map((item) => evaluate(item, environment, context)) };
    case 'range': {
      const start = expectInteger(evaluate(expression.start, environment, context), expression.position);
      const next = expression.next
        ? expectInteger(evaluate(expression.next, environment, context), expression.position)
        : start + 1;
      const step = next - start;
      if (expression.end) {
        const end = expectInteger(evaluate(expression.end, environment, context), expression.position);
        if (step === 0) {
          throw new SimulatorError(
            'Runtime error',
            'A finite stepped range cannot use a zero step in the practice runner.',
            expression.position,
            'Change the second value so it differs from the first, for example [1,2..5].',
          );
        }
        if ((step > 0 && end < start) || (step < 0 && end > start)) return [];
        const length = Math.floor((end - start) / step) + 1;
        if (length > 10_001) {
          throw new SimulatorError('Runtime error', 'Finite ranges are limited to 10,001 values in the practice runner.', expression.position);
        }
        return Array.from({ length }, (_, index) => start + index * step);
      }
      return {
        kind: 'lazy-list',
        description: expression.next ? `[${start},${next}..]` : `[${start}..]`,
        iterator: function* () {
          let current = start;
          while (true) {
            yield current;
            current += step;
          }
        },
      };
    }
    case 'application': {
      const fn = evaluate(expression.fn, environment, context);
      const argument = evaluate(expression.argument, environment, context);
      return applyFunction(fn, argument, context, expression.position);
    }
    case 'lambda': {
      const closure = new Map(environment);
      return makeFunction('lambda', expression.parameters.length, (arguments_, innerContext) => {
        const local = new Map(closure);
        expression.parameters.forEach((parameter, index) => local.set(parameter, arguments_[index]));
        return evaluate(expression.body, local, innerContext);
      });
    }
    case 'if': {
      const condition = expectBoolean(evaluate(expression.condition, environment, context), expression.condition.position);
      return evaluate(condition ? expression.whenTrue : expression.whenFalse, environment, context);
    }
    case 'infix': {
      if (expression.operator === '&&') {
        const left = expectBoolean(evaluate(expression.left, environment, context), expression.left.position);
        return left && expectBoolean(evaluate(expression.right, environment, context), expression.right.position);
      }
      if (expression.operator === '||') {
        const left = expectBoolean(evaluate(expression.left, environment, context), expression.left.position);
        return left || expectBoolean(evaluate(expression.right, environment, context), expression.right.position);
      }
      const operator = environment.get(expression.operator);
      if (!operator) throw new SimulatorError('Runtime error', `Unsupported operator: ${expression.operator}`, expression.position);
      const left = evaluate(expression.left, environment, context);
      if (expression.operator === '$') {
        const right = evaluate(expression.right, environment, context);
        return applyFunction(left, right, context, expression.position);
      }
      const right = evaluate(expression.right, environment, context);
      return applyMany(operator, [left, right], context, expression.position);
    }
  }
}

function createEnvironment(): Environment {
  const environment = new Map<string, Value>();
  const binary = (name: string, implementation: (left: Value, right: Value, context: EvalContext) => Value) =>
    environment.set(name, makeFunction(name, 2, ([left, right], context) => implementation(left, right, context)));
  const unary = (name: string, implementation: (value: Value, context: EvalContext) => Value) =>
    environment.set(name, makeFunction(name, 1, ([value], context) => implementation(value, context)));

  binary('+', (left, right) => expectNumber(left) + expectNumber(right));
  binary('-', (left, right) => expectNumber(left) - expectNumber(right));
  binary('*', (left, right) => expectNumber(left) * expectNumber(right));
  binary('/', (left, right) => {
    const divisor = expectNumber(right);
    if (divisor === 0) throw new SimulatorError('Runtime error', 'divide by zero');
    return expectNumber(left) / divisor;
  });
  binary('div', (left, right) => {
    const divisor = expectInteger(right);
    if (divisor === 0) throw new SimulatorError('Runtime error', 'divide by zero');
    return Math.floor(expectInteger(left) / divisor);
  });
  binary('mod', (left, right) => {
    const divisor = expectInteger(right);
    if (divisor === 0) throw new SimulatorError('Runtime error', 'divide by zero');
    const value = expectInteger(left);
    return value - Math.floor(value / divisor) * divisor;
  });
  binary('^', (left, right) => expectNumber(left) ** expectInteger(right));
  binary('==', (left, right) => valuesEqual(left, right));
  binary('/=', (left, right) => !valuesEqual(left, right));
  binary('<', (left, right) => compareValues(left, right) < 0);
  binary('<=', (left, right) => compareValues(left, right) <= 0);
  binary('>', (left, right) => compareValues(left, right) > 0);
  binary('>=', (left, right) => compareValues(left, right) >= 0);
  binary('&&', (left, right) => expectBoolean(left) && expectBoolean(right));
  binary('||', (left, right) => expectBoolean(left) || expectBoolean(right));
  binary(':', (head, tail) => [head, ...expectFiniteList(tail)]);
  binary('++', (left, right) => {
    if (typeof left === 'string' && typeof right === 'string') return left + right;
    return [...expectFiniteList(left), ...expectFiniteList(right)];
  });
  binary('.', (outer, inner) => {
    expectFunction(outer);
    expectFunction(inner);
    return makeFunction(`${functionName(outer)} . ${functionName(inner)}`, 1, ([value], context) =>
      applyFunction(outer, applyFunction(inner, value, context), context),
    );
  });
  binary('$', (fn, argument, context) => applyFunction(fn, argument, context));

  unary('negate', (value) => -expectNumber(value));
  unary('abs', (value) => Math.abs(expectNumber(value)));
  unary('not', (value) => !expectBoolean(value));
  unary('even', (value) => expectInteger(value) % 2 === 0);
  unary('odd', (value) => Math.abs(expectInteger(value) % 2) === 1);
  unary('show', (value) => formatValue(value));
  unary('length', (value) => expectFiniteList(value).length);
  unary('sum', (value) => expectFiniteList(value).reduce<number>((total, item) => total + expectNumber(item), 0));
  unary('product', (value) => expectFiniteList(value).reduce<number>((total, item) => total * expectNumber(item), 1));
  unary('reverse', (value) => [...expectFiniteList(value)].reverse());
  unary('head', (value) => {
    const list = takeFromList(value, 1);
    if (list.length === 0) throw new SimulatorError('Runtime error', 'Prelude.head: empty list');
    return list[0];
  });
  unary('tail', (value) => {
    if (isLazyList(value)) return dropFromList(value, 1);
    const list = expectFiniteList(value);
    if (list.length === 0) throw new SimulatorError('Runtime error', 'Prelude.tail: empty list');
    return list.slice(1);
  });
  unary('null', (value) => takeFromList(value, 1).length === 0);
  unary('fst', (value) => expectTuple(value, 2).items[0]);
  unary('snd', (value) => expectTuple(value, 2).items[1]);
  unary('id', (value) => value);

  environment.set('const', makeFunction('const', 2, ([value]) => value));
  environment.set('max', makeFunction('max', 2, ([left, right]) => (compareValues(left, right) >= 0 ? left : right)));
  environment.set('min', makeFunction('min', 2, ([left, right]) => (compareValues(left, right) <= 0 ? left : right)));
  environment.set('(,)', makeFunction('(,)', 2, (items) => ({ kind: 'tuple', items })));
  environment.set('flip', makeFunction('flip', 1, ([fn]) => {
    expectFunction(fn);
    return makeFunction(`flip ${functionName(fn)}`, 2, ([left, right], context) => applyMany(fn, [right, left], context));
  }));
  environment.set('uncurry', makeFunction('uncurry', 2, ([fn, tuple], context) => {
    expectFunction(fn);
    return applyMany(fn, expectTuple(tuple, 2).items, context);
  }));

  environment.set('map', makeFunction('map', 2, ([fn, list], context) => {
    expectFunction(fn);
    if (isLazyList(list)) {
      return {
        kind: 'lazy-list',
        description: `map ${functionName(fn)} ${list.description}`,
        iterator: function* () {
          for (const item of iterable(list)) yield applyFunction(fn, item, context);
        },
      };
    }
    return expectFiniteList(list).map((item) => applyFunction(fn, item, context));
  }));
  environment.set('filter', makeFunction('filter', 2, ([predicate, list], context) => {
    expectFunction(predicate);
    if (isLazyList(list)) {
      return {
        kind: 'lazy-list',
        description: `filter ${functionName(predicate)} ${list.description}`,
        iterator: function* () {
          for (const item of iterable(list)) {
            if (expectBoolean(applyFunction(predicate, item, context))) yield item;
          }
        },
      };
    }
    return expectFiniteList(list).filter((item) => expectBoolean(applyFunction(predicate, item, context)));
  }));
  environment.set('zip', makeFunction('zip', 2, ([left, right]) => zipLists(left, right, (a, b) => ({ kind: 'tuple', items: [a, b] }))));
  environment.set('zipWith', makeFunction('zipWith', 3, ([fn, left, right], context) => {
    expectFunction(fn);
    return zipLists(left, right, (a, b) => applyMany(fn, [a, b], context));
  }));
  environment.set('take', makeFunction('take', 2, ([count, list]) => takeFromList(list, expectNonNegativeInteger(count))));
  environment.set('drop', makeFunction('drop', 2, ([count, list]) => dropFromList(list, expectNonNegativeInteger(count))));
  environment.set('takeWhile', makeFunction('takeWhile', 2, ([predicate, list], context) => {
    expectFunction(predicate);
    const result: Value[] = [];
    for (const item of iterable(list)) {
      if (!expectBoolean(applyFunction(predicate, item, context))) break;
      result.push(item);
      if (result.length > 10_000) throw new SimulatorError('Runtime error', 'takeWhile produced too many values.');
    }
    return result;
  }));
  environment.set('dropWhile', makeFunction('dropWhile', 2, ([predicate, list], context) => {
    expectFunction(predicate);
    if (isLazyList(list)) {
      return {
        kind: 'lazy-list',
        description: `dropWhile ${functionName(predicate)} ${list.description}`,
        iterator: function* () {
          let dropping = true;
          for (const item of iterable(list)) {
            if (dropping && expectBoolean(applyFunction(predicate, item, context))) continue;
            dropping = false;
            yield item;
          }
        },
      };
    }
    const items = expectFiniteList(list);
    let index = 0;
    while (index < items.length && expectBoolean(applyFunction(predicate, items[index], context))) index += 1;
    return items.slice(index);
  }));
  environment.set('foldl', makeFunction('foldl', 3, ([fn, initial, list], context) => {
    expectFunction(fn);
    return expectFiniteList(list).reduce((accumulator, item) => applyMany(fn, [accumulator, item], context), initial);
  }));
  environment.set('foldr', makeFunction('foldr', 3, ([fn, initial, list], context) => {
    expectFunction(fn);
    return expectFiniteList(list).reduceRight((accumulator, item) => applyMany(fn, [item, accumulator], context), initial);
  }));
  environment.set('scanl', makeFunction('scanl', 3, ([fn, initial, list], context) => {
    expectFunction(fn);
    const results = [initial];
    for (const item of expectFiniteList(list)) results.push(applyMany(fn, [results[results.length - 1], item], context));
    return results;
  }));
  environment.set('scanr', makeFunction('scanr', 3, ([fn, initial, list], context) => {
    expectFunction(fn);
    const results = [initial];
    for (const item of [...expectFiniteList(list)].reverse()) results.unshift(applyMany(fn, [item, results[0]], context));
    return results;
  }));

  return environment;
}

function isFunction(value: Value): value is SimFunction {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.kind === 'function';
}

function isLazyList(value: Value): value is LazyList {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.kind === 'lazy-list';
}

function expectFunction(value: Value): asserts value is SimFunction {
  if (!isFunction(value)) throw new SimulatorError('Type error', `Expected a function, but received ${typeName(value)}.`);
}

function expectNumber(value: Value, position?: Position): number {
  if (typeof value !== 'number') {
    throw new SimulatorError('Type error', `No instance for Num ${typeName(value)}.`, position, 'Arithmetic operators need numeric operands.');
  }
  return value;
}

function expectInteger(value: Value, position?: Position): number {
  const number = expectNumber(value, position);
  if (!Number.isInteger(number)) throw new SimulatorError('Type error', `Expected an Integer, but received ${number}.`, position);
  return number;
}

function expectNonNegativeInteger(value: Value): number {
  return Math.max(0, expectInteger(value));
}

function expectBoolean(value: Value, position?: Position): boolean {
  if (typeof value !== 'boolean') {
    throw new SimulatorError('Type error', `Couldn't match expected type ‘Bool’ with actual type ‘${typeName(value)}’.`, position);
  }
  return value;
}

function expectFiniteList(value: Value): Value[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [...value].map((character) => ({ kind: 'char', value: character }));
  if (isLazyList(value)) {
    throw new SimulatorError(
      'Runtime error',
      `Cannot demand the whole infinite list ${value.description}.`,
      undefined,
      'Use take to request a finite prefix, for example: take 5 (map (*2) [1..]).',
    );
  }
  throw new SimulatorError('Type error', `Couldn't match expected type ‘[a]’ with actual type ‘${typeName(value)}’.`);
}

function expectTuple(value: Value, size: number): TupleValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && value.kind === 'tuple' && value.items.length === size) {
    return value;
  }
  throw new SimulatorError('Type error', `Expected a ${size}-tuple, but received ${typeName(value)}.`);
}

function iterable(value: Value): Iterable<Value> {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [...value].map((character) => ({ kind: 'char', value: character }));
  if (isLazyList(value)) return { [Symbol.iterator]: value.iterator };
  throw new SimulatorError('Type error', `Couldn't match expected type ‘[a]’ with actual type ‘${typeName(value)}’.`);
}

function takeFromList(value: Value, count: number): Value[] {
  if (Array.isArray(value)) return value.slice(0, count);
  const result: Value[] = [];
  for (const item of iterable(value)) {
    if (result.length >= count) break;
    result.push(item);
  }
  return result;
}

function dropFromList(value: Value, count: number): Value {
  if (Array.isArray(value)) return value.slice(count);
  const lazy = value as LazyList;
  return {
    kind: 'lazy-list',
    description: `drop ${count} ${lazy.description}`,
    iterator: function* () {
      let skipped = 0;
      for (const item of iterable(lazy)) {
        if (skipped++ < count) continue;
        yield item;
      }
    },
  };
}

function zipLists(left: Value, right: Value, combine: (left: Value, right: Value) => Value): Value {
  if (!isLazyList(left) && !isLazyList(right)) {
    const leftItems = expectFiniteList(left);
    const rightItems = expectFiniteList(right);
    return Array.from({ length: Math.min(leftItems.length, rightItems.length) }, (_, index) => combine(leftItems[index], rightItems[index]));
  }
  return {
    kind: 'lazy-list',
    description: 'zipped list',
    iterator: function* () {
      const leftIterator = iterable(left)[Symbol.iterator]();
      const rightIterator = iterable(right)[Symbol.iterator]();
      while (true) {
        const leftNext = leftIterator.next();
        const rightNext = rightIterator.next();
        if (leftNext.done || rightNext.done) return;
        yield combine(leftNext.value, rightNext.value);
      }
    },
  };
}

function compareValues(left: Value, right: Value): number {
  const leftComparable = comparableValue(left);
  const rightComparable = comparableValue(right);
  if (typeof leftComparable !== typeof rightComparable) {
    throw new SimulatorError('Type error', `Cannot compare ${typeName(left)} with ${typeName(right)}.`);
  }
  return leftComparable < rightComparable ? -1 : leftComparable > rightComparable ? 1 : 0;
}

function comparableValue(value: Value): number | string | boolean {
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'object' && !Array.isArray(value) && value.kind === 'char') return value.value;
  throw new SimulatorError('Type error', `No instance for Ord ${typeName(value)}.`);
}

function valuesEqual(left: Value, right: Value): boolean {
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => valuesEqual(item, right[index]));
  }
  if (typeof left === 'object' && left !== null && typeof right === 'object' && right !== null) {
    if (!Array.isArray(left) && !Array.isArray(right) && left.kind === 'char' && right.kind === 'char') return left.value === right.value;
    if (!Array.isArray(left) && !Array.isArray(right) && left.kind === 'tuple' && right.kind === 'tuple') {
      return valuesEqual(left.items, right.items);
    }
  }
  return left === right;
}

function functionName(value: Value): string {
  return isFunction(value) ? value.name : '<not a function>';
}

function typeName(value: Value): string {
  if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
  if (typeof value === 'boolean') return 'Bool';
  if (typeof value === 'string') return 'String';
  if (Array.isArray(value)) return value.length === 0 ? '[a]' : `[${typeName(value[0])}]`;
  if (isFunction(value)) return 'function';
  if (isLazyList(value)) return '[Integer]';
  if (value.kind === 'char') return 'Char';
  return `(${value.items.map(typeName).join(', ')})`;
}

function formatValue(value: Value): string {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item) && item.kind === 'char')) {
      return JSON.stringify(value.map((item) => (item as CharValue).value).join(''));
    }
    return `[${value.map(formatValue).join(',')}]`;
  }
  if (isFunction(value)) return `<function ${value.name}>`;
  if (isLazyList(value)) {
    throw new SimulatorError(
      'Runtime error',
      `Cannot print the infinite list ${value.description}.`,
      undefined,
      'Use take to request a finite prefix before printing it.',
    );
  }
  if (value.kind === 'char') return `'${value.value.replace(/'/g, "\\'")}'`;
  return `(${value.items.map(formatValue).join(',')})`;
}

type Definition = { name: string; parameters: string[]; body: Expr; line: number };
type Statement =
  | { kind: 'expression'; expression: Expr }
  | { kind: 'print'; expression: Expr }
  | { kind: 'putStrLn'; expression: Expr }
  | { kind: 'let'; name: string; expression: Expr };

function parseProgram(source: string): { definitions: Definition[]; statements: Statement[] } {
  const definitions: Definition[] = [];
  const statements: Statement[] = [];
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  let insideMainDo = false;

  lines.forEach((originalLine, index) => {
    const lineNumber = index + 1;
    let line = originalLine.trim();
    if (!line || line.startsWith('--')) return;
    if (line.startsWith('ghci>')) line = line.slice(5).trim();
    if (!line) return;

    if (/^[A-Za-z_][A-Za-z0-9_']*\s*::/.test(line)) return;
    if (/^main\s*=\s*do\s*$/.test(line)) {
      insideMainDo = true;
      return;
    }

    if (insideMainDo) {
      const letMatch = line.match(/^let\s+([A-Za-z_][A-Za-z0-9_']*)\s*=\s*(.+)$/);
      if (letMatch) {
        statements.push({ kind: 'let', name: letMatch[1], expression: parseExpression(letMatch[2], lineNumber) });
        return;
      }
      const printMatch = line.match(/^print\s+(.+)$/);
      if (printMatch) {
        statements.push({ kind: 'print', expression: parseExpression(printMatch[1], lineNumber) });
        return;
      }
      const putStrLnMatch = line.match(/^putStrLn\s+(.+)$/);
      if (putStrLnMatch) {
        statements.push({ kind: 'putStrLn', expression: parseExpression(putStrLnMatch[1], lineNumber) });
        return;
      }
      throw new SimulatorError(
        'Parse error',
        'Inside main = do, this runner currently supports let, print, and putStrLn statements.',
        { line: lineNumber, column: 1 },
      );
    }

    const inlineMain = line.match(/^main\s*=\s*(print|putStrLn)\s+(.+)$/);
    if (inlineMain) {
      statements.push({ kind: inlineMain[1] as 'print' | 'putStrLn', expression: parseExpression(inlineMain[2], lineNumber) });
      return;
    }

    const definition = line.match(/^([a-z_][A-Za-z0-9_']*)(?:\s+([a-z_][A-Za-z0-9_']*(?:\s+[a-z_][A-Za-z0-9_']*)*))?\s*(?<![=<>/])=(?!=)\s*(.+)$/);
    if (definition) {
      definitions.push({
        name: definition[1],
        parameters: definition[2] ? definition[2].trim().split(/\s+/) : [],
        body: parseExpression(definition[3], lineNumber),
        line: lineNumber,
      });
      return;
    }

    statements.push({ kind: 'expression', expression: parseExpression(line, lineNumber) });
  });

  return { definitions, statements };
}

export function runHaskell(source: string): HaskellRunResult {
  const started = typeof performance === 'undefined' ? Date.now() : performance.now();
  try {
    if (!source.trim()) {
      throw new SimulatorError('Parse error', 'There is no code to run.', { line: 1, column: 1 }, 'Choose an example or type an expression.');
    }

    const { definitions, statements } = parseProgram(source);
    const environment = createEnvironment();
    const context: EvalContext = { steps: 0, maxSteps: 50_000 };

    for (const definition of definitions.filter((item) => item.parameters.length > 0)) {
      const closure = environment;
      const fn = makeFunction(definition.name, definition.parameters.length, (arguments_, innerContext) => {
        const local = new Map(closure);
        definition.parameters.forEach((parameter, index) => local.set(parameter, arguments_[index]));
        return evaluate(definition.body, local, innerContext);
      });
      environment.set(definition.name, fn);
    }
    for (const definition of definitions.filter((item) => item.parameters.length === 0)) {
      environment.set(definition.name, evaluate(definition.body, environment, context));
    }

    const output: string[] = [];
    for (const statement of statements) {
      if (statement.kind === 'let') {
        environment.set(statement.name, evaluate(statement.expression, environment, context));
        continue;
      }
      const value = evaluate(statement.expression, environment, context);
      if (statement.kind === 'putStrLn') {
        if (typeof value !== 'string') {
          throw new SimulatorError('Type error', `Couldn't match expected type ‘String’ with actual type ‘${typeName(value)}’.`, statement.expression.position);
        }
        output.push(value);
      } else {
        output.push(formatValue(value));
      }
    }

    if (output.length === 0) {
      output.push(definitions.length > 0 ? 'Definitions loaded. Add an expression or print statement to see a result.' : 'No output.');
    }

    const ended = typeof performance === 'undefined' ? Date.now() : performance.now();
    return { ok: true, output: output.join('\n'), elapsedMs: Math.max(0, ended - started) };
  } catch (error) {
    const ended = typeof performance === 'undefined' ? Date.now() : performance.now();
    const simulatorError = error instanceof SimulatorError
      ? error
      : error instanceof RangeError
        ? new SimulatorError(
          'Runtime error',
          'Evaluation limit exceeded.',
          undefined,
          'This usually means the recursion does not reach a base case, or an infinite list was demanded without take.',
        )
        : new SimulatorError('Runtime error', error instanceof Error ? error.message : 'Unknown simulator failure.');
    return {
      ok: false,
      output: '',
      elapsedMs: Math.max(0, ended - started),
      diagnostic: {
        kind: simulatorError.kind,
        message: simulatorError.message,
        line: simulatorError.position?.line,
        column: simulatorError.position?.column,
        hint: simulatorError.hint,
      },
    };
  }
}
