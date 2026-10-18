/**
 * The derivative of an expression written in x, found by the usual rules (sum, product, quotient, power and chain
 * rules) on the tree from expression.ts. It is used to show f'(x) beside the numerical slope. It never fails: every
 * node type has a rule. The result is tidied as it is built (0 + a is a, 1*a is a, and so on), but it is not fully
 * simplified, so 3*x^2 - 2 may come out as 3*x^2 - 2 and a harder function as a longer formula that is still right.
 */

import { dependsOnX, fromNode, type Node, type Parsed } from './expression';
import { add, call, div, isNum, isValue, mul, neg, num, pow, sub } from './tree';

/** A constant factor goes in front: 2*cos(2*x), not cos(2*x)*2. */
const chain = (inner: Node, outer: Node): Node => (isNum(inner) ? mul(inner, outer) : mul(outer, inner));

/** The derivative of a tree with respect to x. */
export function differentiateNode(node: Node): Node {
  switch (node.type) {
    case 'num':
    case 'const':
      return num(0);
    case 'var':
      return num(1);
    case 'neg':
      return neg(differentiateNode(node.arg));
    case 'bin': {
      const { op, left, right } = node;
      const dl = differentiateNode(left);
      const dr = differentiateNode(right);
      switch (op) {
        case '+':
          return add(dl, dr);
        case '-':
          return sub(dl, dr);
        case '*':
          return add(mul(dl, right), mul(left, dr));
        case '/':
          if (isValue(dr, 0)) return div(dl, right);
          return div(sub(mul(dl, right), mul(left, dr)), pow(right, num(2)));
        default: {
          if (!dependsOnX(right)) {
            // The power rule with the chain rule: (u^k)' = k u^(k-1) u'.
            return chain(dl, mul(right, pow(left, sub(right, num(1)))));
          }
          if (left.type === 'const' && left.name === 'e') return chain(dr, node);
          if (!dependsOnX(left)) return chain(dr, mul(node, call('ln', left)));
          // Both the base and the exponent change: (u^v)' = u^v (v' ln u + v u'/u).
          return mul(node, add(mul(dr, call('ln', left)), div(mul(right, dl), left)));
        }
      }
    }
    default: {
      const u = node.arg;
      const du = differentiateNode(u);
      switch (node.name) {
        case 'sin':
          return chain(du, call('cos', u));
        case 'cos':
          return chain(du, neg(call('sin', u)));
        case 'tan':
          return div(du, pow(call('cos', u), num(2)));
        case 'exp':
          return chain(du, node);
        case 'ln':
          return div(du, u);
        case 'sqrt':
          return div(du, mul(num(2), node));
        default:
          return chain(du, div(u, node));
      }
    }
  }
}

/** The derivative of a parsed expression, as another parsed expression (with `evaluate`, `text` and `tex`). */
export function differentiate(parsed: Parsed): Parsed {
  return fromNode(differentiateNode(parsed.node));
}
