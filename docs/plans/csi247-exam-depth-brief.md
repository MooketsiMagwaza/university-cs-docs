# CSI247 exam depth: the brief for writers

This is the standing brief for writing or extending CSI247 lessons (work order CSI247-14). It is the Java counterpart of [csi243-exam-depth-brief.md](csi243-exam-depth-brief.md): the teaching pattern is the same; the tooling, the exam forms and the lanes are Java's. Read it all, then [docs/guides/csi243-depth-model.md](../guides/csi243-depth-model.md), the coverage rows for your chapter in [csi247-vault-gap-audit.md](csi247-vault-gap-audit.md), and the exemplar lesson `content/docs/sem5/csi323/03-hash-tables/notes/hash-tables-by-example.mdx` (18 complete programs, 4 exam questions with four-step answers, common-error callouts). **Copy its shape.**

## 1. Why

The owner's report of 2026-10-26: CSI247 is "way lighter" than CSI243, with "way less understanding and grasp of concepts, like the cheat sheet etc." Measured: CSI243 has 96 lessons, 2,562 runnable examples and 784 worked exam questions; CSI247 had 58 lessons, 7 runnable examples and none.

The standing complaint behind it (2026-10-20): "you just do what I explicitly mention and not other stuff that should be mentioned nonetheless." So:

- A concept needs **a template, several variations, an exam question answered all the way through, and the mistakes people make**. One example is not a lesson.
- The students are examined on paper: tracing a method, drawing memory, determining T(n), showing an array after each pass, writing a method, saying whether code is valid. Each of those forms needs its own template and several worked variations.
- The syllabus is the owner's own material (the audit). A topic named in a request always brings its siblings; the audit lists them.

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
- **Cover the topic, not only the words of the request.** For every topic add the variations of each construct, the sibling concepts next to it (the audit lists them), the other ways to write the same thing, and the questions asked about each. When in doubt, include it and say so in your report.

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

Each lane lists the files it may create. A lane may also read anything in the repository. The concept lists below are minimums; the audit rows named for each lane are the full list, and the siblings table in the audit is part of the lane.

Minimums for every lane: three worked variations per concept, one exam question per concept, a common-error callout per concept, five check questions per lesson, at least fifteen complete programs per by-example lesson, and twelve to twenty questions in the exam-practice lesson.

### Lane J02: recursion

Files: `content/docs/sem3/csi247/02-recursion/notes/recursion-by-example.mdx` and `.../notes/recursion-exam-practice.mdx`. The existing `recursion-in-java` and `trace-tables` stay; read them first and do not repeat them.

Template first: base case, smaller problem, combination; then the tracing template (a trace table with level, arguments, condition, returned expression, result; and the call-stack picture with the unwinding phase). Then one section per shape, each with three or more variations: counter recursion (countdown, sum 1 to n, factorial); `power` and its loop version (the Lec06 exercise c, d, e); two base cases; branching recursion (`fib`, with the number of calls counted for `fib(5)`); array recursion (sum, maximum, search, reverse); string recursion (length, reverse, palindrome, count a character); range recursion (sum from `lo` to `hi`, binary search recursively); accumulators and helper methods with an extra parameter; mutual recursion (`isEven`, `isOdd`); backtracking (subsets, permutations, paths on a grid); Towers of Hanoi; recursion to loop and back (both directions, with a table of the rule); stack overflow (the real `StackOverflowError`, a missing base case, a call that does not shrink). Add `MemoryDiagram` call-stack scenarios if the engine can express frames; otherwise `SvgFigure`s. Exam questions: trace `factR(7)`, `power(6, 3)`, `fibonacci(6)` (the lecturer's own), write the recursive version, convert, count the calls, find why it never stops. The recursive bubble and selection sort between `i` and `j` belong to lane J04 and link back here.

### Lane J03: time complexity

Files: `content/docs/sem3/csi247/03-time-complexity/notes/complexity-by-example.mdx` and `.../notes/complexity-exam-practice.mdx`.

Template: count primitive operations, write `T(n) =` in full, keep the dominant term. Sections: the counting rules (statement, selection takes the larger branch, loop, nested loop, loop followed by loop); **thirty loop shapes**, each with its T(n), its Big-O and the reason (single, step of 2, halving `i /= 2`, doubling `i *= 2`, nested independent, nested with the inner bound depending on `i`, three-level, loop plus method call, `while` with a conditional exit, early `break`, sum of 1 to n inside the loop bound); the Big-O drills (`7n - 3`, `8n squared log n + 5n squared + n`) with the rule for each simplification; best, average and worst case on search and on insertion sort; recurrences for recursive code solved by expansion (`T(n) = T(n - 1) + c`, `T(n) = T(n / 2) + c`, `T(n) = 2T(n / 2) + n`) and a step counter program for each that agrees with the formula; the costs of library calls (`ArrayList.add`, `add(0, x)`, `contains`, `remove(0)`, `String +=` in a loop against `StringBuilder`) with an amortised-cost explanation for `add`; space complexity including the recursion stack; Big-Omega and Big-Theta and the note that O(n) is also O(n squared) but never to be written that way; comparing two algorithms at a given n. Every step count is shown by a real program that counts (an `int steps` field), never by a stopwatch. Exam forms: determine T(n) and the Big-O, compare, justify.

### Lane J09: linked lists

Files: `content/docs/sem3/csi247/09-linked-lists-traversals/notes/linked-list-operations-by-example.mdx`, `.../notes/linked-list-patterns-by-example.mdx` and `.../notes/linked-list-exam-practice.mdx`. Read `linked-lists-explained` and `linked-lists-and-traversal` first.

Operations lesson: the nested `Node` class (Lec14: why a class is nested); each of `isEmpty`, `size`, `contains`, `addFront`, `addLast`, add at position `i`, `removeFront`, `removeLast`, `remove(int i)`, remove by value, with the pointer-by-pointer steps, a `MemoryDiagram` (scenarios `llbuild`, `lltrav`, `llslide`) and the null checks for the empty list, one node, the head and the last node. Patterns lesson: dummy head and tail pointer (what special case each removes); reverse (iterative and recursive); the middle (fast and slow pointers); cycle detection; merge two sorted lists; insert in sorted order; remove duplicates; nth from the end; doubly linked (insert and delete with both pointers, `dll`); circular; a traversal that computes a value (the revision guide's weighted performance index over nodes holding arrays, with the division-by-zero guard). Cost table against the array. Exam forms: pointer-by-pointer trace, write the method, draw memory.

### Lane J10: stacks and queues

Files: `content/docs/sem3/csi247/10-stacks-and-queues/notes/stack-and-queue-implementations-by-example.mdx`, `.../notes/stack-and-queue-applications-by-example.mdx` and `.../notes/stacks-and-queues-exam-practice.mdx`.

Implementations lesson: array stack (`push`, `pop`, `peek`, `isEmpty`, `isFull`, `size`, `search`, overflow and underflow with the real messages); linked stack; resizing the array; array queue and its waste; **circular queue** (front, back, size, `back = (back + 1) % capacity`, `isFull` when size equals capacity, a trace table of 12 operations on a capacity-5 queue); linked queue (head and tail); deque (four operations, and as a stack and as a queue); priority queue (`java.util.PriorityQueue` natural order and with a `Comparator`; a hand-written sorted-insert version; what the heap is, linked to CSI323). Applications lesson: balanced brackets (three kinds, with the failing cases), reversing, postfix evaluation, **infix to postfix with every push and pop** (at least eight expressions, including the revision guide's `( X + Y ) * Z - ( W / V )`), next greater element, a queue from two stacks and a stack from two queues, a min stack, round-robin scheduling, a bank queue, a string transformation with a queue (the vowel shift). Exam forms: trace the contents after a list of operations, write the class, apply to a problem.

### Lane J07: generics

Files: `content/docs/sem3/csi247/07-generics/notes/generics-by-example.mdx` and `.../notes/generics-exam-practice.mdx`. The older lessons are 4 to 6 KB; read them and go much further.

Sections: why (the cast and the `ClassCastException` without generics); generic class (`Box<T>`, two parameters `Pair<K, V>`, the diamond); the Lab 7 `Set<T>` over an array of 10 (`(T[]) new Object[10]` and why `new T[10]` is rejected); generic method (`printArray` for `Integer`, `Double`, `Character`, `String`, `Float`, the lecturer's exercise); generic interface and the class that implements it (the `BigAndSmall` interface of Lec12); bounded types (`T extends Number`, `T extends Comparable<T>`, two bounds), with the Lab 7 `Pair<T extends Number, U extends Number>` and its `add`, `multiply`, `subtract`, `divide`; wildcards (`?`, `? extends`, `? super`, the PECS rule, with a read-only and a write-only example); erasure and what it forbids (`new T()`, `T[]`, primitives, `instanceof List<String>`); raw types and the unchecked warning. Fix any `List.of` in the generics lessons to `Arrays.asList`. Show the real `javac` messages for "why does this not compile". Exam forms: write the generic method, why does this not compile, what is printed.

### Lane J08: collections and iterators

Files: `content/docs/sem3/csi247/08-collections/notes/collections-by-example.mdx`, `.../notes/iterators-by-example.mdx` and `.../notes/collections-exam-practice.mdx`.

Collections lesson: the hierarchy (`Iterable`, `Collection`, `List`, `Set`, `Queue`, `Map`) with a picture; `ArrayList` operations with every variant (`add(x)`, `add(i, x)`, `set`, `get`, `remove(int)` against `remove(Object)` on an `ArrayList<Integer>`, `indexOf`, `contains`, `subList`, `size`); `LinkedList` as a `List` and as a `Deque` (`addFirst`, `addLast`, `removeFirst`, `removeLast`, `getFirst`, `peek`, `poll`), the Lab 8 course-name list, and the cost of `get(i)`; `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`) and `Map` (`HashMap`, `TreeMap`, `getOrDefault`, `put` replacing, iterating `entrySet`), always printed in a sorted or fixed order; `Collections` utilities (`sort`, `reverse`, `shuffle` with a seeded `Random`, `max`, `min`, `frequency`, `unmodifiableList`); `Arrays.asList` is fixed-size and writes through; `toArray`; sorting with `Comparable` and `Comparator` (the Lab 8 `Person` on `fullname`, `Comparator.comparing`, a chain with `thenComparing`); `remove(8)` on a short list and the real `IndexOutOfBoundsException`. Iterators lesson: for-each, `Iterator` (`hasNext`, `next`, `remove`), `ListIterator` (both directions, `set`, `add`), `ConcurrentModificationException` (the loop that throws and the three safe repairs), writing your own `Iterable`. Choose a collection for a scenario and justify (a table, then six scenarios). Memory diagrams for the Lab 8 steps. Exam forms: choose and justify, trace the operations, fix the bug.

### Lane J06: object-oriented programming

Files: `content/docs/sem3/csi247/06-object-oriented-programming/notes/classes-and-constructors-by-example.mdx`, `.../notes/inheritance-and-polymorphism-by-example.mdx`, `.../notes/object-methods-by-example.mdx`, `.../notes/abstract-and-interfaces-by-example.mdx` and `.../notes/oop-exam-practice.mdx`.

Classes and constructors: instance against `static` members (a counter, a constant, a utility method, and why a static method cannot read an instance field), access modifiers in a table of who can see what, constructors (default, parameterised, chaining with `this(...)`, a copy constructor), `final` fields and an immutable class, setters and getters with validation, `this`, a tester class, objects passed to methods (`transferFunds`), overloading (what counts and what does not). Inheritance and polymorphism: `extends`, constructor order, `super(...)` and `super.method()`, field hiding against method overriding, `protected`, `final`, the `Object` root, **static type against dynamic type** (what compiles against what runs), overloading resolution, an array of the superclass holding subclasses, and the Lab 5 `Doctor`, `GP`, `Surgeon` hierarchy with its UML and file-driven tester. Object methods: `toString` (when Java calls it), `equals` (the contract and the five-step recipe, `getClass` against `instanceof`), `hashCode` kept in step, `==` against `equals`, casting (upcast, downcast, `instanceof`, `ClassCastException` with the real message), wrapper classes and autoboxing against unboxing (the `Integer` cache, `==` on boxed values). Abstract and interfaces: abstract class with a constructor, abstract methods, interface (constants, default and static methods, multiple interfaces, an interface extending an interface), choosing between them, built-in interfaces, and the Lab 6 `Employee`, `Teacher`, `Admin` payroll and `Test`, `Test2`. Exam practice: **valid or not valid**, what is the output, draw memory, write the class, UML. Several `MemoryDiagram` scenarios.

### Lane J01: Java fundamentals

Files: `content/docs/sem3/csi247/01-java-fundamentals/notes/what-is-a-data-structure.mdx`, `.../notes/control-flow-by-example.mdx`, `.../notes/methods-by-example.mdx`, `.../notes/arrays-and-matrices-by-example.mdx`, `.../notes/file-io-by-example.mdx` and `.../notes/fundamentals-exam-practice.mdx`.

`what-is-a-data-structure` is Lecture 1: what a data structure is and why we study them, primitive and non-primitive, linear and non-linear, the common operations, interface against implementation, and the three qualities (correct, fast, small). Control flow: `switch` with and without `break` (fall-through), `do-while`, `break` and `continue`, nested loops (patterns), the classic loop errors with traces, `printf` formats, string methods (`StringBuilder`, `split`, `trim`, `replace`, `contains`, `compareTo`), `Math.random` and `Random` (with seeds), integer division and casting tables. Methods: the six steps to write a method, parameters and returns, multiple `return`, `return;`, overloading, pass by value with primitives, arrays and objects (memory diagrams), scope and shadowing, Javadoc. Arrays and matrices: the five standard methods, copy against alias, reverse, rotate, shift, remove an element, two-dimensional arrays (row and column sums, transpose, diagonal and anti-diagonal, ragged arrays), the `Arrays` class. File I/O: `Scanner(File)`, `hasNextLine`, `PrintWriter`, append mode, `close()`, try-with-resources, `FileNotFoundException`; parse a file by line (the question-mark lines) and by field (CSV with missing values); Lab 1's lay-bye processing end to end. Exam forms: trace a loop, predict the output, find the bug, write a method.

### Lane J04: sorting and searching extras

Files: `content/docs/sem3/csi247/04-sorting-and-searching/notes/recursive-sorts-by-example.mdx`, `.../notes/greedy-algorithms-by-example.mdx`, and a `QuickSortStory` (the lead registers it). Chapters 4 and 5 are already the deepest; this lane adds only what the audit marks Missing or Thin there.

Recursive sorts: recursive bubble sort and recursive selection sort between indexes `i` and `j` (ascending, descending, "right to left"), with trace tables; the Lab 5 `mergeSort` with the supplied `merge(arr, s, m, e)` method read line by line, its errors found and fixed; quick sort partition traced on three arrays, and the worst case on sorted input with a naive pivot. Greedy: coin change and truck loading by `capacity / denomination` and `capacity % denomination`, the counterexample (denominations 6, 4, 1 and a target of 8), greedy against dynamic programming in a paragraph. State in the report that greedy is from the revision guide only. The Lab 4 menu program (`linearSearch` on `double[]`, `binarySearch` with `start` and `end`) as a complete program fed from fixed arrays.

### Lane J05: packages

File: `content/docs/sem3/csi247/05-packages/notes/packages-exam-practice.mdx` only: name conflicts between two packages, fully qualified names against `import`, static imports, package-private and `protected` across packages, folder layout, the compile and run command lines with `-d` and `-cp` (given as `text` fences, not run), and diagnosing the error from the message.

### Lane JR: review and practice (per chapter, after the lessons)

Files: `content/flashcard-data/docs/sem3/csi247/<chapter>/...`, `content/quiz-data/docs/sem3/csi247/<chapter>/...` and `content/practice-data/...`. Flashcards test distinctions (the audit's RG-7 list gives twenty). Quiz questions have `optionFeedback` that says why each wrong option is wrong, and scenario questions with verified code. Practice questions carry marks and a model answer. The lead wires them.

### Lane JD: downloads

Section 7. The lead runs it after the lessons exist, because it generates from them.

### Lane JA: the depth rule

`scripts/audit-content-standard.mjs` reports any `##` concept section in a CSI247 by-example lesson with fewer than three `###` variations, and any chapter without a by-example lesson, an exam-practice lesson, a cheat sheet or downloads; `docs/content-standard.md` gets the rule. The lead does this.
