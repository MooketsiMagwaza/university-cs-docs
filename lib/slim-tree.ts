import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * A copy of the page tree without the fields the sidebar never reads. The layout hands the tree to client components, so
 * React writes it into every page it sends. With 700 pages that was about 320 KB of page data on every page, even on a
 * page with no content: a description of up to 200 characters, the source file (`$ref`) and `"$undefined"` placeholders
 * for each unset option on each of 880 nodes. Names, addresses, ids, folder structure and every option that is set are kept,
 * so the sidebar, the tabs and the breadcrumb are unchanged (PERF-01).
 *
 * Only string keys are copied, for the reason given in lib/source.ts: spreading a node also copied the symbol keys React adds
 * to objects made during a render, and Next refuses to pass those to a client component.
 */
export function slimTree<T extends PageTree.Root | PageTree.Node>(node: T): T {
  const slim: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || key === 'description' || key === '$ref') continue;
    if (key === 'children' && Array.isArray(value)) slim[key] = value.map((child) => slimTree(child as PageTree.Node));
    else if ((key === 'index' || key === 'fallback') && value && typeof value === 'object') slim[key] = slimTree(value as PageTree.Node);
    else slim[key] = value;
  }
  return slim as T;
}
