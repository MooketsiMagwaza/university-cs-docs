export const flashcardData = [
  {
    front: "The three parts of a specification",
    back: "Purpose: what the function represents, in one sentence. Precondition: what must be true of the arguments before application. Postcondition: what is true of the result afterwards.",
  },
  {
    front: "How is the input set partitioned?",
    back: "I = Iv ∪ Ie, where Iv is the valid subset satisfying the precondition and Ie is the invalid remainder. A function acts from Iv (precondition state) to Ov (postcondition state).",
  },
  {
    front: "Why is a type usually wider than Iv?",
    back: "fac :: Integer -> Integer accepts every integer, but the specification's Iv is only the non-negative ones. That gap is where fac (-1) fails to terminate.",
  },
  {
    front: "Three ways to handle an argument outside the precondition",
    back: "Reject it with error (not recoverable); define it by extending the base case; or report it by returning Maybe (visible in the type, and the caller must handle it).",
  },
  {
    front: "What does correctness actually claim?",
    back: "That for every argument satisfying the precondition, the function terminates and produces a result satisfying the postcondition. Correctness is always relative to a stated specification.",
  },
  {
    front: "Why is type checking not correctness?",
    back: "A compiler proves types are used consistently, not that a formula matches the problem. fac 0 = 0 type checks perfectly and is wrong.",
  },
  {
    front: "What is referential transparency?",
    back: "An expression can be replaced by its value without changing observable behaviour. It holds because functions are pure. x = x + 1 is not referentially transparent, since the same text denotes different values over time.",
  },
  {
    front: "How do you prove a property of a list function?",
    back: "Structural induction: prove the base case for [], assume it for xs, then show it holds for (x:xs). The proof follows the same two cases as the function definition.",
  },
  {
    front: "The three levels of evidence",
    back: "It compiles (types consistent); tests pass (worked for those inputs); a completed induction (holds for every finite input, assuming termination).",
  },
  {
    front: "The two stages of analysis before evaluation",
    back: "Syntax analysis checks conformance to the language's syntax; type analysis then checks the expression has a sensible type. Evaluation begins only if both pass.",
  },
  {
    front: "Syntax error or semantic error?",
    back: "Syntax errors concern the structure of the language — unbalanced parentheses, a missing else, type mismatch — and are caught before running. Semantic errors concern meaning — division by zero, index out of range — and surface during execution.",
  },
  {
    front: "The three test categories",
    back: "Normal (an ordinary representative input), boundary (zero, an empty structure, a decision edge), and invalid (outside the domain, where the signature permits it).",
  },
  {
    front: "Why test just outside a range boundary?",
    back: "A mistaken strict comparison passes ordinary examples while rejecting the boundary value. For isDigitChar, test '/' and ':' — the characters immediately either side of '0' and '9'.",
  },
  {
    front: "What is the cost of `length` on n elements?",
    back: "n + 1 calls: one per element plus the base case. Linear growth, O(n) — doubling the list roughly doubles the work.",
  },
  {
    front: "Why is naive `fib` exponential?",
    back: "Each call makes two more, so work roughly doubles per increase of one in n — O(2ⁿ). The cause is recomputation of overlapping subproblems, not recursion itself. An accumulator version is linear.",
  },
  {
    front: "Why is naive `myReverse` quadratic?",
    back: "++ [x] walks the whole reversed tail at each of n steps, giving n + (n-1) + ... + 1 work, so O(n²). Consing onto an accumulator is constant-cost and gives O(n).",
  },
  {
    front: "Cost of head, length, xs !! k, xs ++ ys, sort",
    back: "head is O(1); length is O(n); xs !! k is O(k); xs ++ ys is O(n) in the length of xs; sort is O(n log n).",
  },
  {
    front: "What is laziness, and what is a thunk?",
    back: "Haskell evaluates nothing without a reason. A thunk wraps a function or expression to delay computation until the result is needed. This is why take 5 [1..] terminates and unused arguments cost nothing.",
  },
  {
    front: "Concretely, how many calls does fib make, and how fast does that grow?",
    back: "fib 5 makes about 15 calls, fib 10 about 177, fib 20 about 21,891, fib 30 about 2,692,537, fib 40 about 331 million — work roughly doubles for each increase of one in n. Verified: fib 5 evaluates fib 2 three separate times.",
  },
  {
    front: "How does fibFast avoid fib's recomputation?",
    back: "go 0 a _ = a; go k a b = go (k-1) b (a+b) — it carries the two values it needs forward as arguments instead of recomputing them, making exactly one recursive call per step. Same specification, same results as fib, but linear instead of exponential.",
  },
  {
    front: "Why does `constant \"ready\" undefined` print \"ready\" without crashing?",
    back: "constant x _ = x never inspects its second argument — the pattern _ discards it without forcing it. Since undefined only crashes when actually evaluated, and it's never evaluated here, the crash never fires.",
  },
  {
    front: "Why does `take 5 [1..]` terminate?",
    back: "Haskell is lazy: it builds only the elements actually demanded. [1..] is never fully constructed — take 5 forces exactly five elements and stops, leaving the rest of the infinite list unevaluated.",
  },
  {
    front: "Why is consing cheap but appending is not?",
    back: "x : xs builds one cell, O(1). xs ++ ys must walk and rebuild the whole of xs, O(n) in the length of xs. That is exactly why naive myReverse (using ++ [x] at every step) is O(n²), while an accumulator version using : is O(n).",
  },
  {
    front: "Why does `[x | x <- xs, length xs > 3]` cost O(n²) even though it looks like one pass?",
    back: "length xs is recomputed once per element checked, and length itself is O(n), so an O(n) operation run n times gives O(n²). Computing length xs once, outside the loop, keeps it O(n) — identical output, very different cost.",
  },
  {
    front: "Why should a function do one and only one logical task?",
    back: "This is cohesion applied to functions: splitting \"compute\" from \"format\" (average vs reportAverage) gives each piece a clean, independently testable postcondition and lets the computed value (a Double) be reused anywhere a number is needed — not locked inside one formatted string.",
  },
  {
    front: "When is composing f after g (f . g) safe with respect to their preconditions?",
    back: "When g's postcondition guarantees f's precondition — not just when the types line up. head . sort type-checks either way, but only reasoning about preconditions predicts that head . sort [] crashes, since sort's postcondition never promises a non-empty result.",
  },
  {
    front: "A student's myReverse (x:xs) = myReverse xs only recurses, never conses x back. What does the failed inductive step reveal?",
    back: "The step derives myReverse (myReverse (x:xs)) = xs where the claim needed (x:xs) — a one-element gap at exactly the point of recursion. That mismatch points directly at the missing repair: myReverse (x:xs) = myReverse xs ++ [x].",
  },
  {
    front: "A function compiles, runs, and returns a wrong answer. Where's the fault, and what's the fix?",
    back: "Both compile-time gates already passed and nothing crashed, so the fault is in the formula itself, not the syntax or types. Return to the specification's postcondition and dry-run the failing input by hand — the first line of the trace that disagrees locates the faulty equation.",
  },
];
