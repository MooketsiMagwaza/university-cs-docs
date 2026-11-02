# CSI247 vault gap audit (2026-11-02)

This audit maps the owner's own CSI247 material to the lessons that cover it, lists the sibling concepts nobody named, and cuts the work into lanes. It is the CSI247 counterpart of [csi243-vault-gap-audit.md](csi243-vault-gap-audit.md). Read it with [docs/guides/csi243-depth-model.md](../guides/csi243-depth-model.md) (what a finished chapter holds) and [csi247-exam-depth-brief.md](csi247-exam-depth-brief.md) (how the lanes write).

The owner's standing complaint is that writers do only what is named. The audit exists to stop that: a lesson is planned from the whole row set for its chapter, not from the title of the chapter.

## Scope rule (owner, 2026-11-02): the Lectures folder is the whole course

The owner said: "refer to the lecture notes here as the entire course scope" (`C:\Users\Nido\Desktop\Semester_3_Vault\Current\CSI247\Lectures`). That folder holds `Lec01` to `Lec15` and `Lab07 - generics-1.pdf`. So:

- The labs held elsewhere (Labs 1, 4, 5, 6 and 8), `Revision/` (the study checklist, the revision guide, the annotated Lecture 7), `Resources/` (the Full Notes, the outline, the rules) and the books are **not scope**. Rows in section 4 that cite them (ids starting `RG-`, items that name a Lab other than Lab 7, the Full Notes or the revision guide) are marked **Out of scope** and are kept only as a record of what was found.
- Section 5 (sibling concepts nobody named) is **withdrawn**. Depth now comes from the lecture's own topics: more variations of each lecture example, the lecture's own exercises answered in full, the exam forms those exercises use, and the common errors. A new topic is not added because it is a "sibling".
- Section 4 was written before this rule and was not re-checked row by row against the slides. Where a row's item is not a slide topic (for example mutual recursion, Towers of Hanoi, amortised cost, Big-Omega) it is out of scope even if it is not marked. The authoritative in-scope list is the slide list per lane in section 8 of the brief. Each chapter's lane starts by listing its lecture's slide titles and checking every planned section against them.
- Chapter 02 was first written beyond Lecture 6 and was trimmed on 2026-11-02 (see the work order CSI247-17).

## 1. Sources and what was read

All paths are under `C:\Users\Nido\Desktop\Semester_3_Vault\Current\CSI247`.

| Source | What it is | Read |
|---|---|---|
| `Resources/CSI247 course outline_2026.pdf` | The lecturer's outline for 2026/27 (Mrs B. Gopolang): objectives, topics, assessment | In full |
| `Resources/CSI247 Course Rules 2026.pdf` | Attendance, labs, missed assessments, how to pass | In full |
| `Lectures/Lec01` to `Lec15` | The lecture slides | Every slide title; the exercise slides in full |
| `Lectures/Lab07 - generics-1.pdf`, `Resources/Labs/*` | Lab sheets 1, 4, 5, 6, 7, 8 | In full |
| `Revision/Quiz 1 and 2 - Study Checklist.md` | A checklist for Quiz 1 (basics) and Quiz 2 (recursion, complexity, linear search), with a "differences" reference | Headings and every checklist point |
| `Revision/DSA Study Guide.pdf` | A revision guide with six topics and six exam-style questions | In full |
| `Revision/CSI247-Lec07-Annotated.pdf` | Lecture 7 annotated: complexity counting rules and drills | Headings and the counting examples |
| `Resources/Data Structures Full Notes.pdf` | 128 pages of unit notes: data structures, stacks, queues, trees, heaps, hash tables, graphs | Searched by topic and page, not read end to end |
| `Revision/java-foundations.html` | The reference course already converted into the site | Not re-read (see the handoff) |

Not used: `Notes/Handmade/*.md` and `Notes/AI-Generated/*` (Excalidraw drawings, no readable text outside diagram labels); `Books/*` (three textbooks and one unrelated book); `Lab registers.pdf` (a roster of student names; it is personal data and must not be copied into the repository).

**Not in the vault, so not audited:** Lab 2, Lab 3 and any lab after Lab 8 (linked lists, stacks, queues); any past test, quiz paper or final exam. The audit is therefore driven by the syllabus and the lecturer's exercises, not by past papers. Ask the owner for those papers (section 8).

## 2. Findings that change the plan

1. **The lectures run to Lec15, not Lec13.** `Lec14 - LinkedList Implementation` and `Lec15 - Stack Implementation` are the lecturer's material for chapters 9 and 10. There is no queue lecture in the vault; the queue, circular queue, deque and priority queue come from the Full Notes (circular queue pp. 62 to 65, priority queue and heap pp. 41 to 44) and from the revision guide.
2. **The lecturer's outline lists hash tables, trees and graphs under CSI247** ("Implementation of common data structures: linked lists, stacks, queues, hash tables, trees, graphs"). The owner moved them to CSI323 on 2026-10-26. That decision stands. The revision guide still examines a BST and an adjacency matrix, so the CSI247 overview must point forward to the CSI323 topics (section 8).
3. **Assessment shape.** Two tests (30%), four quizzes (20%), a final exam (50%). Quiz 1 is the basics (Lec02 to Lec05, Lab 1). Quiz 2 is recursion, time complexity and linear search. Questions are written answers and code on paper, so every exam form in the depth model needs a by-hand template.
4. **Topics in the vault that no chapter list names:** two-dimensional arrays and diagonal traversal; file input and output with `FileNotFoundException`, overwrite and `close()`; parsing a text file by line and by field (the revision guide's question-mark lines and CSV with missing fields); recursive sorts between two indexes; greedy coin change and where greedy fails; a nested (inner) class for `Node` (Lec14); `Stack.search`, `isFull`; the vowel-shift string exercise; a weighted index computed while traversing a linked list whose nodes hold arrays; flow charts (Lab 1 asks for one).
5. **Lecture 1 is not on the site at all.** "Introduction to Data Structures" (what a data structure is, primitive and non-primitive, linear and non-linear, the common operations, why study them) has no lesson: `git grep -i "non-linear"` over the CSI247 content finds nothing.
6. **Greedy and coin change appear only in the revision guide**, not in any lecture or in the Full Notes. Treat as "ask the owner whether it is examined" before writing a full lesson (a short section is cheap and safe; see lane J04).
7. **An unlisted page.** `04-sorting-and-searching/notes/bubble-and-selection-sort.mdx` (27 KB) is not in `notes/meta.json`, so it has no sidebar entry. Decide: merge it into `bubble-sort` and `selection-sort`, or list it. Recorded as CSI247-15.

## 3. Where the chapters stand (measured 2026-11-02)

Notes in KB, flashcard and quiz files, figures, and the shape of the two depth layers that exist. "By example" and "exam practice" mean the lesson types of the depth model; none exists for any chapter.

| Chapter | Notes (KB) | Quiz files | Flashcard files | Figure files | By example | Exam practice |
|---|---|---|---|---|---|---|
| 01 java-fundamentals | 9 lessons, 75 | 7 | 1 | 6 | no | no |
| 02 recursion | 2 lessons, 13 | 1 | 1 | 1 | no | no |
| 03 time-complexity | 2 lessons, 19 | 1 | 1 | 1 | no | no |
| 04 sorting-and-searching | 13 listed lessons, 133 (plus the unlisted 27) | 7 | 1 | 4 | partly (drills) | yes (two drills) |
| 05 packages | 3 lessons, 33 | 4 | 1 | 3 | no | no |
| 06 object-oriented-programming | 10 lessons, 81 | 4 | none | 9 | no | no |
| 07 generics | 5 lessons, 24 | 5 | none | 4 | no | no |
| 08 collections | 6 lessons, 29 | 5 | 1 | 2 | no | no |
| 09 linked-lists-traversals | 2 lessons, 16 | 1 | 1 | 1 | no | no |
| 10 stacks-and-queues | 2 lessons, 11 | 1 | 1 | 1 | no | no |

Concept counts (how often a term appears anywhere in the chapter's notes, cheat sheet, review and questions; a zero is a missing concept, a single digit usually a mention without a worked example). The terms that were zero everywhere: mutual recursion, recursive bubble or selection sort, Towers of Hanoi, Big-Omega and Theta, diagonal traversal, `FileNotFoundException`, `switch` fall-through, greedy, nested or inner class, `ListIterator`, merging two sorted lists, a circular linked list beyond one mention, default methods beyond one mention.

## 4. Coverage rows

State: **Covered** (taught, with at least one worked example; depth still to be raised), **Thin** (named or shown once, no variations), **Missing** (nowhere in the CSI247 content). Every row also needs the depth layers of its chapter; "Covered" never means finished. Lane ids are in section 6.

### Lec01 Intro to data structures

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L01-1 | What a data structure is; why study them | none | Missing | J01 |
| L01-2 | Primitive and non-primitive structures | none | Missing | J01 |
| L01-3 | Linear and non-linear structures | none | Missing | J01 |
| L01-4 | Common operations: insert, delete, search, traverse, sort | scattered in chapters | Thin | J01 |
| L01-5 | Interface against implementation; correctness, time and space as the three qualities (Full Notes pp. 1 to 2) | none | Out of scope | J01 |
| L01-6 | Abstract data type (Full Notes, four pages) | `08-collections` core-interfaces (2 KB) | Out of scope | J08 |

### Lec02 Reviewing Java basics (Quiz 1)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L02-1 | Program structure, file named after the class | how-a-java-program-runs | Covered | J01 |
| L02-2 | Variables: declaration, initialisation, assignment, `final` | variables-types-and-operators | Covered | J01 |
| L02-3 | Memory diagram: primitive against reference | values-primitives-references, drawing-memory-diagrams | Covered | J01 |
| L02-4 | Operators, precedence, `++x` against `x++` | variables-types-and-operators | Covered | J01 |
| L02-5 | Integer division, casting, mixed types | variables-types-and-operators (10 mentions) | Covered | J01 |
| L02-6 | `if`, `if-else`, multi-branch, nested | decisions-and-loops | Covered | J01 |
| L02-7 | `switch` and fall-through | decisions-and-loops | Thin (fall-through is zero) | J01 |
| L02-8 | `for` against `while`; off-by-one, missing update, infinite loop | decisions-and-loops | Covered | J01 |
| L02-9 | `do-while`, `break`, `continue`, nested loops | decisions-and-loops | Thin | J01 |
| L02-10 | `String` methods: `length`, `charAt`, `indexOf`, `substring`, `toUpperCase`, `equals` | strings-control-io | Covered | J01 |
| L02-11 | `StringBuilder`, `split`, `trim`, `compareTo`, `replace`, `contains` | strings-control-io (`split` once, `compareTo` twice; `StringBuilder`, `trim` and `replace` appear nowhere in chapter 1) | Thin | J01 |
| L02-12 | Pre-defined classes: `Math.random` and `Random` (Labs 4 and 5 generate their test data with `Math.random`), `Math` methods, wrapper parsing (`Integer.parseInt`) | none of the three appears anywhere in CSI247 | Missing | J01 |
| L02-13 | `Scanner` on the keyboard; the leftover newline after `nextInt` | strings-control-io | Covered | J01 |
| L02-14 | `print`, `println`, `printf` with `%d %s %c %5.2f` | strings-control-io (5 mentions) | Thin | J01 |
| L02-15 | File input with `Scanner(File)`; the file must exist | strings-control-io | Thin | J01 |
| L02-16 | File output with `PrintWriter`; overwrite by default; `close()` | strings-control-io (4 mentions) | Thin | J01 |
| L02-17 | `throws` against `try-catch`; `FileNotFoundException` | strings-control-io | Thin | J01 |

### Lec03 Java methods (Quiz 1)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L03-1 | Anatomy of a declaration; parameters and return values | methods-parameters-scope | Covered | J01 |
| L03-2 | `static` against instance; calling a method | methods-parameters-scope, classes-and-objects | Covered | J01 |
| L03-3 | Flow of a call (what happens during a call) | arrays-and-methods | Thin | J01 |
| L03-4 | Pass by value, always; arrays and objects pass a reference by value | methods-parameters-scope | Covered | J01 |
| L03-5 | Common error 1 (argument and parameter mismatch) and error 2 (a missing return on one path) | methods-parameters-scope | Thin | J01 |
| L03-6 | Multiple `return` statements; `return;` in a `void` method | methods-parameters-scope | Thin | J01 |
| L03-7 | Scope: local, block, overlapping, shadowing a field | methods-parameters-scope | Covered | J01 |
| L03-8 | Javadoc comments and `@param` | none beyond 2 mentions | Thin | J01 |
| L03-9 | The six steps to write a method; repeating code as a method | none | Missing | J01 |

### Lec04 User-defined classes (Quiz 1)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L04-1 | Class and object; instantiation in one line and in two | classes-and-objects (ch 1 and ch 6) | Covered | J06 |
| L04-2 | Instance variables; default values | classes-and-objects | Covered | J06 |
| L04-3 | Constructors: default, parameterised, how many per class | classes-and-objects | Covered | J06 |
| L04-4 | Constructor chaining with `this(...)` | 5 mentions | Thin | J06 |
| L04-5 | `this` as "point to self" | 43 mentions | Covered | J06 |
| L04-6 | Setters and getters; `void` against value-returning | classes-and-objects, encapsulation | Covered | J06 |
| L04-7 | `equals` written by hand (the Account example) | object-class-casting-and-wrappers | Covered | J06 |
| L04-8 | `toString` written by hand | object-class-casting-and-wrappers | Covered | J06 |
| L04-9 | A tester class; passing objects between methods (`transferFunds`) | classes-and-objects | Thin | J06 |
| L04-10 | UML class diagram | shapes-case-study-and-uml | Covered | J06 |
| L04-11 | Method signature; overloading and what does not count as overloading | classes-and-objects (6 and 18 mentions) | Thin | J06 |
| L04-12 | Common OOP mistakes that cost marks (no `main`, file name, `static` misuse) | none | Missing | J06 |

### Lec05 Java arrays (Quiz 1)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L05-1 | Array advantages and disadvantages | arrays-and-methods | Covered | J01 |
| L05-2 | Creating and initialising: three forms; default values | arrays-and-methods | Covered | J01 |
| L05-3 | Memory model of an array; reference semantics | arrays-and-methods, drawing-memory-diagrams | Covered | J01 |
| L05-4 | `ArrayIndexOutOfBoundsException`; `length` is not `length()` | arrays-and-methods | Covered | J01 |
| L05-5 | The five standard array methods: initialise, read, print, largest index, average | arrays-and-methods | Covered | J01 |
| L05-6 | Arrays as parameters (the callee changes the caller's array) | arrays-and-methods | Covered | J01 |
| L05-7 | Arrays of `String` and of other objects; two `new`s; `NullPointerException` | arrays-and-objects | Covered | J01 |
| L05-8 | Two-dimensional arrays: `new int[r][c]`, row and column loops, ragged arrays | 2 mentions | Thin | J01 |
| L05-9 | Matrix operations: sum of a row or column, diagonal and anti-diagonal (revision guide Q6c) | none | Out of scope | J01 |
| L05-10 | Common array algorithms: copy, reverse in place, rotate, shift, remove an element, count, min and max, running total | scattered | Thin | J01 |
| L05-11 | The `Arrays` class: `toString`, `sort`, `fill`, `copyOf`, `equals`, `asList` | searching-with-the-java-library, lists-and-arraylist | Thin | J01 |

### Lec06 Recursion (Quiz 2)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L06-1 | Definition; base case; recursive case moving to the base case | recursion-in-java | Covered | J02 |
| L06-2 | Factorial, iterative and recursive; compare outputs | recursion-in-java | Covered | J02 |
| L06-3 | Trace table: level, `n`, condition, returned expression, result (`factR(5)`) | trace-tables | Covered | J02 |
| L06-4 | Recursion against iteration; convert both ways | recursion-in-java | Thin | J02 |
| L06-5 | Infinite recursion and `StackOverflowError` | recursion-in-java (11 mentions) | Covered | J02 |
| L06-6 | Exercise c, d, e: recursive `power(x, y)` and its loop version | none | Missing | J02 |
| L06-7 | Exercise f, g: Fibonacci series, iterative then recursive | recursion-in-java | Thin | J02 |
| L06-8 | Exercise h: trace `factR(7)`, `power(6, 3)`, `fibonacci(6)` | trace-tables | Thin | J02 |
| L06-9 | Counter, array, string, range recursion (sum, max, reverse, palindrome, count a character) | none | Missing | J02 |
| L06-10 | Accumulator parameters; helper methods with an extra parameter | none | Missing | J02 |
| L06-11 | Two base cases; branching recursion; counting the calls | fib mentioned | Thin | J02 |
| L06-12 | Mutual recursion (`isEven`, `isOdd`) | none | Missing | J02 |
| L06-13 | Backtracking (subsets, permutations, paths in a grid) | 2 mentions | Missing | J02 |
| L06-14 | Towers of Hanoi | none | Missing | J02 |
| L06-15 | Call stack drawn as frames (memory diagram of calls) | none | Missing | J02 |
| L06-16 | Recursive sorting steps: recursive bubble and selection sort between indexes `i` and `j` (revision guide Q2a) | none | Out of scope | J04 |

### Lec07 Algorithm analysis (Quiz 2; annotated Lec07)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L07-1 | Time against space; experimentation (`currentTimeMillis`) against methodological analysis | algorithm-analysis | Covered | J03 |
| L07-2 | Primitive operations; counting rules: statement, selection (larger branch), loop (body times count), nested loop | counting-steps | Covered | J03 |
| L07-3 | Write `T(n) =` in full, then the Big-O; keep the dominant term, drop constants | counting-steps (17 mentions) | Covered | J03 |
| L07-4 | Best, average, worst case | 23 mentions | Covered | J03 |
| L07-5 | Growth rates in order: O(1), O(log n), O(n), O(n log n), O(n squared), O(n cubed), O(2 to the n), O(n!) | algorithm-analysis | Covered | J03 |
| L07-6 | Big-O drills: simplify `7n - 3`, `8n squared log n + 5n squared + n` | counting-steps | Thin | J03 |
| L07-7 | Loop shapes: single, nested, dependent inner bound, halving, doubling, three-level, loop followed by loop, loop with a method call | counting-steps | Thin (about six shapes) | J03 |
| L07-8 | Recurrences for recursive code: `T(n) = T(n - 1) + c`, `2T(n/2) + n` | 17 hits for `T(n)`, none for recurrences of recursive methods | Thin | J03 |
| L07-9 | Complexity of library calls (`ArrayList.add`, `contains`, `remove(0)`, `String +=`) | none | Missing | J03 |
| L07-10 | Amortised cost of `ArrayList.add` | 2 mentions | Thin | J03 |
| L07-11 | Space complexity of an algorithm, including the recursion stack | 2 mentions | Thin | J03 |
| L07-12 | Big-Omega and Big-Theta; "O(n) is also O(n squared) but never write that" | none | Missing | J03 |
| L07-13 | Comparing two algorithms for a given `n` (the 2n against n cubed table) | algorithm-analysis | Covered | J03 |

### Lec08 Searching arrays (Quiz 2 for linear search)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L08-1 | Linear search on unordered and ordered arrays; both return conventions (`boolean`, index, `-1`) | linear-search (14 KB) | Covered | J04 |
| L08-2 | Linear search complexity; when to use it; why not sort first | linear-search | Covered | J04 |
| L08-3 | Binary search: requirement, halving, illustration, iterative and recursive code | binary-search (17 KB) | Covered | J04 |
| L08-4 | Lab 4: `linearSearch` on `double[]`, `binarySearch(arr, key, start, end)`, a menu loop that ends on any other key, `Math.random` data (never shown anywhere on the site) | searching-exam-drill | Out of scope | J04 |
| L08-5 | Searching objects by a field; first and last occurrence; count of matches | searching-exam-drill | Thin | J04 |

### Lec09 Sorting arrays (Test 1)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L09-1 | Bubble sort; array after each pass (63 29 72 85 18) | bubble-sort, bubble-and-selection-sort (unlisted) | Covered | J04 |
| L09-2 | Insertion sort; selection sort; the same exercise array | insertion-sort, selection-sort | Covered | J04 |
| L09-3 | Merge sort; the two operations (split, merge); the 8-element exercise | merge-sort | Covered | J04 |
| L09-4 | Quick sort (in the revision guide and Full Notes; not in Lec09) | quick-sort (7 KB) | Out of scope | J04 |
| L09-5 | Stability; worst-case contrast between merge sort and quick sort (revision guide Q2b) | choosing-an-algorithm | Out of scope | J04 |
| L09-6 | Lab 5: `mergeSort` that returns a sorted array and uses the supplied `merge(arr, s, m, e)`; fix the errors in the given method; random marks in a loop | merge-sort | Out of scope | J04 |
| L09-7 | Counting comparisons and swaps | 100 mentions | Covered | J04 |

### Lec10 Packages

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L10-1 | Built-in packages; `import` forms | built-in-packages-and-imports | Covered | J05 |
| L10-2 | Choose a name, create, compile with `-d`, use, test | creating-a-package, compiling-and-running | Covered | J05 |
| L10-3 | Name conflicts; access across packages (`protected`, package-private); static imports | 4 mentions of static import | Thin | J05 |

### Lec11 OOP (Test 1, Lab 5 and 6)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L11-1 | Goals and advantages of OOP; the four pillars | what-is-oop | Covered | J06 |
| L11-2 | Inheritance: `extends`, constructors with `super(...)`, what a subclass can and cannot do | inheritance-and-super | Covered | J06 |
| L11-3 | Types of inheritance in Java; the class hierarchy; `Object` | inheritance-and-super | Thin | J06 |
| L11-4 | `Object` methods: `toString`, `getClass`, `equals`; what the default prints | object-class-casting-and-wrappers | Covered | J06 |
| L11-5 | Overriding rules; `@Override`; partial overriding with `super.method()` | overriding-and-polymorphism | Covered | J06 |
| L11-6 | A better `equals` (the two possible implementations) and `hashCode` kept in step | object-class-casting-and-wrappers (9 mentions of `hashCode`) | Thin | J06 |
| L11-7 | Casting (upcast, downcast, `instanceof`); wrapper classes; autoboxing against unboxing | object-class-casting-and-wrappers | Covered | J06 |
| L11-8 | Encapsulation: how it is achieved; advantages | encapsulation | Covered | J06 |
| L11-9 | Polymorphism: a subclass is compatible with its superclass; by overriding; by overloading; reference types only | overriding-and-polymorphism | Covered | J06 |
| L11-10 | Abstract classes: syntax, access modifiers, abstract methods | abstract-classes-and-interfaces | Covered | J06 |
| L11-11 | Interfaces: implement, multiple interfaces, UML | abstract-classes-and-interfaces | Covered | J06 |
| L11-11a | An interface extending another interface (Lec11 slide 89) | only mentioned in passing for `Queue<E> extends Collection<E>` | Missing | J06 |
| L11-12 | Default and static interface methods (Java 8) | 1 mention | Thin | J06 |
| L11-13 | Built-in interfaces (`Comparable`, `Runnable`, `Iterable`) | comparable-and-comparator | Thin | J06 |
| L11-14 | Lab 5: UML for `Doctor`, `GP`, `Surgeon`; overriding `tagName` and `calculatePay`; a tester that reads `data.txt` with optional fields and writes three files | shapes-case-study-and-uml | Out of scope | J06 |
| L11-15 | Lab 6: abstract `Employee` with `computeSalary`, overloaded constructors, `Teacher` and `Admin` with their own `equals`, a payroll tester with totals; interface `Test`, `Test2` | abstract-classes-and-interfaces | Out of scope | J06 |
| L11-16 | Access modifiers on members: `private`, default, `protected`, `public` in a table of who can see what | 12 and 16 mentions | Thin | J06 |
| L11-17 | `static` members: counters, constants, utility methods, and why a static method cannot touch an instance field | 40 mentions | Covered | J06 |
| L11-18 | Dynamic dispatch against static type: what runs for `Shape s = new Circle()` | overriding-and-polymorphism | Thin | J06 |
| L11-19 | Overloading against overriding in one table; `final` classes and methods | none | Missing | J06 |
| L11-20 | Valid or not valid? Which assignments, casts and calls compile (exam form) | none | Missing | J06 |

### Lec12 Generics (Lab 7)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L12-1 | What generics are; advantages (type safety, no casts) | why-generics | Covered | J07 |
| L12-2 | Generic class: syntax, type parameter naming (`T`, `E`, `K`, `V`), two type parameters | generic-classes | Covered | J07 |
| L12-3 | Creating objects of a generic class; the diamond | generic-classes | Covered | J07 |
| L12-4 | Bounded types: `T extends Number`, `T extends Comparable<T>` | bounds-and-comparable | Covered | J07 |
| L12-5 | Generic method (`printArray`); calling it with several types | generic-methods-and-interfaces | Covered | J07 |
| L12-6 | Generic interface; the implementing class must be generic | generic-methods-and-interfaces | Covered | J07 |
| L12-7 | Lecture exercise: print `Character`, `String`, `Float` arrays with one method | none | Missing | J07 |
| L12-8 | Lab 7: generic `Set<T>` over an array of 10; `add` into the first empty cell; `remove` by `equals`; `search`; try a `String` in a `Set<Integer>` and read the compile error | generic-classes | Thin | J07 |
| L12-9 | Lab 7: `Pair<T extends Number, U extends Number>` with `add`, `multiply`, `subtract`, `divide` across `Integer`, `Double`, `Float` | bounds-and-comparable | Thin | J07 |
| L12-10 | Lab 7: the `BigAndSmall` interface (slides 23 and 24) | none | Missing | J07 |
| L12-11 | Wildcards: `?`, `? extends`, `? super`; the PECS rule | wildcards-and-variance | Covered | J07 |
| L12-12 | Erasure; what generics cannot do (no `new T()`, no `T[]`, no primitives, no `instanceof List<String>`) | 4 and 3 mentions | Thin | J07 |
| L12-13 | Raw types and unchecked warnings | none | Missing | J07 |
| L12-14 | Why does this not compile? (exam form) | none | Missing | J07 |

### Lec13 Java Collection Framework (Test 2; Lab 8)

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L13-1 | `Arrays.sort()` and the `Arrays` class; sorting objects | searching-with-the-java-library | Thin | J08 |
| L13-2 | The Collection hierarchy: `Iterable`, `Collection`, `List`, `Set`, `Queue`, `Map` | core-interfaces (2 KB) | Thin | J08 |
| L13-3 | Arrays against collections: growth, insert in the middle | framework-and-generics (2 KB) | Thin | J08 |
| L13-4 | Iteration: for, for-each, `Iterator` (`hasNext`, `next`, `remove`) | collections-and-iterators | Covered | J08 |
| L13-5 | `ConcurrentModificationException` and the safe ways to remove while looping | collections-and-iterators (7 mentions) | Covered | J08 |
| L13-6 | `ListIterator`; `Iterable` implemented by your own class | none | Missing | J08 |
| L13-7 | `List` operations; `ArrayList` methods; `remove(int)` against `remove(Object)` | lists-and-arraylist | Covered | J08 |
| L13-8 | `Collections.sort`; it uses merge sort; `Comparable.compareTo` and its return value | comparable-and-comparator | Covered | J08 |
| L13-9 | A `Book` class implementing `Comparable`; sorting a list of books | comparable-and-comparator | Covered | J08 |
| L13-10 | `LinkedList` as a `List`: head, nodes, `addFirst`, `removeLast`, `get(i)` cost | `addFirst`, `addLast` and `removeLast` appear only in chapters 9 and 10, never in `08-collections` | Missing | J08 |
| L13-11 | `Stack` class; `Queue` interface; `PriorityQueue` with natural order and with a `Comparator` | stacks-and-queues-in-java | Thin | J10 |
| L13-12 | `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`) and `Map` (`HashMap`, `TreeMap`): no duplicates, iteration order | choosing-a-collection (2 KB) | Thin | J08 |
| L13-13 | `Collections` utilities: `reverse`, `shuffle`, `max`, `min`, `frequency`, `unmodifiableList` | 13 mentions | Thin | J08 |
| L13-14 | `toArray`; `Arrays.asList` is fixed size | 1 mention | Thin | J08 |
| L13-15 | Lab 8: `Person implements Comparable` on `fullname`; read records from a file into an `ArrayList`; `remove(8)` on a short list and what it throws; memory diagram; sort | lists-and-arraylist | Out of scope | J08 |
| L13-16 | Lab 8: `LinkedList<String>` of course names; every `add` and `remove` variant; `contains`; `toArray` and for-each | none in `08-collections` | Out of scope | J08 |
| L13-17 | Choose a collection for a scenario and justify (exam form) | choosing-a-collection | Thin | J08 |

### Lec14 Linked list implementation

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L14-1 | A recursive data structure; nodes; head; types of lists; benefits | linked-lists-explained | Covered | J09 |
| L14-2 | A nested (inner) `Node` class and why classes are nested | none | Missing | J09 |
| L14-3 | `isEmpty`, `size`, `contains` by traversal | linked-lists-explained | Covered | J09 |
| L14-4 | `addLast`, `addFront`, add at position `i`: the steps and the null checks | linked-lists-explained, linked-lists-and-traversal | Covered | J09 |
| L14-5 | `removeFront`, `removeLast`, `remove(int i)` | linked-lists-explained | Covered | J09 |
| L14-6 | Lecture exercise: print "Found it" if the list holds 120 | linked-lists-and-traversal | Thin | J09 |
| L14-7 | Pointer-by-pointer trace for each operation, with a memory diagram | linked-lists-explained (scenarios `llbuild`, `lltrav`) | Thin | J09 |
| L14-8 | Dummy head (sentinel); tail pointer; why each removes a special case | 7 and 12 mentions | Thin | J09 |
| L14-9 | Reverse (iterative and recursive); find the middle (fast and slow); detect a cycle | 10, 37, 5 mentions | Thin | J09 |
| L14-10 | Merge two sorted lists; remove duplicates; insert in sorted order | none | Missing | J09 |
| L14-11 | Doubly linked list: `prev` and `next`, insert and delete | 13 mentions (`dll` scenario) | Thin | J09 |
| L14-12 | Circular linked list | 1 mention | Missing | J09 |
| L14-13 | Traversal that computes a value (revision guide Q1: weighted index over nodes holding arrays; guard the division by zero) | none | Out of scope | J09 |
| L14-14 | Linked list against array: cost table for each operation | cheat-sheet | Covered | J09 |

### Lec15 Stack implementation, plus the queue material of the Full Notes and the revision guide

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| L15-1 | Stack review: LIFO, `push`, `pop`, `peek`, `isEmpty`, illustration of methods | stacks-and-queues-explained | Covered | J10 |
| L15-2 | Array stack: `isEmpty`, `size`, `isFull`, `push`, `peek`, `pop`, `search`; overflow and underflow | stacks-and-queues-explained | Covered | J10 |
| L15-3 | Linked stack: `push` a node, `peek`, `pop`, `size`, `search` | stacks-and-queues-explained | Covered | J10 |
| L15-4 | Advantages against disadvantages of each | stacks-and-queues-explained | Thin | J10 |
| L15-5 | Stack applications: brackets, reversing, undo, call stack | 22 mentions | Covered | J10 |
| L15-6 | Postfix evaluation | 7 mentions | Thin | J10 |
| L15-7 | Infix to postfix with every push and pop (revision guide Q6d: `( X + Y ) * Z - ( W / V )`) | 1 mention | Out of scope | J10 |
| L15-8 | Next greater element; span; two stacks in one array; a queue from two stacks | 1 mention | Thin | J10 |
| L15-9 | Queue: FIFO; array queue and its waste of space | stacks-and-queues-in-java | Covered | J10 |
| L15-10 | Circular queue: front, back, size; `isFull` when size equals capacity; `back = (back + 1) % capacity` (revision guide Q5a) | stacks-and-queues-in-java (14 mentions) | Out of scope | J10 |
| L15-11 | Linked queue: head and tail, enqueue at the tail, dequeue at the head | 7 mentions | Thin | J10 |
| L15-12 | Deque (double-ended queue) and its four operations | 25 mentions | Thin | J10 |
| L15-13 | Priority queue: the idea, `java.util.PriorityQueue`, ordering with a `Comparator`; the heap behind it (Full Notes pp. 41 to 44) | 13 mentions | Out of scope | J10 |
| L15-14 | Queue applications: print queue, breadth-first order, round robin, a bank | none | Missing | J10 |
| L15-15 | Trace the contents of a stack or queue after a list of operations (exam form) | stacks-and-queues-explained | Thin | J10 |
| L15-16 | A string-manipulation task with a queue or stack (revision guide Q5b: shift the first y vowels, count the changes) | none | Out of scope | J10 |

### Revision guide and checklist items that cross chapters

| ID | Item | Now | State | Lane |
|---|---|---|---|---|
| RG-1 | Read a text file line by line; for lines ending in `?` count words and return the average (Q3a) | strings-control-io | Out of scope | J01 |
| RG-2 | Parse CSV with missing fields; handle missing values gracefully | none | Out of scope | J01 |
| RG-3 | Adjacency matrix to adjacency list (Q6a) | none (CSI323 04-graphs) | Out of scope | CSI323 |
| RG-4 | Balanced BST from a sorted list; pre-order (Q6b); smallest value in the right subtree (Q3b) | none (CSI323 01-trees) | Out of scope | CSI323 |
| RG-5 | Greedy truck loading and coin change; where greedy fails (Q4) | none | Out of scope | J04 |
| RG-6 | Employee performance index over a linked list (Q1) | none | Out of scope | J09 |
| RG-7 | Differences reference, items A to T of the checklist (objects and classes; the three kinds of variable; instance against static variable; static against instance method; constructor against method; setter against getter; `void` against value-returning; definition against invocation; overloading against overriding; primitive against reference; `==` against `equals`; `length` against `length()` against `size()`; compile-time against run-time error; array advantages and disadvantages; recursion against iteration; base case against recursive case; best, average, worst; experimentation against methodology; linear against binary search; growth rates ranked) | cheat sheets in part | Out of scope | J01 to J10 (one flashcard each) |

## 5. Sibling concepts nobody named (withdrawn)

Withdrawn on 2026-11-02 by the scope rule at the top of this file: the lectures are the whole course, so siblings from outside them are not added. The list is in the git history of this file (commit `6d5837f`).

## 6. Lanes

One lane owns one chapter's new files. Section 7 of the brief says how a lane writes. All new lessons live in `content/docs/sem3/csi247/<chapter>/notes/`.

| Lane | Chapter | New lessons (slugs) | Needs from this audit |
|---|---|---|---|
| J02 | 02 recursion | `recursion-by-example`, `recursion-exam-practice` | L06-4 to L06-15 |
| J03 | 03 time-complexity | `complexity-by-example`, `complexity-exam-practice` | L07-6 to L07-12 |
| J09 | 09 linked-lists-traversals | `linked-list-operations-by-example`, `linked-list-patterns-by-example`, `linked-list-exam-practice` | L14-2 to L14-14, RG-6 |
| J10 | 10 stacks-and-queues | `stack-and-queue-implementations-by-example`, `stack-and-queue-applications-by-example`, `stacks-and-queues-exam-practice` | L15-4 to L15-16, L13-11 |
| J07 | 07 generics | `generics-by-example`, `generics-exam-practice` | L12-7 to L12-14 |
| J08 | 08 collections | `collections-by-example`, `iterators-by-example`, `collections-exam-practice` | L13-1 to L13-17, L01-6 |
| J06 | 06 object-oriented-programming | `classes-and-constructors-by-example`, `inheritance-and-polymorphism-by-example`, `object-methods-by-example`, `abstract-and-interfaces-by-example`, `oop-exam-practice` | L04-4, L04-9 to L04-12, L11-3 to L11-20 |
| J01 | 01 java-fundamentals | `what-is-a-data-structure`, `control-flow-by-example`, `methods-by-example`, `arrays-and-matrices-by-example`, `file-io-by-example`, `fundamentals-exam-practice` | L01-1 to L01-5, L02-7 to L02-17, L03-3 to L03-9, L05-8 to L05-11, RG-1, RG-2 |
| J04 | 04 sorting-and-searching | `recursive-sorts-by-example`, `greedy-algorithms-by-example`, plus a `QuickSortStory` | L06-16, L08-4, L08-5, L09-4, L09-6, RG-5 |
| J05 | 05 packages | `packages-exam-practice` | L10-3 |
| JR | all | flashcards, quiz, practice per chapter | RG-7 and every row marked Thin |
| JD | all | `public/files/sem3/csi247/downloads`, `scripts/verify-java-files.mjs` | every complete program |
| JA | repository | depth rule in `scripts/audit-content-standard.mjs` and `docs/content-standard.md` | none |

Order of writing (thinnest first): J02, J03, J09, J10, J07, J08, J06, J01, then J04 and J05.

## 7. What a finished chapter holds, in numbers

Targets taken from CSI243 and scaled to the chapter. A lane reports against these.

| Measure | Target per chapter |
|---|---|
| By-example lessons | one to three, 25 to 60 KB each |
| Concepts per by-example lesson | 6 to 14 `##` sections |
| Worked variations per concept | at least 3, usually 4 to 6 |
| Complete programs with a real output | at least 15 per by-example lesson |
| Exam questions with four-step answers | one per concept, and 12 to 20 in the exam-practice lesson |
| Flashcards | 20 to 30, each testing a distinction |
| Quiz questions | 20 to 40 with `optionFeedback` |
| Practice questions | 8 to 12 with marks and a model answer |
| Downloads | a completed file and a starter file for every complete program |

## 8. Questions for the owner

1. **Past papers.** Are the Test 1, Test 2 and quiz papers (and last year's final) anywhere? The audit is syllabus-driven; papers would show which exam forms are real.
2. **Missing labs.** Lab 2, Lab 3 and any lab after Lab 8 (linked lists, stacks, queues) are not in the vault.
3. **Trees and graphs in the exam.** The outline and the revision guide include them; they live in CSI323 now. Should the CSI247 overview link forward to those topics, so a student revising for the CSI247 final finds them?
4. **Greedy and CSV parsing.** They appear only in the revision guide. Examined, or a coursemate's extra? (Lane J04 and J01 add a short section either way.)
5. **The unlisted `bubble-and-selection-sort` page** (CSI247-15): merge, or list?
