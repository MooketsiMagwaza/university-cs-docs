import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeBeat, soundBeats} from './merge-journey.mjs';
import compareSound from '../../public/files/sem3/csi247/videos/sfx/compare.json';
import landSound from '../../public/files/sem3/csi247/videos/sfx/land.json';
import mergeSound from '../../public/files/sem3/csi247/videos/sfx/merge.json';

type Step = {start:number;left:number[];right:number[];i:number;j:number;output:number[];chosen:string;value:number;action:string;comparison:string;answer:string};
type Group = {start:number;left:number[];right:number[];steps:Step[];output:number[]};
export type MergeJourneySceneData = {
  mode:'merge-journey'; action:string;heading:string;caption:string;narration:string;
  audio:string;durationInFrames:number;fromFrame:number;values:number[];
  groupSize:number;fromSize?:number;groups?:Group[];
  beats?:{start:number;move:number;land:number;end:number}[];
};
const C = {ink:'#172522', muted:'#526965', blue:'#9ed7f5', mint:'#a3e6cf', green:'#327c67', line:'#d8e7e2', white:'#ffffff'};
const bound = (n:number) => Math.max(0,Math.min(1,n));
const mix = (a:number,b:number,t:number) => a+(b-a)*t;
// Critically damped spring: deterministic, no bounce, exactly settled at the end.
const spring = (t:number) => {const p=bound(t);return p===1?1:(1-(1+9*p)*Math.exp(-9*p))/(1-10*Math.exp(-9));};
const moveAt = (phase:number) => spring((phase-.3)/.49);
const W=84, TOP=330, BOTTOM=640;
export function barX(index:number,size:number) {
  const groups=8/size, gap=groups===8?76:groups===4?88:104;
  const total=8*W+(8-groups)*28+(groups-1)*gap;
  return (1320-total)/2+index*(W+28)+Math.floor(index/size)*(gap-28);
}
const height=(v:number)=>30+v*22;
const sounds:Record<string,{peakTime:number}>={compare:compareSound,land:landSound,merge:mergeSound};
function flightPath(from:number,to:number,value:number,up=false) {
  return Array.from({length:33},(_,i)=>{
    const t=i/32,x=mix(from,to,t)+Math.sin(Math.PI*t)*(up?28:0)+W/2;
    const y=mix(up?BOTTOM:TOP,up?TOP:BOTTOM,t)-Math.sin(Math.PI*t)*(up?0:48)-height(value)/2;
    return `${i?'L':'M'}${x},${y}`;
  }).join(' ');
}
function Label({x,y,children,size=27,color=C.ink,weight=500,anchor='middle',opacity=1}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;weight?:number;anchor?:'start'|'middle'|'end';opacity?:number}) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color} opacity={opacity}>{children}</text>;
}
function Bar({x,base,value,color=C.blue,opacity=1,active=false}:{x:number;base:number;value:number;color?:string;opacity?:number;active?:boolean}) {
  const h=height(value);
  return <g opacity={opacity}>
    <rect x={x} y={base-h} width={W} height={h} rx={19} fill={color} stroke={active?C.ink:'rgba(255,255,255,.8)'} strokeWidth={active?3:1.5}/>
    <Label x={x+W/2} y={base-12} size={42} weight={650}>{value}</Label>
  </g>;
}
function Bracket({start,size,layoutSize,y,label,opacity=1}:{start:number;size:number;layoutSize:number;y:number;label?:string;opacity?:number}) {
  const left=barX(start,layoutSize),right=barX(start+size-1,layoutSize)+W;
  return <g opacity={opacity}><path d={`M${left},${y-8} Q${left},${y} ${left+8},${y} H${right-8} Q${right},${y} ${right},${y-8}`} stroke={C.line} fill="none" strokeWidth={3}/>{label&&<Label x={(left+right)/2} y={y+36} size={23} color={C.muted}>{label}</Label>}</g>;
}

function CodePanel({scene,phase,index}:{scene:MergeJourneySceneData;phase:number;index:number}) {
  const split=scene.action==='split', returning=scene.action==='return';
  const steps=scene.groups?.map(group=>group.steps[index])||[];
  const rest=scene.action==='merge'&&steps.every(step=>step.action==='leftover');
  const lines=split?[
    'if (start >= end) return;',
    'int mid = start + (end - start) / 2;',
    'mergeSort(a, start, mid);',
    'mergeSort(a, mid + 1, end);',
    'merge(a, start, mid, end);',
  ]:returning?[
    'for (int k = 0; k < temp.length; k++) {',
    '    a[start + k] = temp[k];',
    '}',
  ]:rest?[
    'while (left <= mid)',
    '    temp[out++] = a[left++];',
    'while (right <= end)',
    '    temp[out++] = a[right++];',
  ]:[
    'if (a[left] > a[right]) {',
    '    temp[out++] = a[right++];',
    '} else {',
    '    temp[out++] = a[left++];',
    '}',
  ];
  const highlights=split?[scene.groupSize===1?0:1]:returning?[1]:scene.action==='merge'?
    rest?[...new Set(steps.map(step=>step.chosen==='left'?1:3))]:phase<.3?[0]:[...new Set(steps.map(step=>step.chosen==='left'?3:1))]:[];
  return <div style={{position:'absolute',left:80,right:80,top:1080,height:285,borderRadius:26,overflow:'hidden',background:'rgba(255,255,255,.92)',border:'2px solid white',boxShadow:'0 14px 40px rgba(29,65,61,.06)'}}>
    <div style={{height:58,display:'flex',alignItems:'center',padding:'0 26px',borderBottom:'1px solid #e6eeea',gap:10}}>
      {['#fa7972','#f3ca69','#8ed4aa'].map(color=><span key={color} style={{width:14,height:14,borderRadius:'50%',background:color}}/>)}
      <span style={{fontSize:23,color:C.muted,marginLeft:17}}>MergeSort.java</span>
      <span style={{marginLeft:'auto',fontSize:20,color:C.muted}}>{split?'Split':returning?'Return the result':rest?'Let the remaining values follow':'Choose the smaller front'} · Java</span>
    </div>
    <div style={{padding:'16px 0'}}>{lines.map((line,k)=><div key={k} style={{display:'flex',fontFamily:'Consolas, monospace',fontSize:30,lineHeight:'36px',background:highlights.includes(k)?'#e1f2ec':'transparent'}}>
      <span style={{width:65,textAlign:'right',paddingRight:24,color:'#8eaaa0',userSelect:'none'}}>{k+1}</span>
      <span style={{whiteSpace:'pre'}}>{line.split(/(if|else|while|for|int|return)/g).map((token,i)=><span key={i} style={{color:/^(if|else|while|for|int|return)$/.test(token)?'#34748e':C.ink}}>{token}</span>)}</span>
      {scene.action==='merge'&&scene.groupSize===4&&phase>=.3&&highlights.includes(k)&&<span style={{marginLeft:'auto',paddingRight:28,fontFamily:'"Segoe UI", sans-serif',fontSize:21,color:C.green}}>{steps.flatMap((step,i)=>(rest?(step.chosen==='left'?1:3):(step.chosen==='left'?3:1))===k?[i===0?'Left child':'Right child']:[]).join(' + ')}</span>}
    </div>)}</div>
  </div>;
}

export function MergeJourneyScene({scene}:{scene:MergeJourneySceneData}) {
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),p=frame/Math.max(1,scene.durationInFrames-1);
  const beat=mergeBeat(p,scene.groupSize,scene.beats),move=moveAt(beat.phase),landed=move===1;
  const groups=scene.groups||[], merging=scene.action==='merge', returning=scene.action==='return';
  const splitMove=spring((p-.12)/.66), returnMove=spring((p-.14)/.66);
  const captionOpacity=bound(frame/12);
  return <AbsoluteFill style={{fontFamily:'"Segoe UI", Arial, sans-serif',color:C.ink,background:'linear-gradient(145deg,#e7f4fc 0%,#f8fcfa 45%,#e0f4ed 100%)'}}>
    <div style={{position:'absolute',left:80,top:48,fontSize:22,letterSpacing:3,color:C.muted}}>MERGE SORT / SEE THE IDEA</div>
    <h1 style={{position:'absolute',left:80,top:93,margin:0,fontSize:67,lineHeight:1.1,letterSpacing:-2.7,fontWeight:700}}>{scene.heading}</h1>
    <div style={{position:'absolute',left:82,top:183,fontSize:30,color:C.muted,opacity:captionOpacity}}>{scene.caption}</div>
    <div style={{position:'absolute',left:60,top:252,width:1320,height:756,borderRadius:48,background:'rgba(255,255,255,.70)',border:'2px solid rgba(255,255,255,.95)',boxShadow:'0 24px 60px rgba(32,75,65,.055)'}}>
      <svg viewBox="0 0 1320 756" width="1320" height="756" style={{overflow:'visible'}}>
        {(scene.action==='intro'||scene.action==='finish'||scene.action==='split')&&<>
          {scene.values.map((value,i)=>{
            const splitting=scene.action==='split';
            const x=splitting?mix(barX(i,scene.fromSize!),barX(i,scene.groupSize),splitMove):barX(i,8);
            const base=scene.action==='intro'?490:scene.action==='finish'?mix(TOP,490,spring(p/.5)):scene.fromSize===8?mix(490,TOP,splitMove):TOP;
            const group=Math.floor(i/scene.groupSize);
            const isOne=scene.action==='intro'&&value===1&&p>.25;
            return <Bar key={value} x={x} base={base} value={value} color={scene.action==='finish'?C.mint:scene.action==='intro'?isOne?C.mint:C.blue:group%2===0?C.blue:C.mint} active={isOne}/>;
          })}
          {scene.action==='intro'&&<Label x={barX(5,8)+W/2} y={552} size={28} color={C.green} opacity={bound((p-.25)/.07)}>first</Label>}
          {scene.action==='split'&&Array.from({length:8/scene.groupSize},(_,i)=><Bracket key={i} start={i*scene.groupSize} size={scene.groupSize} layoutSize={scene.groupSize} y={380} label={scene.groupSize===1?'sorted':scene.groupSize===4?i===0?'left half':'right half':undefined} opacity={splitMove}/>)}
          {scene.action==='split'&&<g opacity={splitMove}>
            <path d="M590,530 Q660,580 730,530" stroke={C.line} fill="none" strokeWidth={3}/>
            <Label x={660} y={627} size={35} weight={600}>{scene.groupSize===1?'Now build back up.':scene.groupSize===2?'A smaller question.':'Same order. Smaller groups.'}</Label>
          </g>}
          {scene.action==='finish'&&<g opacity={spring(p/.4)}><path d="M603,580 l35,35 77,-80" stroke={C.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none"/></g>}
        </>}
        {(merging||returning)&&groups.map((group,groupIndex)=>{
          const step=group.steps[beat.index],sourceSize=scene.groupSize/2;
          const leftX=barX(group.start,sourceSize),rightX=barX(group.start+scene.groupSize-1,sourceSize)+W,centre=(leftX+rightX)/2;
          const title=scene.groupSize===2?`pair ${groupIndex+1}`:scene.groupSize===4?groupIndex===0?'LEFT CHILD':'RIGHT CHILD':'LEFT + RIGHT';
          const comparison=step.action==='compare'?step.comparison:'One side is empty';
          const sourceValues=[...group.left,...group.right];
          const movedIndex=step.chosen==='left'?step.i:group.left.length+step.j;
          const fromX=barX(group.start+movedIndex,sourceSize),toX=barX(group.start+step.output.length,scene.groupSize);
          return <g key={group.start}>
            <Label x={centre} y={40} size={22} color={C.muted}>{title}</Label>
            {merging&&<Label x={centre} y={87} size={scene.groupSize===2?30:36} weight={600}>{comparison}{step.answer&&<tspan fill={C.green}> {beat.phase>.14?step.answer:''}</tspan>}</Label>}
            {returning&&<Label x={centre} y={87} size={30} color={C.green} opacity={1-returnMove}>return ↑</Label>}
            {sourceValues.map((value,k)=>{
              const left=k<group.left.length,local=left?k:k-group.left.length;
              const consumed=local<(left?step.i:step.j)||(landed&&k===movedIndex);
              const front=local===(left?step.i:step.j)&&!consumed;
              return <Bar key={`source-${k}`} x={barX(group.start+k,sourceSize)} base={TOP} value={value} color={left?C.blue:C.mint} opacity={returning?.18*(1-returnMove):consumed?.16:1} active={merging&&front}/>;
            })}
            {merging&&[0,1].map(side=>{
              const ptr=side===0?step.i:step.j,values=side===0?group.left:group.right;
              const advanced=landed&&((step.chosen==='left')===(side===0));
              const cursor=ptr+(advanced?1:0);
              return cursor<values.length?<path key={side} d={`M${barX(group.start+(side===0?0:group.left.length)+cursor,sourceSize)+W/2},350 l-9,13 h18 Z`} fill={C.ink}/>:null;
            })}
            {Array.from({length:scene.groupSize},(_,k)=>{
              const x=barX(group.start+k,scene.groupSize),output=returning?group.output:step.output;
              const selected=merging&&k===step.output.length;
              const localReturn=spring((p-.14-k*.016)/(.66-(scene.groupSize-1)*.016));
              return <g key={`output-${k}`}>
                <rect x={x} y={BOTTOM-10} width={W} height={10} rx={5} fill={selected?C.green:C.line} opacity={returning?1-returnMove:1}/>
                {k<output.length&&<Bar x={x} base={BOTTOM} value={output[k]} color={group.steps[k].chosen==='left'?C.blue:C.mint} opacity={returning?.28*(1-returnMove):1}/>}
                {returning&&<>
                  <path d={flightPath(x,x,group.output[k],true)} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="4 9" opacity={Math.sin(Math.PI*localReturn)*.65}/>
                  <Bar x={x+Math.sin(Math.PI*localReturn)*28} base={mix(BOTTOM,TOP,localReturn)} value={group.output[k]} color={group.steps[k].chosen==='left'?C.blue:C.mint}/>
                </>}
              </g>;
            })}
            {merging&&<>
              <path d={flightPath(fromX,toX,step.value)} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="4 9" opacity={move>0&&move<1?.8:0}/>
              <Bar x={mix(fromX,toX,move)} base={mix(TOP,BOTTOM,move)-Math.sin(Math.PI*move)*48} value={step.value} color={step.chosen==='left'?C.blue:C.mint} opacity={beat.phase>=.3?1:0} active={!landed}/>
            </>}
            {returning&&<Bracket start={group.start} size={scene.groupSize} layoutSize={scene.groupSize} y={380} label="sorted" opacity={returnMove}/>}
          </g>;
        })}
        {(merging||returning)&&<Label x={660} y={714} size={27} color={C.muted}>{returning?'Bring each result back to its own place.':scene.groupSize===2?'Smaller first. The other follows.':'Take the smaller front. Advance only that side.'}</Label>}
      </svg>
    </div>
    <div style={{position:'absolute',left:80,top:1030,fontSize:21,color:C.muted}}>{groups.length>1?'Both sides shown together · Java finishes the left side, then the right.':merging?'The outlined bars are the current fronts.':''}</div>
    <CodePanel scene={scene} phase={beat.phase} index={beat.index}/>
    <div style={{position:'absolute',left:82,bottom:26,fontSize:18,color:C.muted}}>Microsoft Ava · AI narration</div>
    <div style={{position:'absolute',right:82,bottom:30,display:'flex',gap:8}}>{['split','merge','return'].map(action=><span key={action} style={{width:scene.action===action?40:8,height:8,borderRadius:4,background:scene.action===action?C.green:'#bdd7cd'}}/>)}</div>
    <Html5Audio src={staticFile(scene.audio)}/>
    {soundBeats(scene).map((cue:{at:number;sound:string},i:number)=><Sequence key={i} from={Math.max(0,Math.round(cue.at*scene.durationInFrames-sounds[cue.sound].peakTime*fps))} durationInFrames={Math.ceil(fps*.25)}>
      <Html5Audio src={staticFile(`files/sem3/csi247/videos/sfx/${cue.sound}.wav`)} volume={.75}/>
    </Sequence>)}
  </AbsoluteFill>;
}
