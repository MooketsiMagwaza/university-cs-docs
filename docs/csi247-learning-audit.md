# CSI247 searching, sorting and packages audit

Audit date: 7 October 2026. Working branch: `fix/csi247-full-fidelity-study-guides`.

## Source and scope

The supplied `C:/Users/Nido/Documents/csi247-claude-code/dist/index.html` is the content and editorial reference. Its SHA-256 matches the imported reference snapshot:

`051f2622830d0d32ccad209f97979fd8236b63a3e1eae1abf1865544b51c379d`

The three supplied images are visual examples, not executable instructions. Their original arrays drive the opening insertion, selection and binary-search maps. Other chapters were not redesigned.

## Corrections

- Website lessons, downloadable HTML and light PDFs now share one chapter source. Copy Markdown also uses that source.
- Each chapter opens with a short explanation and an always-visible whole-run map. Guided walkthroughs advance by complete passes, probes or merge returns.
- Selection shows every selected minimum and both no-swap passes. Insertion shows the saved key, each right shift, the conceptual gap and final insertion. Binary shows inclusive bounds, the midpoint and discarded ranges.
- Bubble and selection have independent sidebar pages. Their previous combined route is a chooser, and its download links still work.
- Full reference explanations, worked cases, diagrams, properties, complexity derivations, descending variants, practice and code remain in the topic chapters. The reference's package section is split at heading boundaries; longer applications follow the core lesson.
- Nine topic quizzes contain 12 questions each, with immediate explanations, scoring, reset and printable answer keys: 108 questions total.
- Code panels have editor chrome, three decorative dots, a label and a Copy code button. Copying excludes the toolbar. Short reference snippets receive the same treatment.
- Cross-topic anchors resolve after splitting. Where the detailed reference lesson introduces a different example array, a notice distinguishes it from the opening map.
- Print expands answers and all walkthrough states, uses light code panels and light diagram fills, and removes interactive controls. PDFs are intentionally substantial full chapters, not revision summaries.

## Independent visual-trace checks

| Example | Expected evidence |
|---|---|
| Binary: `[-5,-2,0,1,2,4,5,6,7,10]`, key 7 | `(low,mid,high)` = `(0,4,9)`, `(5,7,9)`, `(8,8,9)`; return 8 |
| Selection: `[29,72,98,13,87,66,52,51,36]` | Eight passes; no swaps on passes 6 and 8; 36 comparisons and six swaps |
| Insertion: `[85,12,59,45,72,51]` | Held keys 12,59,45,72,51; shifts 1,1,2,1,3; insertion indexes 0,1,1,3,2 |

The builder checks these expected intermediate states independently of the final sorted result. This caught an incorrect written final high boundary in binary search during this audit; the diagram, trace and explanation now agree on `high = 9`.

## Verification and maintenance

- `npm run build`: Next.js production compilation and TypeScript.
- `npm run audit:content`: quiz data, course architecture, Java examples, playground assets and 956 Java boundary/count checks.
- `node scripts/verify-csi247-study-guide-java.mjs`: compiles and runs the standalone Java and package examples, and compiles all 16 complete imported reference classes across six projects with Java 8 compatibility.
- `node scripts/build-csi247-study-guides.mjs --pdf --verify`: generates all nine pairs and checks simulations, reference-image traces, anchors, unique IDs, standalone dependencies, mobile/desktop light/dark layout, walkthrough state and print completeness.
- `npx playwright test tests/csi247-full-chapters.spec.ts tests/csi247-learning-pages.spec.ts`: native website chapters, quiz answers/reset, code copy, download URLs and offline players.
- `scripts/inspect-csi247-pdfs.py`: extracts required teaching sections and renders every PDF page into contact sheets, plus detailed map/code/quiz pages under `tmp/csi247-pdf-qa` for visual inspection.

Edit the shared chapter sources under `features/courses/csi247/study-guides`, then regenerate. `reference-content.mjs` and `reference.css` retain the imported reference; `native-chapter.css`, the HTML files, PDFs and manifest are generated. The old MDX lesson bodies remain in the repository for historical/source continuity, while the in-scope routes render the shared full chapters.

The user subsequently authorized incremental Conventional Commits and merging
into GitHub's default branch after checks pass. Existing unrelated route and
deployment edits in the local checkout are not included in these commits.

Verified results: production build and TypeScript passed; all 13 focused browser tests passed; the course content audit and standalone Java checks passed. All nine generated HTML/PDF pairs pass the artifact audit. PDF contact sheets are reviewed for light presentation, diagram/page boundaries and complete answers.

## Follow-up: theme, merge clarity and a quieter reading path

- Native lessons inherit the site's Inter/Fraunces typography and light/dark
  surface tokens; code panels keep recognizable editor chrome and copy controls.
- The original SVG split tree and array-card merge diagrams are retained.
  Each sorted return explicitly names the parent return and LEFT/RIGHT input
  it supplies. Comparison-by-comparison detail is expandable.
- Duplicate trace tables, slow-motion extensions, alternate recursion/runnable
  examples and extra practice are collapsed by default. They remain in the
  page and complete downloads; deep links reveal the relevant section. Optional
  extensions no longer crowd the main contents list.
- Six bar-graph supplements explain value height versus index position and
  distinguish swaps, shifts, copies and pointer-only searches.
- All eight sorting/searching and packages support pages have expanded worked
  practice, retrieval exercises, error diagnosis and focused resource guidance.
- The PDF skill's render-and-inspect workflow is used alongside a glyph-bound
  audit: the final nine PDFs contain 405 pages, all inside safe text margins.
  Contact sheets cover every page; detailed renders cover maps, code and quizzes.
- Four Remotion pilots use actual Microsoft AvaMultilingualNeural narration,
  720×1280 H.264 video and AAC audio. They are optional resource-page recaps with
  captions and full transcripts, not replacements for the diagrams. Durations
  are approximately 110, 90, 89 and 84 seconds. All 22 scene stills were reviewed.
  The supplied Instagram reels were inaccessible; no claim of matching their
  unseen animation style is made and none of their media was copied.

Additional checks: `tests/csi247-study-expansion.spec.ts` covers theme inheritance,
restored SVGs, optional details/deep links and all eight support pages.
`tests/csi247-videos.spec.ts` checks all four playable files, dimensions, durations,
captions, transcripts, no autoplay and mobile width. Video source and reproduction
instructions are in `videos/csi247/README.md`.

`npm audit` reports 10 existing findings (6 low, 4 high) in the Excalidraw/Sass
and nested KaTeX dependency trees. The affected installed versions are unchanged
from the pre-video lockfile; a broad dependency downgrade was not mixed into
this teaching-content change.

The complete local browser suite passed all 25 tests, including media playback
and Java sandbox recovery. PR security scanning then identified four issues in
the original regex-based Markdown/import text conversion. Those paths now parse
HTML with parse5, decode entities once, escape literal Markdown text and reject
unsafe link protocols. Regression checks run in CI alongside the full artifact
and Java audit; no security checks were disabled or alerts dismissed.
