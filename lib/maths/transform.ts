/**
 * The transformation y = a f(b(x - c)) + d written out as an expression, with the numbers put in and the obvious
 * simplifications made: with a = 1, b = 1, c = 0 and d = 0 it is f itself, and with f = x^2, a = 2, c = 1, d = 3 it is
 * 2*(x - 1)^2 + 3. Used by the "graph" view of the Visualise component to print the formula of the moved graph.
 */

import { fromNode, type Node, type Parsed } from './expression';
import { add, mul, num, sub, substituteX, variable } from './tree';

export function transformNode(node: Node, a: number, b: number, c: number, d: number): Node {
  const inner = mul(num(b), sub(variable, num(c)));
  return add(mul(num(a), substituteX(node, inner)), num(d));
}

/** y = a f(b(x - c)) + d as a parsed expression, with `evaluate`, `text` and `tex`. */
export function transformed(parsed: Parsed, a: number, b: number, c: number, d: number): Parsed {
  return fromNode(transformNode(parsed.node, a, b, c, d));
}
