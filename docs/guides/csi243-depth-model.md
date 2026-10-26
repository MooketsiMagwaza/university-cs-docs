# How CSI243 reaches exam depth, and what CSI247 must copy

Notes made on 2026-10-26 after the owner said CSI247 is "way lighter" than CSI243 and has "way less understanding and grasp of concepts". They record how CSI243 is built, with measurements, so that CSI247 (and any later course) can be built the same way. The standing sources are the brief [docs/plans/csi243-exam-depth-brief.md](../plans/csi243-exam-depth-brief.md) (the writers' instructions), the gap audit [docs/plans/csi243-vault-gap-audit.md](../plans/csi243-vault-gap-audit.md) and the [content standard](../content-standard.md). This file is the summary and the translation to Java.

## 1. The measured gap

Measured on `main` plus the CSI247 branch (2026-10-26).

| Measure | CSI243 | CSI247 |
|---|---|---|
| Lessons in `notes/` | 96 | 58 |
| Text in the notes | 3.7 MB | 0.5 MB |
| Runnable examples (`HaskellTryIt`, `JavaTryIt`) | 2,562 | 7 |
| Worked exam questions (`### Exam question`, each with the four-step answer) | 784 | 0 |
| `Steps` blocks (worked reasoning) | 820 | 7 |
| Check-your-understanding questions | 263 | 86 |
| Cheat sheets | 10 of 10 chapters (6 to 10 KB each) | 2 of 13 before this work |
| Flashcards | 251 | 187 |
| Quiz questions | 424 | 193 |
| Downloadable runnable files (question at the top, completed and starter) | about 1,300 files in `public/files/sem3/csi243/downloads` | 0 |
| Chapters 11 to 13 (hash tables, trees, graphs) | n/a | 3 KB each, one lesson |

A single CSI243 concept lesson such as `case-by-example` is 66 KB: 20 `##` sections, 98 `###` worked variations, 74 runnable examples, 17 exam questions. The whole CSI247 sorting and searching chapter, the deepest one, is 168 KB; hash tables, trees and graphs are 3 KB each.

The difference is not length for its own sake. CSI247 states each idea once, with one example. CSI243 teaches each idea as a template, several variations that each change one thing, an exam question answered out loud, and the mistakes people make.

## 2. The five layers

Depth in CSI243 comes from five kinds of page that work together. A chapter is not finished until every layer exists.

| Layer | File | What it does |
|---|---|---|
| 1. Teach by example | `notes/<topic>-by-example.mdx` and the older `notes/<topic>.mdx` | Explains the idea, gives the template, then many worked variations and one exam question per section |
| 2. Exam practice | `notes/<topic>-exam-practice.mdx` | A lesson that is only exam questions, each with a four-step worked answer |
| 3. Cheat sheet | `cheat-sheet.mdx` | A lookup page: placeholders, a template and one example per idea, the mistakes, the costs |
| 4. Review | `review.mdx` plus `content/flashcard-data` and `content/quiz-data` | Flashcards that test distinctions, a quiz with a reason for every wrong option, and "Decoding the questions" |
| 5. Practice and files | `questions.mdx` and `public/files/<course>/downloads` | Marked questions with model answers, and every example as a file the student can open and run: a completed version and a starter with only the question |

Behind them sits a **gap audit** (the vault coverage matrix: every lecture, handout, lab and past test mapped to the lesson that covers it, with the sibling concepts nobody listed). The audit decides what to write; the layers are how to write it.

## 3. Anatomy of a by-example lesson

Take `04-making-choices/notes/case-by-example.mdx` as the model. It is built from the same parts every time.

1. **One opening paragraph** that says what a complete exam answer must contain and how this lesson extends the earlier one. Then `LearningObjectives` (three to six verbs) and, where needed, `Prerequisites`.
2. **A template section first.** The general shape with placeholder names, then one sentence per placeholder saying how to read it. Then a **tracing template**: a numbered list, in a `text` block, of the steps to follow to apply the construct to any input ("identify the scrutinee, try the first pattern, record the bindings, try the guards in order..."). The student learns a procedure, not only examples.
3. **One `##` section per concept**, numbered (`## 6. Maybe and lookup`). A concept is anything a question could be about: a construct, a data shape, a kind of mistake. Each section opens with two or three sentences of plain explanation and its own small template.
4. **`###` worked variations**, three to six per concept. Each is named for **what changes** from the one before ("A present payload", "An absent payload", "A successful lookup", "A missing lookup"). Each has the code with the question in a comment, the exact output, and a two-line walk-through of **why** the output is that. The variations are chosen the way an examiner varies a question: another type, the empty case, one element, the boundary, the other branch.
5. **`### Exam question: <what it tests>`** at the end of each concept section, worded as an exam words it, with marks. The answer is in a `details` block ("Worked answer, with the reasoning") holding a `Steps` block of four steps:
   1. *Read the question*: the command word (write, trace, explain, state), what is given, what is asked.
   2. *Plan*: which template applies, and the idea of the solution in a sentence.
   3. *Solution*: the code.
   4. *Check*: run the answer by hand on a small input and on the edge case.
6. **A `mistake` callout ("Common error")** right after the exam question: the wrong code a student writes, the message the compiler gives, and the repair.
7. **Cross-cutting sections** near the end: "the same specification written four ways", "order, overlap, completeness and layout", "errors to recognise". These are where the exam asks you to convert or to find a fault.
8. **`## Summary`** (one `key` callout, "Remember", the whole lesson in a paragraph) and **`## Check your understanding`** (five `CheckQuestion` items that test distinctions, not definitions).

Sizes to expect: 14 to 33 `##` sections, 60 to 120 `###` variations, 30 to 90 runnable examples and 8 to 57 worked answers per lesson. A concept with fewer than three variations is not finished.

## 4. Anatomy of an exam-practice lesson

`case-exam-practice.mdx` (30 KB, 20 questions) has no teaching. It opens with **how to earn the marks** (what a marker looks for: the trace, the bindings, the final value), then groups questions by theme (`## Guards inside case: nine questions`), then lists the errors to check before handing in, then a summary and check questions. Every question has the same four-step answer as above. The questions mix the forms an exam uses: write from a specification, trace, repair, convert one form to another, complete a partial answer, explain why something is rejected.

## 5. Anatomy of the cheat sheet

`05-recursion/cheat-sheet.mdx` is the model: a **placeholder table first** (every name used in the templates, with an example), then one section per idea, each with a **Template** and **Example** (code and output) and one line on the mistake to avoid; a comparison table where two forms compete; a table of the checks; the cost. There are no long explanations; it links back to the notes. The CSI247 cheat sheets added on 2026-10-26 follow this shape and take every output from a real run.

## 6. How it is written and checked

The depth is only trustworthy because of the process around it.

- **Plan from the course material.** The gap audit lists, for every lecture, handout, lab and past test, the lesson that covers it and the sibling concepts next to it. The owner's biggest complaint is that writers do exactly what is named; the audit is the cure. A topic named in a request (`where`) always brings its siblings (`let ... in`, guards, `case`).
- **A brief and a lane.** The brief says what a lesson contains and how to lay it out. Each lane owns its own files, so writers never edit the same file.
- **Every claim comes from a run.** Each Haskell block is checked against the real GHC (`npm run verify:haskell`) and run in the site's interpreter (`npm run scan:haskell`); a mismatch is corrected and the check repeated, at most three rounds. Proof claims are tested over hundreds of lists and trees. Nothing is written about what the language prints without running it.
- **Integrate and wire.** `meta.json` order, the chapter Overview table, the "Continue with" lines, then the cheat sheet, review and practice pages.
- **Files for every example.** One generator makes a completed `.hs` file (the question in a block comment at the top, the solution, `main` with the expected output in comments) and a starter file (the same question and tests, the answer replaced by `undefined -- Your answer here`). A checker compiles every completed file and type-checks every starter.
- **Voice.** Plain words, British spelling, no emojis, no filler. Local names. A template is always shown before its examples.

## 7. Translating the model to Java for CSI247

| CSI243 | CSI247 |
|---|---|
| Template with placeholders | The same, for a class, a method, a loop, a data-structure operation, with `Type`, `name`, `condition` as placeholders |
| Tracing template (reduction steps) | **Trace tables** (loop and recursion), **memory diagrams** (references, objects, linked structures), and the pointer-by-pointer steps for lists and trees |
| Worked variation = one change from the last | The same: another type, the empty collection, a single element, the first and last index, duplicates, sorted and reverse-sorted input |
| `HaskellTryIt` with the shown output | `JavaTryIt` (one `public class Main`, no input; the runner is limited, see TRY-08), or a plain `java` fence with its `text` output when the program cannot run in the browser |
| GHC says "Couldn't match type" | `javac` says "incompatible types" or "cannot find symbol"; show the real message from a real compile |
| Reduce an expression by hand | Trace a method call by hand; draw the state of memory after the code |
| `.hs` completed and starter files | `.java` completed and starter files with the question at the top; a starter has the method signature and `// TODO`; tests print expected values in comments |
| Checked with GHC 9.10 | Checked with `javac --release 8` and `java`; `node scripts/verify-csi247-listings.mjs` does this for the lessons |

Java-specific rules: a worked example is a complete class with `main` whenever the idea allows it (fragments hide the imports and the class they need); never rely on `HashMap` or `HashSet` iteration order in a shown output (copy to a `TreeMap` or sort); use Java 8 (`Arrays.asList`, not `List.of`; no `var`); show the exact exception message and stack-trace first line for the error cases.

Exam questions in CSI247 are of a few fixed forms, and each should have its own template and several worked variations: *trace this method*, *draw the state of memory*, *determine T(n) and the Big-O*, *show the array after each pass*, *write a recursive version*, *valid or not valid? / what is the output?*, *write the method for this specification*, *find and fix the bug*.

## 8. What each CSI247 chapter needs

The concept lists below are the starting point for the CSI247 gap audit. They are what an examiner could ask about, not what the current notes cover. Each concept gets the section pattern of section 3; each chapter gets a by-example lesson (or several), an exam-practice lesson, a cheat sheet, a fuller review and practice page, and the downloadable files.

| Chapter | Concepts to teach by example (with variations) | Exam forms |
|---|---|---|
| 01 Java fundamentals | types and conversion; operators and precedence; integer division and casting; `if`, `switch` (fall-through); `while`, `for`, for-each; nested loops; arrays and 2D arrays; methods, parameters (pass by value), returns, overloading; `String` methods; `Scanner` and files; exceptions | trace a loop, predict output, find the bug, write a method |
| 02 Recursion | counter, array, string and range recursion; two base cases; branching (`fib`); accumulators; mutual recursion; backtracking; recursion to loop and back; stack overflow | trace table, convert, write recursive version, count calls |
| 03 Time complexity | counting steps for 30 loop shapes; nested and dependent loops; halving; recurrences for divide and conquer; best, worst, average; amortised; space | determine T(n), simplify to Big-O, compare algorithms |
| 04 Sorting and searching | every algorithm on sorted, reversed, duplicate and single-element input; stability; passes and comparisons counted; `Comparator` chains; library sorts | show the array after each pass, count comparisons, choose an algorithm |
| 05 Packages | package and import forms; static imports; compile and run with `-d` and `-cp`; name conflicts; access across packages | folder layout, command lines, diagnose the error |
| 06 OOP | constructors and chaining; access modifiers; `static`; overriding and overloading; dynamic dispatch; abstract classes and interfaces (default methods); `equals`, `hashCode`, `toString`; casting and `instanceof`; composition; UML | valid or not valid, what is the output, draw memory, write the class |
| 07 Generics | generic classes, methods, interfaces; bounds; wildcards (`? extends`, `? super`); erasure and its limits | write the generic method, why does this not compile |
| 08 Collections | `List`, `Set`, `Map`, `Queue`, `Deque`; iterators and `ConcurrentModificationException`; `Collections` utilities; sorting collections; choosing a collection | choose and justify, trace operations, fix the bug |
| 09 Linked lists | insert and delete at each position; dummy head; tail pointer; reverse; middle; cycle; merge two sorted lists; doubly and circular lists | pointer-by-pointer trace, write the method, memory diagram |
| 10 Stacks and queues | array and linked implementations; circular queue; deque; priority queue; brackets, postfix, infix to postfix; next greater element | trace the contents, write the class, apply to a problem |
| 11 Hash tables | hash functions; chaining and probing (linear, quadratic, double hashing); deletion; load factor and rehash; `equals`/`hashCode`; `HashMap` use | insert a key list into a table, count probes, write `hashCode` |
| 12 Trees | binary tree vocabulary; all four traversals; BST search, insert, delete; height, size, leaves; balance and rotations (check the syllabus); heaps (check the syllabus) | traverse, build a BST from a list, delete, count |
| 13 Graphs | representations; BFS and DFS traces; components; cycles; topological order; shortest paths (check the syllabus) | trace a search, build the representation, choose an algorithm |

**Check the syllabus before writing.** The vault lists lectures 1 to 13 ending at the Java Collection Framework; chapters 9 to 13 come from the course outline and `Data Structures Full Notes.pdf`. Audit `C:\Users\Nido\Desktop\Semester_3_Vault\Current\CSI247` (lectures, the outline, the full notes, quizzes, labs) the way the CSI243 gap audit did, before deciding how deep the later chapters go.

## 9. Order of work

1. Write the CSI247 gap audit (`docs/plans/csi247-vault-gap-audit.md`) from the vault, and a brief (`docs/plans/csi247-exam-depth-brief.md`) that adapts sections 2 to 7 of the CSI243 brief to Java.
2. Cheat sheets for all 13 chapters (done for 02, 03, 04, 05, 09, 10, 11, 12, 13 on 2026-10-26; 01, 06, 07, 08 follow).
3. By-example and exam-practice lessons, chapter by chapter, starting with the thinnest: 11, 12, 13, then 02, 03, 09, 10, 07, 08, 06, 01.
4. Review and practice pages brought up to CSI243's size: flashcards that test distinctions, quiz questions with a reason for every wrong option, practice questions with marks and model answers.
5. Downloadable `.java` files (completed and starter) for every example, with a checker like `verify-haskell-files.mjs`.
6. A depth rule in the audit: report any concept section with fewer than three examples, and any chapter without a cheat sheet, an exam-practice lesson or downloads.
