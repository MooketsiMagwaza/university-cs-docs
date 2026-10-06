# Work orders

This list records requested repository work, its verification target, and its current delivery state. Update it when a work order changes or is completed.

## CSI243 notes and practice overhaul

| ID | Work order | Acceptance check | Status |
|---|---|---|---|
| CSI243-01 | Audit the higher-order-function lecture deck against the website notes | Missing teaching points and examples from the deck are represented in the notes | Complete |
| CSI243-02 | Deepen higher-order-function notes | `map`, `filter`, partial application, `zipWith`, folds, scans, and composition include explanations and worked examples | Complete |
| CSI243-03 | Expand list-comprehension teaching | Explain generators, output expressions, tests, scope, multiple/dependent generators, empty results, and equivalent forms | Complete |
| CSI243-04 | Include the requested partial-application search example | Explain why `filter (isThere wanted)` works and provide runnable code | Complete |
| CSI243-05 | Include the requested `foldr` factorial program | Include the terminal-input version, a detailed trace, edge cases, and a browser-runnable equivalent | Complete |
| CSI243-06 | Add a simulated in-page Haskell runner | Run the course subset locally in the browser and show parse, type, and runtime diagnostics | Complete |
| CSI243-07 | Interleave W3Schools-style practice through the notes | Place compact “Try it yourself” examples directly after individual concepts, with Run and Reset in each opened editor | Complete |
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

## Notes

- The browser runner intentionally implements the CSI243 teaching subset rather than arbitrary Haskell packages or unrestricted IO.
- Existing uncommitted work in the original checkout is preserved; this overhaul is developed and verified in its own worktree.
- Update work-order status only after the associated acceptance check has been verified.
