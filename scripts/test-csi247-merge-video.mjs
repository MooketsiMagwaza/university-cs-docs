import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {createMergeJourney} from '../videos/csi247/merge-journey.mjs';

const {scenes} = createMergeJourney();
const recorded = JSON.parse(readFileSync(new URL('../videos/csi247/timings.json', import.meta.url), 'utf8'))['merge-sort'];
assert.equal(recorded.scenes.length, scenes.length, 'Regenerate narration after changing the trace');
let nextFrame = 0;
for (const [index, scene] of recorded.scenes.entries()) {
  for (const [key, value] of Object.entries(scenes[index])) {
    assert.deepEqual(scene[key], value, `Recorded scene ${index + 1}: stale ${key}`);
  }
  assert.equal(scene.fromFrame, nextFrame);
  assert(Number.isInteger(scene.durationInFrames) && scene.durationInFrames > 0);
  assert(statSync(new URL(`../public/${scene.audio}`, import.meta.url)).size > 0);
  nextFrame += scene.durationInFrames;
}
assert.equal(recorded.durationInFrames, nextFrame);
const returns = scenes.flatMap(scene => scene.action === 'children-copyback' ? scene.children : scene.action === 'copyback' ? [scene] : []);
const operations = scenes.flatMap(scene => ['children-compare','children-leftover'].includes(scene.action) ? scene.children : ['compare','leftover'].includes(scene.action) ? [scene] : []);
assert.deepEqual(returns.map(scene => [scene.start,scene.end,scene.output]), [
  [0,1,[3,7]], [2,3,[2,5]], [0,3,[2,3,5,7]],
]);
assert.equal(operations.filter(scene => scene.action === 'compare').length, 5);
assert.equal(operations.length, 8);
assert.equal(returns.reduce((sum,scene) => sum + scene.output.length, 0), 8);
assert.equal(scenes.at(-1).comparisons, 5);
assert.deepEqual(scenes.at(-1).values, [2,3,5,7]);
for (const [index,scene] of scenes.entries()) {
  if (scene.action === 'split' || scene.action === 'children-base') {
    assert.deepEqual(scenes[index + 1].values, scene.values, 'A split cannot rearrange array values');
  }
  if (scene.children) assert.deepEqual(scene.children.map(child => [child.start,child.end]), [[0,1],[2,3]], 'Keep both children on screen');
  if (scene.action === 'children-compare') assert.deepEqual(scene.children.map(child => child.comparison), ['7 > 3? True','5 > 2? True']);
  if (scene.action.endsWith('leftover')) assert.equal(scene.comparisons, scenes[index - 1].comparisons);
}
for (const scene of operations) {
    const {left,right,i,j,output,value,chosen} = scene;
    assert.equal(value, chosen === 'left' ? left[i] : right[j]);
    assert.deepEqual(output, [...left.slice(0,i), ...right.slice(0,j)].sort((a,b)=>a-b));
    assert.equal(i + j, output.length);
    if (scene.action === 'compare') {
      assert(i < left.length && j < right.length);
      assert.equal(chosen, left[i] <= right[j] ? 'left' : 'right');
    } else {
      assert(i === left.length || j === right.length);
    }
}
console.log(`Merge video trace passed: ${scenes.length} scenes, 2 simultaneous child lanes, 3 returns, 5 comparisons, 8 temp copies, 8 copy-back writes.`);
