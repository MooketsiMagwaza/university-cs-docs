/**
 * The memory-diagram scenarios of CSI247, one per `<MemoryDiagram scenario="..." />` in the notes. Each is a short piece of
 * Java, with the diagram after every line and a sentence saying what that line did. The drawing rules are the ones in
 * content/docs/sem3/csi247/06-object-oriented-programming/notes/drawing-memory-diagrams.mdx: addresses are invented
 * (100, 200, 300 ...), `=` copies what is in the box, an old value is crossed out and never erased.
 *
 * The scenarios are grouped by what they draw, in lib/csi247/scenarios/. Placement is relative (see `Place` in
 * memory-diagram.ts), so no scenario contains a pixel position.
 */
import type { MemScenario } from './memory-diagram';
import { arrayScenarios } from './scenarios/arrays';
import { collectionScenarios } from './scenarios/collections';
import { linkedListScenarios } from './scenarios/linkedlists';
import { objectScenarios } from './scenarios/objects';
import { sortingScenarios } from './scenarios/sorting';
import { stackQueueScenarios } from './scenarios/stackqueue';

type Builder = () => MemScenario;

const scenarios: Record<string, Builder> = {
  ...arrayScenarios,
  ...objectScenarios,
  ...collectionScenarios,
  ...linkedListScenarios,
  ...stackQueueScenarios,
  ...sortingScenarios,
};

export const memoryScenarioIds = Object.keys(scenarios);

/** Builds a scenario by id. Throws for an unknown id, so a typo in the notes stops the build instead of drawing nothing. */
export function buildMemoryScenario(id: string): MemScenario {
  const build = scenarios[id];
  if (!build) throw new Error(`MemoryDiagram: unknown scenario "${id}" (known: ${memoryScenarioIds.join(', ')}).`);
  return build();
}
