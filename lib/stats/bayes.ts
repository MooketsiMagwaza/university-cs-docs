/**
 * The arithmetic of a two-stage probability tree, for components/interactive/probability-tree.tsx.
 *
 * The first stage is the event A (or not A); the second is the event B, with a different probability depending on the
 * first stage. Multiplying along a branch gives the four joint probabilities; adding the two that end in B gives P(B)
 * (the law of total probability); dividing gives P(A | B) (Bayes' theorem).
 */

export type TreeInput = {
  /** P(A) */
  a: number;
  /** P(B | A) */
  bGivenA: number;
  /** P(B | not A) */
  bGivenNotA: number;
};

export type TreeResult = {
  notA: number;
  notBGivenA: number;
  notBGivenNotA: number;
  /** P(A and B) */
  aAndB: number;
  /** P(A and not B) */
  aAndNotB: number;
  /** P(not A and B) */
  notAAndB: number;
  /** P(not A and not B) */
  notAAndNotB: number;
  /** P(B) */
  b: number;
  /** P(not B) */
  notB: number;
  /** P(A | B), or null when P(B) is 0 and the question has no answer. */
  aGivenB: number | null;
  /** P(not A | B) */
  notAGivenB: number | null;
  /** P(A | not B) */
  aGivenNotB: number | null;
};

const unit = (value: number) => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);

/** Work out the whole tree from its three branch probabilities (each is kept between 0 and 1). */
export function tree(input: TreeInput): TreeResult {
  const a = unit(input.a);
  const bGivenA = unit(input.bGivenA);
  const bGivenNotA = unit(input.bGivenNotA);
  const notA = 1 - a;
  const aAndB = a * bGivenA;
  const aAndNotB = a * (1 - bGivenA);
  const notAAndB = notA * bGivenNotA;
  const notAAndNotB = notA * (1 - bGivenNotA);
  const b = aAndB + notAAndB;
  const notB = aAndNotB + notAAndNotB;
  return {
    notA,
    notBGivenA: 1 - bGivenA,
    notBGivenNotA: 1 - bGivenNotA,
    aAndB,
    aAndNotB,
    notAAndB,
    notAAndNotB,
    b,
    notB,
    aGivenB: b > 0 ? aAndB / b : null,
    notAGivenB: b > 0 ? notAAndB / b : null,
    aGivenNotB: notB > 0 ? aAndNotB / notB : null,
  };
}
