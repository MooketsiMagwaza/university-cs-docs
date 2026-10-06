# Work orders

This list records requested repository work, its verification target, and its current delivery state. Update it when a work order changes or is completed.

## Active areas and ownership

Several agents and people work in this repository at once. This section says who is working where, so changes do not collide. Update it when you start or finish an area.

| Area | Owner | Paths | Branches or pull requests |
|---|---|---|---|
| CSI247 Data Structures notes | Codex agent | `content/docs/sem3/csi247/`, `content/quiz-data/sem3/csi247/`, `content/flashcard-data/sem3/csi247/`, `public/files/sem3/csi247/` | `feat/csi247-*`. Start from the [CSI247 notes guide](docs/guides/csi247-notes-guide.md) |
| Docs home page, Mastery check, scrollbars | Claude Code session | `app/global.css`, `components/callouts/checklist.tsx`, `components/learning/docs-entry-panels.tsx`, `components/learning/semester-status.tsx` | PR 51 |
| Quiz data in JSON and CSI243 deeper-reasoning quizzes | Claude Code session | `components/interactive/quiz.tsx`, `components/interactive/quiz-ref.tsx`, `lib/quiz-data.ts`, `scripts/audit-quiz-data.mjs`, `content/quiz-data/quiz.schema.json`, `content/quiz-data/sem3/csi243/**/notes/*.json`, `content/docs/sem3/csi243/**` | PR 52 |
| Playgrounds (HTML, JavaScript, Python, SQL) and playground data | Claude Code session | `components/interactive/code-*.tsx`, `lib/playground/`, `content/playground-data/`, `content/docs/playgrounds/`, `scripts/audit-playground-data.mjs` | PR 53 |
| Haskell runner extension (CSI243-22) | Claude Code session | `lib/haskell-simulator.ts`, `lib/haskell/`, `scripts/ts-loader/` | `feat/haskell-runner-patterns` |
| README and work orders | Claude Code session | `README.md`, `WORK_ORDERS.md`, `docs/guides/` | PRs 54 and 55 |

### Rules for working alongside each other

- **The CSI247 agent owns the CSI247 paths above.** The Claude Code session does not edit them, and none of the open branches listed here touch them.
- **Shared files are small and conflict-prone.** `components/mdx.tsx`, `package.json`, `app/global.css`, `README.md` and `WORK_ORDERS.md` are edited by several areas. Keep changes to them minimal, rebase onto `main` before you open a pull request, and expect to resolve a trivial conflict if another pull request merged first.
- **Quiz format.** CSI247 quizzes use the TypeScript `quizData` modules today. PR 52 adds a JSON format with a `<QuizRef />` tag for new quizzes. Both stay valid, and nothing in PR 52 changes CSI247 files. Check `components/README.md` on `main` for the current convention before you add quizzes.
- **Do not rename or move CSI243 files** while PR 52 and the CSI243-22 and CSI243-23 work orders are open, because the quiz data paths mirror the page paths.
- **Git conventions.** Conventional Commit messages with a course or area scope, branches named `feat/<description>` or `docs/<description>`, one logical change per commit, and no `Co-Authored-By` or other attribution lines in commits or pull-request descriptions.
- **Update this file** when you start an area, change its paths, or finish it.
## CSI243 notes and practice overhaul

| ID | Work order | Acceptance check | Status |
|---|---|---|---|
| CSI243-01 | Audit the higher-order-function lecture deck against the website notes | Missing teaching points and examples from the deck are represented in the notes | Complete |
| CSI243-02 | Deepen higher-order-function notes | `map`, `filter`, partial application, `zipWith`, folds, scans, and composition include explanations and worked examples | Complete |
| CSI243-03 | Expand list-comprehension teaching | Explain generators, output expressions, tests, scope, multiple/dependent generators, empty results, and equivalent forms | Complete |
| CSI243-04 | Include the requested partial-application search example | Explain why `filter (isThere wanted)` works and provide runnable code | Complete |
| CSI243-05 | Include the requested `foldr` factorial program | Include the terminal-input version, a detailed trace, edge cases, and a browser-runnable equivalent | Complete |
| CSI243-06 | Add a simulated in-page Haskell runner | Run the course subset locally in the browser and show parse, type, and runtime diagnostics | Complete |
| CSI243-07 | Interleave W3Schools-style practice through the notes | Place compact “Try it yourself” examples directly after individual concepts, with Run and Reset in each opened editor | Reopened: only 22 embeds across 37 notes. See CSI243-22 and CSI243-23 |
| CSI243-08 | Keep a standalone practice playground | Register a dedicated playground page with curated examples for longer experimentation | Complete |
| CSI243-09 | Use a minimal visual palette | Use neutral surfaces and reserve strong colour for actions, state, and errors | Complete |
| CSI243-10 | Fix the “The mental model” callout container | A description-only highlight card does not render an empty nested box | Complete |
| CSI243-11 | Replace Mermaid rendering with site-themed SVG diagrams | CSI243 diagrams render as native SVG, inherit the site theme, and require no Mermaid runtime dependency | Complete |
| CSI243-12 | Add diagram zoom, drag, reset, and fullscreen controls | Every site diagram supports 50–300% zoom, pointer dragging, reset, and fullscreen viewing | Complete |
| CSI243-13 | Audit remote state, worktrees, and uncommitted changes | Record relevant branches/worktrees and preserve unrelated local changes | Complete |
| CSI243-14 | Clear stale Dependabot pull requests | Merge applicable updates, recreate/close conflicts as appropriate, and leave no open Dependabot PRs | Complete |
| CSI243-15 | Keep a local preview available | Run the CSI243 site locally for final visual review | Complete |
| CSI243-16 | Merge the completed overhaul into `main` using the authorised admin bypass | Required repository checks pass; the pull request is merged and `origin/main` contains the work | Complete |
| CSI243-17 | Explain functional languages, immutability, scope, and shadowing in depth | Contrast functional and imperative models and show why back-to-back `let x = 3` / `let x = 4` creates separate bindings rather than mutating one value | Complete |
| CSI243-18 | Explain Haskell's typing and laziness precisely | Distinguish static type checking, type inference, lazy value evaluation, thunks, sharing, demand, and infinite-list consumption | Complete |
| CSI243-19 | Restyle the docs home page to match the site theme | No gradients, rings or glass effects; reads the paper-and-ink tokens in light and dark; Mastery check is an interactive checklist with no emoji; scrollbars follow the theme | In review (PR 51) |
| CSI243-20 | Keep quiz content out of MDX | Quizzes live in `content/quiz-data` JSON files referenced with `QuizRef`; migrated pages render unchanged; `npm run audit:quizzes` passes; quiz code blocks match the site theme | In review (PR 52) |
| CSI243-21 | Add W3Schools-style playgrounds beyond Haskell | HTML and CSS, JavaScript, Python and SQL run in the browser with time limits, with examples and seed datasets in JSON; `npm run audit:playgrounds` passes | In review (PR 53) |
| CSI243-22 | Extend the Haskell runner to the notes' main constructs | Multi-equation pattern definitions, guards, `where`, `case`, `let ... in` and simple `data` types run in the browser. A scan of the notes shows most examples that have a GHC transcript running and matching it (30 of 229 today; 182 fail to parse, mainly multi-equation definitions and guards) | Open |
| CSI243-23 | Add data-driven Try it yourself examples next to every runnable example | Each example is a JSON entry referenced from the note, stores the GHC output shown in the note as its expected result, and an audit runs it in the simulator and compares. Depends on CSI243-22 | Open |

## Notes

- The browser runner intentionally implements the CSI243 teaching subset rather than arbitrary Haskell packages or unrestricted IO.
- Existing uncommitted work in the original checkout is preserved; this overhaul is developed and verified in its own worktree.
- Update work-order status only after the associated acceptance check has been verified.

## CSI247 Data Structures notes

Owner: Codex agent. Follow the [CSI247 notes guide](docs/guides/csi247-notes-guide.md), which describes the target chapter shape, how a CSI243 lesson is built, the Java-specific rules, and the checks to run before a pull request.

| ID | Work order | Acceptance check | Status |
|---|---|---|---|
| CSI247-01 | Confirm the chapter structure and Java version for the course | The list of chapters, whether any topic folders are renamed (with redirects), whether `linear-structures` is merged or hidden, and the Java version are written down in this table before notes are written | Open |
| CSI247-02 | Write lesson notes for each topic in the CSI243 style | Each topic has a `notes/` folder with numbered lessons, a `notes/meta.json`, an updated chapter `meta.json`, and an updated `index.mdx` lesson table. Every Java sample compiles and runs on the recorded JDK, and shown output matches a real run | Open |
| CSI247-03 | Add a cheat sheet to each topic | One lookup page per topic with a placeholder table, a template and one example per idea, linked from the notes | Open |
| CSI247-04 | Upgrade practice questions, flashcards and quizzes | Questions show marks and model answers, flashcards test distinctions rather than definitions, and quizzes have per-option feedback and scenario questions with verified code | Open |
| CSI247-05 | Refresh resources pages | Each topic links authoritative references (Java Language Specification, official tutorials, API documentation) with a one-line description of what each is good for | Open |
| CSI247-06 | Verify the course end to end | `npm run check` passes, every internal link resolves, every page is in a `meta.json`, and no duplicate or hidden legacy page remains live | Open |
