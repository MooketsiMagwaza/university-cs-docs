export const flashcardData = [
  {
    front: "Why must a Haskell `if` always have an `else`?",
    back: "Because `if` is an expression, not a statement. It must evaluate to a value, and every value has a type. Without an `else` there would be no value when the condition is False.",
  },
  {
    front: "The two type rules for a conditional expression",
    back: "The condition must have type Bool, and both branches must have the same type, which is the type of the whole expression.",
  },
  {
    front: "How does Haskell pick which equation to use?",
    back: "Arguments are matched against the patterns sequentially from the top. The first equation whose pattern matches is used; the rest are not considered.",
  },
  {
    front: "Why must a variable pattern come last?",
    back: "A variable pattern matches any argument at all, so every equation below it is unreachable. List patterns from most specific to most general.",
  },
  {
    front: "The six kinds of pattern",
    back: "Literal (fac 0), variable (fac n), wildcard (isZero _), tuple (fst (x, _)), list (stW ['b', _, _]), and cons (head (x:_)).",
  },
  {
    front: "What does `(x:xs)` match?",
    back: "A non-empty list, binding x to the head and xs to the tail. Together with [] it forms the standard exhaustive split for any list.",
  },
  {
    front: "Why must cons patterns be parenthesised?",
    back: "Function application binds more tightly than any operator, so `tail _:xs = xs` is read as `(tail _):xs = xs` — a different, invalid meaning. Write `tail (_:xs) = xs`.",
  },
  {
    front: "What is an exhaustive set of patterns, and what happens without one?",
    back: "Every possible argument matches at least one pattern. Without one, the program fails at run time with a non-exhaustive patterns exception — not at compile time, unless -Wincomplete-patterns is enabled.",
  },
  {
    front: "Write the shape of a guarded equation",
    back: "functionName parameters, then no = sign, then indented lines each beginning with | condition = result, ending with | otherwise = defaultResult.",
  },
  {
    front: "What is `otherwise`?",
    back: "An ordinary Prelude name defined as `otherwise = True`. Because it always succeeds it acts as the catch-all, and so must be the last guard.",
  },
  {
    front: "Why does guard order matter?",
    back: "Guards are checked in the order listed and the first True guard supplies the result. A less restrictive guard placed first captures cases meant for a later one — the code compiles but is logically wrong.",
  },
  {
    front: "`where` versus `let`",
    back: "A where clause scopes over the whole equation including every guard, and is written after the body. A let ... in binds only within one expression and is not visible to guards.",
  },
  {
    front: "What can a `case` scrutinise that equation patterns cannot?",
    back: "Any expression — a calculation, a tuple, or a function application — not just the arguments as supplied. A case is also itself an expression, so it can sit inside a larger one.",
  },
  {
    front: "Syntax of a `case` alternative",
    back: "pattern -> result, read as 'should return'. Alternatives are aligned in one column, and `_` catches everything remaining. Note it is ->, never =.",
  },
  {
    front: "Which construct suits a base case of `n == 0` versus `n <= 1`?",
    back: "n == 0 is a literal, so pattern matching expresses it directly. n <= 1 is a range, and no literal pattern can express a range, so guards read best.",
  },
  {
    front: "What happens if every guard in an equation fails?",
    back: "Matching falls through to the next equation. Only if no equation applies does the program fail with a non-exhaustive guards exception.",
  },
  {
    front: "What does GHC report when the two branches of an `if` disagree in type?",
    back: "A compile-time type error, before anything runs — e.g. \"No instance for (Num String) arising from the literal 0\". `if` needs one single type for the whole expression, even though each branch's value is perfectly valid on its own.",
  },
  {
    front: "What does the `-Woverlapping-patterns` warning mean, and does it stop compilation?",
    back: "It flags an equation whose pattern can never fire because an earlier equation already matches every case it could. It is a warning, not an error — the module still compiles, and the wrong (earlier) equation still runs silently.",
  },
  {
    front: "What does `-Wincomplete-patterns` actually do, and what does it not do?",
    back: "It prints a compile-time warning naming the missing patterns, so a human notices the gap. It does not stop compilation, does not add the missing case, and does not prevent the run-time \"Non-exhaustive patterns\" crash if that case is ever reached.",
  },
  {
    front: "Why must `axisOf (0, 0) = ...` come before `axisOf (0, _) = ...`?",
    back: "`(0, 0)` also matches the more general pattern `(0, _)`. If the general tuple pattern came first it would intercept the origin case — tuple patterns need most-specific-first ordering exactly like literal patterns do.",
  },
  {
    front: "What does wrapping a two-argument function's name in backticks actually do?",
    back: "Nothing about the computation changes. `elem x ys` and `` x `elem` ys `` call the identical function on the identical arguments in the same order — backticks only move where the name is written, from before both arguments to between them.",
  },
  {
    front: "Quick decision procedure: if vs. patterns vs. guards vs. case?",
    back: "Two outcomes from one Boolean test → if. Distinct literals or structures → patterns. Ranges or compound conditions → guards. A computed value, or a decision needed mid-expression → case.",
  },
  {
    front: "In `isDiv m n`, why must `m == n` and `m < n` be guarded before the `mod` check?",
    back: "They are preconditions. Checking `m `mod` n == 0` first would divide in a case the specification never intended to reach that check — a precondition must always be tested before any guard whose body assumes it holds.",
  },
  {
    front: "In `bothEven`, why must `even m && even n` be tested before `even m || even n`?",
    back: "The `||` condition is also true whenever both numbers are even, so testing it first would wrongly report `1` for two even numbers. The most specific case must be tested first — the same ordering rule as patterns and guards generally.",
  },
  {
    front: "How should `->` be read inside a `case` alternative, and how does that differ from `=`?",
    back: "Read `->` as \"should return\"; it belongs to `case` alternatives (and later, lambdas). `=` defines an equation's whole right-hand side instead. Writing `=` in a case alternative is a parse error, not just a style slip.",
  },
];
