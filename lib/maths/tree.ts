/**
 * Small constructors for expression trees that tidy as they build: 0 + a is a, 1*a is a, 2 + 3 is 5, and so on. The
 * derivative uses them so its formula is not full of "0*x" and "1*x", and the transformation display uses them to show
 * y = a f(b(x - c)) + d with the numbers put in.
 */

import type { FunctionName, Node } from './expression';

export const num = (value: number): Node => ({ type: 'num', value });
export const isNum = (node: Node): node is { type: 'num'; value: number } => node.type === 'num';
export const isValue = (node: Node, value: number): boolean => node.type === 'num' && node.value === value;

export function neg(a: Node): Node {
  if (isNum(a)) return num(-a.value);
  if (a.type === 'neg') return a.arg;
  return { type: 'neg', arg: a };
}
export function add(a: Node, b: Node): Node {
  if (isValue(a, 0)) return b;
  if (isValue(b, 0)) return a;
  if (isNum(a) && isNum(b)) return num(a.value + b.value);
  if (b.type === 'neg') return sub(a, b.arg);
  if (isNum(b) && b.value < 0) return sub(a, num(-b.value));
  return { type: 'bin', op: '+', left: a, right: b };
}
export function sub(a: Node, b: Node): Node {
  if (isValue(b, 0)) return a;
  if (isValue(a, 0)) return neg(b);
  if (isNum(a) && isNum(b)) return num(a.value - b.value);
  if (b.type === 'neg') return add(a, b.arg);
  if (isNum(b) && b.value < 0) return add(a, num(-b.value));
  return { type: 'bin', op: '-', left: a, right: b };
}
export function mul(a: Node, b: Node): Node {
  if (isValue(a, 0) || isValue(b, 0)) return num(0);
  if (isValue(a, 1)) return b;
  if (isValue(b, 1)) return a;
  if (isValue(a, -1)) return neg(b);
  if (isValue(b, -1)) return neg(a);
  if (isNum(a) && isNum(b)) return num(a.value * b.value);
  if (a.type === 'neg') return neg(mul(a.arg, b));
  if (b.type === 'neg') return neg(mul(a, b.arg));
  return { type: 'bin', op: '*', left: a, right: b };
}
export function div(a: Node, b: Node): Node {
  if (isValue(a, 0)) return num(0);
  if (isValue(b, 1)) return a;
  if (isNum(a) && isNum(b) && b.value !== 0) return num(a.value / b.value);
  if (a.type === 'neg') return neg(div(a.arg, b));
  return { type: 'bin', op: '/', left: a, right: b };
}
export function pow(a: Node, b: Node): Node {
  if (isValue(b, 1)) return a;
  if (isValue(b, 0)) return num(1);
  if (isNum(a) && isNum(b) && Number.isFinite(Math.pow(a.value, b.value))) return num(Math.pow(a.value, b.value));
  return { type: 'bin', op: '^', left: a, right: b };
}
export const call = (name: FunctionName, arg: Node): Node => ({ type: 'call', name, arg });


export const variable: Node = { type: 'var' };

/** The tree with every x replaced by another tree: f(x) becomes f(replacement). */
export function substituteX(node: Node, replacement: Node): Node {
  switch (node.type) {
    case 'var':
      return replacement;
    case 'num':
    case 'const':
      return node;
    case 'neg':
      return neg(substituteX(node.arg, replacement));
    case 'call':
      return { type: 'call', name: node.name, arg: substituteX(node.arg, replacement) };
    default: {
      const left = substituteX(node.left, replacement);
      const right = substituteX(node.right, replacement);
      switch (node.op) {
        case '+':
          return add(left, right);
        case '-':
          return sub(left, right);
        case '*':
          return mul(left, right);
        case '/':
          return div(left, right);
        default:
          return pow(left, right);
      }
    }
  }
}
