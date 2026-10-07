import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {chromium} from '@playwright/test';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=process.cwd(), out=resolve(root,'public/files/sem3/csi247/videos');
const stories=JSON.parse(await readFile(resolve(root,'videos/csi247/timings.json'),'utf8'));
await mkdir(out,{recursive:true});
await mkdir(resolve(root,'tmp/csi247-video-qa'),{recursive:true});
const captionsOnly=process.argv.includes('--captions-only');
const serveUrl=captionsOnly?'':await bundle({entryPoint:resolve(root,'videos/csi247/index.tsx'),publicDir:resolve(root,'public')});
const browserExecutable=chromium.executablePath();
const only=process.argv.find(a=>a.startsWith('--only='))?.split('=')[1];
for(const [id,story] of Object.entries(stories)) {
  if(only && only!==id) continue;
  if(!captionsOnly) {
  const composition=await selectComposition({serveUrl,id,browserExecutable});
  for(const [index,scene] of story.scenes.entries()) {
    await renderStill({serveUrl,composition,browserExecutable,frame:scene.fromFrame+Math.floor(scene.durationInFrames*.68),output:resolve(root,`tmp/csi247-video-qa/${id}-${index+1}.png`)});
    if(process.argv.includes('--beats') && id==='merge-sort') {
      const phases=scene.action==='merge'&&scene.beats?scene.beats.flatMap(beat=>[(beat.start+beat.move)/2,(beat.move+beat.land)/2,(beat.land+beat.end)/2]):[.02,.4,.98];
      for(const [sample,phase] of phases.entries()) await renderStill({serveUrl,composition,browserExecutable,frame:scene.fromFrame+Math.floor((scene.durationInFrames-1)*phase),output:resolve(root,`tmp/csi247-video-qa/beat-${index+1}-${sample+1}.png`)});
    }
  }
  await renderStill({serveUrl,composition,browserExecutable,frame:Math.floor(story.scenes[0].durationInFrames*.6),output:resolve(out,`${id}.png`)});
  if(process.argv.includes('--stills-only')) continue;
  let last=-1;
  await renderMedia({serveUrl,composition,browserExecutable,codec:'h264',audioCodec:'aac',crf:23,concurrency:3,outputLocation:resolve(out,`${id}.mp4`),onProgress:({progress})=>{const pct=Math.floor(progress*10)*10;if(pct!==last){last=pct;console.log(`${id}: ${pct}%`);}}});
  }
  const time=(frame)=>{const ms=Math.round(frame/story.fps*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;};
  const cues=story.scenes.flatMap(s=>{
    if(!s.words) return [{from:s.fromFrame,to:s.fromFrame+s.durationInFrames,text:s.narration}];
    const chunks=[];let words=[];
    const authored=s.narration.split(/\s+/);
    for(const [index,timed] of s.words.entries()) {
      const word={...timed,text:authored.length===s.words.length?authored[index]:timed.text};
      words.push(word);
      if(words.map(w=>w.text).join(' ').length>=55||/[.!?]$/.test(word.text)) {
        chunks.push(words);words=[];
      }
    }
    if(words.length) chunks.push(words);
    return chunks.map(words=>({from:s.fromFrame+words[0].start*story.fps,to:s.fromFrame+words.at(-1).end*story.fps,text:words.map(w=>w.text).join(' ')}));
  });
  await writeFile(resolve(out,`${id}.vtt`),'WEBVTT\n\n'+cues.map(c=>`${time(c.from)} --> ${time(c.to)}\n${c.text}\n`).join('\n'));
  console.log(`${captionsOnly?'Captioned':'Rendered'} ${id}: ${(story.durationInFrames/story.fps).toFixed(1)}s with ${story.voice}`);
}
