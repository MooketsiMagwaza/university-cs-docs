# CSI247 exam depth: the brief for writers

This is the standing brief for writing or extending CSI247 lessons (work order CSI247-14). It is the Java counterpart of [csi243-exam-depth-brief.md](csi243-exam-depth-brief.md): the teaching pattern is the same; the tooling, the exam forms and the lanes are Java's. Read it all, then [docs/guides/csi243-depth-model.md](../guides/csi243-depth-model.md), the coverage rows for your chapter in [csi247-vault-gap-audit.md](csi247-vault-gap-audit.md), and the exemplar lesson `content/docs/sem5/csi323/03-hash-tables/notes/hash-tables-by-example.mdx` (18 complete programs, 4 exam questions with four-step answers, common-error callouts). **Copy its shape.**

## 0. Scope rule (owner, 2026-11-02)

**The lecture slides and the lab sheets are the entire course scope.** That is every file in `C:\Users\Nido\Desktop\Semester_3_Vault\Current\CSI247\Lectures` (`Lec01` to `Lec16`, and `Lab07 - generics-1.pdf`) and in `...\Resources\Labs` (Labs 2 to 8), plus Lab 1 (in `...\Revision`). The owner confirmed that the labs show what is assessed. The revision guide, the study checklist and the Full Notes are not sources of topics. Do not teach anything the lectures and labs do not teach.

**Memory diagrams are a large part of the assessments** (owner, 2026-11-02). Wherever a lecture or lab creates variables, objects, arrays, lists, nodes or calls, the lesson teaches the diagram as an exam form: draw the state of memory after the code, and read a diagram back into code, with `MemoryDiagram` scenarios (rules in the CSI247-09a work order) and an exam question in the exam-practice lesson.

**The scope is the whole course, not one lecture per chapter.** A chapter may use and point forward to what a later lecture or lab teaches, provided that lecture or lab really contains it and the forward reference names it (for example "binary search, Lecture 8"). Lecture 7 lists O(log n) and O(n log n), Lecture 8 halves a search range and asks for the cases of binary search, Lecture 9 states O(n^2) for the three simple sorts (whose inner loops depend on the outer counter) and O(n log n) for merge sort, and Lecture 13 states the cost of the library sorts: the chapter 03 and 02 pages keep those links. What stays out is what no lecture or lab teaches. Check with `grep` on the extracted lecture text before cutting or adding anything.

Depth means: the lecture's and lab's own examples with more variations (each changes one thing), their exercises answered in full, the exam forms those exercises use (trace, write, convert, draw memory, determine Big-O), and the common errors. It does **not** mean adding neighbouring topics. Before writing, list the slide titles of your lecture and the tasks of your lab, and check every planned section against them; if a section is not a slide topic, a lab task or a direct variation of one, drop it. When unsure, leave it out and say so in the report.

## 1. Why

The owner's report of 2026-10-26: CSI247 is "way lighter" than CSI243, with "way less understanding and grasp of concepts, like the cheat sheet etc." Measured: CSI243 has 96 lessons, 2,562 runnable examples and 784 worked exam questions; CSI247 had 58 lessons, 7 runnable examples and none.

The standing complaint behind it (2026-10-20): "you just do what I explicitly mention and not other stuff that should be mentioned nonetheless." So:

- A concept needs **a template, several variations, an exam question answered all the way through, and the mistakes people make**. One example is not a lesson.
- The students are examined on paper: tracing a method, drawing memory, determining T(n), showing an array after each pass, writing a method, saying whether code is valid. Each of those forms needs its own template and several worked variations.
- The syllabus is the lecture slides and the lab sheets (section 0). A concept the lectures teach gets the full pattern; a topic they do not teach is not added.

## 2. The exam-depth pattern

Every concept in a lesson is taught in this order. A concept is anything a question could be about: a construct, a data-structure operation, a kind of mistake.

1. **Plain explanation.** What it is and what problem it solves, in a few sentences, with no undefined jargon.
2. **The template.** The general shape with placeholders (`Type`, `name`, `condition`, `head`, `node`), and one sentence on how to read each placeholder.
3. **Three or more worked variations.** Each changes one thing from the one before: another type, the empty collection, one element, the first and last index, duplicates, sorted and reverse-sorted input, the boundary. For each: the program, the exact output, and a two-line walk-through of why the output is that.
4. **An exam-style question** worded as an exam words it, with marks, answered in four steps (section 2.1).
5. **Common errors.** The wrong code a student writes, the message `javac` or the JVM gives (taken from a real run), and the repair.
6. **Practice with answers** (in the exam-practice lesson and the chapter's practice page).

A lesson that covers six concepts therefore holds at least eighteen worked variations. That is intended. Do not compress it to look short.

### 2.1 Layout of an exam-style question

Use this shape every time, so a student learns to expect it.

````mdx
### Exam question 3: counting the passes (4 marks)

Write a method `int passes(int[] marks)` that returns how many marks are at least 50.
Use a for-each loop.

<details>
<summary>Worked answer, with the reasoning</summary>

<Steps title="Answering the question">

<Step title="1. Read the question">

The command word is "write", so the answer is a method. The input is an `int[]`, the output is one `int`, and the loop form is fixed: for-each.

</Step>

<Step title="2. Plan">

Keep a counter. Visit each mark once; add one when the mark is at least 50. Return the counter.

</Step>

<Step title="3. Solution">

```java
static int passes(int[] marks) {
    int count = 0;
    for (int m : marks) {
        if (m >= 50) {
            count++;
        }
    }
    return count;
}
```

</Step>

<Step title="4. Check">

`passes(new int[] {45, 50, 72})` counts `50` and `72`, so the answer is `2`. `passes(new int[] {})` never enters the loop, so it is `0`.

</Step>

</Steps>

</details>
````

The answer's code is a fragment only when the question asks for one method. Put the complete program, with `main` and the expected output, in the worked variations above it or in the downloadable file (section 7).

### 2.2 Layout of a worked variation

Name what changed from the previous variation in one line before the program ("Same method, but the array is empty"). Then the program, the output, the walk-through.

### 2.3 The tracing and drawing forms

The Java course has two things Haskell does not: state that changes, and objects that live on the heap. A lesson shows them with the site's own pieces, not with prose alone.

- **Trace table** (`TraceTable` around a Markdown table): one row per loop pass or per call; columns for each variable that changes, the condition, and what is returned. Use it for loops, recursion and the counting of steps.
- **Memory diagram** (`MemoryDiagram scenario="..."`, scenarios in `lib/csi247/memory-scenarios.ts`; or a drawn `SvgFigure`): stack on the left, heap on the right, every reference its own box with an arrow to the object, `=` copies what is in the box. Add a scenario when the lesson needs one the engine can express, with a unit test (`npm run test:memory-diagram`). Do not draw pointer pictures with Tailwind boxes (`not-prose` is being removed, CSI247-13).
- **Pointer-by-pointer steps** for lists, stacks and queues: a numbered list in a `text` fence, one pointer change per line, then the diagram after the operation.

## 3. Repository rules

- You work in your own git worktree (the lead gives its path). **Edit only the files in your lane (section 8).** Do not run `git commit`, `git push`, `git checkout`, `git reset` or `git stash`. Do not touch `package.json`, any `meta.json`, any chapter `index.mdx` (the Overview), `cheat-sheet.mdx`, `review.mdx`, `questions.mdx`, `resources.mdx`, `WORK_ORDERS.md`, or anything outside your lane. The lead wires those after reading your report.
- Do not run a dev server, a build, `tsc` on the whole project, Playwright, or two Java verifications at once. The machine has little memory; run one script at a time.
- Write MDX in the style of the exemplar. Front matter has `title` (the lesson's name, no typed number, no "(WIP)") and `description` (one sentence).
- A lesson opens with a short paragraph, then `<LearningObjectives items={[ ... ]} />` (three to six), then optionally `<Prerequisites items={[ ... ]} />`. Sections are `## 1. Title`. It ends with `## Summary` (one `<Callout type="key" title="Remember">`), then `## Check your understanding` (`<CheckQuestions>` holding five `<CheckQuestion question="...">answer</CheckQuestion>` that test distinctions). Do **not** end with a "Continue with" line; the lead adds it.
- Components you may use, and nothing else (they are registered globally; **never write an `import` in MDX**): `Callout` (types `note`, `tip`, `caution`, `mistake`, `key`, `analogy`; props `type` and `title`), `KeyTerm`, `Steps` and `Step`, `LearningObjectives`, `Prerequisites`, `CheckQuestions`, `CheckQuestion`, `ComparisonTable`, `SvgFigure`, `MemoryDiagram`, `TraceTable`, `ConceptFrame` and `FrameBox`, `SiteDiagram` (a flowchart of ideas, never of code), the sort and search stories, and the HTML `details` and `summary` elements. No `QuizRef` and no quiz in a notes page; no emojis; no `not-prose`; no `Mermaid`.
- British spelling (recognise, behaviour, colour). Plain words. Local names (Kago, Naledi, Thato, Mpho, Lesego) and Botswana scenarios (a school, a clinic, a bus rank, a lay-by shop). No filler such as "as we all know".
- A heading never carries a typed number except the `## 1.` pattern for sections.
- **Cover the lecture topic fully, and stay inside it.** For every slide topic add the variations of each construct, the questions the lecture's exercises ask about it, and the other forms of the same exam question. Do not add topics that are not on the slides or in the labs (section 0).

### MDX pitfalls that have broken pages before

- **Never pass program text as a JSX attribute.** MDX strips the indentation. Put the program in a fenced block.
- Generics and comparisons in prose: write `List<String>` and `x < y` only inside backticks or a fence. A raw `<`, `{` or `$` outside code is read as JSX or math and breaks the page. Say "less than" in words.
- In a table cell write `\|` for a pipe, including inside backticks; a cell holding code with a pipe or backslash is safest as `<code>` HTML.
- Blank lines around every fence, every tag line and every `Step`. A fence inside a list is indented by the width of the marker.
- Use a Markdown table, not an HTML table; the one raw HTML table in `trace-tables` (merged cells) is the only exception.

## 4. How to check your work

Run these from the worktree root, in this order, one lesson at a time. A JDK is on the PATH.

1. **Write the program and the placeholder.** A complete program is a ` ```java title="Name.java" ` fence whose class is `Name`, with a `main`, followed by a blank line and a ` ```text ` fence holding exactly `@@OUTPUT@@`.
2. `node scripts/fill-java-outputs.mjs <lesson.mdx>` compiles each program with `javac --release 8` (with the classes declared earlier on the same page) and runs it. It replaces every placeholder with the real output. A program that does not compile is reported: fix it.
3. `node scripts/verify-csi247-listings.mjs <lesson.mdx>` re-runs every complete program and compares with the shown output. It must report 0 differ and 0 do not compile.
4. **Read the filled outputs against your prose.** The scripts check programs, not sentences. A table of chain contents, a count of comparisons, a claim "this prints 5": compare each with the output you now have.
5. `node scripts/check-mdx.mjs <lesson.mdx>` compiles the page.
6. When the lead asks: `node scripts/audit-quiz-data.mjs`, `node scripts/audit-csi247-architecture.mjs`, `node scripts/audit-content-standard.mjs --course csi247`.

Never write a claim about what Java prints, or what the compiler says, that you did not run. When unsure, leave the example out.

### 4.1 Java rules for examples

- **Java 8 only.** `Arrays.asList`, not `List.of`; no `var`, records, text blocks, `String.repeat`, `isBlank`, or `switch` expressions. The compiler flag is `--release 8`.
- A worked example is a complete class with `main` whenever the idea allows it (fragments hide the imports and the class they need). Put the question in a comment at the top. `title="Name.java"` must equal the public class.
- A program that reads the keyboard cannot be run by the checker. Feed it from a string (`new Scanner("12 7 30")`) or an array, and say that in the lesson. Files: write a small file first in the same program (`PrintWriter`), then read it back.
- Never print a whole `HashMap` or `HashSet`, or rely on their iteration order: copy to a `TreeMap` or sort first.
- Never print an object whose class has no `toString` unless the point is the `Name@hash` output; then explain that the number varies and do not put it in a shown output (it would fail the next run).
- No random numbers in a shown output. Use `new Random(42)` only with output taken from a real run, or avoid `Random` and use fixed arrays.
- No timing in a shown output. A complexity claim is a derivation or a step counter, never a stopwatch.
- Show the real exception for error cases, from a run: the program catches it and prints `e.getClass().getName()` and, where the message is the point, `e.getMessage()`. Programs are compiled for Java 8 but run on the machine's JDK (21), and some messages differ between JDKs (an array index error says only the index on Java 8, and "Index 5 out of bounds for length 5" on JDK 11 and later). Where a message differs, show the class name and describe the message in words. Never show a stack-trace line number.
- For a `javac` error, show the message from a real compile with the file name and line number removed, and say which part a student should read ("incompatible types", "cannot find symbol"). If the wording changes between JDKs, show only the part that does not.
- Output that is a long loop is shown trimmed only if the program itself prints less; do not edit a real output.
- `JavaTryIt` is for the one runnable example a reader should be able to edit; the runner is limited (TRY-08: no input, no files, one `public class Main`). Everywhere else use a titled `java` fence with its `text` output.

## 5. What to report

Your final message, kept short, lists:

- the files you created or changed;
- for each lesson, the number of concepts, of worked variations, of complete programs and of exam questions;
- the result of `fill-java-outputs` (programs filled, programs reported), `verify-csi247-listings` and `check-mdx`;
- the extra concepts you added beyond the request, and why;
- anything you could not verify or were unsure about;
- the wiring you want from the lead: the order of your lessons in the sidebar, a one-line Overview description for each, and any flashcard or quiz question you would add to the review page (two lines each: the distinction it tests and the wrong answer it catches).

## 6. The Java exam forms, each with a template

Every chapter's exam-practice lesson mixes these. A by-example lesson gives each form its template and at least three worked variations.

| Form | Template (the numbered procedure to teach) |
|---|---|
| Trace this method | 1. Write the variables as table columns. 2. One row per pass or call. 3. Update only the variable the line changes. 4. Write what is returned or printed on the last row. |
| Draw the state of memory | 1. Stack left, heap right. 2. One box per variable; a primitive holds its value, a reference holds an address. 3. `new` makes a heap box with its address. 4. `=` copies the box content; cross out the old value. 5. Mark unreachable objects as garbage. |
| Determine T(n) and the Big-O | 1. Count the primitive operations in each line. 2. Multiply a loop body by its count; a nested loop multiplies. 3. Sum the lines into T(n). 4. Keep the dominant term and drop constants. |
| Show the array after each pass | 1. Copy the array. 2. Apply one full pass of the algorithm. 3. Write the array. 4. Repeat until a pass changes nothing (bubble) or `n - 1` passes. |
| Write the recursive version | 1. State the base case. 2. State the smaller problem. 3. Write the call and the combination. 4. Trace on the smallest input and one more. |
| Valid or not valid? What is the output? | 1. Read the static type of the reference: that decides what compiles. 2. Read the object it points to: that decides what runs. 3. Check the cast, the access modifier, the abstract method. 4. If it compiles, trace the call. |
| Write the method for this specification | 1. Signature from the specification. 2. The empty and one-element cases. 3. The loop or recursion. 4. Return. 5. Test on three inputs. |
| Find and fix the bug | 1. Run the code in your head on the smallest failing input. 2. Find the first line where the value is not what was meant. 3. Name the kind of error (off by one, wrong operator, missing null check). 4. Repair and re-trace. |

## 7. Downloads (lane JD)

CSI243 has about 1,300 `.hs` files; CSI247 has none. For every complete program in a by-example or exam-practice lesson, generate two files under `public/files/sem3/csi247/downloads/`:

- `completed-examples/<Name>.java`: the question in a block comment at the top, then the solution, then a `main` that prints the results of several calls with the expected output in comments after each. It compiles with `javac --release 8` and runs with `java`.
- `starter-code/<Name>.java`: the same question and the same `main`, with each method the question asks for left as a signature with a stub body (`return 0; // TODO`) so the file compiles; nothing else.
- `README.md` listing every file with its question in one line, and a link from the chapter Resources page.

Generate the files from the lessons' programs rather than by hand. Write `scripts/verify-java-files.mjs` (compile and run every completed file and compare the output with the comments; compile every starter) on the model of `scripts/verify-haskell-files.mjs`. Name files `Topic_Question.java` (`Recursion_Power.java`), keep each under 120 lines, and make a variation `Recursion_PowerV2.java`.

## 8. Lanes

Each lane lists the files it may create. A lane may also read anything in the repository. **The scope of a lane is the slide and lab list below**, taken from the lecture and lab PDFs (extract with `pdftotext -layout`). A lesson section must be a slide topic, a lab task, a direct variation of a slide or lab example, or an answer to one of their exercises. Add memory-diagram questions wherever the lane creates variables, objects, arrays, lists or calls.

Minimums for every lane: three worked variations per concept, one exam question per concept, a common-error callout per concept, five check questions per lesson, and a real run for every complete program.

| Lane | Chapter | Lectures | Slide topics (the scope) |
|---|---|---|---|
| J01 | 01 java-fundamentals | Lec01, Lec02, Lec03, Lec05 | Lec01: what a data structure is, primitive and non-primitive, linear and non-linear, common operations, why study them. Lec02: Java program, variables and the memory diagram, operators, control structures, strings, classes and objects, pre-defined classes, methods, keyboard input, output, file I/O (read, write, catching errors). Lec03: what a method is, examples, flow of calling a method, parameters and return values, implementing and declaring, invoking, comments, repeating code as a method, parameterised methods, parameter passing, common errors 1 and 2, return values and multiple returns, methods without return values, steps and tips, variable scope (local, block, overlapping). Lec05: arrays (advantages and disadvantages, creating, the memory model, initialising, adding values, index out of bounds, retrieving), arrays as parameters (initialise, read, print, index of the largest, average), arrays of String, arrays of objects. **Labs and later lectures:** Labs 1 and 2 (the lay-by problem: read a file into an array of objects, write output files, UML of the class, `preProcessing`, `validate`, `linearSearch` on objects, a menu loop) |
| J02 | 02 recursion | Lec06 | Recursion against a recursive method; the two cases; factorial (iterative and recursive); the important points (base cases, recursive calls, one option executes); tracing and the trace table (level, n, condition, returned, results); recursion against iteration (overhead; convert both ways); infinite recursion (missing base case). Exercises: type and fix `fact` and `factR`; compare outputs; recursive `power`; convert it; test both; Fibonacci series iteratively then recursively; trace `factR(7)`, `power(6, 3)`, `fibonacci(6)`. **Labs and later lectures:** Lab 3 (Recursion): `factorial`, `fibonacci` (display the series, for example `0 1 1 2 3 5`), `power`, a menu `main`; trace `factorial(7)`, `fibonacci(9)`, `power(2, 8)`; comment out a base case and test; iterative versions and compare the output |
| J03 | 03 time-complexity | Lec07 | Algorithm, program; efficiency (time, storage); time complexity and what the runtime depends on; experimentation and its limits; the methodological approach; primitive operations; best, average, worst case; counting: one statement, sequence, selection, basic repetition (`n + 1` and `n`), nested repetition; estimation rules; growth rates (2n against 4 + 3n squared); Big-Oh and its rules; common orders (1, log n, n, n log n, n squared, n cubed, 2 to the n, n!); comparing growth rates. Exercises: Big-Oh of `7n - 2`, `3n^3 + 20n^2 + 5`, `3 log n + 5`; time complexity of the average of n numbers, printing the characters of a string of length n, an iterative n! |
| J04 | 04 sorting-and-searching | Lec08, Lec09 | Lec08: searching, linear search (unordered, ordered, implementation, time complexity, application areas), binary search (how it works, illustration, implementation); exercises: best, average and worst case of binary search; convert the iterative method to a recursive one. Lec09: bubble, insertion, selection and merge sort (how each works, exercises on 63 29 72 85 18 and 63 29 72 85 18 49 3 54, sample methods, disadvantages, when to use). **Labs and later lectures:** Lab 4 (`linearSearch` on doubles, `binarySearch` with start and end, test data from `Math.random` and the first 50 even numbers, a menu loop) and Lab 5 part 1 (`mergeSort` with the supplied `merge`, fix its errors, random marks in a loop) |
| J05 | 05 packages | Lec10 | Built-in packages and `import`; user-defined packages (choose a name, create, use, test) |
| J06 | 06 object-oriented-programming | Lec04, Lec11 | Lec04: object and class, instantiating, instance variables, methods (void, value-returning), constructors, writing a class (naming, variables, methods, constructors, `this`, setters, getters, `equals`, `toString`), testing the class and passing parameters, UML, method signatures, overloading. Lec11: OOP and its goals, inheritance (syntax, what a subclass can and cannot do, types, UML, the class hierarchy, `Object` methods), overriding and its rules, `@Override`, partial overriding, a better `equals`, casting, wrapper classes and autoboxing, encapsulation, polymorphism, abstraction (abstract classes, interfaces, multiple interfaces, an interface extending an interface, UML for interfaces, built-in interfaces). **Labs and later lectures:** Lab 5 parts 2 and 3 (UML for `Doctor`, `GP`, `Surgeon`; overriding `tagName` and `calculatePay`; a tester that reads a file with optional fields and writes three files) and Lab 6 (abstract `Employee`, `Teacher`, `Admin`, `toString`, `equals`, a payroll tester; interfaces `Test` and `Test2`) |
| J07 | 07 generics | Lec12, Lab07 (Lectures folder and Labs) | What generics are and their advantages, levels of generics, generic class (syntax, type parameter, creating objects, more than one type parameter, naming convention), bounded types, generic method, generic interface; the Lec12 exercises; Lab 7 (in the Lectures folder): generic `Set`, `printArray`, `BigAndSmall`, `Pair` of numbers |
| J08 | 08 collections | Lec13 | `Arrays.sort`, the Collection framework and hierarchy, arrays reviewed, `Iterable`, iteration options (for-each, `Iterator`), the `Collection` interface, the `List` ADT, `ArrayList`, `Collections.sort`, `Comparable` and `compareTo`, implementing a list (`ArrayList`, `LinkedList`), with the lecture's exercises. **Labs and later lectures:** Lab 8 (`Person` implements `Comparable`; read records from a file into an `ArrayList`; remove by index and what happens at index 8; a memory diagram; `Collections.sort`; a `LinkedList` of course names with every add and remove method; `toArray`) |
| J09 | 09 linked-lists-traversals | Lec13 (linked list part), Lec14 | A linked list reviewed (recursive structure, nodes, types, access, benefits), the singly linked list with an inner class, `isEmpty`, `addLast`, `addFront`, add at a position, `contains`, traversing, `removeFront`, `removeLast`, remove at a position, `size`; the lecture exercise (print "Found it" if the list has 120) |
| J10 | 10 stacks-and-queues | Lec13 (Stack and Queue ADT), Lec15, Lec16 | Stack ADT and the Java `Stack`, Queue ADT and the Java `Queue` and `PriorityQueue`; stack review, array stack (`isEmpty`, `size`, `isFull`, `push`, `peek`, `pop`, `search`), linked stack, advantages and disadvantages, the lecture's exercises. **Labs and later lectures:** Lec16 (queue review, types of queues including the priority queue, Java's queue, the user-defined queue: linked-list-based `Queue1` with its `Node`, `enqueue`, `dequeue`, `peek`; array-based, the effect of `enqueue` and `dequeue` on front and tail, `isEmpty`, `isFull`, `contains`; exercises) |
| JR | all | | flashcards, quiz and practice data, built only from the lane's lesson content |
| JD | all | | `.java` downloads generated from the lessons' programs and `scripts/verify-java-files.mjs` (section 7) |
| JA | repository | | the depth rule in `scripts/audit-content-standard.mjs` and `docs/content-standard.md` |

The older concept lists for lanes J01 to J10 that stood in this section before 2026-11-02 went beyond the lectures and were removed; they are in the git history (commit `6d5837f`).
