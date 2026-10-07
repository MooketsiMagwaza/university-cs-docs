import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {INPUT, createMergeJourney, mergeTrace, mergeBeat, soundBeats} from '../videos/csi247/merge-journey.mjs';

const modelOnly = process.argv.includes('--model-only');
const journey = createMergeJourney();
const {scenes} = journey;
assert.deepEqual(INPUT,[7,3,8,2,6,1,5,4]);
assert.deepEqual(createMergeJourney(),journey,'Generation must not retain mutable state');
assert.deepEqual(scenes.map(s => s.action),['intro','split','split','split','merge','return','merge','return','merge','return','finish']);
assert.deepEqual(scenes.filter(s => s.action === 'split').map(s => [s.fromSize,s.groupSize]),[[8,4],[4,2],[2,1]]);
const merges = scenes.filter(s => s.action === 'merge');
assert.deepEqual(merges.map(s => [s.groupSize,s.groups.map(g => g.start)]),[[2,[0,2,4,6]],[4,[0,4]],[8,[0]]]);
assert.equal(merges.flatMap(s => s.groups).length,7);

function checkTrace({left,right,steps,output,start}) {
  assert.deepEqual(output,[...left,...right].sort((a,b) => a-b),'Preserve and sort every input');
  assert.equal(steps.length,left.length+right.length);
  for (const [index,step] of steps.entries()) {
    const {i,j,chosen,value} = step;
    assert.equal(step.start,start);
    assert.deepEqual(step.left,left);
    assert.deepEqual(step.right,right);
    assert.equal(i+j,index);
    assert(i >= 0 && i <= left.length && j >= 0 && j <= right.length);
    assert.deepEqual(step.output,output.slice(0,index));
    assert.deepEqual(step.output,[...left.slice(0,i),...right.slice(0,j)].sort((a,b) => a-b));
    assert.equal(value,chosen === 'left' ? left[i] : right[j]);
    if (i < left.length && j < right.length) {
      assert.equal(step.action,'compare');
      assert.equal(step.comparison,`${left[i]} > ${right[j]}?`);
      assert.equal(step.answer,left[i] > right[j] ? 'yes' : 'no');
      assert.equal(chosen,left[i] > right[j] ? 'right' : 'left','Equal fronts choose left');
    } else {
      assert.equal(step.action,'leftover');
      assert.equal(step.comparison,'');
      assert.equal(step.answer,'');
    }
    if (index+1 < steps.length) {
      assert.equal(steps[index+1].i,i+Number(chosen === 'left'));
      assert.equal(steps[index+1].j,j+Number(chosen === 'right'));
    }
  }
}

let comparisons = 0, copies = 0, writes = 0;
for (const [index,scene] of scenes.entries()) {
  assert.equal(scene.mode,'merge-journey');
  assert.equal(scene.values.length,8);
  for (const key of ['heading','caption','narration']) {
    assert.equal(typeof scene[key],'string');
    assert(scene[key].trim().length > 0);
    assert(!/\b(?:\d+|sixteen|twenty.four)\s+(?:comparisons|temp copies|copy.back writes)\b/i.test(scene[key]),'No instructional operation counters');
    assert(!/\b(?:let.s dive in|without further ado|in conclusion|unlock the power|game.changer)\b/i.test(scene[key]),'No stock filler');
  }
  assert(!Object.hasOwn(scene,'comparisons'),'No UI comparison counter');
  if (scene.action === 'split' || scene.action === 'merge') assert.deepEqual(scenes[index+1].values,scene.values,'Splits and temporary writes preserve source');
  if (scene.action === 'merge') {
    for (const group of scene.groups) {
      checkTrace(group);
      assert.deepEqual([...group.left,...group.right],scene.values.slice(group.start,group.start+scene.groupSize));
      comparisons += group.steps.filter(s => s.action === 'compare').length;
      copies += group.steps.length;
    }
    assert.equal(scenes[index+1].action,'return');
    assert.deepEqual(scenes[index+1].groups,scene.groups);
  }
  if (scene.action === 'return') {
    const expected = [...scene.values];
    for (const group of scene.groups) {
      expected.splice(group.start,group.output.length,...group.output);
      writes += group.output.length;
    }
    assert.deepEqual(scenes[index+1].values,expected,'Return commits completed results to correct ranges');
  }
  const beats = soundBeats(scene);
  assert.deepEqual(beats,soundBeats(scene),'Deterministic sound cues');
  for (const [i,beat] of beats.entries()) {
    assert(Number.isFinite(beat.at) && beat.at >= 0 && beat.at < 1);
    assert(['compare','land','merge'].includes(beat.sound));
    if (i) assert(beat.at > beats[i-1].at,'Ordered cues without simultaneous lane stacking');
  }
  if (scene.action === 'merge') {
    assert.equal(beats.filter(b => b.sound === 'land').length,scene.groupSize);
    assert.equal(beats.filter(b => b.sound === 'compare').length,Array.from({length:scene.groupSize},(_,i) => scene.groups.some(g => g.steps[i].action === 'compare')).filter(Boolean).length);
  } else if (scene.action === 'return') assert.deepEqual(beats,[{at:.8,sound:'merge'}]);
  else assert.deepEqual(beats,[]);
}
assert.equal(comparisons,16);
assert.equal(copies,24);
assert.equal(writes,24);
assert.deepEqual(scenes.at(-1).values,[1,2,3,4,5,6,7,8]);

// Tagged duplicate values make stable ordering observable across both inputs.
const tagged = (number,id) => ({number,id,valueOf() {return this.number;},toString() {return String(this.number);}});
const left = [tagged(1,'L1'),tagged(2,'L2a'),tagged(2,'L2b'),tagged(4,'L4')];
const right = [tagged(1,'R1'),tagged(2,'R2'),tagged(3,'R3'),tagged(4,'R4')];
const stable = mergeTrace(left,right,5);
checkTrace(stable);
assert.deepEqual(stable.output.map(v => v.id),['L1','R1','L2a','L2b','R2','R3','L4','R4']);
assert.deepEqual(left.map(v => v.id),['L1','L2a','L2b','L4']);
assert.deepEqual(right.map(v => v.id),['R1','R2','R3','R4']);
for (const [a,b] of [[[],[]],[[1,2],[]],[[],[1,2]],[[1,1],[1,1]],[[-5,0],[-3,4]]]) checkTrace(mergeTrace(a,b));
for (const count of [2,4,8]) {
  let previous = -1;
  for (let frame = 0; frame <= 600; frame++) {
    const beat = mergeBeat(frame/600,count);
    assert(Number.isInteger(beat.index) && beat.index >= 0 && beat.index < count);
    assert(beat.phase >= 0 && beat.phase <= 1);
    assert(beat.index+beat.phase >= previous,'Animation clock never moves backwards');
    previous = beat.index+beat.phase;
  }
  assert.deepEqual(mergeBeat(0,count),{index:0,phase:0});
  assert.deepEqual(mergeBeat(1,count),{index:count-1,phase:1});
}

function checkTimedBeats(scene) {
  assert.equal(scene.beats.length,scene.groupSize);
  let previousEnd = 0;
  for (const [i,beat] of scene.beats.entries()) {
    for (const key of ['start','move','land','end']) assert(Number.isFinite(beat[key]));
    assert(beat.start >= 0 && beat.start < beat.move && beat.move < beat.land && beat.land < beat.end && beat.end <= 1,'Timed beats need readable decision, movement, arrival and hold');
    assert(Math.abs(beat.start-previousEnd) < 1e-9,'Timed beat intervals must be contiguous');
    previousEnd = beat.end;
    for (const [position,phase] of [[beat.start,0],[beat.move,.3],[beat.land,.79]]) {
      const actual = mergeBeat(position,scene.groupSize,scene.beats);
      assert.equal(actual.index,i);
      assert(Math.abs(actual.phase-phase) < 1e-9,'Renderer phases must match speech timing');
    }
  }
  let previousClock = -1;
  for (let frame=0;frame<=1200;frame++) {
    const {index,phase} = mergeBeat(frame/1200,scene.groupSize,scene.beats);
    assert(index >= 0 && index < scene.groupSize && phase >= 0 && phase <= 1);
    assert(index+phase >= previousClock,'Timed animation cannot reverse at beat boundaries');
    previousClock = index+phase;
  }
  assert.deepEqual(mergeBeat(1,scene.groupSize,scene.beats),{index:scene.groupSize-1,phase:1});
  const expected = scene.beats.flatMap((beat,i) => [
    ...(scene.groups.some(g => g.steps[i].action === 'compare') ? [{at:beat.start+.02,sound:'compare'}] : []),
    {at:beat.land,sound:'land'},
  ]);
  assert.deepEqual(soundBeats(scene),expected,'Sound cues use the same timed movement beats');
}
for (const scene of merges) {
  checkTimedBeats({...scene,beats:Array.from({length:scene.groupSize},(_,i) => ({
    start:i/scene.groupSize, move:(i+.3)/scene.groupSize, land:(i+.79)/scene.groupSize, end:(i+1)/scene.groupSize,
  }))});
}

// Check the measured metadata against actual PCM, not authored estimates.
for (const [name,duration] of [['compare',.05],['land',.08],['merge',.2]]) {
  const base = `../public/files/sem3/csi247/videos/sfx/${name}`;
  const metadata = JSON.parse(readFileSync(new URL(`${base}.json`,import.meta.url),'utf8'));
  const wav = readFileSync(new URL(`${base}.wav`,import.meta.url));
  assert.equal(wav.toString('ascii',0,4),'RIFF');
  assert.equal(wav.toString('ascii',8,12),'WAVE');
  let pcm,rate,channels,bits;
  for (let offset=12;offset+8<=wav.length;) {
    const chunk = wav.toString('ascii',offset,offset+4),size = wav.readUInt32LE(offset+4);
    if (chunk === 'fmt ') {
      assert.equal(wav.readUInt16LE(offset+8),1,'Uncompressed PCM');
      channels = wav.readUInt16LE(offset+10);
      rate = wav.readUInt32LE(offset+12);
      bits = wav.readUInt16LE(offset+22);
    }
    if (chunk === 'data') pcm = wav.subarray(offset+8,offset+8+size);
    offset += 8+size+(size%2);
  }
  assert.equal(rate,48000); assert.equal(channels,1); assert.equal(bits,16);
  assert(pcm?.length > 0);
  let peak = 0,peakFrame = 0,squares = 0;
  for (let i=0;i<pcm.length/2;i++) {
    const sample = pcm.readInt16LE(i*2);
    if (Math.abs(sample)>peak) {peak=Math.abs(sample);peakFrame=i;}
    squares += sample*sample;
  }
  const count = pcm.length/2,normalizedPeak = peak/32767;
  assert.equal(metadata.duration,count/rate);
  assert.equal(metadata.duration,duration);
  assert.equal(metadata.peakTime,peakFrame/rate);
  assert.equal(metadata.peak,normalizedPeak);
  assert.equal(metadata.sampleRate,rate); assert.equal(metadata.channels,channels); assert.equal(metadata.sampleWidth,bits/8);
  assert(Math.abs(metadata.peakDbFS-20*Math.log10(normalizedPeak)) < 1e-9);
  assert(Math.abs(metadata.rmsDbFS-20*Math.log10(Math.sqrt(squares/count)/32767)) < 1e-9);
  assert(metadata.peakTime > 0 && metadata.peakTime < metadata.duration);
  assert(metadata.peakDbFS < -25 && metadata.rmsDbFS < metadata.peakDbFS,'Cues must remain quiet and unclipped');
}

if (!modelOnly) {
  const recorded = JSON.parse(readFileSync(new URL('../videos/csi247/timings.json',import.meta.url),'utf8'))['merge-sort'];
  assert.equal(recorded.scenes.length,scenes.length,'Regenerate narration after trace changes');
  let nextFrame = 0;
  for (const [index,scene] of recorded.scenes.entries()) {
    for (const [key,value] of Object.entries(scenes[index])) assert.deepEqual(scene[key],value,`Recorded scene ${index+1}: stale ${key}`);
    assert.equal(scene.fromFrame,nextFrame,'Frames are contiguous');
    assert(Number.isInteger(scene.durationInFrames) && scene.durationInFrames > 0);
    assert.equal(typeof scene.audio,'string');
    assert(statSync(new URL(`../public/${scene.audio}`,import.meta.url)).size > 0,'Narration exists');
    assert(scene.words?.length > 0,'Recorded narration needs word boundaries');
    let lastEnd = 0;
    for (const word of scene.words) {
      assert(typeof word.text === 'string' && word.text.length > 0);
      assert(Number.isFinite(word.start) && Number.isFinite(word.end));
      assert(word.start >= lastEnd-1e-7 && word.end > word.start,'Ordered word boundaries');
      assert(word.end <= scene.durationInFrames/recorded.fps,'Words stay inside their scene');
      lastEnd = word.end;
    }
    if (scene.action === 'merge') {
      checkTimedBeats(scene);
      const seconds = scene.durationInFrames/recorded.fps;
      const wordEnd = text => {
        const word = scene.words.find(w => w.text.toLowerCase().replace(/[^a-z]/g,'') === text);
        assert(word,`Missing voice anchor: ${text}`);
        return word.end;
      };
      if (scene.groupSize === 8) {
        for (const [i,text] of ['one','two','three'].entries()) assert(Math.abs(scene.beats[i].land*seconds-wordEnd(text)) < 1e-7,'Named values land on spoken anchors');
        assert(Math.abs(scene.beats[5].land*seconds-wordEnd('out')) < 1e-7,'Exhaustion cue follows spoken out');
      } else {
        const anchor = wordEnd(scene.groupSize === 2 ? 'eight' : 'four');
        assert(Math.abs(scene.beats[0].move*seconds-(anchor+.08)) < 1e-7,'Both lanes are named before their first copies travel');
        assert(Math.abs(scene.beats[0].land*seconds-(anchor+.65)) < 1e-7);
      }
    }
    for (const beat of soundBeats(scene)) {
      const frame = Math.round(beat.at*scene.durationInFrames);
      assert(frame >= 0 && frame < scene.durationInFrames,'Sound begins inside scene');
      assert(statSync(new URL(`../public/files/sem3/csi247/videos/sfx/${beat.sound}.wav`,import.meta.url)).size > 44);
    }
    nextFrame += scene.durationInFrames;
  }
  assert.equal(recorded.durationInFrames,nextFrame);
}
console.log(`Merge video ${modelOnly ? 'model' : 'model and recorded assets'} passed: ${scenes.length} scenes, seven merges, stable duplicates, source/copyback state, continuous animation and valid sound beats.`);
