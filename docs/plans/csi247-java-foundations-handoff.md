# Handoff: CSI247 in the style of "Java Foundations" (updated 2026-10-25)

The owner asked for two things: continue the open work orders, and make the CSI247 content "like" `java-foundations.html` (a copy is in the owner's Downloads and in the vault under `Semester_3_Vault/Current/CSI247/Revision/`). The work is on branch `feat/csi247-java-foundations` (worktree `C:/wt/csi247-foundations`, cut from `origin/main` at 37c28ce). It is committed locally and not pushed. Work orders CSI247-11 and CSI247-12 in `WORK_ORDERS.md` track it.

## What the reference is

One HTML file with 40 pages: lessons written from zero with a four-box frame (idea, definition, why it works, what it is for), objectives, key terms, steps, asides, numbered listings with their output, SVG figures, a step-through memory-diagram stepper (13 scenarios), trace tables whose rows reveal one at a time, exam drills (searching, sorting, counting steps for T(n), "valid or not valid"), a cheat sheet, a 112-term glossary and appendices. It stops at stacks and queues. Hash tables, trees and graphs (chapters 11 to 13) have no source and still need lessons in the same style (CSI247-12).

## Done

- **Converter** `scripts/convert-java-foundations.mjs <html> .tmp/jf`: writes `lessons/`, `skipped/`, `reference/` (cheat sheet, glossary, appendix), `figures/` and `report.json`. It runs the reference's own JavaScript for the four figures it draws at load time. Run `node scripts/check-mdx.mjs .tmp/jf` to compile the output. `.tmp/` is not committed; rerun the converter to get it back.
- **Components** (documented in `components/README.md`, styled in `app/styles/java-lessons.css`, registered in `components/mdx.tsx`, added to the audit vocabulary and to `docs/content-standard.md` section 2.3): `ConceptFrame` with `FrameBox`, `TraceTable`, `SvgFigure` (data in `content/figure-data`, loader `lib/figure-data.ts`) and `MemoryDiagram` (engine `lib/csi247/memory-diagram.ts`, 13 scenarios in `lib/csi247/memory-scenarios.ts`, `npm run test:memory-diagram`, 9 tests, part of `test:unit`). `LearningObjectives` renders `code` in backticks. The files type-check on their own (a scoped `tsc`); the whole-project `npm run types:check` has not been run.
- **Lessons placed** in chapters 1, 2, 3, 4, 6, 8, 9 and 10: 23 new and 7 smaller ones replaced at their old URLs (`recursion-in-java`, `algorithm-analysis`, `bubble-sort`, `selection-sort`, `inheritance-and-super`, `overriding-and-polymorphism`, `abstract-classes-and-interfaces`), with their `QuizRef` kept at the end. `encapsulation-and-abstraction` became `encapsulation` (quiz data moved, redirects in `next.config.mjs`, aliases updated). `notes/meta.json` and the Overview tables are in the new order. Not used because the existing lessons are deeper: linear search, binary search, insertion sort, merge sort, packages and generics (converted into `.tmp/jf/skipped`). Links to those pages point at the existing lessons.
- **Checks that pass:** `check-mdx` (120 of 120 CSI247 pages), `npm run audit:quizzes` (267 quizzes, 1,050 questions), `node scripts/audit-content-standard.mjs --course csi247` (no structure findings; 75 findings, all `notes-quiz`, `retired-component` or `Accordion` on old pages, 4 of them carried over with the replaced lessons).
- **Java listings:** `node scripts/verify-csi247-listings.mjs` compiles with `javac --release 8` and runs every complete program, with the classes declared earlier on the page. 15 programs ran: 9 match the output shown, 6 show no output, 0 differ, 0 fail. The other 88 listings are fragments (statements, one class of a pair) and are not checked. Two lessons used the Java 9 method `List.of`; they now use `Arrays.asList`. The existing generics lessons still use `List.of`.

## Added after the first push (2026-10-26)

- **Cheat sheets** for the 11 chapters that had none (CSI247-14), every output from a real run; **the depth model** in `docs/guides/csi243-depth-model.md` (the measured gap, the five layers, the anatomy of a by-example lesson, an exam-practice lesson and a cheat sheet, and what each chapter needs); the first by-example lesson, `11-hash-tables/notes/hash-tables-by-example` (the pattern to copy). `.tmp/fill-outputs.mjs` (not committed) fills `@@OUTPUT@@` text fences from real runs: write a program, put `@@OUTPUT@@` in the text fence below it, run it. Keep a copy of that script in `scripts/` if it is wanted again.
- **Diagrams** (CSI247-13, the owner's first main fix): all 52 Mermaid charts became `SvgFigure`s drawn by `scripts/lib/flow-svg.mjs`; Mermaid is retired in the docs and the audit. Left: the 52 Tailwind `not-prose` blocks, then removing the `Mermaid` component and the `mermaid` dependency.
- **CI fix:** `tests/java-playground.spec.ts` expected the old Java output limit (500 lines or 64 KiB); the runner now allows 2,000 lines or 256 KiB. The spec was updated; CI had not re-run when this was written.

## Left, in order

1. **Look at it in a browser** at 1280px and 375px, light and dark (never done; the machine had under 600 MB free): a lesson with a frame and a figure, `drawing-memory-diagrams` (all four steppers, Next/Back/Jump/Start again, keyboard, the legend), `trace-tables` and `searching-exam-drill` (the reveal buttons; rows are hidden until hydration), `lists-and-arraylist` and `linked-lists-explained`. Start the dev server only with no game running and about 3 GB free. Watch for console errors (hydration warnings from `TraceTable`), SVG colours in dark mode, and the memory-diagram minimum width on a phone.
2. **Cheat sheets, glossary and appendices:** `.tmp/jf/reference/{cheat,glossary,appendix}.mdx` are converted but not placed. Split the cheat sheet per chapter, put the glossary on the course Resources page, and turn appendix F (review questions) into quiz data. Links to those pages currently point at `/docs/sem3/csi247/resources`.
3. **By-example and exam-practice lessons** for every other chapter (CSI247-14), in the order 02, 03, 09, 10, 07, 08, 06, 01 (chapters 1 to 10 only: since 2026-10-26 CSI247 ends at stacks and queues); then the Review, Practice and downloads. Start with the gap audit and the Java brief.
3a. **Review and Practice for the new lessons:** flashcards and quiz questions for casting, `equals`, `toString`, memory diagrams, trace tables and the drills (CSI247-08 and CSI247-09 ask for them), and the three misconception questions in CSI247-09a. The new lessons carry their own Check your understanding sets (3 to 6 questions).
4. **Overlap:** `linked-lists-explained` and `stacks-and-queues-explained` sit before the older `linked-lists-and-traversal` and `stacks-and-queues-in-java`; the older ones hold the exam practice, variants and circular queue. Decide whether to merge them.
5. **Quick sort animation:** the reference has one (`ALG.quick` in its script); the site has stories for bubble, selection, insertion and merge sort only (`components/interactive/simple-sort-stories.tsx`).
6. **Hash tables, trees and graphs** now belong to CSI323 (Semester V, marked work in progress): their lessons, cheat sheets and the by-example hash tables lesson moved there on 2026-10-26. Writing them to CSI243 depth is CSI323-01 in `WORK_ORDERS.md`. Memory diagrams for recursion call stacks stay in CSI247.
7. Run `npm run types:check` and `npm run test:unit` when memory allows, and fix whatever they find.

## Gotchas

- The main tree (`C:/Users/Nido/Desktop/Projects/Active/university-cs-docs`) holds the owner's own uncommitted files (`app/docs/[[...slug]]/page.tsx`, `app/llms.mdx/...`, `app/og/...`, `content/docs/sem3/csi213/index.mdx`, `meta.json`, `.claude/`, `CLAUDE.md`, `vercel.json`, `scripts/vercel-ignore-build.mjs`). Never stage them; work in the worktree.
- MDX: blank lines around every component tag and fence; the converter escapes `{ } < > $ * _` in prose. `$` matters because the site uses `remark-math`.
- Commit messages follow Conventional Commits with the scope `csi247`, no `Co-Authored-By` line, and nothing is pushed unless the owner asks.

## Repository state (checked 2026-10-25)

- `origin` has only `main`; no open pull requests. Local branches `feat/csi243-notes-overhaul`, `feat/csi243-ui-and-quiz-data`, `feat/csi247-merge-storytelling` and `feat/haskell-runner-patterns` were never merged (the last has 39 modified and 4 untracked files of the owner's in `C:/wt/csi243-playground`; leave them).
- `feat/csi213-test2-study-content`, `feat/csi243-exam-depth` and `feat/csi243-proofs-hof-custom-types` are merged and can be deleted locally.
- Thirteen leftover lane worktrees `C:/wt/lane-F4` to `F10` and `V11` to `V16` hold nothing that is not on `main`. Remove each `node_modules` junction first (`cmd //c "rmdir C:\wt\lane-X\node_modules"`), then `git worktree remove --force`.
