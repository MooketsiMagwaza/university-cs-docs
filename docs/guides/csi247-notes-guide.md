# Writing CSI247 notes in the CSI243 style

This guide is for whoever builds out CSI247 Data Structures (a Codex agent or a human). CSI243 Functional Programming is the reference course: its chapters are the model for how a finished course looks, reads and is checked. Follow it, adapt it for Java, and do not copy its Haskell-specific parts.

Read this alongside [`components/README.md`](../../components/README.md) (component reference) and [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (content and provenance rules).

## 1. Where things stand

CSI247 lives in `content/docs/sem3/csi247/`. Each topic folder currently holds only four pages (`index`, `questions`, `review`, `resources`). There are no lesson notes and no cheat sheets, so the course reads as an outline with practice attached.

| Topic folder | Today |
|---|---|
| `java-fundamentals` | index, questions, review, resources |
| `recursion` | index, questions, review, resources |
| `time-complexity` | index, questions, review, resources |
| `sorting-and-searching` | index, questions, review, resources |
| `arrays-and-arraylists` | index, questions, review, resources |
| `collections` | index, questions, review, resources |
| `linked-lists-traversals` | index, questions, review, resources |
| `stacks-and-queues` | index, questions, review, resources |
| `linear-structures` | Hidden in `meta.json`; overlaps with the two topics above |

The goal is to give every topic the same shape CSI243 chapters have, with real lesson notes at the centre.

## 2. The target shape of a chapter

Copy the CSI243 layout. For example, CSI243 chapter 5:

```text
content/docs/sem3/csi243/05-recursion/
  meta.json               page order for the chapter
  index.mdx               chapter overview and learning path
  notes/
    meta.json             lesson order
    how-recursion-works.mdx
    dry-running.mdx
    writing-recursive-functions.mdx
    termination-and-errors.mdx
  cheat-sheet.mdx         lookup page: templates, one example each, no long explanations
  questions.mdx           exam-style practice with marks and hidden solutions
  review.mdx              flashcards plus a quiz
  resources.mdx           curated official references
```

For CSI247, a chapter folder should be:

```text
content/docs/sem3/csi247/<topic>/
  meta.json               { "title": "...", "pages": ["index", "notes", "cheat-sheet", "questions", "review", "resources"] }
  index.mdx
  notes/
    meta.json             { "title": "Notes", "pages": ["<lesson-1>", "<lesson-2>", ...] }
    <lesson-1>.mdx
    ...
  cheat-sheet.mdx
  questions.mdx           (keep and improve what exists)
  review.mdx              (keep and improve what exists)
  resources.mdx           (keep and improve what exists)
```

Rules for folders and names:

- **Do not rename existing topic folders unless it is agreed first.** Renaming changes public URLs, and quiz and flashcard data paths mirror the folder names. If you do rename, add redirects in `next.config.mjs` (CSI243 did this for moved notes), update every internal link, and move the matching data files.
- Lesson files use kebab-case names that say what the lesson teaches. Number the lesson titles in frontmatter (`"3. Writing Recursive Functions"`), as CSI243 does.
- Add each new folder or page to the right `meta.json`, otherwise it will not appear in the sidebar. The course-level `meta.json` already lists the topics; keep `linear-structures` hidden or merge its content into `linked-lists-traversals` and `stacks-and-queues`, but do not leave two copies of the same material live.

## 3. Anatomy of each page type

### Chapter overview (`index.mdx`)

Frontmatter with title `Chapter Overview`, then:

- A short opening that says what the chapter is for and why it matters in the course.
- A table of lessons in order: `| Order | Lesson | Main question |`, each lesson linked, each with the single question the lesson answers.
- A line pointing to practice questions and review after the notes.
- A `<Checklist>` of the chapter's key rules and a short list of chapter outcomes.

See `content/docs/sem3/csi243/05-recursion/index.mdx`.

### Lesson notes (`notes/*.mdx`)

A lesson teaches one idea completely. The CSI243 lessons share a rhythm; reproduce it:

1. **Frontmatter**: `title` (numbered) and a `description` that says what the student can do afterwards.
2. **An opening paragraph** that states the problem the lesson solves, assuming no more than the previous lessons taught.
3. **Numbered sections**, each introducing exactly one new thing. Define every term and symbol the first time it appears.
4. **A worked example for every idea**, always in the same order: purpose, the code, the exact output, then a line-by-line explanation. Then a second example in a different domain, so the idea is not tied to one example.
5. **A trace or diagram when behaviour is not obvious**: a step-by-step trace for algorithms (`<StepByStep>`), a `<SiteDiagram>` for structures (linked lists, stacks, queues, trees, call trees), and `<ComparisonTable>` for side-by-side comparisons.
6. **Show the wrong version too.** Put the common mistake next to the fix, using `<CommonMistake>` and a "Common errors" table (attempt, what happens, repair). Show what the language actually reports, copied from a real run.
7. **A knowledge-check quiz after each concept**, not just at the end.
8. **A practice section** with numbered tasks, with answers hidden in `<Accordions>`.
9. **A `<Checklist title="Mastery check">`** of "I can ..." statements, then a closing link to the next lesson.

Useful components, in the order CSI243 uses them most: `Checklist`, `Quiz`, `Callout`, `Accordions`/`Accordion`, `SiteDiagram`, `ComparisonTable`, `StepByStep`/`Step`, `CommonMistake`, `RecognitionStrategy`. The full list and props are in `components/README.md`. Components are registered globally, so never import them in MDX.

### Cheat sheet (`cheat-sheet.mdx`)

A lookup page, not a lesson. Placeholder table first, then one template and one example per idea, with no long explanations and a link back to the notes. See `content/docs/sem3/csi243/05-recursion/cheat-sheet.mdx`.

### Practice questions (`questions.mdx`)

Exam-style questions using `<ExamQuestion title="Question 1: ... [12 marks]">` with `<SubQuestion part="a" prompt={...} solution={...} />`. Show the mark for each part and write the solution as a model answer that says where marks are earned. Keep the existing CSI247 questions that are sound, and extend them rather than replacing them.

### Review (`review.mdx`)

A flashcard deck plus a quiz, both loaded from data files (see section 6). Do not write questions inline in the MDX.

### Resources (`resources.mdx`)

`<ResourceGrid>` of `<ResourceCard>` entries linking to authoritative references (for CSI247: the Java Language Specification, the official Java tutorials, the `java.util` API documentation). Describe what each link is good for. Lecture files under `public/files/sem3/csi247` are shown with `<ResourceHub />` and indexed in that folder's `meta.json`.

## 4. How CSI243 teaches, and what to carry over

These are habits, not decoration. They are what make the course usable.

- **Start from zero and say so.** Do not assume vocabulary. The first lesson of a chapter says what the reader needs, and links to it.
- **Specification before code.** State what a method must do, with examples and edge cases, before writing it. CSI243 uses a six-part process (purpose, examples, domain and edge cases, signature, implementation with a dry run, verification). Use the same process for Java methods, with the signature as the Java method header.
- **Trace by hand.** Every algorithm gets a dry run with the intermediate state written out line by line (array contents after each pass, the stack after each push, the call tree for recursion). Students are marked on this.
- **Test the boundaries.** For every method list normal, boundary and invalid inputs, including empty collections, a single element, the first and last index, duplicates and already-sorted or reverse-sorted data.
- **Every claim about what the language does must come from running it.** CSI243 found several wrong statements in existing notes by checking them against GHC. Do the same with the JDK: compile and run every sample, and copy the real output and the real compiler and exception messages.
- **Be precise about cost.** For data structures, give the time and space cost of each operation, say whether it is average or worst case, and show where the cost comes from.
- **Plain, direct prose.** No filler, no emojis, no marketing tone. Prefer a short sentence to a clever one. Use local names (Kago, Naledi, Thato) and Botswana-relevant scenarios where an example needs a context.

## 5. Java-specific guidance

- Code fences use ` ```java `. Terminal output uses ` ```text `. Show `javac` errors and exception stack traces in ` ```text ` blocks, copied from a real run.
- Prefer **complete, runnable examples** (a class with `main`) for anything a student might type in. Use fragments only when a full program would hide the idea, and say they are fragments.
- **Check the Java version the course uses** before you start. The existing CSI247 text mentions Java 8 in one place, and JDK 21 is common on student machines. Compile with `javac --release 8` if the course targets Java 8, and avoid features newer than the course version (`var`, records, text blocks, switch expressions) unless a lesson is explicitly about them.
- Use the course's input style where input is taught (`Scanner`), but keep most examples input-free so the output is deterministic and checkable.
- Draw structures with `<SiteDiagram>`: array layout, linked-list nodes and references, stack and queue states, binary trees and recursion call trees. A diagram should show state at a moment in time, not just a box labelled "linked list".
- There is **no in-browser Java runner**, because Java cannot run in the browser without a server or a large runtime. Do not use `<HaskellTryIt>`. Make examples self-contained and show the exact output so the student can compare it with their own run. Describe the compile-and-run commands once per chapter.
- Algorithm lessons (sorting, searching, linked lists, stacks, queues) should each include: the idea in one sentence, pseudocode or a trace on a small input, the Java implementation, the cost analysis, a complete runnable program with its output, and the common mistakes (off-by-one errors, null handling, modifying a collection while iterating).

## 6. Quizzes and flashcards

Quiz questions and flashcards are data, kept out of the MDX.

- **Flashcards**: `content/flashcard-data/sem3/csi247/<topic>/flashcards.ts` exports `flashcardData`, an array of `{ front, back }`. Cards should test distinctions and reasons ("why must the base case come first?"), not just definitions.
- **Quizzes**: today CSI247 uses TypeScript modules at `content/quiz-data/sem3/csi247/<topic>/<name>-quiz.ts` exporting `quizData`, imported at the top of `review.mdx`. A JSON format with a `<QuizRef />` tag is in review in pull request #52. Check `components/README.md` on `main` at the start of your work to see which format is current, and use that one. Do not mix the two inside one chapter.
- Every question needs `question`, `options`, `correctIndex`, an `explanation`, and, for new questions, `optionFeedback` with one entry per option explaining why that option is wrong.
- Write scenario questions as well as recall questions: a short Java snippet or situation, four plausible options, and feedback that diagnoses each wrong answer. Verify any code in a question by compiling and running it.

## 7. Before you open a pull request

1. Every Java sample compiles and runs, and the shown output matches a real run. Record the JDK version you used.
2. `npm run check` passes (type check and production build).
3. Run any audit script that applies to the files you touched (see `package.json` and `scripts/`).
4. Every new page is listed in the right `meta.json`, and every internal link resolves.
5. No question or answer text is copied from a source without permission. Follow [`CONTENT_POLICY.md`](../../CONTENT_POLICY.md) for provenance.
6. `WORK_ORDERS.md` is updated: set the status of the work order you completed, with the acceptance check verified.

## 8. Git conventions

- Branch names: `feat/csi247-<short-description>`, for example `feat/csi247-recursion-notes`.
- Commit messages: Conventional Commits with the course as scope, for example `feat(csi247): add recursion lesson notes and cheat sheet`.
- **Do not add `Co-Authored-By` or any attribution line** to commits or pull-request descriptions.
- Keep pull requests small: one chapter (or one page type across a few chapters) per pull request, so review stays practical.
- Stage only the files that belong to your change.

## 9. Reference map: read these first

| What you are building | Look at |
|---|---|
| Chapter overview | `content/docs/sem3/csi243/05-recursion/index.mdx` |
| A lesson with traces and a worked example flow | `content/docs/sem3/csi243/05-recursion/notes/writing-recursive-functions.mdx` |
| A lesson that corrects a misconception | `content/docs/sem3/csi243/05-recursion/notes/termination-and-errors.mdx` |
| Cheat sheet | `content/docs/sem3/csi243/05-recursion/cheat-sheet.mdx` |
| Practice questions | `content/docs/sem3/csi243/05-recursion/questions.mdx` |
| Review page and its data | `content/docs/sem3/csi243/05-recursion/review.mdx`, `content/flashcard-data/sem3/csi243/05-recursion/flashcards.ts` |
| Resources page | `content/docs/sem3/csi243/05-recursion/resources.mdx` |
| Course-level `meta.json` ordering | `content/docs/sem3/csi243/meta.json` |
| Component props | `components/README.md` |
