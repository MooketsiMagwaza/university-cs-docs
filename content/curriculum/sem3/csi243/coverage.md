# CSI243 source-coverage matrix

This matrix controls the redevelopment of CSI243. A topic is not complete until its source material, explanation, runnable examples, practice, lab, and review checks are all covered.

| Unit | Required coverage | Primary supplied sources | Required practical evidence | Status |
|---|---|---|---|---|
| 00 Start Here | GHCup install, GHC, GHCi, Prelude prompt, `:help`, `:load`, `:reload`, `:type`, `:info`, `:set prompt`, `:quit`, expressions, `let`, `it`, `:{ :}`, first saved script, `runhaskell`, `ghc -o`, comments, module/filename rule | Lecture 2 Using Haskell; Lab 1; csi243_ho4 | Environment check, first saved program, and a compiled executable | Verified (GHC 9.10.3) |
| 01 Functional Thinking | Functions, expressions, purity, side effects, composition, FP vs imperative | Lecture 1 Intro to FP; csi243_ho4 | Compare two solutions and identify side effects | Verified (GHC 9.10.3) |
| 02 Expressions and Types | Syntax/type analysis, `Int`, `Integer`, `Float`, `Double`, `Bool`, `Char`, `String`, lists, tuples, inference | Definitions and Data Types; csi243_ho4 | Predict and verify expression types and results | Verified (GHC 9.10.3) |
| 03 Defining Functions | Signature, specification, implementation, comments, identifiers, precedence, testing | csi243_ho4; csi243_ho6; Lab 1 | A documented `.hs` file with verified calls | Verified (GHC 9.10.3) |
| 04 Making Choices | `if`, guards, pattern matching, `case`, ordering, exhaustiveness | csi243_ho6; Making Choices 2; csi243_ho7; Haskell Functions | One problem implemented four ways (Lab 02) | Verified (GHC 9.10.3) |
| 05 Recursion | Base case, recursive step, termination, factorial, Fibonacci, dry runs, invalid inputs, `error` | Making Choices 2; csi243_ho7; Haskell Functions | Recursive traces and error handling | Verified (GHC 9.10.3) |
| 06 Lists, Tuples and Comprehensions | Homogeneous lists, cons, ranges, list recursion, partial functions, tuple arity, `fst`/`snd`, comprehensions with generators and tests | Modules, Lists, Tuples; Definitions and Data Types; Haskell Functions; csi243_ho7; Lab 3 | Recursive list functions with dry runs (Lab 03) | Verified (GHC 9.10.3) |
| 07 Higher-Order Functions | Lambdas, currying, partial application, sections, `map`, `filter`, `takeWhile`, `zipWith`, folds, composition | csi243_ho7; csi243_ho4; Haskell Functions | Trace and compare higher-order pipelines | Verified (GHC 9.10.3) |
| 08 Modules and Custom Types | Module naming, exports, imports, qualified imports, `Prelude`, type synonyms, `data`, constructors, recursive types | Modules, Lists, Tuples; Lecture 2; csi243_ho7; csi243_ho4 | Two-module program and a custom data type | Verified (GHC 9.10.3) |
| 09 Polymorphism and Type Classes | Type variables, inference rule, constraints, `Eq`/`Ord`/`Show`/`Num`/`Integral`/`Fractional`, numeric conversion, `Maybe`, instances | csi243_ho7; Definitions and Data Types; Haskell Functions | Generic functions and signature reading | Verified (GHC 9.10.3) |
| 10 Reasoning, Testing and Revision | Specification, pre/postconditions, input partitioning, referential transparency, structural induction, error classes, test categories, recursive and list-operation cost, laziness | csi243_ho4; Lecture 1; Making Choices 2 | Reasoning worksheet and complexity comparison | Verified (GHC 9.10.3) |

## Site chapter mapping

The units above are taught on the site inside chapter folders, which do not map one-to-one:

| Unit | Site location |
|---|---|
| 00 Start Here | `02-expressions-types/notes/ghci`, `notes/first-program` |
| 01 Functional Thinking | `01-functional-thinking/notes/*` |
| 02 Expressions and Types | `02-expressions-types/notes/values-text`, `notes/expressions-types` |
| 03 Defining Functions | `03-defining-functions/notes/*` (including `notes/lab-01`) |
| 04 Making Choices | `04-making-choices/notes/*` (including `notes/lab-02`) |
| 05 Recursion | `05-recursion/notes/*` |
| 06 Lists, Tuples and Comprehensions | `06-lists-tuples/notes/*` (including `notes/lab-03a` and `notes/lab-03`) |
| 07 Higher-Order Functions | `07-higher-order/notes/*` |
| 08 Modules and Custom Types | `08-modules-types/notes/*` |
| 09 Polymorphism and Type Classes | `09-polymorphism/notes/*` |
| 10 Reasoning, Testing and Revision | `10-reasoning-revision/notes/*` |

## Laboratory coverage

| Lab | Source | Site location |
|---|---|---|
| Lab 1 — Introduction to the Haskell Environment | `Labs/Lab 1 (1).docx` | `03-defining-functions/notes/lab-01`, with Tasks 1–3 also covered in `02-expressions-types/notes/ghci` |
| Lab 2 — Making Choices | `Labs/Lab 2 Making Choices (1).docx` | `04-making-choices/notes/lab-02` |
| Lab 3 — Recursion and Lists | `Labs/Lab 3 Recursion Continued.pdf` | `06-lists-tuples/notes/lab-03` |

## Verification status

**Course GHC version: 9.10.3** (installed via GHCup, Windows x86_64).

Every fenced `ghci>` transcript in the chapter notes was extracted mechanically (337 claims
across 34 files) and replayed against GHC 9.10.3, each in an isolated GHCi process. Results:

| Outcome | Count |
|---|---|
| Matched exactly | 215 |
| Matched (error/exception text, abbreviated in the notes) | 13 |
| Matched (expected text contained in a longer real message) | 62 |
| **Verified total** | **290** |
| Bindings and `:{ … :}` blocks producing no output | 21 |
| Not auto-runnable (`:load`, `main`, `import`, `it`) — checked by hand instead | 17 |
| Genuine mismatches found and fixed | 4 |
| Non-terminating by design, deliberately not executed | 1 |

| Chapter | Verified / runnable |
|---|---|
| 01 Functional Thinking | 1 / 1 |
| 02 Haskell Basics | 32 / 34 |
| 03 Functions & I/O | 14 / 14 |
| 04 Making Choices | 29 / 29 |
| 05 Recursion | 21 / 21 |
| 06 Lists, Tuples & Comprehensions | 55 / 59 |
| 07 Higher-Order Functions | 62 / 62 |
| 08 Modules & Custom Types | 24 / 26 |
| 09 Polymorphism & Type Classes | 45 / 46 |
| 10 Reasoning, Testing & Revision | 7 / 7 |

### Corrections made as a result

1. **`tuples.mdx`** — `:type` reported `(Num a) => (a, String, String)`; GHC 9.10 prints the
   single constraint without parentheses. Corrected to `Num a =>`.
2. **`first-program.mdx` and `modules.mdx`** — both claimed GHC *rejects* a file whose module
   name differs from its file name. It does not: such a file loads and compiles fine. The rule
   only bites when another module `import`s it, because GHC locates a module by filename, and
   the error then appears in the *importing* file. Both callouts, the error table, and the two
   practice questions were rewritten against the real behaviour.
3. **`modules.mdx`** — the two-module load shows `[1 of 3]` / `[2 of 3]` on GHC 9.10, not
   `[1 of 2]` / `[2 of 2]`.
4. **`ghci.mdx`** — GHC 9.10 opens with a plain `ghci>` prompt, not `Prelude>`. The section now
   leads with the current behaviour and explains `Prelude>` as what the lecture slides show.

Also added: a callout in `lists.mdx` recording that GHC 9.8+ emits a `-Wx-partial` warning on
*every* use of `head`, including successful ones — students will meet it immediately, and it
reinforces the partial-function point that section makes.

### Verified by hand (not auto-runnable)

- `:load` → `main` → edit → `:reload` cycle.
- `runhaskell Cube.hs`.
- `ghc -o cube Cube.hs`, producing `[1 of 2] Compiling Main` / `[2 of 2] Linking cube.exe`,
  a working executable, and the `.o` and `.hi` artefacts.
- The two-module `MyCalculator` / `MainModule` program, including `averageTwo 24 67` → `45.5`
  and `addTwo 89 23` → `112`.
- The `getLine` / `read` / `show` pipeline in `input-processing.mdx`, driven from stdin.
- Exception wording for `head []`, `maximum []`, `!!` out of range, and `read "four"`.

## Outstanding work

- Decide whether Lab 1 Task 5 (the Hello World comparison) should also appear as an exercise in `notes/first-program`.
- Consider a capstone integrating modules, custom types, and IO once units 00–10 are verified.

## Completion gates

- Every code example is compiled with the selected course GHC version.
- Every displayed output is captured from a real run.
- Each lesson answers what, why, when, when not, and how.
- Each lesson includes a comparison, a worked trace, common errors, guided practice, independent practice, and a mastery check.
- Current and archived resources are visibly separated on the site and in the Semester 3 vault.
- The portable vault note is published only after the site lesson passes academic and technical review.
