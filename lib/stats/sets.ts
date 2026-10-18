/**
 * The algebra of two or three sets, for the Venn diagram in components/interactive/venn-diagram.tsx.
 *
 * The diagram has one region for every combination of memberships. A region is written as a "mask": bit 0 is
 * membership of A, bit 1 of B and bit 2 of C. For two sets the masks are 0 (in neither), 1 (A only), 2 (B only) and
 * 3 (both); for three sets they run from 0 to 7. An expression such as (A or B)' is evaluated on one mask at a time,
 * and the count of the expression is the sum of the counts of the regions where it is true.
 */

export type SetName = 'A' | 'B' | 'C';
export type SetCount = 2 | 3;

export type Expr =
  | { op: 'set'; name: SetName }
  | { op: 'not'; arg: Expr }
  | { op: 'and'; left: Expr; right: Expr }
  | { op: 'or'; left: Expr; right: Expr }
  | { op: 'minus'; left: Expr; right: Expr };

/** How the complement is written in LaTeX: a bar over the set (CSI213), a superscript c (STA122) or a prime. */
export type Notation = 'bar' | 'c' | 'prime';

export const A: Expr = { op: 'set', name: 'A' };
export const B: Expr = { op: 'set', name: 'B' };
export const C: Expr = { op: 'set', name: 'C' };

export const not = (arg: Expr): Expr => ({ op: 'not', arg });
/** A and B and ...: the intersection, folded from the left. */
export const and = (first: Expr, ...rest: Expr[]): Expr => rest.reduce<Expr>((left, right) => ({ op: 'and', left, right }), first);
/** A or B or ...: the union, folded from the left. */
export const or = (first: Expr, ...rest: Expr[]): Expr => rest.reduce<Expr>((left, right) => ({ op: 'or', left, right }), first);
/** In the first set but not in the second. */
export const minus = (left: Expr, right: Expr): Expr => ({ op: 'minus', left, right });

const BIT: Record<SetName, number> = { A: 1, B: 2, C: 4 };

/** Is the region with this mask inside the set? */
export function isMember(mask: number, name: SetName): boolean {
  return (mask & BIT[name]) !== 0;
}

/** Is the expression true for an element whose memberships are given by the mask? */
export function evaluate(expr: Expr, mask: number): boolean {
  switch (expr.op) {
    case 'set':
      return isMember(mask, expr.name);
    case 'not':
      return !evaluate(expr.arg, mask);
    case 'and':
      return evaluate(expr.left, mask) && evaluate(expr.right, mask);
    case 'or':
      return evaluate(expr.left, mask) || evaluate(expr.right, mask);
    case 'minus':
      return evaluate(expr.left, mask) && !evaluate(expr.right, mask);
  }
}

/* ───────── the regions of the diagram ───────── */

/** Every region of a diagram of this many sets, as masks. */
export function regionMasks(sets: SetCount): number[] {
  return Array.from({ length: 1 << sets }, (_, mask) => mask);
}

function namesIn(mask: number, sets: SetCount): SetName[] {
  return (['A', 'B', 'C'] as SetName[]).slice(0, sets).filter((name) => isMember(mask, name));
}

/** A short unique key for a region: 'none', 'A', 'AB', 'ABC' and so on. */
export function regionKey(mask: number, sets: SetCount): string {
  return mask === 0 ? 'none' : namesIn(mask, sets).join('');
}

/** What a region is called in words. */
export function regionLabel(mask: number, sets: SetCount): string {
  const names = namesIn(mask, sets);
  if (names.length === 0) return sets === 2 ? 'Neither A nor B' : 'None of A, B, C';
  if (names.length === sets) return sets === 2 ? 'A and B' : 'A, B and C';
  return `${names.join(' and ')} only`;
}

/** The count in each region when the page first opens, indexed by mask. */
export function defaultCounts(sets: SetCount): number[] {
  const byKey: Record<string, number> = sets === 2
    ? { none: 15, A: 12, B: 8, AB: 5 }
    : { none: 12, A: 10, B: 8, C: 6, AB: 4, AC: 3, BC: 5, ABC: 2 };
  return regionMasks(sets).map((mask) => byKey[regionKey(mask, sets)]);
}

/** The starting counts with some regions overridden by key, for example `{ AB: 20 }`. */
export function countsFromStart(sets: SetCount, start?: Record<string, number>): number[] {
  const base = defaultCounts(sets);
  if (!start) return base;
  return regionMasks(sets).map((mask) => {
    const value = start[regionKey(mask, sets)];
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : base[mask];
  });
}

/* ───────── counting ───────── */

/** The masks where the expression is true, in order. */
export function regionsOf(expr: Expr, sets: SetCount): number[] {
  return regionMasks(sets).filter((mask) => evaluate(expr, mask));
}

/** The number of elements in the expression: the sum of the counts of the regions where it is true. `counts` is indexed by mask. */
export function countOf(expr: Expr, counts: number[]): number {
  return counts.reduce((sum, count, mask) => (evaluate(expr, mask) ? sum + count : sum), 0);
}

/** Everything in the diagram. */
export function totalOf(counts: number[]): number {
  return counts.reduce((sum, count) => sum + count, 0);
}

/** The number of elements in one set, such as |A|. */
export function setSize(name: SetName, counts: number[]): number {
  return countOf({ op: 'set', name }, counts);
}

/** The probability of the expression when every element is equally likely, or null when the diagram is empty. */
export function probabilityOf(expr: Expr, counts: number[]): number | null {
  const total = totalOf(counts);
  return total > 0 ? countOf(expr, counts) / total : null;
}

/** Two expressions that are true on exactly the same regions (De Morgan's laws, the distributive laws and so on). */
export function equivalent(first: Expr, second: Expr, sets: SetCount): boolean {
  return regionMasks(sets).every((mask) => evaluate(first, mask) === evaluate(second, mask));
}

/* ───────── writing an expression ───────── */

type Op = Expr['op'];

/** In words: 'A and B', 'not (A or B)', 'A minus B'. This is also the id a lesson passes as the `expression` prop. */
export function describe(expr: Expr, parent?: Op): string {
  switch (expr.op) {
    case 'set':
      return expr.name;
    case 'not':
      return `not ${describe(expr.arg, 'not')}`;
    case 'and':
    case 'or':
    case 'minus': {
      const word = expr.op === 'minus' ? 'minus' : expr.op;
      const text = `${describe(expr.left, expr.op)} ${word} ${describe(expr.right, expr.op)}`;
      // A chain of 'and' or of 'or' needs no brackets, anything else inside another operator does.
      return parent && !(parent === expr.op && expr.op !== 'minus') ? `(${text})` : text;
    }
  }
}

/** In symbols for a menu: 'A ∩ B′', '(A ∪ B)′', 'A − B'. */
export function symbols(expr: Expr, parent?: Op): string {
  switch (expr.op) {
    case 'set':
      return expr.name;
    case 'not':
      return expr.arg.op === 'set' ? `${expr.arg.name}′` : `(${symbols(expr.arg)})′`;
    case 'and':
    case 'or':
    case 'minus': {
      const sign = expr.op === 'and' ? '∩' : expr.op === 'or' ? '∪' : '−';
      const text = `${symbols(expr.left, expr.op)} ${sign} ${symbols(expr.right, expr.op)}`;
      return parent && !(parent === expr.op && expr.op !== 'minus') ? `(${text})` : text;
    }
  }
}

/** In LaTeX for KaTeX, with the complement written the way the lesson writes it. */
export function latex(expr: Expr, notation: Notation = 'bar', parent?: Op): string {
  switch (expr.op) {
    case 'set':
      return expr.name;
    case 'not': {
      if (notation === 'bar') return `\\overline{${latex(expr.arg, notation)}}`;
      const mark = notation === 'c' ? '^{c}' : "'";
      return expr.arg.op === 'set' ? `${expr.arg.name}${mark}` : `(${latex(expr.arg, notation)})${mark}`;
    }
    case 'and':
    case 'or':
    case 'minus': {
      const sign = expr.op === 'and' ? '\\cap' : expr.op === 'or' ? '\\cup' : '-';
      const text = `${latex(expr.left, notation, expr.op)} ${sign} ${latex(expr.right, notation, expr.op)}`;
      return parent && !(parent === expr.op && expr.op !== 'minus') ? `(${text})` : text;
    }
  }
}

/* ───────── the menu ───────── */

export type Choice = { id: string; expr: Expr };

const choice = (expr: Expr): Choice => ({ id: describe(expr), expr });

/** The expressions the reader can pick from for a diagram of two or three sets. */
export function expressionsFor(sets: SetCount): Choice[] {
  if (sets === 2) {
    return [
      A, B, and(A, B), or(A, B), not(A), not(B), minus(A, B), minus(B, A),
      not(or(A, B)), not(and(A, B)), and(not(A), not(B)), or(not(A), not(B)),
    ].map(choice);
  }
  return [
    A, and(A, B), and(A, B, C), or(A, B, C),
    and(A, B, not(C)), and(A, not(B), not(C)), minus(A, B),
    and(A, or(B, C)), or(and(A, B), and(A, C)), or(and(A, B), C), or(and(A, B), and(A, C), and(B, C)),
    or(and(A, not(B), not(C)), and(not(A), B, not(C)), and(not(A), not(B), C)),
    not(or(A, B, C)), and(not(A), not(B), not(C)), not(and(A, B, C)),
  ].map(choice);
}

/** Find an expression by its id (the words form), falling back to the first one on the list. */
export function findExpression(sets: SetCount, id: string | undefined): Choice {
  const list = expressionsFor(sets);
  const wanted = (id ?? '').trim().toLowerCase();
  return list.find((entry) => entry.id.toLowerCase() === wanted) ?? list.find((entry) => entry.id === 'A and B') ?? list[0];
}
