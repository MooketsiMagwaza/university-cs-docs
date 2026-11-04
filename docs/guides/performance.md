# Performance: how to measure it, what the numbers were, and how to work with little memory

Written for PERF-01 to PERF-05 (requested 2026-11-03). Every number below comes from a real run on the owner's machine (Windows 11, 15.7 GB, Node 24.18, Next 16.4.2 with Turbopack) unless the text says it is an estimate or was not possible. The machine was shared with other work during the runs, so a time can move by 10 to 20 per cent between runs; sizes do not move. "Cold" is the first run (nothing cached); "warm" is the next run with nothing changed.

## 1. Commands that check speed and size

| What | Command | What it tells you |
|---|---|---|
| Fast loop while writing | `npm run check:quick` | the content and data audits, the unit tests and the MDX pages changed since the last commit (about 3 s when nothing changed) |
| Every MDX page compiles | `npm run check:mdx` (`node scripts/check-mdx.mjs --all`) | 4 to 5 s for 699 pages. Without `--all` only the pages changed since the last commit are checked; `--since origin/main` checks the pages changed on a branch |
| Unit tests | `npm run test:unit` | one `node --test` run over `tests/unit/*.test.mjs`, four files at a time (a new test file is picked up without editing `package.json`) |
| Audits | `npm run audit:content` | the seven content and data audits side by side. The CSI247 Java audit is skipped when its inputs have not changed since it passed (`scripts/run-if-changed.mjs`, stored in `node_modules/.cache/stamps`); `npm run audit:content:full` (what CI runs) always runs it |
| Java listings in the CSI247 lessons | `npm run verify:csi247-listings` | only the lessons whose text changed since they last passed (`-- --force` checks all) |
| Types | `npm run types:check` | `fumadocs-mdx`, `next typegen`, then an incremental `tsc` whose state is kept in `.next/cache/tsconfig.tsbuildinfo` |
| Whole check | `npm run check` | audits and types side by side, then the production build |
| Production build | `npm run build` | needs far more than 6 GB free for the whole site (section 6); a CI runner has 16 GB |
| Page sizes after a build | `npm run audit:page-budget -- --report` | HTML, page data, first-load JavaScript, style sheets and requests for every prerendered page, per kind of page. Without `--report` it fails when a page is over budget |
| What is in the JavaScript | `npx next analyze --output --snapshot a`, then `npx next analyze export --snapshot a > graph.jsonl` | every module of every chunk of every route, with sizes; sum `part` records by `source_path` |
| A small build for a quick check | `DOCS_DIR=tmp/mini-docs npm run build` | builds only the pages in that folder (copy a few pages and the `meta.json` of every folder above them); about 40 to 90 s |
| Headers | `npm run build && npm start -- -p 3200`, then `curl -sI http://localhost:3200/<path>` | the `Cache-Control` of each kind of route |

`node scripts/run-parallel.mjs [--limit N] <npm script or command>...` runs independent scripts side by side and prints each one's output when it ends. `check`, `check:quick`, `check:full`, `audit:content` and CI use it.

## 2. Build, test and compile times (PERF-02)

Seconds. "Before" is the repository as it was on origin/main; "after" has the changes in this branch.

| Command | Before | After | What changed |
|---|---|---|---|
| `npm run test:unit` (257 tests) | 9.6 cold, 6.3 warm (seven chained `npm run` calls; the files themselves take 0.2 to 1.0 s each, 4.2 s in all) | 1.5 cold, 1.4 warm | one `node --test` run, four files at a time; same 257 tests pass |
| `node scripts/check-mdx.mjs`, pages changed | 5.0 (it always checked what it was given, and `check` never ran it) | 0.35 when nothing changed | default is the changed pages; CI runs `--all` |
| `node scripts/check-mdx.mjs --all` (699 pages) | 5.0 and 5.6 | 4.3 | unchanged |
| `npm run audit:content` | 17.8 warm (its parts timed alone: 1.5 + 1.3 + 0.9 + 0.8 + 0.7 + 18.6 + 0.8, 24.6 in all, cold) | 13.9 when the Java audit runs, 1.4 when its inputs are unchanged | audits run side by side; the Java audit (a `javac` run, 13 s) is skipped when its inputs have not changed since it passed |
| `npm run audit:content:full` (CI) | not timed | 17.2 | the same audits plus the two study-guide audits, side by side |
| `npm run types:check` | parts timed alone: `fumadocs-mdx` 3.6 + `next typegen` 3.6 + `tsc` 13.8 cold or 7.0 warm = 21.0 cold | 11.8 cold, 5.8 and 6.0 warm | `tsc` itself is unchanged: the build info moved into `.next/cache` (so CI can keep it), and the machine was less busy for the second set of runs. Do not read this as a `tsc` speed-up |
| `verify-csi247-listings.mjs` | 30.4 | 33.6 the first time (all lessons), 0.34 when no lesson changed | `scripts/verify-listings-changed.mjs` remembers the lessons that passed (hash of the text, the verifier and the JDK) |
| `npm run check:quick` (new) | none | 2.7 | audits (Java skipped), unit tests and changed MDX pages side by side |
| Production build, whole site | did not finish: killed at 30 s, free memory had fallen from 3.5 GB to 0.8 GB | did not finish: killed at 28 s, free memory had fallen from 6.7 GB to 0.6 GB | see section 6 |
| `next dev`, first request of a CSI243 notes page | did not finish: killed at 33 s after about 3.2 GB | the same with `async: true` on the docs collection (lazy page bodies) and with the two `turbopackLazyDynamicImports` flags; both removed again, no gain | see section 6 |
| Production build, 18-page mini site (`DOCS_DIR=tmp/mini-docs`) | 86 s and 44 s | 62 s and 55 s | the two runs of each differ by more than the change; treat as the same |
| Production build, all 699 page names with empty bodies (full sidebar tree) | not run before the change | 70 s and 67 s | shows the cost of the tree alone |
| CI job | not measured (cannot run CI from here) | not measured | `ci.yml` now runs the independent checks side by side, caches `.next/cache` and the Playwright browsers, and skips the second type check inside the build. Expect the checks stage to drop from the sum of the steps to the longest one; the real gain needs one CI run to read |

Findings are unchanged: `npm run audit:quizzes` prints the same line before and after (267 quizzes, 1050 questions, 267 references), `npm run audit:content-standard -- --course csi247` prints the same report, and the unit tests are 257 of 257 before and after.

Not done: a `tsc` project-reference split (the single program takes 6 s warm, so there is little to split), and `workers` for Playwright (`playwright.config.ts` runs one worker; two on CI would halve the browser stage, but the specs share one server and nobody has checked that they are independent).

## 3. Quizzes, flashcards and practice questions (PERF-04)

How the data reached the page before: `QuizRef` and `PracticeRef` are server components that read the JSON at build time and passed every question as a property to the client component, so the questions were in the page twice (once drawn, once as page data). 81 pages use them and carried 1,007,220 bytes of questions in all (mean 12 KB, largest 162 KB on the CSI213 topic 4 Review). A quiz written directly in the MDX (`<Quiz questions={quizData} />`, 46 pages) and a flashcard deck (`<FlashcardDeck cards={...} />`, 31 data modules, at most 16 KB per page) carry their questions in the page too; they are not changed because that needs MDX edits.

What it is now: `QuizRef` and `PracticeRef` put only the title, the question count and an address (`/data/quiz/<path>.json?v=<hash of the content>`) in the page, with a low-priority preload hint. Each data file is also a static JSON file (`app/data/[kind]/[...path]/route.ts`, 81 quiz and practice files, `Cache-Control: public, max-age=31536000, immutable`). In the browser `QuizLoader` and `PracticeLoader` show a stand-in, fetch the file when it is within 800 px of the screen (one request for all quizzes on the page that read the same file) and render the same `Quiz` or `PracticeQuestions` in the same place. `MathText` renders text without a `$` as plain text and loads KaTeX in its own chunk only for a text with a formula.

Measured on a real `next build` and `next start` of the mini site, HTML in KB (raw, and gzip level 6):

| Page | Before | After this change |
|---|---|---|
| CSI213 topic 4 Review (one `QuizRef`, 221 KB of questions) | 284.1 (38.2 gz) | 103.1 (21.0 gz) |
| CSI213 topic 4 Practice (six `PracticeRef`) | 216.2 (25.9 gz) | 106.1 (16.3 gz) |
| CSI243 list recursion notes (eleven `QuizRef`) | 483.6 (61.6 gz) | 435.6 (50.0 gz) |
| CSI243 lists notes (`QuizRef`) | 350.5 (46.3 gz) | 318.3 (38.9 gz) |
| CSI243 topic 6 Review (`Quiz` and `FlashcardDeck` written in the MDX) | 135.0 (27.8 gz) | 133.6 (27.6 gz), unchanged as expected |

(The mini site has 15 pages, so these do not include the sidebar data of the whole site, section 6.)

Checked in the browser on the mini build (the built-in browser pane): the Review page shows the chooser (195 questions, six topics) after the file arrives and the browser reuses the preloaded download (one network entry, 164 KB); Start, an answer and Check answer work and the feedback draws its formulas with KaTeX; the Practice page shows its 18 sections with 94 formulas, and Show solution opens a solution with formulas. The pane did not fire `IntersectionObserver` callbacks in a background tab, so the loaders were exercised with a stub that reports every element as visible; in a visible tab the observer does the same.

Not measured: time to the first question on Slow 4G (Lighthouse is not installed and was not downloaded). By design the file is requested when the HTML is parsed (the preload hint), in parallel with the scripts, so the question appears as soon as the scripts have run. Not done: prefetching the next topic's file on idle (the page does not know the next topic's data file), and moving the `<Quiz questions=...>` and `<FlashcardDeck cards=...>` pages to the loaders (needs MDX edits or a remark plugin).

## 4. Clean-up (PERF-03)

Removed (all recoverable from git history):

| What | Size | Why nothing needs it |
|---|---|---|
| `_archive_csi247/` (115 files) | 603,563 bytes | referenced only by `pivot_to_canvases.sh`, which created it, and by the exclude list of `scan_uni_docs.py` |
| `pivot_to_canvases.sh` | 2,923 bytes | the one-off script that moved the old CSI247 folders into the archive; nothing calls it |
| `components/visuals/mermaid.tsx` and its entry in `components/mdx.tsx` | 3,597 bytes | no MDX page uses `<Mermaid>` (`git grep`: the word appears only in prose); it loaded the `mermaid` library at run time |
| `@codesandbox/sandpack-react` in `package.json` | 76.8 MB of `node_modules` together with the next row | no file imports it |
| `mermaid` in `package.json` | (in the row above) | no file imports it. It stays in `node_modules` because `@excalidraw/excalidraw` depends on it |

Sizes: tracked files 3,700 files and 450,368,618 bytes before, 3,584 files and 449,741,442 bytes after (`public/` is 435,864,977 bytes before and after, `content/` 7,703,190); `package-lock.json` 364,468 bytes before, 342,748 after; `node_modules` 780,757,107 bytes before, 703,927,490 after.

Looked at and kept:

- `llms.txt`, `apply-files.py`, `payload.json` (the JSON payload workflow): removed on 2026-11-04, the owner asked for it. The `/llms.txt` route of the site is unaffected.
- `public/files/**` (321 MB) and `public/diagrams/**` (81 MB): the PDFs, slides and canvases are linked from `public/files/<course>/meta.json` (read by `ResourceHub`) or from topic Overview pages. Of the 2,054 files in `public/`, a search of every tracked text file for the path or the file name finds no mention of 121, all small (0.9 MB). Of these, `public/files/sem3/csi247/pdfcoffee.com_csi-247-exam-2018-pdf-free.pdf` (683 KB), `public/files/sem1/mat111/lectures/Week 7.pdf` (193 KB) and `public/og-image.png` (6.7 KB) are single files that look forgotten rather than dead; the rest are parts of the CSI243 archive and download sets that the Legacy pages list. Duplicates by content: 104 groups, 2.8 MB, mostly PDFs shared between two courses' resource lists.
- The twelve Excalidraw canvases (about 81 MB) are 99 per cent embedded PNG images (the 11.6 MB `stacks-and-queues` canvas holds 11.4 MB of base64 images in 18 files); redrawing them with smaller images is the largest saving left in `public/`. A canvas of 3 MB or more already waits for a click.
- `scan_uni_docs.py`, `scripts/build-downloads-readme.mjs`, `scripts/sync-mat221-source-content.mjs`, `scripts/scaffold-semester-study-pages.ps1`, `scripts/audit-csi247-pdf-layout.py`: nothing calls them by name, but each is a stand-alone tool the owner may run by hand.
- The prose in `content/docs/sem3/csi243/10-reasoning-revision/notes/complexity.mdx` still says "the Mermaid tree above"; the tree is gone.

## 5. Caching (PERF-05)

Read first: `node_modules/next/dist/docs/01-app/02-guides/cdn-caching.md` and `ci-build-caching.md`, and the `headers` reference. Next sends static pages with `s-maxage=31536000` and `/_next/static` files as `public, max-age=31536000, immutable`, and says the immutable header cannot be changed. Every docs page is already generated at build time (`generateStaticParams`), and `llms.txt`, `llms-full.txt`, the `.md` copies, the sitemap and the manifest are static too.

Headers per kind of route, from `next start` on the mini build (before and after):

| Route kind | Before | After |
|---|---|---|
| Docs page, home, overview (HTML) | `s-maxage=31536000` | unchanged, on purpose: the edge keeps it until the next deploy and the browser revalidates. A browser `max-age` on HTML would leave a returning reader with a page that points at script files a later deploy removed, unless Vercel Skew Protection is on; with it, adding `max-age=300, stale-while-revalidate=86400` is safe |
| `/_next/static/**` | `public, max-age=31536000, immutable` | unchanged |
| `/files/**`, `/diagrams/**`, `/videos/**`, `/images/**`, `/java-playground/**`, `logo.png`, `og-social.png`, `og-image.png` | `public, max-age=0` | `public, max-age=86400, stale-while-revalidate=604800` (not hashed, so not immutable) |
| `*.excalidraw` | `application/octet-stream` | `application/json; charset=utf-8` (so a server may compress it) |
| `/data/quiz/**`, `/data/practice/**` | did not exist | `public, max-age=31536000, immutable`, the address carries a hash of the content |
| `/api/search?query=...` | none | `public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` |
| `/llms.txt`, `.md` copies | `s-maxage=31536000` | unchanged |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | `public, max-age=0, must-revalidate` | unchanged |
| `/og/docs/**` images | made at build time (about 700 PNGs) | made on the first request and then cached (`revalidate = false`); the build no longer draws them |

Other changes: `proxy.ts` now has a `matcher` for `/docs` only; it used to run in front of every request (home, API, search, data, everything under `public/`). The Excalidraw fetch uses `cache: 'no-cache'` instead of `'no-store'`, so opening the same 20 MB canvas twice downloads it once. Redirects: the old Exam address of a renamed topic went to the old Review address and then to the new one (two hops); `next.config.mjs` now has a direct rule for each, and a script over the 242 rules found no other chain. Measured: `/docs/sem3/csi247/java-fundamentals/exam` 308 to `/review` then 308 to `/01-java-fundamentals/review` (two hops) before; one 308 after. The same for `hash-tables/exam-practice` to CSI323. CI caches `.next/cache` (Turbopack's build cache and the TypeScript build info) and the Playwright browsers.

Not done: the `vercel.json` header rules (the owner's checkout has uncommitted changes to it; the rules above are in `next.config.mjs`, which Vercel applies too), and the two-deploy stale-content check (needs two deployments).

## 6. Page load (PERF-01)

Whole-site production build: it did not finish, twice. First attempt, 3.5 GB free at the start: killed after 30 s during "Creating an optimized production build" when free memory had fallen to 0.8 GB. Second attempt, 6.7 GB free: killed after 28 s at 0.6 GB. Fifteen Node worker processes of the killed build were left running and had to be stopped by hand. So the numbers below come from a mini site (15 pages), from a build of all 699 page names with empty bodies (which shows what every page carries), and from static analysis.

Why the whole site is so large: compiling the 699 MDX pages with the site's plugins gives 70.6 MB of JavaScript from 5.4 MB of text (13 times). CSI243 is 44.6 MB, CSI213 10.1 MB, MAT221 5.4 MB, CSI247 5.0 MB. 161 pages compile to more than 100 KB and 47 to more than 500 KB. The code is 176,815 highlighted tokens in 8,371 code blocks (each token becomes a JSX call with a style object) and 23,838 KaTeX nodes (CSI213). Turbopack reads all of it for the first docs request in development and for the build.

What was tried and did not help: `async: true` on the docs collection (page bodies loaded with `page.data.load()`) and `experimental.turbopackLazyDynamicImports` with `turbopackLazyDynamicImportsSSR`. The first docs request in development was killed at about 3.2 GB in all three cases (33 s, 35 s, 17 s). Both were removed again, so `source.config.ts` and `app/docs/[[...slug]]/page.tsx` keep their original page loading.

What would help (prototype, not applied): emit each highlighted code block as one string instead of one JSX call per token. With the file-type picture also off, the 699 pages compile to 42.1 MB (from 70.6 MB), pages over 100 KB go from 161 to 115 and over 500 KB from 47 to 19. It needs `MdxPre` and `nodeText` in `components/interactive/code-window.tsx` to read the text and language from properties instead of walking children. The same walk is also the cause of a flaw found while testing: `MdxPre` is a client component, its children can reach it as a lazy reference, `nodeText` then returns less text, and the block gets the wrong kind (Output instead of Code), no language label or a wrong line count. Two builds of the same code gave different markup for the same page. Computing the language and text on the server (before the client boundary) fixes it and is the same change.

Applied and measured on real builds of the mini site (gzip level 6, first load of a docs page):

| | Before | After |
|---|---|---|
| First-load JavaScript | 556 KB in 26 requests | 315 KB in 22 requests |
| Style sheets | 99 KB | 73 KB |
| HTML of a page with no body, in the full tree (699 pages) | 417.8 KB raw, 54.8 KB gzip (page data 320 KB) | 225.9 KB raw, 27.5 KB gzip (page data 143 KB); the page markup is identical |

What changed the JavaScript: KaTeX is loaded only for text with a formula (556 to 479 KB; a CSI243 Review page now loads 23 script files, 340 KB over the wire, a CSI213 notes page 25, 417 KB, the extra 77 KB being a chunk only that page loads), and then 27 interactive components are loaded by the pages that use them (479 to 315 KB; `components/interactive/lazy.tsx`: the Haskell and Java runners, the animation library behind the insertion-sort story, every explorer, story and simulation). What changed the style sheets (99 to 73 KB): Excalidraw's 145 KB style sheet is loaded with the editor and not with every page, and the duplicate `katex.css` import in `app/layout.tsx` (the same file is already imported by `global.css`) is gone. The Mermaid component is deleted but was never in the first load (a dynamic import), so it changes nothing here. The page data: the layout handed the whole page tree to client components, so every page carried the tree of all 699 pages with a description of up to 200 characters, the source path and `"$undefined"` for each unset option on 880 nodes. `lib/slim-tree.ts` drops what the sidebar never reads. A unit test covers it, and the page markup (scripts removed) is byte for byte the same before and after. `icon: false` in the code options drops an 800-character SVG that was compiled into every code block and sent to the browser as a property of each one (4.0 MB less compiled output across the site; 17 KB less HTML on the lists page and 24 KB less on the list recursion page).

What is left in the first load (315 KB): React and Next (about 140 KB), the Fumadocs layout and its dialogs (about 90 KB), the progress and timer panels, Lucide icons. `features/courses/csi247/study-guides/native-chapter.css` (116 KB, about 20 KB gzip) is imported by `app/docs/[[...slug]]/page.tsx` and so is in every docs page's style sheets; loading it only where a full chapter is drawn means moving the import into a client component that is loaded on demand, as was done for Excalidraw. The sidebar still lists all 699 pages on every page (about 143 KB of page data after the slimming); sending only the current course's branch needs the layout to know the page, which means moving `DocsLayout` into the page.

Not measured: Largest Contentful Paint, Total Blocking Time and hydration time (no Lighthouse; the built-in browser pane has no throttling), and the HTML of the real pages of the whole site (the build does not fit). The size of every real page can be read after one CI build with `npm run audit:page-budget -- --report`.

## 7. Budgets

| Budget | Limit | Enforced by |
|---|---|---|
| HTML of a prerendered page | 500 KB | `npm run audit:page-budget`. Report-only in CI until the pages that are already over are recorded with `npm run audit:page-budget -- --write-known` after a full build; then drop `--report` and commit `scripts/page-budget.json` |
| First-load JavaScript of a page, gzip | 330 KB (the order asked for 250 KB; the framework, the layout and the panels are about 300 KB, section 6) | the same script |
| A notes, review or practice page, compiled | 500 KB | `npm run audit:content-standard` (DEV-03) |

## 8. Working with little memory

- Check first: no game running (`Get-Process VALORANT`), and free memory (`(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory` is in KB). Do not start a build, `tsc` or a dev server below 3 GB free. The whole-site build needs far more than 6 GB; use `DOCS_DIR=tmp/mini-docs` or CI.
- Run one heavy command at a time: `npm ci`, `next build`, `next start`, `next dev`, `tsc`, Playwright, Lighthouse and the Java audits. When several people or agents share the machine, take the lock first (`mkdir C:/Users/Nido/AppData/Local/Temp/claude/perf-heavy.lock`) and remove the folder when the command ends, also when it fails.
- After stopping a Turbopack build or dev server, look for leftover `node` processes (`pool_entry-[turbopack-node]` workers keep running and hold 50 to 80 MB each) and stop the ones that belong to your folder.
- `next dev` rewrites the block in `AGENTS.md` (its heading level). Set `agentRules: false` in `next.config.mjs` to stop it, or leave that change out of your commit.
