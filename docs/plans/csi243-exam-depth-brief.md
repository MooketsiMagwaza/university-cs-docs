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
- **Cover the topic, not only the words of the request.** The owner's standing complaint is that writers do exactly what is named and leave out what belongs beside it. For every topic add the variations of each construct, the sibling concepts a student meets next to it (the neighbouring functions, forms, types and classes an exam could ask about even though no one listed them), the other ways to write the same thing, and the questions asked about each. When in doubt, include it and say so in your report.
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

### Lane M: `Maybe`, `Either` and the standard types (CSI243-37)

Files: `content/docs/sem3/csi243/09-polymorphism/notes/maybe-in-depth.mdx`, `.../notes/either-in-depth.mdx` and `.../notes/maybe-either-exam-practice.mdx`. The existing `maybe-and-instances.mdx` introduces `Maybe` and the idea of replacing `error`; read it first. The owner's complaint: "explain stuff like `Maybe` etc. and `Either`, you never went into it properly". `Either` is not covered anywhere in the course, and `Maybe` is covered by one lesson that mixes it with instances. Go much further, without repeating.

`maybe-in-depth.mdx`: build the idea from the problem. Why a function sometimes has no answer (`head []`, division by zero, a missing key), why `error` and magic values like `-1` are poor answers, and how a type can say "an answer, or none". Then `data Maybe a = Nothing | Just a` read constructor by constructor, with the type `Maybe Int` against `Int` (and `Just 3 + 1` rejected, with GHC's message). A **template for writing a function that may fail** (the guard or pattern that detects failure, `Nothing` for it, `Just` for success) and at least **eight worked safe functions** with a runnable block each: `safeDiv`, `safeHead`, `safeTail`, `safeRoot`, `safeIndex`, a lookup in a table of pairs, the first even number in a list, parsing one digit. **Consuming** a `Maybe`: pattern matching, `case` (with guards), and the library functions, each with the definition written out, a template, a hand trace and at least three variations: `maybe` (the eliminator: `maybe 0 (+1)`, `maybe "none" show`), `fromMaybe`, `isJust`/`isNothing`, `fromJust` (and why it is dangerous), `catMaybes`, `mapMaybe`, `listToMaybe`, `maybeToList`. **Chaining** computations that may each fail: the nested `case` written out, then a hand-written helper (`andThen :: Maybe a -> (a -> Maybe b) -> Maybe b`) with traces, then `>>=` named as the library version; `fmap` and `<$>` on a `Maybe`; `Maybe` fields in a record (an optional value). How `Maybe` behaves with `Eq`, `Ord` and `Show` (`Just 3 < Just 4`, `Nothing < Just 0`, `show (Just (-3))`). A comparison table: `Maybe` against `error`, against a default value, against a list used as an optional value. Common errors with GHC's messages. End with at least ten exam questions answered in full.

`either-in-depth.mdx`: build `Either` from the problem `Maybe` cannot solve (saying **why** it failed). `data Either a b = Left a | Right b`, the convention (`Left` for the failure and its reason, `Right` for the success), read constructor by constructor, and `Either` as a plain choice between two types (a list of `Either Int String`). The **template for a validating function** and at least **eight worked functions** with a runnable block each: `safeDivE`, parsing an age with several distinct failure reasons, validating a password with several rules, a bank withdrawal that can fail for two reasons, a lookup that names the missing key, the square root of a negative number, checking a list is sorted and reporting the first bad position, reading a mark between 0 and 100. **Consuming** an `Either`: pattern matching, `case`, and the library functions with the definition written out, a template, a hand trace and at least three variations each: `either` (the eliminator: `either length negate`, `either show (map toUpper)`), `lefts`, `rights`, `partitionEithers`, `isLeft`/`isRight`, `fromLeft`/`fromRight`. **Chaining** failing steps: the nested `case`, a hand-written `andThenE`, the stop-at-the-first-error behaviour with a trace, and `>>=` named. Converting between `Maybe` and `Either` (`maybeToRight`, `rightToMaybe` written by hand). `Eq`, `Ord` and `Show` for `Either` (`Left 1 < Right 0`). When to choose `Maybe`, `Either` or an exception, as a table. Common errors with GHC's messages (mixing the two sides, a missing `Left`/`Right`, ambiguous types such as `Left 3` without a context). End with at least ten exam questions answered in full.

`maybe-either-exam-practice.mdx`: at least twenty exam questions across both types and the standard types, in the layout above: declare a function's type and write it; trace `maybe` and `either` calls; rewrite a `case` using `maybe`/`either` and back; chain three failing steps; say what `catMaybes`/`mapMaybe`/`partitionEithers` return for a given list; find the type error; choose `Maybe` or `Either` for a specification and justify; convert a function that uses `error` to use `Maybe`; a question on the other standard types: `Ordering` (`compare`, and `case compare a b of`), the unit type `()`, tuples as product types, `Bool` as a two-constructor type, with their `Eq`/`Ord`/`Show` behaviour. Each answered in full.

### Follow-on lanes V1 to V16 (from docs/plans/csi243-vault-gap-audit.md)

These lanes came out of the vault gap audit. Each creates one or two lessons; the audit file holds the coverage rows for each (search it for the lane id). Every concept gets the full pattern of section 2, the variations of each construct and the sibling concepts beside it (section 3). Placement in the sidebar is decided by the lead when wiring; ignore any sidebar sentence below that contradicts the chapter as it stands.

### Lane V1: arithmetic choices, numeric domains and conversions

Files: `content/docs/sem3/csi243/02-expressions-types/notes/arithmetic-by-example.mdx` and `content/docs/sem3/csi243/02-expressions-types/notes/arithmetic-exam-practice.mdx`.

Extend `expressions-types.mdx` and sit beside `values-text.mdx`, linking `09-polymorphism/notes/standard-classes.mdx`. Chapter 2 sidebar: after Expressions and Types, before Values, Names, Types, and Text; practice immediately after its lesson.

Cover precedence and associativity with full arithmetic/Boolean traces; construct expressions from prose; `div`/`mod` against `quot`/`rem` on all sign combinations; `divMod`/`quotRem` and their identities; `^`, `^^`, `**` and their domains; repeated addition/multiplication and the non-negative precondition of `squareByAdding`; `negate`, `abs`, `signum`, `subtract`, `recip`; `fromIntegral`, `toInteger`, conversion before division; `floor`, `ceiling`, `truncate`, half-to-even `round`; numeric annotations, defaulting and Int limits; approximate equality, absolute/relative tolerance, Infinity and NaN; `sqrt`, `log`, `exp`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, radians and domain restrictions. Separate type errors from undefined mathematical inputs and floating results. Do not imply exponentiation by a fractional power is exact or that every zero division raises an exception.

Minimum: three worked variations per operator/function/conversion, four per signed quotient/remainder operation and exponent family, including zero and negative cases; at least eighteen narrated exam questions, plus additional questions if needed to cover every concept. Repair the book/Test1 implication that `sum (replicate (fromIntegral n) n) == n*n` holds for negative n. Existing round and conversion examples should be referenced before adding genuinely different cases.

### Lane V2: designing recursive numeric algorithms

Files: `content/docs/sem3/csi243/05-recursion/notes/numeric-recursion-by-example.mdx` and `content/docs/sem3/csi243/05-recursion/notes/numeric-recursion-exam-practice.mdx`.

Extend `writing-recursive-functions.mdx` and `dry-running.mdx`. Chapter 5 sidebar: after Writing Recursive Functions, before Dry Running; put the new practice after Dry Running. Existing Rec_ and Lab1_ downloads are prerequisites and must not be re-created.

Cover the full specification-to-tests process for factorial variants, inclusive/exclusive sums, range sums with a stated reversed-bounds policy, `sumFac`, `cube`/`multTen` as simple starting specifications, signed multiplication by repeated addition, recursive power, exponentiation by squaring, Euclid `gcd` and derived `lcm`, decimal digit sum/count/reversal and Fibonacci with an accumulator. Distinguish one recursive call, changing both parameters, and repeated work in two branches. Keep domains and decreasing measures explicit; show equivalent if/guard/pattern definitions only where it helps a new algorithm, since conversion itself is covered. Cross-link V11 for the existing Either Fibonacci applicative expression, V12 for cost and existing proof pages for correctness.

Minimum: four worked variations per algorithm family, including zero, negative-domain policy and another recurrence or bound; at least twelve narrated exam questions. Include repair-a-base-case, derive-a-recurrence, dry-run-a-new-function and choose-an-accumulator tasks. Do not write another factorial induction lesson.

### Lane V3: designing recursive list functions and boundary cases

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/recursive-list-design.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/recursive-list-exam-practice.mdx`.

Extend `list-recursion.mdx`, `lab-03.mdx` and `lab-03a.mdx`. Chapter 6 sidebar: after List Recursion, before the Lab 03 lessons; practice immediately after the design lesson. Link existing List_ and Lab2_/Lab3_ downloads.

Cover each Recursion Continued question (`atPosition`, `largerY`, `positiveNumbers`, descending `isSorted`) with its signature, base/step, narrated dry run and test design. Add the 2026 `sums`, `multList` and `has` tasks; recursive count/select/transform, `take`, `drop`, `splitAt`, `takeWhile`, append/interleave, accumulator reverse and safe extrema. Use no-library restrictions where specified. Teach empty, singleton, unequal-list and strict/non-strict sortedness cases; preserve the original index through a helper; reject index equal to length. Explain when `head`, `tail`, `last`, `init` and `!!` demand missing data. Safe-result consumption is already covered in Maybe/Either; concentrate on deriving the recursive algorithm. Sorting belongs to V9.

Minimum: four worked variations per recursive shape and per original lab question, three per additional named function, at least fifteen narrated exam questions. Include negative/oversize take/drop counts, no matching elements, all matching elements and duplicate sorted values.

### Lane V4: the exact fold and zip laboratory, designed from first principles

Files: `content/docs/sem3/csi243/07-higher-order/notes/designing-folds-and-zips.mdx` and `content/docs/sem3/csi243/07-higher-order/notes/lab-04-folds-and-zips.mdx`.

Extend `folds-and-composition.mdx` and sit beside `zip-and-zipwith.mdx`; use `applying-by-hand.mdx` for tracing prerequisites. Chapter 7 sidebar: design after Folds and Composition; lab after Zip and ZipWith and More Higher-Order Functions.

Cover exact October Lab 4 Q1, Q2a-c and Q3, Lab 5 Q5, and textbook Appendix C. Derive the fold seed and combining function from recursive equations, including `sumsq` without `map`, product, length, conditional count, cube totals, `map` and `filter` as folds. Derive `ff`, `fmark`, the direct lambda formula and correct Int-to-Double conversion; generalise to three weights; dot product. Derive `zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]`, `fp`, the recursive case and all shortest-list stopping cases; contrast calling existing `zipWith3` with implementing the requested function. Include malformed arity, wrong operator argument, all-empty-only base case and partially printed output before a crash. State empty sums/products and negative n policy. Do not repeat the twenty already-covered higher-order tracing concepts.

Minimum: four worked variations per design concept and original lab question/subpart, three for each Appendix C adaptation; at least twelve narrated exam questions plus every original lab part as a fully answered task. Use a commented complete lab program and a normal/boundary/invalid test grid.

### Lane V5: type synonyms, parameter substitution and tiny parser values

Files: `content/docs/sem3/csi243/08-modules-types/notes/type-synonyms-in-depth.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/type-synonym-exam-practice.mdx`.

Extend `type-synonyms.mdx`. Chapter 8 sidebar: immediately after Type Synonyms, before Custom Types; practice after the new lesson. Cross-link data examples already at exam depth.

Cover `String`, `Pos`, `Board`, `Course`, `Assoc k v`, `Pair a` and `Parser a` through expansion, concrete instantiation, aliases built from aliases, parameter ordering, saturation and function signatures. Write keys/values/table operations and a few tiny character/digit parsers represented as functions returning a list of result/suffix pairs; show failure, one result, multiple results and leftover input. This is about reading/using the alias, not a new parser framework. Compare aliases with newtype/data through type-checking decisions; repair `data Course = (title, code, credits)`, undeclared parameters and recursive aliases. State correct import/export behaviour and defer its full module mechanics to V6.

Minimum: four worked variations per synonym shape, three per parser result shape/error, at least ten narrated exam questions. Include expand-a-type, infer-a-client-signature, model-a-domain, explain-no-extra-type-safety and repair-a-declaration tasks.

### Lane V6: modules, abstraction and real GHCi diagnostic sessions

Files: `content/docs/sem3/csi243/08-modules-types/notes/modules-and-abstraction-practice.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/module-debugging-exam-practice.mdx`.

Extend `modules.mdx`, `imports.mdx` and the tool work in `02-expressions-types/notes/first-program.mdx` and `ghci.mdx`. Chapter 8 sidebar: after Importing, before Type Synonyms; debugging practice immediately after the new module lesson.

Cover building and testing Geometry/MyCalculator-style core/client/test modules, filenames and hierarchical paths, `-i` search paths, `Main`, interpreted versus compiled execution and `.hi`/`.o` roles. Practise export lists, `T` versus `T(..)` versus selected constructors, explicit type-name scope, qualified/aliased imports, Prelude name clashes, cyclic dependencies and missing modules. Build an opaque stack or validated mark interface with representation invariants and smart constructors. Explicitly correct "types/synonyms cannot be hidden/are always exported": the importing module's source-level names are controlled by imports/exports, even when the compiler knows hidden types internally. Correct the implication that an unqualified import prevents qualified access. Explain the outline's parameterised module/functor term, distinguish it from Haskell `Functor`, and demonstrate Haskell's ordinary alternatives using function/type parameters rather than inventing module syntax.

The debugging lesson supplies complete GHCi sessions for `:browse`, `:show modules`, `:show paths`, `:!`, load/reload, `:break`, `:trace`, `:history`, `:list`, `:print` and `:force`; distinguish observation from forcing a lazy binding. Tie each command to an actual failing small program. Include tool-role questions from Lecture 2 rather than a catalogue alone.

Minimum: three worked variations per import/export/interface/tool concept and per debugger command, four distinct multi-file programs, at least twelve narrated exam questions. Flag the old module/type-synonym claims for the lead to correct in the existing lessons and their Q/R/CS; a new page must not leave contradictory review answers unreported.

### Lane V7: characters, codes and whole-string transformations

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/characters-and-data-char.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/character-exam-practice.mdx`.

Extend `02-expressions-types/notes/values-text.mdx`, `04-making-choices/notes/lab-02.mdx` and `08-modules-types/notes/imports.mdx`. Chapter 6 sidebar: after Lists and before Tuples; character practice immediately after the new character lesson.

Cover `ord`, `chr`, Unicode versus the ASCII subset, valid code-point domain, numeric escapes, newline/tab/backslash/quote escapes, `toUpper`, `toLower`, `isAscii`, `isUpper`, `isLower`, `isAlpha`, `isDigit`, `isAlphaNum`, `isSpace`, guarded `digitToInt`/`intToDigit` and predicate differences. Explain there is no empty Char; distinguish `' '` from `""`, space counting from whitespace counting, and the lecture's informal getCode/getChar operations from actual `ord`/`chr` and input action `getChar`. Build character and String normalisers, then `[String]` transformations with nested map. Repair the Currying slide's `map toUpper :: [String] -> [String]` mismatch. Do not repeat generic comprehension or safe Maybe design already covered.

Minimum: three worked variations per named function/escape family, including nonletters and boundary cases, four for String versus [String] transformations; at least twelve narrated exam questions.

### Lane V8: text and list library operations beyond the usual examples

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/text-and-list-library.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/list-library-exam-practice.mdx`.

Extend `lists.mdx` and sit beside the comprehension lessons; link the existing equality lesson for `nub`, `delete`, `group`, `isPrefixOf` and `lookup`. Chapter 6 sidebar: after List Comprehensions and its exam practice, before the lab lessons.

Cover `words`, `unwords`, `lines`, `unlines`, `intersperse`, `intercalate`, `find`, `findIndex`, `elemIndex`, `isSuffixOf`, `isInfixOf`, `stripPrefix` and `Data.List.transpose`. For each teach exact types, order, empty input and failure form. Contrast literal spaces with arbitrary whitespace, empty lines and final newline behaviour; show why split/join round trips can normalise information. Explain substring as `take count . drop start` under a stated policy, and the lecture's informal cat as `(++)`, not a missing standard function. Show rectangular and ragged transpose, and contrasts with the already-covered nested comprehension. Safe Maybe results and general concat/comprehension rules are prerequisites, not duplicate topics.

Minimum: three worked variations per function, four per split/join family including lost-information cases; at least fourteen narrated exam questions, including choosing a library operation, predicting exact text, composing two operations and repairing a type error.

### Lane V9: ordering algorithms, maps and sets

Files: `content/docs/sem3/csi243/07-higher-order/notes/sorting-and-merging.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/maps-and-sets-by-example.mdx`.

Extend the sorting examples in `08-modules-types/notes/imports.mdx` and sit beside `more-higher-order-functions.mdx`; extend existing List_InsertionSort/List_Merge downloads. Chapter 7 sidebar: Sorting and Merging after More Higher-Order Functions. Chapter 8 sidebar: Maps and Sets after Importing and the V6 module practice, before Type Synonyms.

The sorting lesson covers `sort`, `sortBy`, `compare` with a projected key, ascending/descending/stable ties, insertion/insertion sort, merge/merge sort and grouping after sorting to make frequency tables. Trace the algorithms and use Ord versus a supplied comparator correctly; do not repeat the equality lesson's generic group/nub/delete teaching. State when sorting changes the original order a question asks you to preserve. Cross-link V12 for cost rather than trusting the old branching heuristic.

The collections lesson covers qualified `Data.Map`/`Data.Set` from `containers`, association-list versus Map versus Set, immutable update, `empty`, `fromList`, `toList`, `lookup`, `member`, `insert`, `delete`, `size`, duplicate-key policy, Map keys/values and Set union/intersection/difference. Give concrete names and types for functions that share a name across modules. Correct the slides' unqualified "Map is unsorted" wording by distinguishing insertion order from ordered key traversal. Explain package availability without turning package installation into the lesson.

Minimum: three worked variations per sorting algorithm, comparator shape and named collection operation; at least eight narrated sorting questions and ten collection questions. Every search/update example includes absent and existing elements; every merge includes empty/unequal lists and ties.

### Lane V10: sequencing input/output and processing complete input

Files: `content/docs/sem3/csi243/03-defining-functions/notes/io-sequencing-and-loops.mdx` and `content/docs/sem3/csi243/03-defining-functions/notes/text-and-file-io-practice.mdx`.

Extend `input-processing.mdx`, `complete-program.mdx` and `output.mdx`; sit beside `lab-01.mdx`. Chapter 3 sidebar: after Input, Bindings, and Processing, before Where and Local Definitions; both new pages precede Lab 01.

Cover action/result types, `getChar`/`putChar`, `getLine`/`readLn`, leftover newlines, `do` final-expression rules, `let`/`<-`, `pure`/`return` versus exit, `(>>)`/`(>>=)` operational sequencing, `when`/`unless`, prompt-until-valid recursion and sentinel loops. Teach `mapM`, `mapM_`, `sequence` and `sequence_`, distinguishing a list of actions from executing them. Reuse existing safe parsers instead of reteaching Maybe/Either. Add exact `printf` formatting used by Test1 11 and distinguish that formatting from rounding a numeric value.

The second page covers `getContents`, `interact`, `readFile`, `writeFile`, `appendFile`, pure text processors composed with IO, and labelled success/error transcripts for two separate inputs. State newline/EOF behaviour, file overwrite/append behaviour and when lazy input is demanded. Provide tiny local input fixtures and deterministic pure checks. Include the suite's `sequence [IO Bool]`, `pure ()` and `exitFailure` use. All terminal examples need exact input and output; code requiring actual IO should be a plain fence if the site's interpreter cannot support it.

Minimum: three worked variations per action/combinator/control form, four complete input-processing programs and four file/whole-input programs; at least fourteen narrated exam questions across both lessons.

### Lane V11: the Functor, Applicative and Monad patterns behind existing code

Files: `content/docs/sem3/csi243/09-polymorphism/notes/functor-and-applicative-patterns.mdx` and `content/docs/sem3/csi243/09-polymorphism/notes/dependent-computation-patterns.mdx`.

Extend `maybe-and-instances.mdx` after the new Maybe/Either sequence. Chapter 9 sidebar: after Maybe/Either Exam Practice, before chapter revision. Link V6 for the unrelated module-functor terminology and V10 for effects.

Cover type constructors versus concrete types; generic `fmap` and its identity/composition laws; list/Maybe/Either comparisons and a hand-written Tree Functor instance; `pure`, `<$>`, `<*>` and lifting binary/ternary functions; type derivation and first-failure behaviour of the exact `fibonacci` Either expression in Test1 09. Contrast independent arguments combined applicatively with a next computation chosen from the preceding result using `>>=`. Give list branching/Cartesian application and list bind, name the relevant class relationships and show small do desugarings. Teach the general pattern and custom instance; existing Maybe/Either eliminators, safe functions, mapping and chains remain covered prerequisites. Do not imply Haskell Functor is a parameterised module or that Either accumulates every error by default.

Minimum: three worked variations per general operation/type context, four contrasts of independent versus dependent computation, at least twelve narrated exam questions, including type errors, missing wrappers, wrong sequencing and a custom-instance law check.

### Lane V12: accurate time and space reasoning

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/complexity-by-recurrence.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/complexity-exam-practice.mdx`.

Extend `complexity.mdx`; use `lazy-evaluation.mdx` as an already-covered prerequisite. Chapter 10 sidebar: immediately after The Cost of a Definition and before final revision questions; practice after the new lesson.

Cover operation counts, input-size definitions, base cases, linear/quadratic/logarithmic/exponential growth and two-input bounds. Derive factorial/length, naive and accumulator Fibonacci, slow/fast reverse, repeated factorial sums, insertion sort and merge sort. Include best/worst case, short-circuit searches, output-size lower bounds and the distinction between numeric arithmetic cost and a unit-cost assumption. Correct "one call means linear; two calls mean exponential": subproblem sizes and local work determine the recurrence. Use `T(n)=T(n-1)+c`, summation costs, halving and `2T(n/2)+O(n)` with worked solutions.

Explain auxiliary space versus result space, stack versus pending thunks, retained inputs, sharing and demand. Correct the unconditional claim that `[x | x <- xs, length xs > 3]` necessarily recomputes an invariant length for each element: state source-level/no-sharing cost separately from sharing/optimisation, and use changing suffixes for an unambiguous quadratic example. Reuse seq/foldl' teaching rather than proposing another strictness lesson. Provide a correction list for existing complexity Q/R/CS for the lead.

Minimum: four worked variations per recurrence family and per space-accounting pattern, at least fourteen narrated exam questions including "find the wrong complexity claim". No benchmark timing should substitute for a derivation.

### Lane V13: specifications, predicate logic and ambiguous requirements

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/contracts-and-predicate-logic.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/specification-exam-practice.mdx`.

Extend `specification.mdx` and the design process in `03-defining-functions/notes/defining-functions.mdx`. Chapter 10 sidebar: immediately after Specification, before Equational Reasoning; practice after the contract lesson.

Cover purpose/precondition/postcondition, domain/codomain versus valid/invalid subsets, partial versus total correctness and a decreasing termination measure. Translate "every", "some", "none", "only if", "if and only if", implication, XOR and De Morgan laws into Boolean predicates and `all`/`any`; include empty-domain/vacuous truth and quantified order. Compose contracts by checking the earlier postcondition against the next precondition. Use exact ambiguous lab requirements: invalid parity for an Int, divisor zero versus equality/order, index equal to length, square 0 specially defined as 1, negative range bounds and grade cut-offs. State assumptions before writing code and test each disjoint input partition. Add concrete comparison questions for functional/procedural/OO/declarative descriptions, markup versus programming and concurrency/optimisation benefits without promising automatic speed.

Minimum: four worked variations per contract/logical form, three for each ambiguity policy, at least twelve narrated exam questions. Include the exact ho7 homework proof that the factorial implementation equals the specified mathematical product, with the zero case, inductive product identity and termination stated separately. Existing positivity proofs do not discharge this claim. Give three correctness-to-specification variations (factorial, range product and shifted/double factorial) using the existing proof template. Other proof machinery and counterexample technique already covered are linked, not rewritten.

### Lane V14: an integrated grade-book practical and independent mock

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/grade-book-capstone.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/integrated-mock-practical.mdx`.

Sit beside `errors-and-testing.mdx`, using existing data, comprehension, Maybe/Either and module lessons as prerequisites. Chapter 10 sidebar: after all taught material and before Questions and Review; capstone before mock.

Build the exact Test1 16 model/core/report/application shape. Work through `Student`, safe `average`, `outcome`, `summary` and `classAverage`; distinguish an average of student means from pooling all marks when class sizes differ. Address no students, no marks, invalid marks, duplicate names, explicit weighting and classification boundaries. Derive the existing constructor-pattern comprehension and error/report paths without reteaching their syntax. Include a module-and-test layout, supplied TestSupport-style `assertEqual`, `assertTrue`, `assertApprox`, labelled failures, test-suite runner/exit status and the exclusion of intentionally broken examples. Explain supplied PowerShell as a way to run tests, not as another language to learn. Show that passing cases is evidence, not proof.

The mock supplies an unfamiliar but comparable dataset/domain, a timed practical and a written diagnostic component. Include a full mark scheme, independent starter, complete narrated answer, dry runs, tests, error repairs and a justified cost comparison. Existing chapter Q/R remain useful; the gap is integration under a single specification.

Minimum: three worked variations per integration decision (missing data, averaging policy, validation, module boundary and test oracle), four complete datasets including unequal student mark counts; at least ten narrated capstone questions and twelve independently attemptable mock questions with full answers.

### Lane V15: standard classes beyond recognising the class name

Files: `content/docs/sem3/csi243/09-polymorphism/notes/standard-class-exam-patterns.mdx` and `content/docs/sem3/csi243/09-polymorphism/notes/standard-class-exam-practice.mdx`.

Extend `standard-classes.mdx` and `type-classes.mdx`. Chapter 9 sidebar: after The Standard Type Classes, before the Maybe/Either sequence; the practice page follows the new class lesson.

Cover general `Ord` laws, compare/min/max, lexicographic tie decisions and consistency with Eq; `Show`/`Read` round trips, annotations supplied by context and malformed/ambiguous input; `Enum` methods `succ`, `pred`, `toEnum`, `fromEnum` and endpoint errors; `Bounded` independent from `Enum`, with enumeration requiring both constraints; an accurate numeric superclass map including Real/RealFrac and Floating, with method-driven constraint choices. Separate properties the compiler checks from laws an instance should satisfy; qualify laws for partial values and floating NaN rather than claiming every derived instance is mathematically lawful for every payload. Numeric calculation practice belongs to V1. The existing Eq lesson and handwritten/derived data instances are exam depth and must not be recreated.

Minimum: three worked variations per method/law/constraint decision, four contextual Read and enumeration-boundary cases, at least twelve narrated exam questions. Include a correction note for the existing simplified numeric class graph and unconditional equality/order law wording, for the lead to reconcile in Q/R/CS.

### Lane V16: operators, identifiers and legacy pattern repairs

Files: `content/docs/sem3/csi243/03-defining-functions/notes/operators-and-lexical-rules.mdx` and `content/docs/sem3/csi243/03-defining-functions/notes/operator-and-pattern-repairs.mdx`.

Extend the naming rules in `defining-functions.mdx` and sit beside `07-higher-order/notes/currying-and-sections.mdx`; link the current case/pattern lessons. Chapter 3 sidebar: after Defining Functions and before A Complete Haskell Program; repair practice immediately after the operator lesson.

Cover legal value/type/constructor/operator names, apostrophes and underscores, wildcard versus an underscore-prefixed binding, reserved words and source capitalisation mistakes. Define a symbolic operator with a signature, give `infixl`, `infixr` and non-associative `infix` declarations, parenthesise mixed operators and diagnose conflicting fixities. Use non-commutative examples so precedence and associativity change the result. Distinguish ordinary value operators from constructor operators beginning with a colon. Explain repeated variables cannot express equality inside one pattern and rewrite using a guard. Address ho7's legacy `n+k` syntax through the optional legacy extension and the recommended ordinary pattern/guard rewrite; arithmetic expressions are not general patterns. Point to existing section/lambda/negative-section teaching instead of repeating it.

Minimum: three worked variations per naming, operator and repair concept, four per fixity form and legacy-pattern repair; at least ten narrated exam questions, including parse versus scope versus type failures and a fully parenthesised reduction.

### Lane F4 to F9: Haskell file compilations for lanes V1 to V16

File format, naming and checks are those of Lane F (and the exact format in the prompt of each F bot). The families to write for each lane are in this table; a bundle (V6, V14) is a uniquely named subdirectory in both folders with an entry file `Main.hs`.

| Lane | New question-file name prefixes and concrete question families | Required paired practice / verification emphasis |
| --- | --- | --- |
| V1 | `Arith_SignedDivision_`, `Arith_DivisionPairs_`, `Arith_ExponentChoice_`, `Arith_Conversions_`, `Arith_FloatingDomain_`, `Arith_ExpressionTrace_` | All sign combinations; three power operators; conversions/ties; tolerance and non-finite results. Include the negative repeated-addition counterexample. |
| V2 | `Rec_DesignRange_`, `Rec_DesignMultiply_`, `Rec_DesignPower_`, `Rec_DesignEuclid_`, `Rec_DesignDigits_`, `Rec_DesignSumFactorials_`, `Rec_DesignFibAcc_` | New specifications and boundary policies beside existing Rec_ examples; compare algorithms on finite valid inputs. |
| V3 | `List_DesignIndex_`, `List_DesignThreshold_`, `List_DesignSorted_`, `List_DesignScale_`, `List_DesignTakeDrop_`, `List_DesignPrefix_`, `List_DesignInterleave_`, `List_DesignExtrema_` | Each lab question and every new list algorithm; explicit empty/singleton/negative-count/oversize cases; no duplicate Lab3 filenames. |
| V4 | `Hof_DesignSumSq_`, `Hof_DesignFold_`, `Hof_WeightedMarks_`, `Hof_ThreeListZip_`, `Hof_DesignDotProduct_`, `Hof_Lab04Integrated_` | Exact October Lab 4 parts and Appendix C adaptations; test every shortest-list case and mixed element types; Lab 5 fold-filter implementation. |
| V5 | `Alias_Expand_`, `Alias_Assoc_`, `Alias_Course_`, `Alias_ParserResult_`, `Alias_Repair_` | Alias expansion and instantiation, simple parser failures/suffixes, same underlying type versus distinct wrappers. |
| V6 | `Module_Export_`, `Module_AbstractStack_`, `Module_ValidatedMark_`, `Module_ImportRepair_`, `Module_GhciSession_` | Real multi-module question bundles, not several module headers in one .hs file. Put each bundle in a uniquely named subdirectory with core/client/test files in both folders. The question at the top identifies the entry file, load/build command and expected scope failures. Debugger commands belong in comments beside executable definitions. |
| V7 | `Char_CodePoint_`, `Char_Classify_`, `Char_DigitConversion_`, `Char_EscapeOutput_`, `Char_Normalise_`, `Char_CountWhitespace_` | Character versus String versus list of String, Unicode/ASCII boundary, spaces/tabs, guarded conversion and exact escaped output. |
| V8 | `TextList_Words_`, `TextList_Lines_`, `TextList_Join_`, `TextList_Search_`, `TextList_PrefixSuffix_`, `TextList_Substring_`, `TextList_Transpose_` | Exact newline behaviour, empty and ragged structures, missing search result and normalising versus lossless round trips. |
| V9 | `Sort_Comparator_`, `Sort_Insertion_`, `Sort_Merge_`, `Sort_Frequency_`, `Collections_Map_`, `Collections_Set_` | Stable ties and order, comparator types, duplicate map keys, immutable update and set algebra; record containers requirement and qualify shared names. |
| V10 | `IO_Character_`, `IO_Sequence_`, `IO_PromptLoop_`, `IO_Sentinel_`, `IO_WholeInput_`, `IO_FilePipeline_`, `IO_FormattedReport_` | Fixed input transcripts in question comments; deterministic pure-core self-tests in main where useful. File exercises use named small fixtures and a temporary output path inside their exercise directory; never assume interactive stdin during an automated run. |
| V11 | `Context_FunctorTree_`, `Context_Applicative_`, `Context_EitherFib_`, `Context_ListApplication_`, `Context_DependentBind_`, `Context_DoRewrite_` | General class patterns and custom instances; independent/dependent failure cases; compare rewritten definitions on the same inputs. Reuse, rather than replace, any Maybe/Either files from the concurrent lane. |
| V12 | `Cost_Recurrence_`, `Cost_Sort_`, `Cost_Reverse_`, `Cost_Sharing_`, `Cost_Space_` | Counted/instrumented pure models with stated cost assumptions; formula and derivation in comments. Do not assert exact allocation, optimiser behaviour or wall-clock timing from printed values alone. |
| V13 | `Spec_Domain_`, `Spec_Predicate_`, `Spec_Quantifier_`, `Spec_ContractComposition_`, `Spec_AmbiguousRequirement_`, `Spec_ParadigmComparison_`, `Proof_FactorialSpecification_` | Preconditions/postconditions and truth tables in question comments; executable Boolean checks including empty domains and contradictory requirements. Compare input partitions; do not turn an unsatisfied precondition into a fabricated result. |
| V14 | `Capstone_GradeBook_`, `Capstone_AveragePolicy_`, `Capstone_Validation_`, `Capstone_TestHarness_`, `Capstone_Mock_` | Multi-module bundles with an entry program and tests, as for V6; fixtures for empty/unequal groups and invalid data. Include tiny assertion helpers and success/failure reporting; demonstrate the suite runner without making PowerShell a Haskell exercise. |
| V15 | `Class_OrdLaw_`, `Class_ReadShow_`, `Class_EnumBoundary_`, `Class_BoundedEnum_`, `Class_NumericHierarchy_` | Generic class-method and law questions beside existing Poly_/Data_ files; avoid repeating already-covered Eq or handwritten data instances. Error questions leave invalid alternatives commented. |
| V16 | `Operator_Fixity_`, `Operator_Definition_`, `Operator_NameRepair_`, `Operator_Constructor_`, `Operator_LegacyPattern_` | Fully parenthesised expected reductions; legal operator declarations; ordinary Haskell rewrites of legacy n+k syntax. Keep any optional extension example isolated from portable examples. |
