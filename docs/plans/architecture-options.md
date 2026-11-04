# Architecture options for university-cs-docs

Written 2026-11-04 from a read-only study of `C:/wt/perf2`, the Next.js 16.4.3 docs in `node_modules`, the GitHub Actions and commit-status history of `MooketsiMagwaza/university-cs-docs`, and public documentation. Nothing was built or run. Every number is **measured** (repo, CI history, docs), **cited** (web, listed at the end) or an **estimate** (reasoning shown).

## Summary

**Diagnosis.** The build is heavy because all 730 MDX pages are compiled into JavaScript modules that Turbopack bundles, so build memory follows the weight of the content (about 78 MB compiled today, estimate), not the page count; 40% of it is highlighted code and about 22% is KaTeX. Vercel's 8 GB machine was crossed between 699 and 730 pages, and the Dependabot bump is not the cause, because the commit before it (4f6fcaa) failed too.

**Recommended path.**
1. This week: read the failing Vercel log (it says whether V8's heap or the container died), then take the fastest of: a `NODE_OPTIONS` heap variable (free), the Enhanced build machine (cents per build, needs Pro), or a GitHub-built prebuilt deploy (free). Verify and merge PERF-06 (now committed) as the real code fix.
2. This month: collapse KaTeX the same way as code (new, 2 to 3 days) and run a 3 to 4 day spike on taking the content out of the bundler (option F).
3. Decide at about 1,000 pages: adopt F for all courses if memory stays flat; otherwise stay on A with a Pro machine and put new semesters in separate zones (B).
4. Do not rewrite on Astro, Docusaurus, VitePress or Hugo: none removes the cause and each costs 30 to 60 working days.
5. The owner's plain-HTML idea is right for page bodies and wrong for widgets. Its cheapest honest form is F.

## 1. Diagnosis

### 1.1 Causes, separated by evidence

| Cause | Evidence | Verdict |
|---|---|---|
| Content compiled into the bundle | `.source/server.ts` has one `import * as` per page (730 modules, sync mode); `includeProcessedMarkdown` stores each page's text twice; 70.6 MB of JavaScript from 5.4 MiB of text at 699 pages | **Main cause (measured)** |
| Code blocks as JSX | PERF-06 prototype: 70.6 to 42.1 MB (8,371 blocks, 176,815 tokens) | 40% of output (measured) |
| KaTeX as JSX | CSI213 10.1 MB from 0.19 MB of source; MAT221 5.4 MB from 0.08 MB | about 22% (measured); PERF-06 does not touch it |
| Every route imports `source` | The docs page, `llms.mdx`, `llms-full.txt`, `sitemap`, `og` and `/api/search` (an Orama index built at run time) import `lib/source.ts`, hence all 730 modules | Inflates every function and cold start (code reading; sizes not measured) |
| Prerendered routes | 1,564 = 730 pages + 730 `.md` + about 100 others; static generation 32 s of about 150 s | Small in time; memory share unknown |
| Turbopack compile memory | Desktop build killed in 28 s (free memory 6.7 to 0.6 GB); dev server 1.45 GB idle, 4 GB after ten pages | Real, follows the module graph. `turbopackMemoryEviction` only works in `next dev` (Next docs), so that line in `next.config.mjs` does nothing for builds |
| Sidebar tree on every page | 143 KB of page data per page at 699 pages | Not a memory cause but quadratic: about 510 KB per page at 2,500 pages (estimate, linear in pages). PERF-08's 20 KB gzip test will probably pass by about 1,500 pages |
| Client components, Shiki and KaTeX output | First load 315 KB gzip; CSI243 pages 435 to 720 KB of HTML | Page weight, not build. `CodeWindow` is `'use client'` and takes `html` and `text` props, so each code block is in the page three times (markup plus two Flight strings; Next docs say the payload carries client-component props) |
| Images and canvases | `public/` is 436 MB | Not in the compile; clone time and repo size only |
| Dependency bump | 4f6fcaa (before it) and d0760b8 (after) both failed; 36dddb5 (699 pages) passed | Ruled out |

### 1.2 Where did it die?

GitHub built d0760b8 in 153 s on a 16 GB runner (133 s for 4f6fcaa); that job failed only in the later Playwright smoke test, a separate problem. On Vercel, successful deployments took 5:04 (36dddb5), 6:13 and 7:48 from "pending" to "success"; the failures stopped at 4:32 and 5:47. That fits dying late (static generation or after) but does not prove it. The log decides: `npx vercel inspect dpl_HLQvfpJ4JpR7xfZkjFqEYqjKj549 --logs`. If it says "JavaScript heap out of memory", V8's limit was hit, not the container; CI sets `--max-old-space-size=8192` and I cannot see whether Vercel does.

### 1.3 Scaling model (estimate from three anchors)

Memory: `peak GB = 2 + 0.079 x compiled MB`. The slope is fitted to one crossing (8 GB at about 76 MB, between the 699-page pass and the 730-page failure); the 2 GB fixed part is the idle dev server rounded up. It also matches the desktop kill (7.6 GB predicted for 699 pages; more than 6 GB seen). Trust it to plus or minus 30%. Compiled size at 730 pages is about 78 MB (70.6 MB scaled by source growth, less the lighter CSI247 pages); new pages are assumed to weigh today's average.

| Pages | Today's code (MB / GB) | PERF-06 (x0.6) | PERF-06 + KaTeX collapse (x0.46, est.) |
|---|---|---|---|
| 730 | 78 / **8.2** | 47 / 5.7 | 36 / 4.8 |
| 1,000 | 107 / 10.4 | 64 / 7.1 | 49 / 5.9 |
| 1,500 | 160 / 14.6 | 96 / 9.6 | 74 / 7.8 |
| 2,500 | 267 / 23.1 | 161 / 14.7 | 123 / 11.7 |

Weight matters more than count: CSI243 compiles to 0.30 MB per page, CSI247 to 0.044, today's mix to 0.107. If every new page is CSI243-like, multiply the 2,500-page row by 2.3; if CSI247-like or Semester I and II stubs, by 0.6.

**Crossings (pages).** 8 GB Vercel machine: about 710 today, 1,180 with PERF-06, 1,540 with PERF-06 and KaTeX collapse. 16 GB Enhanced: 1,660, 2,760, 3,600. Owner's desktop with 5 GB free: 360, 590, 770, so the whole site will not build there even after both fixes and `DOCS_DIR` stays necessary.

Build time (GitHub runner, 4 vCPU, "Production build" step, 39 successful runs):

| Pages | MDX MB | Code blocks | Median step time (runs) |
|---|---|---|---|
| 618 | 2.20 | 1,541 | 95 s (15) |
| 671 | 5.27 | 7,926 | 168 s (4) |
| 699 | 5.69 | 8,181 | 192 s (10) |
| 730 | 6.51 | 8,847 | 133 and 153 s (2) |

Fit: `80 s + 11.1 s per 1,000 code blocks` (R squared 0.79 over six size groups; page count fits worse, R squared 0.54). That is about 214 s at 1,000 pages, 282 s at 1,500 and 416 s at 2,500. Time is not the binding limit; Vercel's cap is 45 minutes.

Other walls (cited): functions are capped at 250 MB uncompressed (5 GB in beta). If every function holds the whole collection, that is reached near 2,300 pages today and near 3,900 with PERF-06 (estimate; sizes unmeasured). Redirects, rewrites and headers count as "routes", capped at 2,048 per deployment; the site has about 270.

### 1.4 What Vercel offers

Hobby always uses the Basic machine (2 vCPU, 8 GB). Pro and Enterprise can choose Standard (4 vCPU, 8 GB), Enhanced (8 vCPU, 16 GB), Turbo (30 vCPU, 60 GB) or Elastic (auto-sized). Builds cost $0.0035 per CPU minute, rounded up to the minute: Enhanced $0.028 per build minute (Vercel's example: 2 min 34 s costs $0.084), Turbo $0.105. Pro includes one paid seat, extra seats $20 a month (the base fee is on a pricing page I did not read). A failed build does not update the build cache. I cannot see the owner's plan (team slug `odins-project`). `VERCEL_BUILD_SYSTEM_REPORT=1` prints an out-of-memory report on every build.

## 2. The options

Assumption: 1,500 to 2,500 pages in two to four semesters. Today 699 of 730 pages use components, 400 pass JSX literals, 54 import TypeScript quiz data.

### A. Stay on Next and Fumadocs and optimise further

- **A1 PERF-06**: uncommitted when I read perf2, since committed on `feat/code-blocks-as-strings` (e6466a7). Measured 70.6 to 42.1 MB on the prototype; its commit message reports minus 38% on a 10-page sample.
- **A2 collapse KaTeX and any static subtree to strings**: the same trick for the other 22%. Astro ships it as the MDX `optimize` option ("may be useful if you have many MDX files"; an internal plugin, not a package). Estimate: minus 9 MB.
- **A3 a prebuilt search index** (Pagefind or a static export) so `/api/search` stops carrying the collection. Pagefind claims a 10,000-page search in under 300 kB of payload.
- **A4 less prerendering.** `generateStaticParams` may return a subset or `[]`; the rest renders on first visit (Next docs). `[]` for `llms.mdx` removes 730 of 1,564 prerenders. Fewer workers, each of which loads the compiled pages, cut memory in static generation: commit 16b994a already sets `cpus: 2` on Vercel, and the experimental `staticGenerationMaxConcurrency` and `staticGenerationMinPagesPerWorker` are the next knobs. On-demand pages need a function that loads the collection, so pair with `async: true` (lazy bodies) or cold starts slow; PERF-01 tried `async: true` only in dev, where it cannot cut compile memory.
- **A5 per-course route groups** with their own `defineDocs` shrink each function (the 250 MB wall) but not the build total, since one `next build` compiles every route (reasoning, unverified).
- **A6 compile cache:** Turbopack's build cache is already on by default since 16.3; memory, not CPU, is the limit. **A7 Skew Protection** is Pro-only and does not touch memory. **A8 a larger machine** is the only no-code lever.
- **A9 page weight:** render `CodeWindow` on the server with a tiny copy island; do PERF-07, PERF-10 and PERF-08 earlier.

### B. The same stack as several apps (Next multi-zones)

Next documents Multi-Zones: separate apps behind one domain via `rewrites` and `assetPrefix`, with hard page loads between zones (`node_modules/next/dist/docs/01-app/02-guides/multi-zones.md`). CSI243 is 63% of the compile, so one zone for it, one for the rest, new zones for new semesters. Avoid Vercel's Microfrontends product: 2 projects included, then $250 per project per month on Pro.
- **Port:** extract `components/`, `lib/`, `features/`, `app/styles` into workspace packages; per-zone `next.config.mjs` (assetPrefix, its share of the 242 redirects), `source.config.ts` and Vercel project; a shared `tree.json` so tabs and sidebar list other zones; search, `llms*.txt`, sitemap, OG and the `.md` negotiation in `proxy.ts` aggregated or duplicated.
- **Lose:** soft navigation between semesters, one search box (unless Pagefind), single-deploy simplicity.
- **B-lite:** same repo, N Vercel projects, one `DOCS_DIR` each (already supported), rewrites in the root project: 4 to 7 days, but a zone's sidebar shows only its own pages until the tree is shared.

### C. Astro with Starlight (MDX and React islands)

Starlight supports MDX and bring-your-own React components. In Astro's islands model (from memory) a component ships no JavaScript without a `client:*` directive, so static widgets (`Step` 4,377 uses, `Callout`, `CheckQuestion`) would render to plain HTML from the existing React code and about 30 interactive ones need a directive.
- **Build evidence is thin.** Astro 5's Content Layer claims up to 5x faster Markdown, 2x MDX and 25 to 50% less memory (vendor). Astro 7's default Rust compiler Sätteri claims up to 60% faster builds but runs no remark or rehype plugins, and we need remark-math, rehype-katex and Shiki. The only independent benchmark is from 2022: 4,000 plain Markdown files in 22.9 s on Astro 1.0, 70.7 s on Next 12, 0.68 s on Hugo. One anecdote has an Astro blog out of memory on Vercel until `getStaticPaths` data was trimmed. I found no figure for MDX of this weight. Estimate: the server module graph is as large as in PERF-06 form, so memory beats Next only by the client graph.
- **Page weight** is the real gain. Estimate: 20 to 60 KB gzip of JavaScript on a notes page against 315 KB, body once in the HTML.
- **Port:** the Fumadocs layout (header, section tabs, sidebar with progress and timer banner, TOC, page actions, pager, topic tabs, streak chip) as Starlight overrides; search to Pagefind; routes `llms.txt`, `llms-full.txt`, `.md` copies, OG, sitemap, robots, manifest, `/data/*.json`, `/progress-manifest.json`; 242 redirects; the MAT221 compat shell; and the hard part, `features/progress` and `features/study-timer` (178 KB of TypeScript on React context providers), which need a shared store because every island is its own React root.

### D. Other frameworks

| Framework | Hosts the React components? | Evidence on scale |
|---|---|---|
| Docusaurus | Yes | Same design (MDX modules in a bundle). Issue 9754: 2,289 MD/MDX files, client compile 1.3 min and server 4.4 min per locale, 7 to 14 GB RAM. Discussion 10584: a large site ran out of memory at 32 GB until Rspack ("Docusaurus Faster") fitted in 16 GB |
| VitePress | No (Vue) | Issue 4833: thousands of math-heavy notes ran out of memory at an 8 GB heap |
| Nextra 4 | Yes | App Router; same Turbopack profile, and its guide warns the catch-all route lengthens compilation |
| SvelteKit | No (about 60 components rewritten) | No benefit that offsets the rewrite |
| Eleventy | Only by hand | 4,000 Markdown files in 1.9 s (2022). This is option E |
| Hugo, Zola | **No.** Markdown and shortcodes only; 699 of 730 pages use components | Hugo 0.68 s for 4,000 files (2022). 2,562 `HaskellTryIt` and 267 `QuizRef` become shortcodes plus vanilla JavaScript. Hugo highlights with Chroma, not Shiki (my knowledge) |

### E. Plain HTML, CSS and JavaScript with a small generator

See section 5.

### F. Content pipeline plus a thin Next app (my addition)

Render each page once to an HTML fragment and a JSON record, cache by content hash, let Next read files. Two forms:
- **F1, first-party, quickest to test:** `defineDocs({ docs: { dynamic: true } })`. `fumadocs-mdx/dist/runtime/dynamic.js` reads each file with `fs`, compiles it with `environment: 'runtime'`, runs it with `AsyncFunction` and caches it per page, so no page enters Turbopack's graph; the repo already generates `.source/dynamic.ts`. Unproven: the option has no description in Fumadocs' collection reference, `@/` imports in MDX (54 quiz-data pages) probably cannot resolve at run time and need PERF-10 first, and each static-generation worker keeps the pages it compiled.
- **F2, own script:** `scripts/build-content.mjs` compiles each page with today's plugins, renders it with `react-dom/server` over an esbuild bundle of the components, and writes `<hash>.html` plus a manifest (frontmatter, toc, search text, processed markdown). `lib/source.ts` becomes a virtual source (`loader` accepts `{ files: [{ type, path, data }] }`, as `toFumadocsSource` shows); the page renders `<DocsPage>` around `dangerouslySetInnerHTML` in a server component (no Flight copy); a small hydrator mounts marked islands lazily. Precedents in the repo: the CSI247 chapters are HTML strings from `createGuides()` shown by `FullStudyChapters`, and `scripts/check-mdx.mjs` compiles all 730 pages in 4.3 s, so MDX parsing is cheap; the cost is Shiki, KaTeX and the bundler.
- **Memory:** Next stays near its fixed part (about 2 GB, estimate) at any size; the pipeline holds one page per worker (estimate 0.3 to 0.6 GB each). **Time:** cold pipeline 2 to 5 minutes (estimate), warm seconds; Next build plus prerender 100 to 150 s at 5,100 routes.
- **Port:** `lib/source.ts`, `source.config.ts` (becomes pipeline config), `page.tsx`, the llms and search routes, an island protocol for about 30 interactive components (props must be JSON), the 54 quiz-data pages.
- **Gradual:** yes, inside one app. A course flag picks fragment or MDX, and each migrated course leaves the bundle at once. CSI243 first removes 63% of the compile.

### Facts side by side

| | A (A1+A2+A3) | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Memory now to 2,500 pages | 4.8 to 11.7 GB | about 5 GB per zone, 4 equal zones (est.) | unknown, similar graph (est.) | Docusaurus 7 to 14 GB at 2,289 files (cited) | under 1 GB (est.) | about 2 GB fixed (est.) |
| Build time at 2,500 | about 7 min (est.) | 4 parallel builds, 3 min each (est.) | unknown | minutes to hours | 2 to 5 min cold, seconds warm (est.) | E plus 1 to 2 min |
| Page weight | JS 315 KB gzip (measured); HTML down ~40% on code pages (est.) | same | JS 20 to 60 KB (est.) | Docusaurus SPA, heavier | JS 10 to 40 KB (est.) | HTML smaller; JS 250 to 315 KB |
| Effort (working days) | 8 to 12 | 8 to 15 (B-lite 4 to 7) | 30 to 45 | 30 to 60 | 45 to 70 | 15 to 25 (first course 8 to 10) |
| Gradual? | not needed | yes, zone by zone | yes, by rewrites, two UIs | yes, same | yes | **yes, per course, one UI** |

## 3. Weighted comparison

Scores 1 (poor) to 5 (best), my judgement from the evidence above. Weights: memory 20 (it is the failure); effort 17 and feature loss 12 (one developer, months of widgets); maintainability 14; risk 12; scalability 9 (walls other than memory); page weight 8 (students on mobile data, but the site is not slow today); cost 5; build time 3 (the 45-minute cap is far).

| Criterion (weight) | A | B | C | D Docusaurus/ VitePress | D Hugo/ Zola | E | F |
|---|---|---|---|---|---|---|---|
| Build memory (20) | 2 | 4 | 3 | 2 | 5 | 5 | 5 |
| Build time (3) | 3 | 4 | 4 | 2 | 5 | 5 | 4 |
| Page weight (8) | 3 | 3 | 5 | 3 | 5 | 5 | 4 |
| Migration effort (17) | 5 | 3 | 1 | 1 | 1 | 1 | 3 |
| Risk (12) | 4 | 3 | 2 | 2 | 1 | 2 | 3 |
| Feature loss (12) | 5 | 3 | 3 | 2 | 1 | 2 | 4 |
| Maintainability by one (14) | 4 | 2 | 3 | 3 | 3 | 2 | 3 |
| Scalability to 2,500 (9) | 2 | 4 | 4 | 2 | 5 | 5 | 5 |
| Cost (5) | 3 | 4 | 5 | 5 | 5 | 5 | 4 |
| **Weighted score (of 100)** | **71** | **65** | **58** | **44** | **62** | **64** | **77** |

A wins the short term and F the long term, and they are not rivals: A1 and A2 are also the first steps of F. Hugo and Zola score well on build criteria only; effort and feature loss rule them out.

## 4. Recommendation in stages

### This week: deploy again

Production should not be down: Vercel only promotes a deployment that finishes, so the 11-02 deployment (699 pages) should still serve (I did not check the dashboard). In order:
1. **Read the failure (10 minutes):** the `vercel inspect --logs` command above, and set `VERCEL_BUILD_SYSTEM_REPORT=1`.
2. **If the log says "JavaScript heap out of memory":** add `NODE_OPTIONS=--max-old-space-size=6144` as a Vercel environment variable and redeploy. Free, two minutes.
3. **If the container was killed and the team is Pro:** set the build machine to Enhanced (Settings, Build and Deployment) and redeploy. A 3-minute build is about $0.084. No code change; the fastest safe route.
4. **If the team is Hobby:** deploy the build GitHub already makes. Add a job after the build step in `.github/workflows/ci.yml`: `vercel pull --yes --environment=production`, `vercel build --prod`, `vercel deploy --prebuilt --prod`, with `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as secrets only the owner can create, and `"git": { "deploymentEnabled": false }` in `vercel.json` so Vercel stops failing its own build. The owner has uncommitted `vercel.json` edits, so merge by hand, and keep the job independent of the failing Playwright step. Test on a preview first: Vercel lists "static file uploads" as 100 MB on Hobby for CLI deploys (about source files; a June 2026 changelog says CLI limits were removed, without detail) and `public/` is 436 MB.
5. **The real fix, any plan:** push `feat/code-blocks-as-strings` (PERF-06 plus the `cpus: 2` commit) as a branch and read the Vercel preview build, which runs on the same 8 GB machine. The model says 5.7 GB at 730 pages, under 8 GB with room for about 300 pages; the preview confirms or refutes that before main is touched.

### Next month

PERF-06 verified and merged (1 to 2 days); KaTeX and static-subtree collapse (new PERF-14, 2 to 3 days); search to a prebuilt index (1 to 2); `CodeWindow` on the server (1 to 2); remove the dead `turbopackMemoryEviction` line; run the spike below in parallel.

### Spike (the lead runs it later; I did not)

**Where:** a `workflow_dispatch` job on `ubuntu-latest` (16 GB, 4 vCPU), `npm run build` wrapped in `/usr/bin/time -v` for "Maximum resident set size". One day to write, one to run, one more for F2. Nothing on the desktop.

**The 20 pages** (copied with the `meta.json` of every folder above them into `tmp/spike-docs`, built with `DOCS_DIR`, as docs/guides/performance.md section 1 describes):
1. CSI243 (6): `05-recursion/notes/numeric-recursion-by-example.mdx` (119 KB, about 268 blocks, the largest page), `02-expressions-types/notes/arithmetic-by-example.mdx`, `09-polymorphism/notes/either-in-depth.mdx`, `07-higher-order/notes/lab-04-folds-and-zips.mdx`, `06-lists-tuples/review.mdx` (inline `Quiz`, `FlashcardDeck`), one small notes page with `HaskellTryIt`.
2. CSI247 (6): `08-collections/notes/collections-by-example.mdx`, `01-java-fundamentals/notes/arrays-by-example.mdx` (`MemoryDiagram`), `06-object-oriented-programming/notes/inheritance-by-example.mdx`, one page each with `JavaTryIt`, `ExcalidrawCanvas` and a sorting story.
3. CSI213 (2): `04-random-var-distributions/review.mdx` (`QuizRef`, KaTeX) and one note that imports `quizData`. MAT221 (1): `02-substitution/notes.mdx`. Semester I (1): `sem1/csi141/01-programming-process/notes.mdx`. Overviews (3): docs `index.mdx`, `sem3/index.mdx`, `sem3/csi243/index.mdx`.

**Variants** (two runs each, cold then warm): V0 current main; V1 `CODE_AS_STRING` on; V2 V1 plus KaTeX collapse, if written; V3 F1 (`dynamic: true`).

**Measure:** peak RSS of the process tree; seconds in compile and in static generation; compiled size; size of every `.vercel/output/functions/*.func` (the 250 MB test); HTML bytes and first-load JavaScript of the four largest pages; text equality of rendered HTML with code normalised; screenshots at 1280 and 375 px for 8 pages; no hydration warnings.

**Slope test:** repeat V1 and V3 with the 20 pages copied under new slugs to make 60 and 200 pages; the fit gives GB per page.

**Decision rule:** adopt V3 for all courses if peak RSS at 200 pages is within 0.5 GB of the 20-page value, all pages match V0 and compile takes under 1 s per page. If V3 fails, run F2 on the same pages (render with `@mdx-js/mdx` and `react-dom/server`, list the components that fail outside Next). If V1 alone peaks under 4 GB at 730 pages, stay on A and postpone F.

### Before the content doubles (about 1,000 to 1,200 pages)

Decide at 1,000 pages with the measured slope. What would change this plan:
- The log shows the OOM in static generation: A4's knobs and on-demand `.md` copies may buy another 300 pages.
- V1's measured RSS is far below the model: A has more runway; refit before deciding.
- New semesters are code-heavy like CSI243: move to F before the first lands; A's ceiling then drops to about 500 more pages.
- A function exceeds 250 MB: apply A3 and A5, or split zones (B).
- The owner leaves Vercel (Cloudflare Pages, GitHub Pages): F2's static output becomes the plan, which is also option E.

## 5. The owner's idea: plain HTML, CSS and JavaScript

**What it would really take.** The content is not Markdown: 699 of 730 pages use components, 400 pass JavaScript literals, `Step` appears 4,377 times and `HaskellTryIt` 2,562 times. A generator needs either MDX plus React rendered once at build (that is F2) or a rewrite of the content syntax and about 60 components. Breakdown:
- Generator core (MDX, Shiki, KaTeX, hash cache, workers): 4 to 6 days.
- Static components (about 25: `Step`, `Callout`, `CheckQuestion`, `LearningObjectives`, tables, cards) as remark directives or templates: 5 to 8.
- Interactive components (about 30): the logic is mostly framework-free TypeScript and reusable (`lib/haskell-simulator.ts` 197 KB, the Java playground's TeaVM worker, `lib/csi247/memory-*`, `lib/stats`, `lib/maths`), but the UIs must be rewritten or kept as esbuild-built React islands (Excalidraw needs React anyway): 15 to 25.
- Layout and chrome (header, tabs, sidebar, TOC, pager, dark mode, mobile menu): 6 to 10. Search (Pagefind): 1 to 2. Redirects, `.md` copies, `llms*.txt`, sitemap, OG: 3 to 5. Progress and timer without React context: 4 to 7. Parity checks over 730 pages: 6 to 10.
- Total 45 to 70 working days.

**Where it is better.** Memory stays under 1 GB at any size because each page is built alone; unchanged pages are skipped by hash; pages weigh 60 to 150 KB with 10 to 40 KB of JavaScript (estimates); it hosts anywhere; and the 16 runtime dependencies shrink, so Dependabot noise falls.

**Where it is worse.** You maintain a generator forever and every new widget exists twice (author syntax plus implementation); no type-checked component reuse; the Fumadocs UI, its upgrades and accessibility work are gone; 730 pages could regress in ways a student only notices at exam time; one person owns all of it.

**Cheapest version.** Do not replace the site. Build only the part that is better as plain output, the page bodies. That is F2, CSI243 first (8 to 10 days for the first course): the pipeline writes HTML fragments, chrome and widgets stay React, and if the owner later leaves Next the fragments are already the static site's content. If a hand-written core is still wanted, the smallest honest step is a Node script that renders one course (CSI243's 148 pages) to static HTML through unified, Shiki and KaTeX and serves it by rewrite, leaving that course's widgets out until each is ported.

## Sources

Repo and local: `docs/guides/performance.md`, `WORK_ORDERS.md`, `.source/server.ts`, `node_modules/fumadocs-mdx/dist/runtime/`, Next docs in `node_modules/next/dist/docs/01-app/`. GitHub commit statuses and Actions jobs via `gh api` (data and fit in the scratchpad: `ci-builds.tsv`, `ci-sizes.tsv`, `fit.mjs`).

Web (read 2026-11-04): Vercel [build machines](https://vercel.com/docs/builds/managing-builds), [pricing](https://vercel.com/docs/pricing), [limits](https://vercel.com/docs/limits), [function limits](https://vercel.com/docs/functions/limitations), [build troubleshooting](https://vercel.com/docs/deployments/troubleshoot-a-build), [Skew Protection](https://vercel.com/docs/skew-protection), [reduce Next.js build time](https://vercel.com/kb/guide/how-do-i-reduce-my-build-time-with-next-js-on-vercel), [GitHub Actions with Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel), [CLI limits changelog](https://vercel.com/changelog/cli-deployment-limits-removed). [Build benchmark, 2022](https://www.zachleat.com/web/build-benchmark/). [Astro 5](https://astro.build/blog/astro-5/), [Astro MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/), [Sätteri in Astro 7](https://infoq.com/news/2026/08/astro-satteri-rust), [Starlight](https://starlight.astro.build/). Docusaurus [issue 9754](https://github.com/facebook/docusaurus/issues/9754) and [discussion 10584](https://github.com/facebook/docusaurus/discussions/10584). VitePress [issue 4833](https://www.goodfirstissue.org/vuejs/vitepress/issues/4833). [Nextra 4](https://the-guild.dev/blog/nextra-4) (from a search summary, not read in full). [Pagefind](https://pagefind.app/). The Astro out-of-memory anecdote also comes from a search summary of a page that now returns 410.
