/**
 * Permutations, combinations and the two counts with repetition, for components/interactive/counting-calculator.tsx.
 * Everything is a BigInt, so the answers stay exact however large they get (a double stops being exact at 2^53).
 */

/** n! as a BigInt. */
export function factorial(n: number): bigint {
  let result = 1n;
  for (let i = 2; i <= n; i += 1) result *= BigInt(i);
  return result;
}

/** Permutations without repetition: n (n-1) ... (n-r+1) = n! / (n-r)!, or 0 when r is more than n. */
export function permutations(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  let result = 1n;
  for (let i = 0; i < r; i += 1) result *= BigInt(n - i);
  return result;
}

/** Combinations without repetition: "n choose r" = n! / (r! (n-r)!), or 0 when r is more than n. */
export function combinations(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  const k = Math.min(r, n - r);
  let result = 1n;
  // After step i the result is "(n-k+i) choose i", a whole number, so each division is exact.
  for (let i = 1; i <= k; i += 1) result = (result * BigInt(n - k + i)) / BigInt(i);
  return result;
}

/** Arrangements with repetition allowed: n^r (each of r places can hold any of n things). */
export function arrangementsWithRepetition(n: number, r: number): bigint {
  return r < 0 ? 0n : BigInt(n) ** BigInt(r);
}

/** Selections with repetition allowed, order ignored: C(n + r - 1, r). */
export function selectionsWithRepetition(n: number, r: number): bigint {
  if (r === 0) return 1n;
  return n <= 0 ? 0n : combinations(n + r - 1, r);
}

/** The count for a choice of "order matters" and "repetition allowed". */
export function count(n: number, r: number, ordered: boolean, repetition: boolean): bigint {
  if (ordered) return repetition ? arrangementsWithRepetition(n, r) : permutations(n, r);
  return repetition ? selectionsWithRepetition(n, r) : combinations(n, r);
}

/** 2598960n becomes "2,598,960". Written by hand so the server and the browser print the same text whatever the locale. */
export function groupDigits(value: bigint, separator = ','): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export type Counting = {
  /** The name of the count, for a heading. */
  name: string;
  /** The formula, in LaTeX. */
  formula: string;
  /** The working with the numbers put in, in LaTeX. */
  working: string;
  value: bigint;
  /** Something to say beside the answer, such as why it is 0. */
  note?: string;
};

/** n, n-1, ... as LaTeX terms joined by times; a long product is shortened to its first three and its last term. */
function product(first: number, step: number, terms: number): string {
  const term = (i: number) => String(first + step * i);
  if (terms <= 0) return '1';
  if (terms <= 5) return Array.from({ length: terms }, (_, i) => term(i)).join('\\times ');
  return `${term(0)}\\times ${term(1)}\\times ${term(2)}\\times\\cdots\\times ${term(terms - 1)}`;
}

/** Join the steps of a calculation with equals signs, leaving out a step that repeats the one before it. */
function chain(...steps: string[]): string {
  return steps.filter((step, i) => i === 0 || step !== steps[i - 1]).join('=');
}

/** The formula, the working with the numbers put in, and the answer for one choice. */
export function explain(n: number, r: number, ordered: boolean, repetition: boolean): Counting {
  const value = count(n, r, ordered, repetition);
  const answer = groupDigits(value, '{,}');

  if (ordered && !repetition) {
    return {
      name: 'Permutations: order matters, no repetition',
      formula: 'P(n,r)=\\dfrac{n!}{(n-r)!}',
      working: r > n ? `P(${n},${r})=0` : chain(`P(${n},${r})`, `\\dfrac{${n}!}{${n - r}!}`, product(n, -1, r), answer),
      value,
      note: r > n ? 'There are fewer than r objects to place, so no arrangement exists.' : undefined,
    };
  }
  if (!ordered && !repetition) {
    return {
      name: 'Combinations: order does not matter, no repetition',
      formula: 'C(n,r)=\\dbinom{n}{r}=\\dfrac{n!}{r!\\,(n-r)!}',
      working: r > n ? `C(${n},${r})=0` : chain(`C(${n},${r})`, `\\dfrac{${n}!}{${r}!\\,${n - r}!}`, `\\dfrac{${product(n, -1, r)}}{${product(r, -1, r)}}`, answer),
      value,
      note: r > n ? 'There are fewer than r objects to choose from, so no selection exists.' : undefined,
    };
  }
  if (ordered) {
    return {
      name: 'Arrangements with repetition: order matters, repetition allowed',
      formula: 'n^{r}',
      working: chain(`${n}^{${r}}`, product(n, 0, r), answer),
      value,
    };
  }
  return {
    name: 'Selections with repetition: order does not matter, repetition allowed',
    formula: 'C(n+r-1,\\,r)=\\dbinom{n+r-1}{r}',
    working: chain(`C(${n}+${r}-1,\\,${r})`, `\\dbinom{${n + r - 1}}{${r}}`, answer),
    value,
  };
}
