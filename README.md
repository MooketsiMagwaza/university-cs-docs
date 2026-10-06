# University CS Docs

[![CI](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/codeql.yml/badge.svg)](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/codeql.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

An open, interactive study site for Computer Science courses at the University of Botswana. Each course has structured notes, active-recall review, guided practice questions, and resource hubs, written so a student can go from first contact with a topic to exam readiness in one place.

Live site: <https://university-cs-docs.vercel.app>

> [!IMPORTANT]
> This is a community-maintained study resource, not an official University of Botswana publication. Confirm course requirements, assessment rules, and administrative information through official university channels.

## Contents

- [What is covered](#what-is-covered)
- [How a course is organised](#how-a-course-is-organised)
- [Features](#features)
- [Getting started](#getting-started)
- [Project layout](#project-layout)
- [Writing content](#writing-content)
- [The Haskell practice runner](#the-haskell-practice-runner)
- [Architecture](#architecture)
- [Quality checks](#quality-checks)
- [Contributing](#contributing)
- [License](#license)

## What is covered

| Semester | Courses | Status |
|---|---|---|
| I | CSI131 Discrete Structures I, CSI141 Programming Principles, CSI161 Introduction to Computing, MAT111 Introductory Mathematics I, COM141 Communication and Academic Literacy Skills | Work in progress |
| II | CSI132 Discrete Structures II, CSI142 Object-Oriented Programming, MAT122 Introductory Mathematics II, STA122 Introductory Concepts of Probability, COM142 Academic Writing | Work in progress |
| III | CSI213 Discrete Structures III, CSI243 Functional Programming, CSI247 Data Structures, MAT221 Calculus II, MGT202 Management | Available |
| V | CSI323 Algorithms | Available |

Semesters I and II are marked as work in progress on the site. Do not rely on them as your only exam resource, and check every topic against current lectures and the official course outline.

## How a course is organised

Courses follow a study flow of notes, review, questions and exam practice. The depth differs by course, and CSI243 Functional Programming is the most complete example. Each of its chapters has:

- **Notes**: lessons that build each idea from first principles, with worked examples, common mistakes and short knowledge checks.
- **Cheat sheet**: a one-page summary of the chapter.
- **Practice questions**: guided problems with solutions.
- **Review**: flashcards and a quiz for active recall.
- **Resources**: lecture slides, labs and source material.

Other courses use the same ideas with their own structure. For example, CSI247 organises its content by topic, and MAT221 has a dedicated module under `features/courses/mat221`.

## Features

- **Searchable documentation** built on Fumadocs, with full-text search, a sidebar tree per semester, and a landing page at `/`.
- **Interactive learning components**: knowledge-check quizzes with per-option feedback, flashcard decks, step-by-step walkthroughs, worked examples, mastery checklists, and exam-style questions with hidden solutions.
- **Mathematics** rendered with KaTeX, plus formula blocks, theorem and proof environments, and a function plotter.
- **Diagrams** drawn as themed SVG with zoom, drag and fullscreen controls, and Excalidraw canvases for freehand work.
- **In-browser Haskell runner** for CSI243: edit a course example and run it without installing anything. See [The Haskell practice runner](#the-haskell-practice-runner).
- **Focus timer**: a Pomodoro timer that persists across pages, with settings and daily totals saved on the device.
- **Resource hub**: a searchable file browser for lecture slides, lab manuals and PDFs, with in-page PDF preview.
- **Light and dark themes** and a responsive layout.
- **Machine-readable output**: every page is also served as Markdown (append `.md`, or request `text/markdown`), with `/llms.txt` and `/llms-full.txt` indexes.
- **Open graph images, a sitemap and a web manifest** generated from the content.

## Getting started

### Prerequisites

- Node.js 22 (the version in `.nvmrc`; `package.json` allows `>=22 <23`)
- npm 10 or later
- Git

### Install and run

```bash
git clone https://github.com/MooketsiMagwaza/university-cs-docs.git
cd university-cs-docs
npm ci
npm run dev
```

The site is then available at <http://localhost:3000>.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build locally |
| `npm run types:check` | Generate MDX and route types, then run the TypeScript compiler |
| `npm run check` | Type check and production build, the same checks CI runs |
| `npm run audit:mat221-fidelity` | Audit the MAT221 content module against its source |

More audit and maintenance scripts live in `scripts/`.

### If the build runs out of memory

Large MDX trees can exhaust Node's default heap. CI uses 8 GB. Raise the limit for a single command like this:

```bash
# macOS and Linux
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

```powershell
# Windows PowerShell
$env:NODE_OPTIONS = "--max-old-space-size=8192"; npm run build
```

### Deployment

The site is deployed on Vercel. Importing the repository into Vercel is enough: it detects Next.js and uses `npm run build`. Vercel Analytics and Speed Insights are included.

## Project layout

```text
app/                    Next.js App Router: landing page, /docs, search API, llms endpoints, OG images
components/             React components, registered globally for MDX (see components/README.md)
  callouts/ interactive/ layouts/ learning/ math/ visuals/
content/
  docs/                 MDX pages, by semester and course (sem1/, sem2/, sem3/, sem5/)
  quiz-data/            Quiz questions kept out of the MDX files
  flashcard-data/       Flashcard decks
  curriculum/           Course outline data
features/courses/       Self-contained course modules (MAT221)
lib/                    Source loader, site config, shared helpers, the Haskell practice runner
public/                 Images, diagrams, videos, and the downloadable files shown by the resource hub
scripts/                Audit and maintenance scripts
docs/                   Migration notes and plans
```

### Key features

- **Interactive Homepage**: A responsive, parallax-driven landing page built with Framer Motion.
- **Custom MDX Components**: A massive suite of React components designed for computer science notes, including interactive quizzes, step-by-step guides, mathematical proof environments, and function plotters.
- **Browser Playgrounds**: Sandboxed HTML, JavaScript, Python, SQL, Haskell, and CSI247 Java practice environments.
- **Visual Algorithm Labs**: Card-based searching and sorting traces with substituted conditions, active code lines, trace tables, recursion views, and complexity growth.
- **Complete CSI247 Path**: The 2026 outline now runs from Java primitives/references, methods, classes, arrays, recursion, and Big-O through searching/sorting, packages, OOP, generics, Collections, and implemented lists, stacks, queues, hash tables, trees, and graphs.
- **Resource Hub**: A centralized, searchable file browser for lecture slides, lab manuals, and supplementary PDFs.

## Writing content

### Pages

All notes live under `content/docs/`, grouped by semester and course code, for example `content/docs/sem3/csi243/`. Every MDX file starts with frontmatter:

```mdx
---
title: "Recursion on Lists"
description: "Use the empty and cons patterns as a base case and recursive step."
---
```

Page order in the sidebar comes from the `meta.json` file in each folder:

```json
{
  "title": "5. Recursion",
  "pages": ["index", "notes", "cheat-sheet", "questions", "review", "resources"]
}
```

### Components need no imports

Custom components are registered once, in `components/mdx.tsx`, so MDX files never import them. The one exception is quiz data, which is imported. Add a component by creating it, importing it in `components/mdx.tsx`, and adding it to the object returned by `getMDXComponents`.

The full component reference, with props and examples, is in [`components/README.md`](components/README.md).

### CSI247 Standalone HTML and PDF Guides

CSI247 searching, sorting, and package lessons each have a complete offline study guide. These are not snapshots of the current page: they are independently generated chapters with simplified explanations, immediate diagrams, synchronized trace players, fully commented Java, multiple worked cases, and exam-style answers. Screen HTML supports light and dark modes; printed and generated PDFs always use the light presentation.

- Authoring and deterministic simulations: `features/courses/csi247/study-guides/`
- Generated HTML/PDF artifacts and route manifest: `public/files/sem3/csi247/study-guides/`
- Generator and verifier: `scripts/build-csi247-study-guides.mjs`

```bash
npm run build:csi247-study-guides   # regenerate all HTML/PDF guides and verify them
npm run audit:csi247-study-guides   # reject stale generated artifacts
npm run test:csi247-study-guides    # browser-check themes, traces, responsiveness, and print mode
```

The topic-page download controls resolve through the checked-in manifest. Bubble sort and selection sort therefore receive separate HTML/PDF artifacts even though they share one MDX route.

### Quizzes and flashcards

Quiz questions and flashcards are stored as data files, not inline in the lesson text:

- New quiz data goes in audited JSON under `content/quiz-data/<semester>/<course>/` and is rendered with `<QuizRef src="..." id="..." />`. Some older chapter reviews still import a typed `quizData` array into `<Quiz />` while they migrate.
- Flashcard decks go in `content/flashcard-data/<semester>/<course>/`.

Each quiz question has `question`, `options`, `correctIndex`, an `explanation`, and optionally `optionFeedback` with one entry per option. `npm run audit:quizzes` rejects malformed data, broken references, duplicate options, and unreferenced JSON quizzes.

### Images and files

- Images live in `public/images/<semester>/<course>/`. Use descriptive kebab-case names, WebP for photographs and PNG for diagrams, and always write alt text. In MDX use `<SafeImage src="..." alt="..." caption="..." />`, which falls back gracefully when a file is missing.
- Downloadable files live in `public/files/<semester>/<course>/`. Add them to the `meta.json` in that folder, then show them with `<ResourceHub modulePath="/files/sem3/csi247" />`.

### MDX and mathematics rules

The MDX compiler reads JSX before KaTeX reads LaTeX, so a few rules prevent build failures:

1. Never put mathematics inside component props. Put it in the component's children.
2. Never use a raw `<` or `>` inside JSX. Use `\lt` and `\gt` in LaTeX, or `&lt;` and `&gt;`.
3. Do not remove the `min-w-0` and `overflow-x-auto` classes from layout components, because formulas do not wrap.

## The Haskell practice runner

CSI243 includes a runner that executes a teaching subset of Haskell in the browser, using `lib/haskell-simulator.ts`. It powers the practice page at `/docs/sem3/csi243/playground` and the "Try it yourself" blocks inside notes.

- **Supported today**: numbers, Booleans, strings, characters, tuples and lists; arithmetic, comparison and Boolean operators; one-line function definitions, lambdas and operator sections; `if`/`then`/`else`; finite and lazy ranges; list comprehensions; the common list functions such as `map`, `filter`, `zip`, `zipWith`, folds and scans; and `main = do` blocks using `let`, `print` and `putStrLn`.
- **Not supported**: pattern-matching equations, guards, `where`, modules and imports, user-defined types, type classes, and input functions such as `getLine`. The runner says **Course subset** so its feedback is never mistaken for a real GHC diagnostic. Use GHCi or a compiled `.hs` file for those.

Embed an editable example in a note with `<HaskellTryIt code={...} />`, or the full runner with `<HaskellPlayground />`. Check any claim about real GHC behaviour against GHC itself before publishing it.

## Architecture

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) with React 19 |
| Documentation engine | Fumadocs (core, UI and MDX) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, with theme tokens in `app/global.css` |
| Mathematics | KaTeX through `remark-math` and `rehype-katex` |
| Interactive drawing | Excalidraw |
| Motion | Framer Motion |

Next.js 16 has breaking changes from earlier versions. When you change framework-level code, read the guides in `node_modules/next/dist/docs/` first.

The site follows a single visual language: a warm paper background, ink-coloured borders, flat palette fills and hard offset shadows. New components should read the theme tokens in `app/global.css` rather than introduce their own colours.

## Quality checks

Before opening a pull request, run:

```bash
npm run check
npm run test:java-playground
npm run test:csi247-study-guides
npm run check:full
```

`npm run check` is the normal lean path: quiz references, CSI247 metadata and internal links, lesson Java, runtime provenance, type-checking, and a production build. GitHub Actions adds the focused browser smoke suite once. Generated-guide freshness, guide Java compilation, responsive/theme/print matrices, and every browser scenario remain available through `npm run check:full` for releases or large guide changes instead of slowing every pull request.

CodeQL, dependency review, and Dependabot cover repository security and dependency maintenance. See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/content-architecture.md](docs/content-architecture.md) for the complete authoring contract.

`WORK_ORDERS.md` records requested repository work, its acceptance check and its delivery state.

## Contributing

Contributions are welcome, from a one-line correction to a complete course topic. Start with the [contribution guide](CONTRIBUTING.md), follow the [Code of Conduct](CODE_OF_CONDUCT.md), and read the [educational content and resource policy](CONTENT_POLICY.md).

- [Report a bug](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=bug.yml)
- [Report a content correction](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=content.yml)
- [Propose a feature or course topic](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=feature.yml)
- [Ask a question or discuss an idea](https://github.com/MooketsiMagwaza/university-cs-docs/discussions)
- [Report a vulnerability privately](https://github.com/MooketsiMagwaza/university-cs-docs/security/advisories/new)

Project decisions and roles are described in [GOVERNANCE.md](GOVERNANCE.md). General help routes are in [SUPPORT.md](SUPPORT.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for the full text.

The MIT License applies to original repository code and content. Third-party educational resources keep their respective rights and must comply with [CONTENT_POLICY.md](CONTENT_POLICY.md).

Copyright (c) 2026 Mooketsi Vincent Magwaza
