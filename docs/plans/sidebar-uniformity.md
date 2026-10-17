# Sidebar uniformity (UNI-01)

Recorded on 2026-10-17 from the live page tree (`/progress-manifest.json`, which is built from the same tree as the sidebar) and from `npm run audit:content-standard`. It lists how each course's sidebar differed from the standard shape, what the work on `feat/uniform-layouts` has already changed, and what is left. The orders are in [WORK_ORDERS.md](../../WORK_ORDERS.md) (UNI-01 to UNI-06).

## The standard shape

```text
Course Overview
1. Topic name
   Overview
   Notes            one page, or a folder of lessons, always labelled "Notes"
   Cheat sheet      optional
   Review
   Practice
   Resources        optional
2. Topic name
   ...
Course Resources
```

The rules are in [docs/content-standard.md](../content-standard.md) section 2.1. Course extras such as playgrounds live under `/docs/playgrounds`, not in a course sidebar.

## Course by course

| Course | Sidebar at the start | Changed so far | Left to do |
|---|---|---|---|
| Semester I and II (10 courses, 59 topics) | Topics showed Notes, Review, Practice with no Overview | An Overview page for every topic, built from the notes' own section headings | The Overviews have no objectives or prerequisites; the generated notes still need the notes template (STD-07, UNI-03, UNI-04) |
| CSI213 | The Overview and then 25 sub-topic pages directly in each topic; no Notes, Review or Practice | Nothing yet | Move the sub-topic pages into `notes/`, add Review (the cram-sheet bank, QZ-04) and Practice, with redirects and progress aliases (UNI-02, STD-08) |
| CSI243 | A "Haskell Practice Runner" in the course sidebar; Practice before Review; Lab pages as extra topic pages in topics 3, 4 and 6 | The runner is folded into `/docs/playgrounds/haskell`; Review comes before Practice; the labs are the last lessons of their topic's Notes; every old address redirects | The per-section quiz checks and the retired components in the notes (STD-10, UNI-04) |
| CSI247 | A "Java Playground" in the course sidebar; the notes folder labelled "Lecture Notes"; Practice before Review; seven topics with no Notes page (the overview holds the notes); unnumbered folders; two hidden legacy pages | The playground is `/docs/playgrounds/java`; the folder is labelled "Notes"; Review comes before Practice; every old address redirects | Split seven overview-and-notes pages into Overview and Notes, number the 13 folders with redirects, and decide about `linear-structures` and `arrays-and-arraylists` (UNI-02, STD-11, CSI247-01) |
| MAT221 | Two separators, a "Calculus I Formula Sheet" course page, and topics showing Notes, Practice, Review with no Overview | An Overview for all 15 topics; Review before Practice; no separators; the formula sheet is reached from Course Resources | The rebuild on the standard (STD-12). MAT221 pages draw their own header, so the new Overviews have no title heading until then |
| CSI323 | Unnumbered topic folders; no Notes page; Practice before Review | Review comes before Practice | Number the four folders with redirects, and write Notes (the pages are visual-map work in progress) (STD-09) |
| MGT202 | The standard shape | None needed | None |

## Findings of the audit

`npm run audit:content-standard` structure findings, before and after the sidebar work so far:

| Course | Before | After |
|---|---:|---:|
| Semester I and II (each of ten courses) | 5 or 6 | 0 |
| CSI213 | 42 | 42 |
| CSI243 | 15 | 0 |
| CSI247 | 34 | 20 |
| MAT221 | 33 | 0 |
| CSI323 | 12 | 8 |
| MGT202 | 0 | 0 |

## How the changes were made

- The sidebar labels come from `lib/topic-pages.ts`: one label per standard page and for a topic's `notes/` folder.
- The order comes from each topic's `meta.json`, which the audit checks.
- Moved pages redirect in `next.config.mjs`. Saved progress follows a moved page through `content/progress/aliases.json`.
