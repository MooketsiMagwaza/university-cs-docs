import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import stories from './timings.json';
import {MergeJourneyScene, type MergeJourneySceneData} from './merge-journey';

type Scene = {heading:string;mode:'facts'|'copyback'|'split'|'merge'|'runs'|'insertion'|'bars'|'bubble'|'selection'|'linear'|'binary';caption:string;narration:string;audio:string;fromFrame:number;durationInFrames:number;values?:number[];after?:number[];left?:number[];right?:number[];i?:number;j?:number;output?:number[];chosen?:string;value?:number;lines?:string[]};
type Story = {title:string;scenes:(Scene | (MergeJourneySceneData & {fromFrame:number}))[];durationInFrames:number;fps:number;voice:string};
const C={paper:'#f1ebdd',ink:'#273047',card:'#fbf5e9',muted:'#6e7180',blue:'#b8c5df',rose:'#d9a9b0',green:'#6d9c91'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const smooth=(t:number)=>t*t*(3-2*t);
const Text=({x,y,children,size=24,color=C.ink,anchor='middle'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;anchor?:'middle'|'start'|'end'})=><text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontFamily="Consolas, monospace">{children}</text>;

function Bars({scene,p}:{scene:Scene;p:number}) {
  const input=scene.values||[], n=input.length, max=Math.max(...input), w=540/n;
  let states:number[][]=[input,scene.after||input];
  if(scene.mode==='bubble') states=[[7,3,5,2],[3,7,5,2],[3,5,7,2],[3,5,2,7]];
  if(scene.mode==='selection') states=[input,input,input,[2,3,5,7]];
  const progress=interpolate(p,[.18,.86],[0,states.length-1],clamp), step=Math.min(states.length-2,Math.floor(progress)), t=smooth(progress-step);
  const before=states[step],after=states[step+1];
  const probe=scene.mode==='linear'?Math.min(2,Math.floor(p*4)):scene.mode==='binary'?(p<.53?2:3):-1;
  return <svg viewBox="0 0 620 510" width="620" height="510">
    <Text x={40} y={28} anchor="start" size={20}>value</Text>
    <line x1={35} x2={590} y1={410} y2={410} stroke={C.muted}/>
    {input.map(v=>{const index=mix(before.indexOf(v),after.indexOf(v),t),h=v/max*300;const discarded=scene.mode==='binary'&&p>=.53&&input.indexOf(v)<=2;return <g key={v} opacity={discarded?.2:1} transform={`translate(${45+index*w},0)`}><rect y={410-h} width={w-20} height={h} rx={6} fill={probe===input.indexOf(v)?C.rose:scene.mode==='selection'&&v===2?C.rose:C.blue}/><Text x={(w-20)/2} y={394-h} size={32}>{v}</Text></g>})}
    {input.map((_,i)=><Text key={i} x={45+i*w+(w-20)/2} y={453} size={22}>{i}</Text>)}
    <Text x={580} y={496} anchor="end" size={20}>array index →</Text>
  </svg>;
}

function Insertion({p}:{p:number}) {
  const stage=interpolate(p,[.22,.9],[0,4],clamp), step=Math.min(3,Math.floor(stage)), t=smooth(stage-step);
  const keyPoints=[[500,85],[500,85],[500,85],[500,85],[60,326]];
  const keyX=mix(keyPoints[step][0],keyPoints[step+1][0],t),keyY=mix(keyPoints[step][1],keyPoints[step+1][1],t);
  return <svg viewBox="0 0 620 530"><Text x={35} y={35} anchor="start">Held key (safe outside array)</Text>
    <rect x={keyX} y={keyY} width={76} height={65} rx={8} fill={C.rose}/><Text x={keyX+38} y={keyY+44} size={34}>2</Text>
    {[3,5,7].map((v,i)=>{const when=2-i;const move=smooth(interpolate(stage,[when,when+1],[0,1],clamp));const x=60+(i+move)*130;return <g key={v}><rect x={x} y={390-v*32} width={76} height={v*32} rx={6} fill={C.blue}/><Text x={x+38} y={375-v*32} size={30}>{v}</Text></g>})}
    <line x1={45} x2={590} y1={390} y2={390} stroke={C.muted}/>{[0,1,2,3].map(i=><Text key={i} x={98+i*130} y={438}>{i}</Text>)}
  </svg>;
}

function Merge({scene,p}:{scene:Scene;p:number}) {
  const left=scene.left||[],right=scene.right||[],i=scene.i||0,j=scene.j||0,output=scene.output||[];
  const move=smooth(interpolate(p,[.38,.7],[0,1],clamp)),landed=move===1,chosenLeft=scene.chosen==='left';
  const row=(values:number[],y:number,ptr:number,label:string,color:string)=><g><Text x={30} y={y-24} anchor="start" size={23}>{label}</Text>{values.map((v,k)=><g key={k} opacity={k<ptr?.25:1}><rect x={100+k*105} y={y} width={78} height={64} fill={color} rx={8}/><Text x={139+k*105} y={y+43} size={33}>{v}</Text>{k===ptr&&scene.mode==='merge'&&<Text x={139+k*105} y={y+96} size={22}>{label==='LEFT'?'L':'R'}</Text>}</g>)}</g>;
  const chosen=scene.mode==='merge';const fromX=100+(chosenLeft?i:j)*105,fromY=chosenLeft?70:240,toX=65+output.length*130,toY=470;
  return <svg viewBox="0 0 620 650" width="620" height="650">
    {row(left,70,i+(landed&&chosenLeft?1:0),'LEFT',C.blue)}
    {row(right,240,j+(landed&&!chosenLeft?1:0),'RIGHT',C.rose)}
    <Text x={30} y={438} anchor="start" size={23}>TEMP · separate output</Text>
    {[0,1,2,3].map(k=><g key={k}><rect x={65+k*130} y={470} width={78} height={64} rx={8} stroke={C.muted} fill={C.card}/><Text x={104+k*130} y={514} size={33}>{output[k]??'·'}</Text><Text x={104+k*130} y={567} size={20}>{k}</Text></g>)}
    {chosen&&<g transform={`translate(${mix(fromX,toX,move)},${mix(fromY,toY,move)})`}><rect width={78} height={64} rx={8} fill={C.green}/><Text x={39} y={43} size={33}>{scene.value}</Text></g>}
    {chosen&&<Text x={310} y={632} size={21}>{landed?`Copied ${scene.value}. ${chosenLeft?'L':'R'} advances; the other waits.`:j>=right.length||i>=left.length?'One run is empty: copy the leftover.':'Compare the two front unread values.'}</Text>}
  </svg>;
}

function CopyBack({scene,p}:{scene:Scene;p:number}) {
  const input=scene.values||[],output=scene.after||[];
  const progress=interpolate(p,[.15,.85],[0,4],clamp), k=Math.min(3,Math.floor(progress)), t=smooth(progress-k);
  return <svg viewBox="0 0 620 560">
    <Text x={35} y={60} anchor="start">TEMP · sorted output stays intact</Text>
    <Text x={35} y={320} anchor="start">ARRAY · overwrite the same index</Text>
    {output.map((v,i)=><g key={i}>
      <rect x={55+i*135} y={100} width={90} height={75} rx={8} fill={C.green}/><Text x={100+i*135} y={150} size={34}>{v}</Text>
      <rect x={55+i*135} y={355} width={90} height={75} rx={8} fill={i<k||progress===4?C.green:C.blue}/><Text x={100+i*135} y={405} size={34}>{i<k||progress===4?output[i]:input[i]}</Text>
      <Text x={100+i*135} y={480} size={23}>{i}</Text>
    </g>)}
    <g transform={`translate(${55+k*135},${mix(100,355,t)})`}><rect width={90} height={75} rx={8} fill={C.green}/><Text x={45} y={50} size={34}>{output[k]}</Text></g>
    <Text x={310} y={540} size={22}>Copy temp[k] to array[start + k]. No swapping.</Text>
  </svg>;
}

function Split({p}:{p:number}) {
  const groups=[[[7,3,5,2]],[[7,3],[5,2]],[[7],[3],[5],[2]]];
  return <svg viewBox="0 0 620 630">
    {groups.map((level,d)=>{const reveal=interpolate(p,[d*.17,d*.17+.18],[0,1],clamp);return <g key={d} opacity={reveal}>{level.map((values,k)=>{const block=560/level.length,x=30+k*block;return <g key={k}>{d>0&&<line x1={x+block/2} y1={70+d*180-95} x2={x+block/2} y2={70+d*180-20} stroke={C.muted} strokeWidth={2}/>}<rect x={x+8} y={70+d*180} width={block-16} height={82} rx={8} fill={d===2?C.green:C.blue}/><Text x={x+block/2} y={123+d*180} size={32}>{values.join('  ')}</Text></g>})}</g>})}
    <Text x={310} y={615} size={22}>Every one-value range is already sorted.</Text>
  </svg>;
}

function SceneView({scene,index,total,title}:{scene:Scene;index:number;total:number;title:string}) {
  const frame=useCurrentFrame(),p=frame/scene.durationInFrames;
  // Readable sentence chunks remain visible long enough to follow the voice.
  const sentences=scene.narration.match(/[^.!?]+[.!?]+/g)||[scene.narration];
  const subtitle=sentences[Math.min(sentences.length-1,Math.floor(p*sentences.length))].trim();
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:'Arial, sans-serif',padding:'48px 50px'}}>
    <div style={{fontSize:19,letterSpacing:2,textTransform:'uppercase',color:C.muted}}>CSI247 / {title.split('·')[0]} / {index+1} of {total}</div>
    <h1 style={{fontSize:46,lineHeight:1.13,letterSpacing:-1.5,margin:'30px 0 12px',minHeight:155,fontFamily:'Georgia, serif'}}>{scene.heading}</h1>
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',minHeight:0}}>
      {scene.mode==='facts'?<div style={{width:'100%',display:'grid',gap:24}}>{scene.lines?.map((line,n)=><div key={line} style={{padding:'26px 24px',borderLeft:`5px solid ${n===0?C.rose:C.blue}`,background:C.card,fontFamily:'Consolas, monospace',fontSize:27,lineHeight:1.5,overflowWrap:'anywhere'}}>{line}</div>)}</div>:scene.mode==='copyback'?<CopyBack scene={scene} p={p}/>:scene.mode==='split'?<Split p={p}/>:['merge','runs'].includes(scene.mode)?<Merge scene={scene} p={p}/>:scene.mode==='insertion'?<Insertion p={p}/>:<Bars scene={scene} p={p}/>}
    </div>
    <div style={{fontSize:27,lineHeight:1.4,fontWeight:600,minHeight:92,padding:'18px 0',borderTop:`2px solid ${C.ink}`}}>{scene.caption}</div>
    <div style={{fontSize:23,lineHeight:1.45,minHeight:135,color:C.ink,paddingTop:12}}>{subtitle}</div>
    <div style={{height:4,background:C.blue,marginTop:20}}><div style={{height:'100%',width:`${100*(index+p)/total}%`,background:C.ink}}/></div>
    <div style={{fontSize:16,color:C.muted,marginTop:12}}>AI narration: Microsoft Ava · Original instructional animation</div>
    <Html5Audio src={staticFile(scene.audio)}/>
  </AbsoluteFill>;
}
const Lesson=({story}:{story:Story})=><>{story.scenes.map((scene,i)=><Sequence key={i} from={scene.fromFrame} durationInFrames={scene.durationInFrames}>{scene.mode==='merge-journey'?<MergeJourneyScene scene={scene}/>:<SceneView scene={scene} index={i} total={story.scenes.length} title={story.title}/>}</Sequence>)}</>;
const Root=()=> <>{Object.entries(stories).map(([id,story])=><Composition key={id} id={id} component={Lesson} width={720} height={1280} fps={story.fps} durationInFrames={story.durationInFrames} defaultProps={{story:story as Story}}/>)}</>;
registerRoot(Root);
