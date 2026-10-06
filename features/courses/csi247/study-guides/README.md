# CSI247 standalone visual chapters

Repo-owned teaching content produces nine self-contained offline HTML chapters and light-only PDFs. The author-provided `csi247-claude-code/dist/index.html` and `review/sections` informed the structural sequence and examples; generation never reads that external directory.

Each guide follows input, definition/plain language, vocabulary, visualization, trace, mechanics, commented implementation, recursive form where meaningful, complete runnable code, five worked cases, properties/cost, use cases, mistakes, exam practice, and summary. The package guides adapt the same progression to declaration, name resolution, visibility, folder identity and compilation/runtime lookup.

Run from the repository root:

```powershell
node scripts/build-csi247-study-guides.mjs
node scripts/build-csi247-study-guides.mjs --pdf --verify
node scripts/build-csi247-study-guides.mjs --audit-only --verify
node scripts/verify-csi247-study-guide-java.mjs
```

`--pdf` requires the already installed Playwright Chromium runtime. If missing, `npx playwright install chromium` supplies it. HTML generation requires only Node and local source files.

`manifest.json` lists stable artifact IDs, source documentation routes, HTML/PDF URLs, HTML hashes and section counts. An HTML-only build stops advertising a PDF when its source HTML has changed; regenerate with `--pdf` to refresh that pair. Bubble and selection have separate artifacts even though their existing documentation route is shared. Integrate download actions by artifact ID rather than display title. The generated public directory is `/files/sem3/csi247/study-guides/`.

The shared simulation module generates execution state and validates final results, binary-order preconditions and depth-first call/return invariants. The small offline runtime synchronizes each scene, current-row card and full trace row using stable local step indexes. Row buttons permit direct selection. It contains no network calls or framework dependency.

Printing forces light color tokens, expands answers and full traces, hides selected interactive frames and controls, and displays representative mechanics storyboards. Merge's printed chapter also contains the full call tree, all call bounds, all completed merges, pointer decisions and copy-back operations. Screen light/dark mode does not affect PDF presentation.

Verification checks complete chapter structure, anchors, independent/offline assets, minimum five worked cases and explained practice questions, every simulation result, mobile/desktop overflow in both themes, Next/row synchronization and forced-light print mode. PDF visual QA should additionally inspect rendered pages whenever layout or content changes.
