# Documentation architecture

This repository separates authored lessons, learning data, interactive UI, downloadable resources, and validation code so each kind of change has one canonical home.

## Directory contract

```text
content/docs/                         MDX routes and chapter meta.json files
content/quiz-data/                    Audited JSON quizzes used by <QuizRef />
content/flashcard-data/               Typed flashcard arrays imported by review pages
components/interactive/               Reusable client-side labs and playgrounds
components/mdx.tsx                    Global MDX component registry
features/courses/*/                   Course-owned generators and feature data
lib/                                  Browser runners and shared data/logic
public/files/                         Course-owned resources and generated study guides
public/java-playground/               Vendored TeaVM runtime, notices, and licenses
scripts/                              Content, source, and provenance audits
tests/                                Real-browser smoke tests
```

## Course and chapter shape

A course lives at `content/docs/semN/course-code/`. Its `meta.json` is the navigation source of truth. A substantial chapter should normally contain:

- `index.mdx` for the concept map and study order;
- `notes/` for focused lessons when the subject is too large for one page;
- `cheat-sheet.mdx` for recall, not first teaching;
- `questions.mdx` for practice prompts;
- `review.mdx` for flashcards and referenced quizzes;
- `resources.mdx` for owned files and carefully selected external references.

Every item listed in `meta.json` must resolve to an MDX page or a child directory with its own `meta.json`. Frontmatter supplies the rendered H1, so authored MDX should begin at `##`.

## CSI247 downloadable chapter guides

CSI247 topic pages link to complete standalone artifacts; they do not clone the current browser DOM. Canonical guide content and deterministic trace simulations live in `features/courses/csi247/study-guides/`. The builder emits one self-contained interactive HTML file and one light-only PDF per topic under `public/files/sem3/csi247/study-guides/`, plus a route-to-artifact manifest.

Each standalone guide must:

- work without a network connection or framework runtime;
- use the same definition → immediate diagram → worked visual traces → properties → fully commented Java → exam-practice sequence as the site lesson;
- synchronize its scene, highlighted trace row, current-step summary, and controls;
- support light and dark reading modes while forcing a white light-mode print/PDF presentation;
- contain at least five worked cases and five explained exam-style questions;
- be rebuilt whenever its source, simulation, runtime, or visual tokens change.

Run `npm run build:csi247-study-guides` to regenerate HTML/PDF artifacts. The full local/release check uses `npm run audit:csi247-study-guides` to reject stale generated HTML, hashes, manifests, or PDFs, and `npm run audit:csi247-study-guide-java` to compile the Java embedded in those guides. The normal pull-request pipeline deliberately avoids repeating the expensive standalone-guide browser matrix; it keeps the core content, type, build, and browser smoke checks fast enough for a hobby project.

## Interactive lesson pattern

Keep the explanation in MDX and the reusable behavior in a component. Register reusable components once in `components/mdx.tsx`. Searching and sorting visuals belong inside the lesson for that method; do not send learners to a generic multi-algorithm lab.

Teach in this order:

1. simplified definition and one concrete mental model;
2. full-array cards with one scene per meaningful iteration or outer-loop pass;
3. exact conditions with substituted values and the resulting mutation or range update;
4. a compact dry-run table matching the course's `Pass / Array / Operation` convention;
5. invariant, time, space, stability, adaptiveness, and preconditions;
6. Java implementation, followed by recursion and order variants where relevant.

Keep code secondary until the movement makes sense. A video, static export, or exam walkthrough should reuse the same scene data rather than inventing a second trace.

Browser runners must isolate learner code, apply execution and output limits, recover after worker failures, and have a real-browser smoke test. Third-party runtime files require exact URLs, hashes, byte sizes, source provenance, and complete license texts.

## Required checks

```bash
npm run audit:content          # lean CI set: learning data, architecture, lesson Java, runtime provenance
npm run audit:content:full     # core set plus generated-guide freshness and embedded guide Java
npm run audit:csi247-study-guides
npm run audit:csi247-study-guide-java
npm run types:check            # generated MDX/routes and TypeScript
npm run test:csi247-study-guides # offline runtime, responsive themes, synchronized traces, print mode
npm run test:java-playground   # real browser compile/run and output-limit smoke
npm run build                  # production Next.js build
```

`npm run check` runs the lean content audits, type-check, and production build. `npm run check:full` is the pre-release/manual exhaustive path and adds generated-guide audits plus both browser suites. CI installs Chromium and a JDK, runs the four focused CSI247 browser smoke tests once, and keeps CodeQL and dependency review as separate workflows.

## Pull-request boundaries

Prefer one course or one platform concern per feature branch. Use conventional names such as `feat/csi247-search-sort-packages-playgrounds` and keep unrelated local changes out of the commit. When a feature depends on another open pull request, state the dependency and rebase only after the dependency lands; do not silently combine their histories.
