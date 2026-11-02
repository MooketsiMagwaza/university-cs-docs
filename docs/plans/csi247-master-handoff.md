# Master handoff: CSI247 depth, diagrams and Semester V (written 2026-10-26)

This file is for a person or an agent who picks the work up cold, next month or later, on another account or machine. It is meant to be read start to finish once. It says who the owner is and how they want work done, what is built and where, what was decided and why, what has and has not been checked, and what to do next with the exact commands. It does not replace [WORK_ORDERS.md](../../WORK_ORDERS.md) (the repository-wide list); it is the story and the instructions for one large effort, tracked there as CSI247-11, CSI247-13, CSI247-14 and CSI323-01.

Older, narrower notes that this file supersedes where they differ: [csi247-java-foundations-handoff.md](csi247-java-foundations-handoff.md) (the first handoff, 2026-10-25), [../guides/csi247-notes-guide.md](../guides/csi247-notes-guide.md) (page types) and [../guides/csi243-depth-model.md](../guides/csi243-depth-model.md) (how CSI243 reaches exam depth; **read it before writing any lesson**).

## Contents

1. [Orientation and the kickoff prompt](#1-orientation-and-the-kickoff-prompt)
2. [The owner and the rules they set](#2-the-owner-and-the-rules-they-set)
3. [Where things are right now](#3-where-things-are-right-now)
4. [Decision log](#4-decision-log)
5. [What exists: components, data, scripts, content](#5-what-exists-components-data-scripts-content)
6. [Verification: what was checked, what was not](#6-verification-what-was-checked-what-was-not)
7. [The work orders, in order, with instructions](#7-the-work-orders-in-order-with-instructions)
8. [How to write one lesson, step by step](#8-how-to-write-one-lesson-step-by-step)
9. [Gotchas](#9-gotchas)
10. [Decisions waiting on the owner](#10-decisions-waiting-on-the-owner)
11. [Progress log](#11-progress-log)

## 1. Orientation and the kickoff prompt

**The project.** `university-cs-docs` (GitHub `MooketsiMagwaza/university-cs-docs`) is a Next.js 16 and Fumadocs documentation site that teaches the owner's university computer science courses (University of Botswana style: courses such as CSI247 Data Structures, CSI243 Functional Programming, CSI213 probability, CSI323 Algorithms). Content is MDX in `content/docs/<semester>/<course>/<topic>/`; quiz, flashcard, figure and practice data are JSON or TypeScript beside it in `content/`. `AGENTS.md` at the repository root says this Next.js has breaking changes: read the guides under `node_modules/next/dist/docs/` before writing Next.js code.

**The effort.** Three requests from the owner, all on branch `feat/csi247-java-foundations` and pull request 87:

1. Make CSI247 "like" the Java Foundations reference (`java-foundations.html`: lessons from zero, memory diagrams, trace tables, exam drills). Done as a conversion plus new components.
2. Bring CSI247 to the **depth** of CSI243, which the owner called far lighter and weaker on understanding ("like the cheat sheet etc."). Started: the model is written up, cheat sheets exist, one exemplar lesson was written (it later moved to CSI323). **This is the main work left.**
3. Replace the dated diagrams ("the mermaid diagram thing is old and outdated, that is the first main fix"). Half done: all Mermaid charts are redrawn; 52 hand-written Tailwind picture blocks remain.

Then the scope was narrowed (2026-10-26): **CSI247 ends at stacks and queues (chapters 1 to 10)**. Hash tables, trees and graphs moved to **CSI323 (Semester V)**, and Semester V, CSI323 and its four topics are marked work in progress.

**Kickoff prompt** (paste this to a new agent):

> Read docs/plans/csi247-master-handoff.md completely, then docs/guides/csi243-depth-model.md and docs/plans/csi243-exam-depth-brief.md. Then check the state: `git fetch`, `gh pr view 87`, `gh pr checks 87`, and `git -C C:/wt/csi247-foundations status` (or make a fresh worktree from `origin/main` if the branch was merged). Report in five lines what is merged, what is open and what CI says. Follow section 2 (the owner's rules) exactly: Conventional Commits, no Co-Authored-By or attribution lines, no push or pull request unless I ask, never stage my uncommitted files in the main checkout, no emojis, content in data files. Continue with section 7 in order, starting at 7.1. Every claim about what Java prints must come from a real run. Before any dev server, Playwright run or build, check free memory and whether a game is running.

## 2. The owner and the rules they set

The owner is Mooketsi (Windows user `Nido`, 15.7 GB laptop; they play Valorant on it). These come from their own instructions across sessions; treat them as binding.

**Git and delivery**
- Conventional Commit messages with a course or area scope (`feat(csi247): ...`, `fix(csi247): ...`, `docs(work-orders): ...`); branches `feat/<description>` or `docs/<description>`; one logical change per commit.
- **No `Co-Authored-By` trailer and no "generated with" line in commits or pull-request bodies, ever.** (Replies to review comments on GitHub are the one exception the Auto-fix tooling asks for: it appends a short "Addressed by Claude Code" line there.)
- Do not push or open a pull request unless asked. (On 2026-10-26 the owner asked for both for PR 87; later pushes to that branch were authorised by turning on Auto-fix.)
- Never merge unless the owner says so; they have asked for "merge even with failing CI" only when they said "roll it out now".
- Large pushes: `git -c pack.useSparse=false -c http.postBuffer=524288000 push -u origin <branch>`.
- **The main checkout (`C:\Users\Nido\Desktop\Projects\Active\university-cs-docs`) holds the owner's own uncommitted files; never stage or modify them:** `app/docs/[[...slug]]/page.tsx`, `app/llms.mdx/docs/[[...slug]]/route.ts`, `app/og/docs/[...slug]/route.tsx`, `content/docs/sem3/csi213/index.mdx`, `content/docs/sem3/csi213/meta.json`, `vercel.json`, `scripts/vercel-ignore-build.mjs`, `CLAUDE.md`, `.claude/`. Do your work in a worktree under `C:/wt/`.

**Content and interface**
- Theme: the cream and navy "paper and ink" look (Inter body, Fraunces headings, 2px ink frames, hard offset shadow) with Google-developer-docs *structure* (section tabs, sidebar, "On this page", topic tabs, pager). Style only through the `--ui-*` tokens in `app/styles/tokens.css`. No Roboto, Google palette, soft shadows, gradients or glass blur.
- **No emojis** in the interface or in page content. Plain labels or lucide icons. (The converter turns the reference's check marks and crosses into Yes and No.)
- Content stays out of MDX: quiz questions are JSON under `content/quiz-data` referenced with `<QuizRef />`; flashcards are TypeScript under `content/flashcard-data`; figures are JSON under `content/figure-data` referenced with `<SvgFigure />`; practice data is JSON under `content/practice-data`.
- Keep interactive UI minimal. The owner said "you over complicate the quiz UI" once. Offer the fewest choices that do the job; add no modes or filters unasked.
- Focus on structure and consistency across courses, not on polishing individual widgets. Diagnose before changing; reduce clutter.
- Plain, direct prose; British spelling; local names (Kago, Naledi, Thato, Mpho) and Botswana-relevant scenarios; no filler.
- Page titles carry no typed number and no `(WIP)` marker; the sidebar numbers topics and lessons from folder names and `meta.json` order. "Work in progress" is shown by the `SemesterWorkInProgress` banner and the docs-home card status, never in titles.

**The owner's biggest complaint (read twice).** On 2026-10-20 they said: *"you just do what I explicitly mention and not other stuff that should be mentioned nonetheless."* When a topic is named, also add its variations, the sibling concepts next to it, and the questions asked about each, without being asked, and say in the report what extra was added. Audit the whole area for gaps and record them as work orders before building. Their own course material is the syllabus: `C:\Users\Nido\Desktop\Semester_3_Vault\Current\CSI247` (and `CSI243`, `CSI213`, `MAT221`, `MGT202`). Lectures `Lec01` to `Lec13` are in `CSI247/Lectures`; `Resources/` holds the course outline, course rules and `Data Structures Full Notes.pdf`; `Revision/java-foundations.html` is the reference course.

**Depth.** CSI243 is the model. For every concept: a plain explanation, a template, three or more worked variations (each changing one thing), an exam-style question answered in four steps, the common errors, and practice. A concept with fewer than three examples is not finished.

**Machine care.** The laptop slows badly under Node load; free memory has been as low as 130 MB. Before the dev server (about 1.5 to 2 GB), `tsc` on the whole project, a build or Playwright: check `Get-Process VALORANT*` and free memory (`Get-CimInstance Win32_OperatingSystem`); if a game is running or free memory is under about 3 GB, do only light work (reading, editing, small node scripts, git) and say the heavy checks are held. Up to three Sonnet helper agents on disjoint file lanes are welcome when work piles up, but helpers never run git writes, never run a dev server, build or Playwright, and run `tsc` or audits one at a time (see `WORK_ORDERS.md`, "Lanes for parallel work").

## 3. Where things are right now

**Branch and PR.** Branch `feat/csi247-java-foundations`, worktree `C:/wt/csi247-foundations`, cut from `origin/main` at `37c28ce`. [Pull request 87](https://github.com/MooketsiMagwaza/university-cs-docs/pull/87) is open against `main`. Last known CI (head `f2e50be`): 6 of 6 checks passing, merge state clean. The head after that, `0c55795` (the Semester V move), had not reported when this was written. Auto-fix was turned on for the PR, so the desktop app wakes a session on CI failures, conflicts and review comments.

**The 14 commits on the branch** (oldest first), all by the owner's name, no trailers:

| Commit | What |
|---|---|
| `3584fec` | components `MemoryDiagram`, `ConceptFrame`, `TraceTable`, `SvgFigure`, their styles, the engine and 13 scenarios, 9 unit tests |
| `0df6b40` | `scripts/convert-java-foundations.mjs`, `scripts/verify-csi247-listings.mjs`, first handoff |
| `051a33f` | 30 converted lessons into chapters 1, 2, 3, 4, 6, 8, 9, 10; `encapsulation-and-abstraction` became `encapsulation`; redirects and aliases |
| `af62aaa` | work orders: merged CSI243 lessons, Java runner state, CSI247-11 and CSI247-12 |
| `400a3e9` | CodeQL fixes in the converter |
| `2f1ab02` | `docs/guides/csi243-depth-model.md` and the guide update |
| `9b60aad` | cheat sheets for the 11 chapters that had none |
| `eec108b` | fixed `tests/java-playground.spec.ts` (runner limit is now 2000 lines or 256 KiB) |
| `330ad7a` | all 52 Mermaid charts redrawn as `SvgFigure`; `scripts/lib/flow-svg.mjs`; `scripts/convert-mermaid-figures.mjs`; Mermaid retired in the docs and audit |
| `a6b8e8c` | `hash-tables-by-example` lesson; CSI247-13 and CSI247-14 work orders |
| `e749d45` | handoff update |
| `0c2ea07` | cheat-sheet links fixed for the architecture audit; flowchart edge reader without a dense regexp |
| `f2e50be` | side-scroll smoke test waits for the layout to settle |
| `0c55795` | chapters 11 to 13 moved to CSI323; Semester V marked work in progress |

After this handoff there is one more commit: this file, `scripts/fill-java-outputs.mjs` and work-order updates.

**What `main` contains.** `main` (`37c28ce` when this was written) holds PR 86 (the CSI243 exam-depth lessons, merged 2026-10-21 without waiting for CI, which is why `main`'s own CI was red: the Java playground test and three CSI247 smoke tests). PR 87 fixes the Java playground test and makes the smoke check less timing-sensitive.

**Other branches and worktrees (checked 2026-10-25).** `origin` has only `main`. Local branches `feat/csi243-notes-overhaul`, `feat/csi243-ui-and-quiz-data`, `feat/csi247-merge-storytelling` and `feat/haskell-runner-patterns` were never merged (the last has 39 modified and 4 untracked files of the owner's in `C:/wt/csi243-playground`; **leave them**). Merged and safe to delete locally: `feat/csi213-test2-study-content`, `feat/csi243-exam-depth`, `feat/csi243-proofs-hof-custom-types`. Thirteen leftover lane worktrees `C:/wt/lane-F4` to `F10` and `V11` to `V16` hold nothing that is not on `main`; remove each `node_modules` junction first (`cmd //c "rmdir C:\wt\lane-X\node_modules"`), then `git worktree remove --force`. Do not delete anything without the owner's word.

**Not committed (in `.tmp/` of the worktree, regenerable).** `.tmp/jf/` (converter output including `skipped/`), `.tmp/diagrams.html` (a preview of the 52 figures), `.tmp/move-to-sem5.mjs` (the one-off script that moved chapters 11 to 13; its result is in git), parser comparison helpers. Rerun `node scripts/convert-java-foundations.mjs <html> .tmp/jf` to get the converter output back; the reference file is `C:\Users\Nido\Downloads\java-foundations.html` (also in the vault under `CSI247/Revision/`).

## 4. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-10-17 | CSI247 had thirteen numbered chapters, Java 8 for every sample (`javac --release 8`) | CSI247-01 |
| 2026-10-25 | Convert the Java Foundations reference into MDX with a script, not by hand | 40 pages, mechanical, repeatable |
| 2026-10-25 | New components instead of bending the standard elements: `ConceptFrame`/`FrameBox`, `TraceTable`, `SvgFigure`, `MemoryDiagram` | the reference's signature teaching pieces had no equivalent |
| 2026-10-25 | A reference page replaces an existing lesson only when the existing one is smaller, at the **same URL**; otherwise skipped. Replaced: `recursion-in-java`, `algorithm-analysis`, `bubble-sort`, `selection-sort`, `inheritance-and-super`, `overriding-and-polymorphism`, `abstract-classes-and-interfaces`. Skipped (existing lessons deeper): linear search, binary search, insertion sort, merge sort, packages, generics | URLs and quizzes stay valid |
| 2026-10-25 | `encapsulation-and-abstraction` became `encapsulation` with redirects and an alias; abstraction lives in `abstract-classes-and-interfaces` | the old file mixed two ideas |
| 2026-10-26 | The owner asked for CSI243's depth, with "proper notes on how it does it" | written up in `docs/guides/csi243-depth-model.md` |
| 2026-10-26 | Mermaid is retired; diagrams are drawn SVG | the owner called Mermaid old and outdated |
| 2026-10-26 | **CSI247 scope for this feature = chapters 1 to 10** (up to and including stacks and queues); chapters 11 to 13 moved to CSI323 in Semester V; all of Semester V and its modules marked work in progress | the owner's instruction; CSI323's overview already said it continues "after stacks and queues" |
| 2026-10-26 | The moved chapters' thin overview, review, practice and resources pages were dropped, not merged | CSI323 already had fuller ones |
| 2026-10-26 | Work in progress is shown with the existing `SemesterWorkInProgress` banner plus the docs-home card "In progress", not a `(WIP)` title | `docs/content-standard.md` section 2.1.1 forbids status markers in titles |

## 5. What exists: components, data, scripts, content

### 5.1 Components added in this effort

All are registered in `components/mdx.tsx` (never import components in MDX), documented in `components/README.md` ("Java lesson pieces"), styled in `app/styles/java-lessons.css` (class prefix `jf-`), and allowed by the audit vocabulary.

| Component | File | Use | Data |
|---|---|---|---|
| `ConceptFrame` with `FrameBox label="..."` | `components/learning/concept-frame.tsx` | the four-box lesson opening: the idea, the definition, why it works, what it is for | none; children are Markdown |
| `TraceTable` | `components/learning/trace-table.tsx` (client) | wraps a Markdown table; rows hidden until revealed (next, all, hide) | none; the stylesheet hides rows until hydration |
| `SvgFigure src id` | `components/visuals/svg-figure.tsx` (server) | a drawn SVG with a caption as children | `content/figure-data/<page path>.json`: `{ "<id>": { "alt": "...", "svg": "<svg>..." } }`; loader `lib/figure-data.ts` |
| `MemoryDiagram scenario [static]` | `components/interactive/memory-diagram.tsx` (client) | the exam memory diagram, stepped one line of Java at a time or finished only | `lib/csi247/memory-scenarios.ts` (13 scenarios: `basics student course marks shape alist llbuild lltrav book alstudents llslide llq dll`); engine `lib/csi247/memory-diagram.ts` |
| `LearningObjectives` | `components/learning/lesson-introduction.tsx` | now renders `backticked` words as code | |
| `SemesterWorkInProgress name=` | `components/learning/semester-status.tsx` | the work-in-progress banner for a semester, course or topic | `name` (or `semester`) |

`Mermaid` still exists as a component and `mermaid` is still in `package.json`, but no page uses it and `scripts/audit-content-standard.mjs` no longer allows it in notes. Removing both is part of CSI247-13.

### 5.2 Scripts and commands

Run from the worktree root. A **JDK on the PATH** is needed for the Java scripts (the machine has JDK 21).

| Command | What it does |
|---|---|
| `node scripts/check-mdx.mjs <file or folder>` | compiles MDX with the site's math plugin; catches stray `<` and `{`, unclosed tags. Run on every page you touch |
| `node scripts/fill-java-outputs.mjs <lesson.mdx>` | fills `@@OUTPUT@@` text fences from a real `javac --release 8` and `java` run, with classes declared earlier on the page. **The way to get outputs.** |
| `node scripts/verify-csi247-listings.mjs [folder or file]` | re-runs every complete program in the lessons and compares with the output shown; fragments are skipped. Last full run over CSI247 and Semester V (2026-10-26): 68 programs ran, 62 matched the shown output, 6 showed no output, 0 differed, 0 failed to compile; 90 listings are fragments or one class of several and are not checked |
| `node scripts/convert-java-foundations.mjs <html> .tmp/jf` | converts the reference course to MDX, figures and a report |
| `node scripts/convert-mermaid-figures.mjs <folder> [--write] [--preview file.html]` | turns `<Mermaid>` charts into `<SvgFigure>` pictures drawn by `scripts/lib/flow-svg.mjs` (layered flowchart layout, themed SVG; `--preview` writes an HTML page to eyeball them) |
| `npm run test:memory-diagram` | 9 unit tests: every scenario builds and draws, crossings, garbage, aliasing (also part of `npm run test:unit`) |
| `npm run audit:csi247-architecture` | metadata, links and data references of every CSI247 page (it rejects a link to a `notes` folder: link to the chapter page) |
| `npm run audit:quizzes` | every quiz JSON is used and well formed (267 quizzes, 1,050 questions) |
| `npm run audit:csi247-java` | compiles the CSI247 chapter examples and the study-guide snippets |
| `node scripts/audit-content-standard.mjs --course csi247 --verbose` | the content standard report (`--course csi323` for Semester V). Last: CSI247 72 findings, all old `notes-quiz` or `retired-component` or `Accordion`; CSI323 4 findings |
| `npm run audit:content:full` | what CI runs for content (all audits above plus the offline study guides); heavy |
| `npm run types:check`, `npm run build`, `npm run test:browser` | type check, production build, Playwright (CI only unless memory allows) |

CI (`.github/workflows/ci.yml`, job "Type check and build") runs in this order: `audit:content:full`, `test:csi247-markdown`, `test:csi247-illustrations`, the content-standard report, `test:unit`, `verify:java-notes`, `types:check`, `build`, then Playwright (`npm run test:browser`). It stops at the first failing step, so a later step can hide failures that only appear once an earlier one is fixed. CodeQL and dependency review run beside it.

### 5.3 The content now

**CSI247 (`content/docs/sem3/csi247`), ten chapters.** Each has `index`, `notes/`, `cheat-sheet`, `review`, `questions`, `resources`.

| Chapter | Lessons in `notes/meta.json` order | Cheat sheet |
|---|---|---|
| 01 java-fundamentals | how-a-java-program-runs, variables-types-and-operators, decisions-and-loops, arrays-and-methods, then the five older lessons (values-primitives-references, strings-control-io, methods-parameters-scope, classes-and-objects, arrays-and-objects) | yes |
| 02 recursion | recursion-in-java (replaced), trace-tables | yes |
| 03 time-complexity | algorithm-analysis (replaced), counting-steps | yes |
| 04 sorting-and-searching | linear-search, binary-search, searching-with-the-java-library, searching-exam-drill, sorting-fundamentals, bubble-sort, selection-sort, insertion-sort, merge-sort, quick-sort, comparable-and-comparator, sorting-exam-drill, choosing-an-algorithm | yes (older) |
| 05 packages | built-in-packages-and-imports, compiling-and-running, creating-a-package | yes (older) |
| 06 object-oriented-programming | what-is-oop, classes-and-objects, drawing-memory-diagrams, encapsulation, inheritance-and-super, overriding-and-polymorphism, object-class-casting-and-wrappers, abstract-classes-and-interfaces, composition, shapes-case-study-and-uml | yes |
| 07 generics | why-generics, generic-classes, generic-methods-and-interfaces, bounds-and-comparable, wildcards-and-variance (all older, unchanged) | yes |
| 08 collections | collections-and-iterators, lists-and-arraylist, then four short older lessons | yes |
| 09 linked-lists-traversals | linked-lists-explained, linked-lists-and-traversal (older, with exam practice) | yes |
| 10 stacks-and-queues | stacks-and-queues-explained, stacks-and-queues-in-java (older, with the circular queue) | yes |

The CSI247 chapters total about 0.5 MB of notes; CSI243's is 3.7 MB. That is the depth gap (section 7.3).

**CSI323 (`content/docs/sem5/csi323`, "Algorithms"), Semester V, work in progress.** Topics `01-trees-and-bsts` (notes: `trees-and-bsts`), `02-heaps-and-priority-queues` (**no notes yet**), `03-hash-tables` (notes: `hash-tables-in-java`, `hash-tables-by-example`), `04-graphs` (notes: `graphs-and-traversals`). Each has a cheat sheet where notes exist, review (flashcards and quiz from TypeScript data), practice, resources. Old CSI247 URLs for these redirect here (`next.config.mjs`, 38 new redirects) and `content/progress/aliases.json` carries progress. The other Semester V courses (CSI354, CSI374, CSI342) are only names on the overview page.

**The reference's leftovers.** The converted cheat sheet, glossary and appendices (`.tmp/jf/reference/{cheat,glossary,appendix}.mdx` after rerunning the converter) are **not placed anywhere**. Links to them currently point at `/docs/sem3/csi247/resources`.

## 6. Verification: what was checked, what was not

**Checked and passing (2026-10-26):** `check-mdx` on all CSI247 and Semester V pages; `npm run audit:quizzes`; `npm run audit:csi247-architecture` (113 pages); `npm run audit:csi247-java`; `npm run test:memory-diagram`; scoped type checks of the new components (a temporary `tsconfig` that extends the project one and includes only the new files); every Java output in the cheat sheets and the hash tables lesson came from a real run; the new flowchart edge reader parses all 52 original charts identically to the first version; the 52 diagrams were seen in a static preview in the in-app browser (cream paper colours, tinted boxes, labelled arrows read cleanly; the decision tree has one edge crossing).

**Never checked:**
- **Nothing has been viewed in a lesson page in a browser**: not `MemoryDiagram` (step buttons, keyboard, legend), not `TraceTable` (hidden rows, reveal buttons, hydration), not the figures inside a page, not dark mode, not 375px, not the work-in-progress banners. The machine never had the memory. **Do this first when you can** (section 7.2).
- The whole-project `npm run types:check`, the production build and the Playwright specs were only run by CI.
- The side-scroll smoke test fix (`f2e50be`) is a diagnosis (a timing flake: `main`'s run failed three different pages, this branch's run failed another, the rest passed). If a page still fails on the new head it really overflows at 390px.
- 90 of 158 Java listings in the lessons and cheat sheets are fragments (or one class of a pair) and are not compiled; the 68 complete programs were all verified. Two lessons used the Java 9 method `List.of`; they now use `Arrays.asList`, but the older generics lessons still use `List.of`.
- The Java runner (TRY-08) was not touched in this effort beyond the Playwright limit message.

**Known CI history for this PR.** The first run failed on `tests/java-playground.spec.ts` (stale limit message), then on `audit:csi247-architecture` (cheat sheets linked to a `notes` folder with no page), then on a side-scroll check; two CodeQL alerts in the converter and one in the diagram script were fixed (replace a dense regexp with a small reader; strip tags until none remain; write table-cell code with a pipe or backslash as HTML).

## 7. The work orders, in order, with instructions

IDs refer to `WORK_ORDERS.md`. Statuses below were true on 2026-10-26.

### 7.1 Land PR 87

1. `gh pr checks 87`. If anything is red, read the failing step with `gh run view <run id> --log-failed` and fix it on the branch (CI stops at the first failing step; a later step may fail once the first is fixed). Keep fixes small and commit them separately.
2. Ask the owner whether to merge. If yes: it squash-merges with the pull-request title as a Conventional Commit and `(#87)`; `main` requires the checks "Type check and build" and "Analyze JavaScript and TypeScript" and an up-to-date branch (`gh pr update-branch 87` if behind). CodeQL runs only on pull requests based on `main`.
3. After the merge, do not delete the remote branch (the sandbox refused it before; leave deletion to the owner).
4. If the owner prefers smaller pull requests, the natural split is: components and styles; the converted lessons; the cheat sheets; the diagrams; the Semester V move.

### 7.2 Browser verification (do before more content, when memory allows)

Prerequisites: no game running and about 3 GB free. Start the dev server **once** with the preview tool or `npm run dev`, check pages, stop it. Expect the first visit to a page to take 15 to 80 seconds (DEV-01, DEV-02). Check each in light and dark, at 1280px and 375px, with the console open (no hydration warnings, no errors):

- `/docs/sem3/csi247/06-object-oriented-programming/notes/drawing-memory-diagrams`: four steppers; Next step, Back, Jump to final diagram, Start again; the highlighted line of Java; crossed-out values; the faded "unreachable, garbage" objects; the diagram scrolls sideways inside its frame on a phone and the page does not.
- `/docs/sem3/csi247/02-recursion/notes/trace-tables` and `/docs/sem3/csi247/04-sorting-and-searching/notes/searching-exam-drill`: rows hidden on load, "Reveal next row", "Reveal all", "Hide again", the counter; keyboard operation; the table with merged cells in `trace-tables` (the one raw HTML table).
- A lesson with the four-box opening (any converted lesson) and one with figures (`how-a-java-program-runs`, `classes-and-objects`, `choosing-an-algorithm`, `compiling-and-running`): the SVG colours follow the theme, text is legible, the picture fits at 375px.
- The cheat sheets (any of the 11), the Overview tables, the sidebar order and labels (`N.M Title`), the pager.
- `/docs/sem5`, `/docs/sem5/csi323`, each topic: the work-in-progress banner; the docs home card for Semester V reads "In progress"; the old addresses redirect (`/docs/sem3/csi247/11-hash-tables`, `/12-trees`, `/13-graphs`, and `/docs/sem3/csi247/hash-tables`).
- Run `tests/code-layout.spec.ts` (clipped code, wheel traps, sideways page scroll) against a few CSI247 pages.

Record what you find as new work orders; fix layout faults in `app/styles/java-lessons.css` through tokens only.

### 7.3 CSI247-14: bring chapters 1 to 10 to CSI243 depth (the main work)

Read [csi243-depth-model.md](../guides/csi243-depth-model.md) (the measured gap, the five layers, the anatomy of a by-example lesson, an exam-practice lesson and a cheat sheet, and section 8's concept list per chapter). The exemplar lesson is `content/docs/sem5/csi323/03-hash-tables/notes/hash-tables-by-example.mdx` (18 complete programs, 4 exam questions with four-step answers, common-error callouts, summary, check questions). **Copy its shape.**

**Step 0, before writing: the gap audit and the Java brief.**
- `docs/plans/csi247-vault-gap-audit.md`: map every CSI247 lecture (`Lec01` to `Lec13`), the outline, `Data Structures Full Notes.pdf`, labs, quizzes and past papers in the vault to the lesson that covers it, list the sibling concepts nobody named, and cut the follow-on lanes. Model: `docs/plans/csi243-vault-gap-audit.md` (640 rows, 121 siblings, 16 lanes). PDFs can be read with the `pdf` skill or `pdftotext`; `scripts/inspect-csi247-pdfs.py` exists.
- `docs/plans/csi247-exam-depth-brief.md`: adapt `docs/plans/csi243-exam-depth-brief.md` (sections 2 to 5) to Java: Java 8, `javac`/`java` instead of GHC, trace tables and memory diagrams instead of reduction traces, the exam forms in section 7 of the depth model, and the lane rules.

**Order of chapters** (thinnest first; chapters 11 to 13 are CSI323's now): **02 recursion, 03 time complexity, 09 linked lists, 10 stacks and queues, 07 generics, 08 collections, 06 OOP, 01 fundamentals**, then 04 and 05 (already the deepest). For each chapter write, in this order:
1. one or more **by-example lessons** (`notes/<topic>-by-example.mdx`): a template and tracing template first, then one `##` section per concept with three or more `###` variations each, an exam question per concept, a common-error callout, then cross-cutting sections, a summary and five check questions;
2. an **exam-practice lesson** (`notes/<topic>-exam-practice.mdx`): how to earn the marks, then questions grouped by theme, each with the four-step answer, then the errors to check;
3. wire them into `notes/meta.json` and the Overview table (section 8);
4. then the chapter's **review** (flashcards that test distinctions; quiz questions with `optionFeedback`), **practice** (`ExamQuestion` with marks and model answers), and the **downloads** (below).

Concept lists per chapter are in section 8 of the depth model; extend them from the gap audit. Chapter-specific notes:
- **02 recursion:** counter, array, string and range recursion; two base cases; branching (`fib`); accumulators; mutual recursion; backtracking; recursion to loop and back; stack overflow; trace tables with five columns; counting calls. Add `MemoryDiagram` scenarios for call stacks (a new scenario type: frames on the stack) if the engine can express them; otherwise draw `SvgFigure`s.
- **03 time complexity:** thirty loop shapes with step counts; nested and dependent loops; halving; recurrences for binary search and merge sort; best, worst, average; amortised `ArrayList.add`; space. Exam form: "determine T(n) and the Big-O".
- **09 and 10:** pointer-by-pointer traces with `MemoryDiagram` (scenarios `llbuild`, `lltrav`, `dll` exist); dummy head, tail pointer, reverse, middle, cycle, merge two sorted lists; array and linked stack and queue; circular queue; deque; priority queue; brackets, postfix, infix to postfix, next greater element. Decide whether the new `*-explained` lessons and the older lessons should merge (owner decision 10.2).
- **06 OOP:** constructors and chaining, `static`, access modifiers, overriding against overloading, dispatch, abstract classes against interfaces (default methods), `equals`/`hashCode`/`toString`, casting, composition, UML; exam forms "valid or not valid" and "what is the output". Covers CSI247-08.
- **07 generics and 08 collections:** the older lessons are 2 to 6 KB each; apply the full pattern; fix the `List.of` uses to `Arrays.asList`; iterators and `ConcurrentModificationException`.

**Downloads (CSI243 has about 1,300 `.hs` files; CSI247 has none).** Build the Java equivalent: for every example a completed `.java` file (the question in a block comment at the top, the solution, `main` printing the expected values in comments) and a starter file (same question and tests, the answer replaced by a stub and `// TODO`), under `public/files/sem3/csi247/downloads/{completed-examples,starter-code}`, with a README, linked from the chapter Resources pages. Model: `public/files/sem3/csi243/downloads/` and `scripts/verify-haskell-files.mjs` (write `scripts/verify-java-files.mjs`: compile and run every completed file, compile every starter). Generate the files from the lessons' programs rather than by hand.

**The depth audit rule (UNI-04 neighbour):** extend `scripts/audit-content-standard.mjs` to report any `##` concept section with fewer than three examples, and any chapter without a cheat sheet, exam-practice lesson or downloads. Add the rule to `docs/content-standard.md`.

**Acceptance:** every chapter 1 to 10 has a by-example lesson, an exam-practice lesson, a cheat sheet, a review with flashcards and a quiz with option feedback, practice questions with marks, and downloads; every complete program compiles with `--release 8` and its shown output matches (`verify-csi247-listings`); `check-mdx`, `audit:quizzes`, `audit:csi247-architecture` and the content-standard report show no new findings.

### 7.4 CSI247-13: finish the diagram fix

Part 1 is done (52 Mermaid charts). **Part 2: 52 hand-written Tailwind `not-prose` HTML blocks** (utility colours such as `border-blue-500` and `bg-emerald`, which ignore the theme). List them with `git grep -n "not-prose" -- content/docs/sem3/csi247` (use `git grep`, not `grep -r`: the worktree's `node_modules` is a junction and a recursive grep takes minutes). They fall into two kinds:
- **Structure pictures** (arrays, variables and references, linked lists, stacks, queues, input buffer, call frames; about 25): replace with a `MemoryDiagram` scenario (add scenarios to `lib/csi247/memory-scenarios.ts` and a unit test), or a drawn `SvgFigure`. Add small picture builders next to `scripts/lib/flow-svg.mjs` (array row with highlighted cells, a stack, a queue, a linked list) that output SVG in the `.jf-figure` vocabulary, then store the result in `content/figure-data`.
- **Concept cards** (comparisons such as identity against equality, scope boxes, generics legal and illegal, learning paths, overview tiles; about 25): replace with a Markdown table, `ComparisonTable`, `KeyTerm` or `Callout`.

Then retire Mermaid in code: delete `components/visuals/mermaid.tsx`, its registration in `components/mdx.tsx`, the `mermaid` dependency in `package.json` (and refresh `package-lock.json` with `npm install --package-lock-only`), and the "Retired components" row. Add an audit rule that fails on `not-prose` and on `<Mermaid` in notes. Acceptance: no `<Mermaid` and no `not-prose` block in any CSI247 page; checked in the browser, light and dark, 1280px and 375px.

### 7.5 CSI247-08, 09, 09a, 10 (residue)

- **CSI247-08** (casting, `equals`, `toString`): the lessons exist (`object-class-casting-and-wrappers`, `shapes-case-study-and-uml`). Left: flashcards, review quiz questions and a practice question for each; compile-check the fragments by wrapping them.
- **CSI247-09 / 09a** (memory diagrams everywhere): `MemoryDiagram` and the lesson `drawing-memory-diagrams` exist. Left: `docs/guides/csi247-memory-diagrams.md` (the drawing rules and the reference diagram redrawn), diagrams in every topic where variables, objects or calls appear (recursion call stacks, references and casting, `equals` against `==`, collections), the three misconception questions in the Review quizzes (why the array slot does not point at the variable; why `setName` through the slot is visible through `myStudent`; why reassigning `myStudent` leaves `students[2]` unchanged).
- **CSI247-10** (reported 2026-10-17): the wheel trap on `native-chapter.css` is fixed; the standalone study guides' `reference.css` line 1253 has the same rule and needs regenerating, and a Playwright wheel test is still wanted. Decide whether the old full-chapter pages should move to the code window.

### 7.6 The reference's leftovers and overlaps

- **Place the cheat sheet, glossary and appendices** of the reference (rerun the converter): the glossary on the CSI247 Resources page, appendix F's review questions into quiz data, the course-wide cheat sheet already split per chapter. Update the links that point at `/docs/sem3/csi247/resources`.
- **Quick sort animation:** the reference has one (`ALG.quick` and `initSortViz` in the script of `java-foundations.html`, lines about 6381 to 6465); the site has stories for bubble, selection, insertion and merge sort only (`components/interactive/simple-sort-stories.tsx`). Add `QuickSortStory`, register it, and put it in `quick-sort.mdx` (the converter dropped it with a warning).
- **Overlap decision** (owner, 10.2): `linked-lists-explained` and `stacks-and-queues-explained` sit before the older `linked-lists-and-traversal` and `stacks-and-queues-in-java`.
- **Skipped reference pages** (linear search, binary search, insertion sort, merge sort, packages, generics): compare them with the existing deeper lessons and fold any missing exam drill into the by-example lessons rather than adding duplicate pages.
- The existing CSI247 lessons still contain `QuizRef` inside notes and `Accordion`s (72 content-standard findings); migrate them as UNI-04 does for other courses.

### 7.7 CSI323-01 (Semester V)

Done: the move, the redirects, the banners. **Left:** write the CSI323 topics to CSI243 depth in the same pattern (trees and BSTs including AVL and red-black ideas the topic overview promises; heaps and priority queues, which have **no notes at all**; hash tables beyond the two lessons; graphs including shortest paths and minimum spanning trees if the course outline has them). First audit the Semester V outline in the vault (there may be no CSI323 folder yet; ask the owner for the outline). Keep the work-in-progress banners until a topic reaches the depth acceptance of 7.3, then remove the topic banner (and the course and semester banners only when every topic and course is done). Also move the three quizzes out of the notes into the review pages (UNI-04).

### 7.8 Repository-wide items (pointers only)

The rest of `WORK_ORDERS.md` stays valid. The ones most likely to matter next: **TRY-08** (Java runner: Playwright spec, `verify-java-notes-examples.mjs`, the TeaVM against CheerpJ decision), **UNI-04 to UNI-06 and CI-04** (notes template everywhere, strict content audit, browser verification), **STD-12** (MAT221 rebuild), **DEV-01 to DEV-03** (memory and compile time), **CI-05 to CI-07**, **PRG-17 to PRG-19**, **RES-03, RES-04**, and the CSI243 follow-ups recorded in `C:/wt/queue-state.md` (plain-fence claims the GHC checker does not run, `scan-haskell-notes` ignoring `input=`, old-style "No instance for (Eq T)" wording, downloads not linked from lessons, cheat sheets and reviews for the new CSI243 lessons).

## 8. How to write one lesson, step by step

1. **Pick the concept list** from the gap audit and the depth model section 8. Decide the sections; each concept gets at least three variations that each change one thing (another type, the empty collection, one element, the first and last index, duplicates, sorted and reverse-sorted input, the boundary).
2. **Create the file** `content/docs/sem3/csi247/<chapter>/notes/<slug>.mdx` with front matter `title` (no typed number) and `description` (one sentence). Open with one paragraph, `<LearningObjectives items={[...]} />` (three to six), optionally `<Prerequisites />`.
3. **Section 1 is the template and a tracing template** (a numbered procedure in a `text` fence). Then `## 2. ...` per concept: two or three sentences of plain explanation, a small template, `###` variations named for what changes, an `### Exam question: ...` with marks, its `<details>` worked answer holding a `<Steps title="Answering the question">` of four `<Step>`s (Read the question: the command word and what is given; Plan; Solution; Check on a small input and the edge case), and a `<Callout type="mistake" title="Common error">`.
4. **Programs.** A worked example is a complete class with `main` and a question in a comment. Use `title="Name.java"` where `Name` is the class. Put `@@OUTPUT@@` in the `text` fence below it. Java 8 only: `Arrays.asList` not `List.of`; no `var`, records or text blocks. Never print a whole `HashMap` or `HashSet` (copy to a `TreeMap` or sort). Show real exception messages, taken from a run.
5. **Fill and verify:**
   - `node scripts/fill-java-outputs.mjs <file>` (replaces every placeholder with a real run; fix any program it reports as not compiling);
   - `node scripts/verify-csi247-listings.mjs <file>` (must report 0 differ, 0 do not compile);
   - read the filled outputs against the claims in your text and tables (the text you hand-write, such as a table of chain contents or probe counts, is **not** checked by the scripts; compare it to the program output);
   - `node scripts/check-mdx.mjs <file>`.
6. **Summary and check:** `## Summary` with one `<Callout type="key" title="Remember">`, then `## Check your understanding` with five `<CheckQuestion question="...">answer</CheckQuestion>` that test distinctions.
7. **Wire it:** add the slug to `notes/meta.json` (order = sidebar order), add a row `| [N.M Title](/docs/sem3/csi247/<chapter>/notes/<slug>) | question it answers |` to the chapter `index.mdx` table (numbering `N.M` from folder and position), and update links elsewhere. Link a chapter as `/docs/sem3/csi247/<chapter>` (never `.../notes`, which has no page and fails the architecture audit).
8. **Components allowed in notes** (audit vocabulary): `Callout`, `KeyTerm`, `Steps`/`Step`, `LearningObjectives`, `Prerequisites`, `CheckQuestions`/`CheckQuestion`, `ComparisonTable`, `SiteDiagram`, `SvgFigure`, `MemoryDiagram`, `TraceTable`, `ConceptFrame`/`FrameBox`, `JavaTryIt`, the sort and search stories, and the `details`/`summary` HTML elements. No `import` in MDX; no quiz in a notes page (put questions in review data); no emojis.
9. **Audits and commit:** `node scripts/audit-quiz-data.mjs`, `node scripts/audit-csi247-architecture.mjs`, `node scripts/audit-content-standard.mjs --course csi247` (no new findings), then `git add <the files>` and a Conventional Commit.

MDX pitfalls: blank lines around every tag, fence and `Step`; never put program text in a JSX attribute; no raw `<`, `{` or `$` in prose (`$` starts math: the site uses `remark-math`); escape `|` in table cells (a pipe or backslash inside code in a cell is safest written as `<code>` HTML); a fence inside a list is indented by the width of the marker.

## 9. Gotchas

- **Shell:** Git Bash on Windows through the Bash tool. **Backslashes in heredocs and `node -e` strings are mangled**; write files with the Write or Edit tool, or write a script file, instead of piping JavaScript with `\` through a heredoc. `sleep` followed by a command is blocked; wait with `until <check>; do sleep 3; done` in a background command. The Edit tool needs the file read first and fails on multi-line matches in CRLF files (`WORK_ORDERS.md` is edited by script, preserving its line endings).
- **`grep -r` over the worktree is very slow** (the `node_modules` junction). Use `git grep` or restrict the path. Never `rm -rf` a worktree containing the junction.
- **Long commands** (the Java verifier, audits) run past the 2-minute tool timeout; start them with `run_in_background` and wait for the notification, or limit them to a folder.
- **Memory:** see section 2. The in-app browser can open a local static page served with a tiny Node `http` server (port of your choice); `file://` pages hung.
- **Java verification** needs `javac` and `java` on the PATH (JDK 21 here; programs are compiled `--release 8`, which prints an "obsolete" warning that the scripts suppress). Programs in a page share classes declared earlier on the same page; a class declared twice uses the latest.
- **`next.config.mjs`:** renamed or moved pages need a permanent redirect there and an alias in `content/progress/aliases.json`; quiz, flashcard and figure data paths mirror the page path, so move them in the same commit. Loading the config in node (`await import('./next.config.mjs')`) runs fumadocs-mdx and is a quick way to check redirects.
- **Generated Haskell and Java study guides** under `public/files/**/study-guides` are built by `scripts/build-csi247-study-guides.mjs`; edit the sources in `features/courses/csi247/study-guides`, not the output.
- **CodeQL** flags a regexp that matches `-->`, a tag-stripping replace that runs once, and escaping that skips backslashes. Prefer a small parser to a dense regexp in scripts.
- The owner's `payload.json` at the repository root is a stray tracked file; ignore it.

## 10. Decisions waiting on the owner

1. **Merge PR 87?** (7.1.) And whether to split it.
2. **Overlap:** keep or merge `linked-lists-explained` / `stacks-and-queues-explained` with the older lessons in the same chapters.
3. **The work-in-progress tag:** the banner and card status are used because titles may not carry `(WIP)`. Does the owner also want a marker in the sidebar names? That would need a change to the standard.
4. **Remove Mermaid** (component and dependency) once part 2 of CSI247-13 is done.
5. **The Java runner engine** (TRY-08): TeaVM subset against a real JVM in the browser (CheerpJ): size and licence questions.
6. **Stale branches and worktrees** (section 3): delete the merged ones and the 13 lane worktrees?
7. **The Semester V outline:** CSI323's real syllabus (is there an official outline? what do heaps, hash tables and graphs cover?) before writing it to depth.
8. **Open since earlier:** PRG-19 (a request that ended mid-sentence), CI-05 (CodeQL on stacked pull requests), CI-06 (Node 22 in CI against Node 24 locally).

## 11. Progress log

- **2026-10-25.** Read the reference (`java-foundations.html`, 40 pages). Built the converter and the four components; placed 30 lessons; opened the branch. Checked every other worktree and the remote (only `main` on `origin`; PR 86 merged; 13 lane worktrees disposable).
- **2026-10-26.** Pushed and opened PR 87. Fixed CodeQL alerts, the stale Java playground test and the cheat-sheet links. Wrote the depth model; added cheat sheets for the 11 chapters that had none; redrew all 52 Mermaid charts; wrote the hash tables by-example lesson. The owner narrowed the scope to chapters 1 to 10, so chapters 11 to 13 moved to CSI323 and Semester V was marked work in progress. Wrote this handoff. State at the end: PR 87 green at `f2e50be`, `0c55795` pushed, nothing seen in a browser yet.
- **Next:** 7.1 (land the PR), 7.2 (browser pass), then 7.3 starting with the gap audit and the Java brief, then recursion.
