# Documentation architecture

This repository separates authored lessons, learning data, interactive UI, downloadable resources, and validation code so each kind of change has one canonical home.

## Directory contract

```text
content/docs/                         MDX routes and chapter meta.json files
content/quiz-data/                    Audited JSON quizzes used by <QuizRef />
content/flashcard-data/               Typed flashcard arrays imported by review pages
components/interactive/               Reusable client-side labs and playgrounds
components/mdx.tsx                    Global MDX component registry
lib/                                  Browser runners and shared data/logic
public/files/                         Course-owned downloadable resources + meta.json
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
npm run audit:content          # learning data, architecture, Java examples, runtime provenance
npm run types:check            # generated MDX/routes and TypeScript
npm run test:java-playground   # real browser compile/run and output-limit smoke
npm run build                  # production Next.js build
```

`npm run check` runs the content audits, type-check, and production build. CI additionally installs Chromium and a JDK, runs the browser Java smoke test, and keeps CodeQL and dependency review as separate workflows.

## Pull-request boundaries

Prefer one course or one platform concern per feature branch. Use conventional names such as `feat/csi247-search-sort-packages-playgrounds` and keep unrelated local changes out of the commit. When a feature depends on another open pull request, state the dependency and rebase only after the dependency lands; do not silently combine their histories.
