# CSI243 exam depth: the brief for writers

This is the standing brief for writing or extending CSI243 lessons. It records the request of 2026-10-20 (work orders CSI243-25 to CSI243-34) and the teaching pattern that answers it. Read it all before writing.

## 1. Why

The request, nearly word for word:

- A lot of the material is **stated but not properly explained**. One example is nowhere near enough for a concept. Each concept needs **a template, an example question, and a full explanation all the way through**.
- `data` was mentioned and given **one** example per kind, yet assessments ask about it in many different forms.
- List generators and comprehensions do not have enough explanation or exam-style examples. **The current layout is not enough for the exams at all.**
- The syllabus is not known, so the coverage must be wide: many examples and many variations of each kind of question.
- Higher-order functions must be explained well enough that a student can **apply them by hand**.
- Lazy evaluation needs full examples, including `ones = 1 : ones` and `numsFrom n = n : numsFrom (n + 1)`, an explanation of non-strict evaluation, and infinite data structures.
- Polymorphism needs full examples of `a`, `[a]` and every other form, and `Eq =>` deserves a topic of its own, explained from start to finish.
- The students will also want every example as a **runnable Haskell file** with the question at the top, and a **blank file** with only the question in comments to try it themselves.

## 2. The exam-depth pattern

Every concept in a lesson is taught in this order. A concept is anything a question could be about: a function, a syntax form, a kind of type, a proof shape.

1. **Plain explanation.** What it is, what problem it solves, in a few sentences with no jargon left undefined.
2. **The template.** The general shape with placeholders, the way the `data` template and the proof template are written elsewhere. Say how to read each placeholder.
3. **Three or more worked variations.** Each differs from the others in a way an exam could vary: another type, an edge case (the empty list, a single element, zero), another shape of the same construct. For each: the code, the output, and a walk-through of why the output is that.
4. **An exam-style question.** Worded the way an exam words it, with marks if natural. Then the answer **with the reasoning from reading the question to checking the answer**: what is being asked and what command word it uses, what is given, which template applies, the solution step by step, and a check on a small input.
5. **Common errors.** The wrong code or the wrong output a student produces, the error message GHC gives, and the repair.
6. **Practice with answers.**

A lesson that covers six concepts therefore holds at least eighteen worked examples. That is intended. Do not compress it to look short.

### Layout of an exam-style question

Use this shape every time, so a student learns to expect it:

````mdx
### Exam question 3: counting the passes (4 marks)

Write a function `passes :: [Int] -> Int` that counts how many marks in a list are at least 50.
Use a list comprehension.

<details>
<summary>Worked answer, with the reasoning</summary>

<Steps title="Answering the question">
  <Step title="1. Read the question">
    The command word is "write", so the answer is a definition. The input is a list of `Int`, the output
    is one `Int`, and the method is fixed: a comprehension.
  </Step>
  <Step title="2. Plan">
    Keep the marks that are at least 50, then count what is kept. A comprehension with a test keeps them; `length` counts.
  </Step>
  <Step title="3. Solution">
    ```haskell
    passes :: [Int] -> Int
    passes marks = length [m | m <- marks, m >= 50]
    ```
  </Step>
  <Step title="4. Check">
    `passes [45, 50, 72]` keeps `[50, 72]`, so the answer is `2`. `passes []` keeps nothing, so it is `0`.
  </Step>
</Steps>

</details>
````

### Layout of a worked variation

Name what changed from the previous variation in one line before the code ("Same shape, but the list holds strings"). Then the code, the output, and the walk-through.

## 3. Repository rules

- You work in your own git worktree. **Edit only the files in your lane (section 6).** Do not run `git commit`, `git push`, `git checkout`, `git reset` or `git stash`. Do not touch `package.json`, any `meta.json`, any chapter `index.mdx` (the Overview), `cheat-sheet.mdx`, `review.mdx`, `questions.mdx`, `WORK_ORDERS.md`, or anything outside your lane. The lead wires those after reading your report.
- Write MDX in the style of the reference lessons:
  - `content/docs/sem3/csi243/07-higher-order/notes/zip-and-zipwith.mdx` (a short, complete lesson)
  - `content/docs/sem3/csi243/10-reasoning-revision/notes/proofs-of-programs-i.mdx` (the template and the worked-variations style)
  - `content/docs/sem3/csi243/10-reasoning-revision/notes/lab-proofs-of-programs-i.mdx` (solutions that narrate the whole thought process)
- Front matter has `title` (the lesson's name, no typed number) and `description` (one sentence).
- A lesson opens with a short paragraph, then `<LearningObjectives items={[ ... ]} />` (three to six), then optionally `<Prerequisites items={[ ... ]} />`. Sections are `## 1. Title`. It ends with `## Summary` (one `<Callout type="key" title="Remember">` with the points), then `## Check your understanding` (`<CheckQuestions>` holding three to six `<CheckQuestion question="...">answer</CheckQuestion>`). Do **not** end with a "Continue with" line; the lead adds it.
- Components you may use, and nothing else (they are registered globally; **never write an `import` in MDX**): `Callout` (types `note`, `tip`, `caution`, `mistake`, `key`, `analogy`; props `type` and `title`), `KeyTerm` (prop `title`), `Steps` and `Step` (prop `title` on each), `LearningObjectives`, `Prerequisites`, `CheckQuestions`, `CheckQuestion`, `HaskellTryIt`, `SiteDiagram` (a Mermaid flowchart for a diagram of ideas, never for code), and the HTML `details` and `summary` elements.
- No emojis. British spelling (recognise, behaviour, colour). Plain words. Do not write "as we all know" or filler.
- A heading never carries a typed number except the `## 1.` pattern for sections.

### MDX pitfalls that have broken pages before

- **Never pass program text as a JSX attribute** (`code="..."`, `initialCode={...}`). MDX removes the indentation of the lines inside the attribute and breaks any `main = do`. Put the program in a fenced block inside the tag.
- A `<HaskellTryIt>` has a blank line after the opening tag, the program in a ```` ```haskell ```` fence, a blank line, the output in a ```` ```text ```` fence, a blank line, and the closing tag:

  ````mdx
  <HaskellTryIt>

  ```haskell
  main :: IO ()
  main = print (sum [1..10])
  ```

  ```text
  55
  ```

  </HaskellTryIt>
  ````

- For a GHCi session add `session`: the first fence holds the commands, one per line, and the `text` fence holds the transcript with `ghci>` before each command.
- The `text` fence is **exactly what GHC prints**: no extra blank lines, no prompt for a program. If a program prints nothing, omit the `text` fence.
- Outside a code span or fence, never write a raw `<` or `{` in prose. MDX reads them as JSX. Say "less than" or put the symbol in backticks.
- Inside a table cell write `\|` for a pipe, including inside backticks.
- In a numbered list, indent a fence by the width of the number.
- Blank lines around every fence, every tag line and every `Step`.

## 4. How to check your work

You can run node scripts. **You cannot run `ghc` or `runghc`**: the sandbox denies the compiler's C toolchain. So:

1. Work out every expected output by reduction on paper, carefully, and write it in the `text` fence.
2. `node --no-warnings --experimental-strip-types scripts/scan-haskell-notes.mjs --file <part of your file name> --mismatches`
   runs every `haskell` fence of your page through the site's own in-browser Haskell interpreter and compares it with the shown output. **Every `HaskellTryIt` block must run and match.** A block that does not run in the interpreter would show an error on the site, so change the example (use a feature the interpreter supports: the scan tells you what it rejected) or, if the construct is the point of the lesson, show it in a plain `haskell` fence that is not inside `HaskellTryIt` and say in your report which block that is.
3. `node scripts/check-mdx.mjs <your file>` checks that the page compiles. Fix every error.
4. The lead then runs every block against the real GHC (`node scripts/verify-haskell-ghc.mjs <file>`) and sends you the mismatches. Expect one round of corrections.

Never write a claim about what GHC prints that you did not work out. When unsure, leave the example out.

## 5. What to report

Your final message, kept short, lists:

- the files you created or changed;
- for each lesson, the number of concepts, of worked variations, of `HaskellTryIt` blocks and of exam questions;
- the result of the scan and the MDX check;
- anything the interpreter would not run, and anything you were unsure about;
- the wiring you want from the lead: the order of your lessons in the sidebar, one-line Overview descriptions, and any flashcard or quiz questions you would add to the review page.

## 6. Lanes

Each lane lists the files it may create. A lane may also read anything in the repository.

### Lane P: proof patterns (CSI243-26)

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/proof-patterns.mdx` and `.../notes/lab-proof-patterns.mdx`.

Extend Proofs of Programs I so that it covers as many kinds of proof as any syllabus could ask. Keep the same proof layout (claim, induct on, base case, hypothesis, step, conclusion, a reason on every line) and the same thought-process steps as the lab. Do not repeat the proofs already in `proofs-of-programs-i.mdx` and its lab (`xs ++ []`, associativity, `reverse` twice, `fastReverse`, `sumTo`, `size`/`mirror` on trees, even and odd lists, `sum (xs ++ ys)`, `length (reverse xs)`, `map` fusion, `sumAcc`, `filter` over an append, `height (mirror t)`, `length (inorder t)`, `inorder (mirror t)`, `mapE`/`mapO`).

Cover, with a template and at least two worked proofs each:

- Numbers: factorial is positive, `2^n > n`, sum of the first `n` odd numbers is `n^2`, a Fibonacci property, divisibility, an inequality, a base case other than `0` (start at `1`), and **strong induction** (a hypothesis for every smaller value, needed for Fibonacci).
- Lists with Prelude functions: `take n xs ++ drop n xs = xs`, `length (replicate n x) = n`, `concat` and `map`, `elem` over an append, `last`/`init`, `and`/`or`, `maximum` over an append, `zip`/`unzip`, `length (zip xs ys)`.
- Folds: `foldr (:) [] xs = xs`, `map` defined with `foldr`, `foldr f z (xs ++ ys)`, `sum` by `foldr` equals `sum` by `foldl` for numbers (needs a generalised claim), and one fold-fusion law.
- Trees (`data Tree a = Leaf | Node (Tree a) a (Tree a)`): `mapTree` fusion, `preorder`/`inorder` length, `height` against `size`, `size t < 2 ^ height t`, binary-search-tree `insert` keeps the tree ordered and `member` finds what was inserted. Also a leaf-labelled tree (`data LTree a = LLeaf a | LBranch (LTree a) (LTree a)`) with `leaves = nodes + 1` style claim, and an expression tree (`data Expr = Num Int | Add Expr Expr | Mul Expr Expr`) where a simplifier preserves `eval`.
- Equivalence of two definitions of the same function (two ways to define `length`, `reverse`, `sum`, `elem`).
- Proof by cases inside a step (guards, `Maybe`, `if`), and a claim that needs **two** lemmas.
- Disproof by counterexample, and a "find the error" question with a flawed proof.
- Mutual recursion beyond the lesson: a pair of functions on a mutually recursive type, and `isEven`/`isOdd` on numbers.

The lab file holds twelve to fifteen tasks in the same seven-step narrated format as `lab-proofs-of-programs-i.mdx`, with the definitions block and the table of quotable results at the top. The lesson ends with an `## Exam questions` section of at least five questions in the layout above, spanning the kinds.

### Lane H: higher-order functions applied by hand (CSI243-27)

Files: `content/docs/sem3/csi243/07-higher-order/notes/applying-by-hand.mdx` and `.../notes/more-higher-order-functions.mdx`.

A student must be able to take a call such as `foldr (\x acc -> x + 2 * acc) 0 [1,2,3]` or `scanl (flip (:)) [] "abc"` and evaluate it with pencil and paper.

`applying-by-hand.mdx`: first a **tracing template** for any call (rewrite the call with the function's definition substituted, one reduction per line, with the equation used named on every line; for an operator or lambda, show the application as a substitution of the argument for the parameter). Then, for each of `map`, `filter`, `foldr`, `foldl`, `foldr1`, `foldl1`, `scanl`, `scanr`, `zipWith`, `zip`, `takeWhile`, `dropWhile`, `all`, `any`, `flip`, `curry`, `uncurry`, `(.)` and `($)`: the defining equations (labelled), then at least three traces that differ (an operator, a lambda, a partially applied function, a section, an empty list, a one-element list), each trace showing every substitution, with a **table of intermediate values** where it helps (for example the accumulator at each step of a fold). Show the differences in a `foldr` trace and a `foldl` trace of the same call with a non-commutative operator. Show a composition `(f . g) x` and `($)` traced. End with an `## Exam questions` section of at least eight questions in the layout above, each asking for a trace or for the result of a call, and each answered fully, including the type of the expression.

`more-higher-order-functions.mdx`: `iterate`, `concatMap`, `span`/`break`, `partition`, `zip3`/`zipWith3`, `scanl1`/`scanr1`, `until`, `replicate` used with them, and the idiom of a list of functions (`map ($ 3) fs`, `foldr (.) id fs`). Each: template, three variations, trace, common errors. End with a decision table "which higher-order function?" and four exam questions.

### Lane D: custom data types (CSI243-28)

Files: `content/docs/sem3/csi243/08-modules-types/notes/data-types-by-example.mdx` and `.../notes/data-types-exam-practice.mdx`. The existing `custom-types.mdx` stays as it is.

`data-types-by-example.mdx`: for each kind, the template and **at least three worked examples** with a runnable `HaskellTryIt` for each, drawn from different domains (a game, a bank, a library, shapes, a calendar, an expression language): enumerations (with `deriving (Show, Eq, Ord, Enum, Bounded)` and what each gives, with `[minBound .. maxBound]`, `succ`, `fromEnum`); constructors with fields; several constructors with different fields; records, accessors and update syntax; `newtype`; parameterised types (`data Pair a b`, `data Maybe' a`, `Either`-like types, `Tree a`); recursive types (a list, `data Tree a = Leaf | Node (Tree a) a (Tree a)`, a leaf-labelled tree, an expression tree with `eval` and `show`-like printing); mutually recursive types; and `instance Show` / `instance Eq` / `instance Ord` written by hand, including how derived `Ord` compares constructors with fields (constructor order first, then fields left to right). For every kind also show the functions over it with one equation per constructor, a partial function that fails (a missing constructor) and how GHC warns about it, and the common errors with GHC's messages.

`data-types-exam-practice.mdx`: at least twelve exam questions spanning every kind (declare a type for a description; write a function over a given type; trace a function on a value; say what `deriving` gives; write an instance; find the error; convert a record to positional form; design a type for a requirement), each answered in the layout above with the reasoning from reading to checking.

### Lane L: lazy evaluation and infinite data (CSI243-29)

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/lazy-evaluation.mdx` and `.../notes/infinite-data-structures.mdx`.

`lazy-evaluation.mdx`: what **non-strict** means (a function may return a result without evaluating every argument), against strict (eager) evaluation, with a table; the evaluation order Haskell uses (outermost first, only when a value is demanded, each expression evaluated at most once, which is sharing); **thunks** drawn step by step; a trace template for a lazy evaluation (write the expression, mark which argument is demanded, reduce the outermost call, show the unevaluated arguments as thunks); worked traces of `fst (1, undefined)`, `const 5 undefined`, `length [undefined, undefined]`, `take 2 (map (*2) [1..])`, `head (filter even [1..])`, `if` and the short-circuit of `&&` and `||`, a `where` binding that is never used, sharing with `let x = expensive in x + x`; what `undefined`/bottom is, and which expressions fail or loop; strictness with `seq`, `$!` and `foldl'` and why `foldl` builds a chain of thunks; lazy against strict for the same program; common errors; and an `## Exam questions` section of at least eight questions of the kinds "what does this print?", "does this terminate?", "which argument is evaluated first?", "trace this call lazily", each answered fully.

`infinite-data-structures.mdx`: start from the definitions a student will be asked about, with their full explanation and trace:

```haskell
ones :: [Int]
ones = 1 : ones

numsFrom :: Int -> [Int]
numsFrom n = n : numsFrom (n + 1)
```

Explain why `ones` is not a loop (it is a list whose tail is itself, a cycle in memory), why `take 3 ones` terminates and `length ones` does not, how `numsFrom 5` produces its elements one at a time, and what "productive" means. Then: `repeat`, `cycle`, `iterate`, `[1..]`, `zip [1..] xs`, `takeWhile` on an infinite list, `fibs = 0 : 1 : zipWith (+) fibs (tail fibs)`, the sieve of Eratosthenes for primes, and an **infinite tree** (`data Tree a = Leaf | Node (Tree a) a (Tree a)` with `infTree n = Node (infTree (2 * n)) n (infTree (2 * n + 1))`, and a function that takes the first `d` levels). For each: template, three variations, trace of the first few steps, what is safe to do with it (`take`, `takeWhile`, `zip` with a finite list, `!!`) and what loops (`length`, `sum`, `reverse`, `last`, printing the whole value). Include the interaction with folds (`foldr` on an infinite list can stop, `foldl` cannot). End with at least eight exam questions answered fully.

### Lane E: polymorphism and Eq (CSI243-30 and CSI243-31)

Files: `content/docs/sem3/csi243/09-polymorphism/notes/polymorphism-by-example.mdx` and `.../notes/eq-and-class-constraints.mdx`. Read the existing chapter 9 lessons first and do not repeat them; go further and wider.

`polymorphism-by-example.mdx`: type variables and how to **read** a polymorphic type: `a`, `[a]`, `[[a]]`, `(a, b)`, `a -> b`, `a -> a`, `(a -> b) -> [a] -> [b]`, `Maybe a`, `Either a b`, `[(a, b)]`. For each form: the template, at least three functions with that type (`id`, `const`, `fst`, `snd`, `swap`, `head`, `tail`, `length`, `reverse`, `map`, `filter`, `zip`, `flip`, `(.)`), what the type tells you the function **can** and **cannot** do (a function `a -> a` can only return its argument), instantiation (`length :: [a] -> Int` used at `[Char]`, at `[[Int]]`), how to **derive the most general type of an expression** step by step with unification (a template for it, then three traced examples such as `map fst`, `zip . map f`, `foldr (:) []`), writing a function for a given polymorphic type (three examples), the difference between **parametric polymorphism** (works for every type, `length`) and **overloading** (works for the types with an instance, `+`, `==`, `show`), and common errors with GHC's messages (rigid type variable, "Couldn't match expected type"). End with at least ten exam questions ("state the type of", "what does this type tell you", "write a function of this type", "why is this definition rejected"), answered fully.

`eq-and-class-constraints.mdx`: the whole of `Eq` from start to finish. What equality is and why not every type has it; the class (`==`, `/=`, the minimal definition); reading `Eq a =>` in a type (what the arrow `=>` means, "for every type `a` that has equality"); the functions that need it (`elem`, `notElem`, `lookup`, `nub`, `delete`, `group`, `isPrefixOf`, `==` on lists and tuples, `Maybe`) with at least three examples each of the common ones; deriving `Eq` and what it compares for enumerations, constructors with fields, records and recursive types; writing an instance by hand (a type with a custom notion of equality such as comparing a record by one field, or ignoring case) and the laws it should obey (reflexive, symmetric, transitive) with a counterexample for an instance that breaks them; several constraints (`(Eq a, Show a) =>`, `(Eq a, Ord a)`); how to **derive the constraint of a function** from its body (a template, then three traced examples); functions with no `Eq` (`Eq (a -> b)` does not exist, so `id == id` is rejected, and why); the error "No instance for (Eq T) arising from a use of `==`" with three causes and repairs; a short section pointing on to `Ord`. End with at least ten exam questions, answered fully.

### Lane C: list comprehensions (CSI243-32)

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/comprehension-templates.mdx` and `.../notes/comprehension-exam-practice.mdx`. Read the existing `list-comprehensions.mdx` first and do not repeat it; go further.

`comprehension-templates.mdx`: the **general template** `[ output | generator, generator, test, let binding ]` with a reading guide; then one section per shape, each with its template and **at least three variations**: one generator and an output expression; a test (guard); several tests; two generators (and the **order** in which values are produced: the last generator varies fastest, shown in a table); a dependent generator (`y <- [x .. 5]`); a pattern in a generator (`(a, b) <- pairs`, and how a failed pattern skips an element); `let` inside a comprehension; a nested comprehension (a list of lists, a matrix, a transpose); a comprehension over a string; the empty result and why; comprehensions that build tuples (pairs, triples, Pythagorean triples, `zip`-like); and a comprehension with a function call and with `if/then/else` in the output. For each variation: the output, a trace of how it is produced (a table of the generator values and which pass the test), and the **equivalent** written with `map`, `filter` and `concatMap`. Also: translate a comprehension to `concatMap` by the rule, common errors with GHC's messages, a comparison table with recursion and with the higher-order functions, and a section on when **not** to use a comprehension.

`comprehension-exam-practice.mdx`: at least fifteen exam questions in the layout above: what does this produce (with traces); write a comprehension for a specification; rewrite a recursive function as a comprehension and back; rewrite a comprehension with `map` and `filter`; count the elements produced without listing them; find the error; use two generators to build a table; write `factors`, `isPrime`, `perfect numbers`, `pythagorean triples`, `zip3`-like, `cartesian product`, `flatten`, `rotations`. Each answered in full.

### Lane F: examples as Haskell files (compilations)

Files: under `public/files/sem3/csi243/downloads/`: `completed-examples/` and `starter-code/` (create `.hs` files) and `README.md` listing them. Do not overwrite the three files already there (`FirstProgram.hs`, `FunctionPractice.hs`, `Lab01Solution.hs`, `Lab01Starter.hs`).

For every lab and topic, write pairs:

- `completed-examples/<Name>.hs`: starts with a block comment holding the **question** (exactly as a lab or an exam would word it), then the complete solution with comments that explain the thinking in a few lines ("Read the question", "Plan", the base case and the recursive case explained), then a `main` that prints the results of several test calls with the expected output in comments after each. The file must be a complete program that compiles with `ghc` and runs with `runghc`.
- `starter-code/<Name>.hs`: the **same question** in a block comment, the type signature of each function the question asks for, each with a body of `undefined` so the file compiles, and a `main` that calls the function on the test inputs with the expected output in comments. Nothing else: the learner writes the answers.
- For each question, **variations**: `<Name>V2.hs`, `<Name>V3.hs` with a different list, different data, a different condition or a different type, in both folders.

Sources: the lab sheets in `public/files/sem3/csi243/archive/labs/Haskell/` (Labs 1 to 6; the PDFs can be read with `python` and `pypdf`; `.hs` files there may hold the lecturer's code), the lab lessons in `content/docs/sem3/csi243/**/lab-*.mdx`, the practice questions in `content/docs/sem3/csi243/*/questions.mdx`, and the worked examples in the lessons. Cover recursion on numbers and lists, guards and pattern matching, list comprehensions, tuples, higher-order functions, custom data types, polymorphism and type classes, laziness, and proofs (a proof file holds the claim at the top, the definitions, the proof in a block comment, and a `main` that checks the claim on many inputs). Name files in a consistent way (`Topic_Question.hs`), keep each file under 120 lines, and list every file in `README.md` with its question in one line.

You cannot compile in your sandbox, so write each file with extreme care and keep programs simple enough that you are certain of the output. The lead compiles and runs every file and sends you the failures.

### Lane W: `where` and local definitions (CSI243-35)

Files: `content/docs/sem3/csi243/03-defining-functions/notes/where-and-local-definitions.mdx` and `.../notes/where-exam-practice.mdx`. The existing lessons mention `where` only in passing (`guards.mdx` uses it about twenty times without a lesson of its own). Read `defining-functions.mdx` and `guards.mdx` first and do not repeat them; go much further.

The owner's request: "explain `where` wayyy more, with way more examples". Aim for the most thorough treatment of `where` in the course.

`where-and-local-definitions.mdx`: the **template** (`f args | guard = ... | otherwise = ... where name = expression`) with a reading guide; then one section per use, each with at least **four worked variations** from different domains and a runnable `HaskellTryIt` for each: naming an intermediate value (BMI, discriminant of a quadratic, Heron's formula); sharing a value used in several guards; local helper **functions** with their own parameters; **pattern bindings** (`(q, r) = n \`divMod\` 10`, `(x:_) = xs`); several bindings that refer to each other (order does not matter); nested `where` (a `where` inside a local function); `where` shared by all guards of ONE equation and not visible in another equation of the same function (show the "Variable not in scope" error and the repair); `where` and a parameter of the same name (shadowing, with a warning); a `where` binding that is never used and never evaluated (laziness); `where` against `let ... in` (side by side: where is attached to an equation, let is an expression; convert each way; where `let` is needed, such as inside a guard's expression or a lambda); `where` against a top-level helper (when to promote); and the **layout** rules (the indentation of `where` and of its bindings, one-line forms with braces and semicolons). For each variation: a trace of the evaluation showing when the `where` bindings are computed (on demand, once), and the rewrite without `where`.

Also: the scope diagram (a SiteDiagram or a table of which names each part of an equation can see), common errors with GHC's messages (parse error on input, not in scope, the binding in the wrong equation, tabs), and a comparison table with `let`, with guards, with top-level definitions.

`where-exam-practice.mdx`: at least fifteen exam questions in the layout above: what does this evaluate to (with `where` values traced); rewrite using `where` to remove repetition; rewrite a `where` as `let ... in` and back; add a `where` helper to a recursive function; find the scope error; predict the output when a `where` binding shadows a parameter; write a function from a specification using `where` (grade bands, tax brackets, a simple interest calculator, digits of a number, quadratic roots with the discriminant); fix the indentation; explain why a `where` binding is not evaluated. Each answered in full.

### Lane K: `case` expressions (CSI243-36)

Files: `content/docs/sem3/csi243/04-making-choices/notes/case-by-example.mdx` and `.../notes/case-exam-practice.mdx`. The existing `case-expressions.mdx` stays as it is; read it first and go much further, without repeating it.

The owner's request: "explain `case` with way more examples". Aim for the most thorough treatment of `case` in the course.

`case-by-example.mdx`: the **template** (`case expression of pattern -> result; pattern -> result`) with a reading guide, and the rule that the **first matching alternative wins**. One section per kind of scrutinee, each with **at least four worked variations** and a runnable `HaskellTryIt` for each: `Bool`; `Int` and `Char` literals; tuples (single and nested, and the idiom `case (x > 0, y > 0) of`); lists (`[]`, `[x]`, `[x, y]`, `(x:xs)`, `(x:y:rest)`); `Maybe` (`case lookup key table of`); `Ordering` (`case compare a b of LT -> ...`); strings; user-defined enumerations and types with fields; nested patterns; wildcards; as-patterns (`all@(x:_)`); guards inside an alternative and the fall-through to the next alternative when all guards fail; `where` bound to the whole equation against a `let` inside an alternative; `case` nested inside `case`; `case` as an expression inside a larger expression (`1 + case ...`), as an argument, and in a `let`. **Guards in case alternatives get a section of their own** (owner: "make sure in case the guards are properly explained"). It has: the template `pattern | guard1 -> result1 | guard2 -> result2 | otherwise -> result3` and a reading guide; the rule that guards are tried top to bottom and the first `True` wins; that the variables bound by the pattern are visible in the guards; why `otherwise` is just `True`; the **fall-through** (when the pattern matches but every guard is `False` and there is no `otherwise`, matching continues with the NEXT alternative, shown with a trace where the first alternative's pattern matches and all its guards fail); `->` in a case guard against `=` in a function-equation guard (a side-by-side table and the error GHC gives when they are mixed up); at least **six worked variations**, each with a runnable block: classifying a number with a variable pattern (`n | n < 0 -> ... | n == 0 -> ... | otherwise -> ...`), a tuple pattern with guards, a list pattern with guards (`(x:_) | x > 0 -> ...`), `Maybe` with guards, a user-defined type with guards, and guards that call a function or use a `where` binding of the whole equation; **pattern guards** (`| Just v <- lookup k table -> ...`) combined with Boolean guards; a guarded function rewritten as `case` with guards and back; non-exhaustive guards (what crashes, the run-time text, how to repair); and the common errors (using `=` instead of `->`, a guard that is not Boolean, a missing catch-all, guards indented wrongly) with GHC's messages. The exam-practice lesson has at least six questions that are specifically about guards inside `case` (including one that needs the fall-through traced).

Then: the four ways to say the same thing (`if`, guards, multiple equations, `case`) with the same specification written all four ways and a conversion rule in each direction; **order and overlap** (a general pattern before a specific one makes the specific one unreachable, and GHC warns); **non-exhaustive patterns** (the run-time error text, the compile-time `-Wincomplete-patterns` warning, how to repair it); layout and the one-line form with braces and semicolons; common errors with GHC's messages (missing `of`, bad indentation, a pattern of the wrong type, a guard that is not Boolean, mixed result types). For each variation: a trace of the matching, top to bottom, saying which alternative matches and why the earlier ones do not.

`case-exam-practice.mdx`: at least fifteen exam questions in the layout above: what does this evaluate to (with the match traced); rewrite a function with multiple equations as a `case` and back; rewrite nested `if` as `case`; complete the missing alternatives; find the non-exhaustive pattern and give an input that crashes it; write a function from a specification using `case` on a tuple, a list, a `Maybe` and a user-defined type; predict the output when two alternatives overlap; fix the layout; say which alternative matches for a given value. Each answered in full.
