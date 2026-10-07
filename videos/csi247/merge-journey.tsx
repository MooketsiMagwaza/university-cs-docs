import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';

export type MergeJourneySceneData = {
  mode:'merge-journey';
  action:string; heading:string; caption:string; narration:string; audio:string;
  durationInFrames:number; values:number[]; comparisons:number;
  start:number; end:number; mid?:number; left?:number[]; right?:number[];
  i?:number; j?:number; output?:number[]; chosen?:string; value?:number;
  children?:{start:number;end:number;left:number[];right:number[];i:number;j:number;output:number[];chosen:string;value:number;comparison:string;action:string}[];
};
const C={paper:'#f1ebdd',ink:'#273047',card:'#fbf5e9',muted:'#6e7180',blue:'#b8c5df',rose:'#d9a9b0',green:'#6d9c91',line:'#abb0ba'};
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=(p:number)=>p*p*(3-2*p);
const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
const Label=({x,y,children,size=23,color=C.ink,anchor='start'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;anchor?:'start'|'middle'})=><text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontFamily="Arial, sans-serif">{children}</text>;
const Tile=({x,y,value,fill=C.card,opacity=1,width=80}:{x:number;y:number;value:number|string;fill?:string;opacity?:number;width?:number})=><g opacity={opacity}><rect x={x} y={y} width={width} height={66} rx={5} fill={fill} stroke={C.ink} strokeWidth={2}/><Label x={x+width/2} y={y+44} size={34} anchor="middle">{value}</Label></g>;

export function MergeJourneyScene({scene}:{scene:MergeJourneySceneData}) {
  const frame=useCurrentFrame(),p=frame/scene.durationInFrames;
  const copying=scene.action==='compare'||scene.action==='leftover';
  const returning=scene.action==='copyback';
  const active=copying||returning;
  const children=scene.children||[];
  const childReturning=scene.action==='children-copyback';
  const childCopying=scene.action==='children-compare'||scene.action==='children-leftover';
  const splitting=scene.action==='split'||scene.action==='children-base';
  const childProgress=interpolate(p,[.16,.82],[0,2],clamp);
  const childIndex=Math.min(1,Math.floor(childProgress));
  const childMove=ease(childProgress-childIndex);
  const left=scene.left||[],right=scene.right||[],output=scene.output||[];
  const i=scene.i||0,j=scene.j||0,chosenLeft=scene.chosen==='left';
  // Read the comparison first, then travel, then hold the completed result.
  const move=ease(interpolate(p,[.38,.68],[0,1],clamp));
  const landed=move===1;
  const nextOutput=output.length+(copying&&landed?1:0);
  const copyProgress=interpolate(p,[.16,.82],[0,output.length],clamp);
  const copyIndex=Math.min(Math.max(0,output.length-1),Math.floor(copyProgress));
  const copyMove=ease(copyProgress-copyIndex);
  const sourceX=(chosenLeft?60:360)+(chosenLeft?i:j)*94;
  const targetX=50+output.length*140;
  const sourceY=260,targetY=440;
  const code=splitting?[
    'if (start >= end) return;',
    'int mid = start + (end - start) / 2;',
    'mergeSort(a, start, mid);',
    'mergeSort(a, mid + 1, end);',
    'merge(a, start, mid, end);',
  ]:returning||childReturning?[
    'for (int k = 0; k < temp.length; k++) {',
    '    a[start + k] = temp[k];',
    '}',
    '// This range is sorted.',
    '// The parent can use it when both children finish.',
  ]:scene.action==='leftover'||scene.action==='children-leftover'?[
    'while (left <= mid)',
    '    temp[out++] = a[left++];',
    'while (right <= end)',
    '    temp[out++] = a[right++];',
    '// No key comparison when only one side remains.',
  ]:[
    'if (a[left] > a[right]) {',
    '    temp[out++] = a[right++];',
    '} else {',
    '    temp[out++] = a[left++];',
    '}',
  ];
  const highlighted=splitting?[scene.action==='children-base'?0:1]:returning||childReturning?[1]:scene.action==='leftover'?[chosenLeft?1:3]:scene.action==='children-leftover'?[1]:copying?[p<.38?0:chosenLeft?3:1]:childCopying?[p<.38?0:1]:[];
  const panelLabel=splitting?'Java · recursive calls':returning||childReturning?'Java · copy back':scene.action==='intro'||scene.action==='finish'?'Java · the merge decision':'Java · compare, then copy';
  return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:'Arial, sans-serif'}}>
    <div style={{position:'absolute',left:44,top:38,fontSize:20,letterSpacing:2,color:C.muted}}>CSI247 / FOLLOW THE SAME FOUR VALUES</div>
    <h1 style={{position:'absolute',left:44,top:70,margin:0,fontSize:54,fontFamily:'Georgia, serif'}}>Merge sort</h1>
    <div style={{position:'absolute',left:44,right:44,top:142,fontSize:28,lineHeight:1.3,fontWeight:600,minHeight:72}}>{scene.heading}</div>
    <div style={{position:'absolute',left:44,right:44,top:223,display:'flex',gap:14,fontSize:23}}>
      <span style={{background:C.card,padding:'10px 14px',border:`1px solid ${C.line}`}}>Range {scene.start}..{scene.end}</span>
      <span style={{background:C.card,padding:'10px 14px',border:`1px solid ${C.line}`}}>Comparisons {scene.comparisons}</span>
    </div>
    <svg viewBox="0 0 660 570" width="660" height="570" style={{position:'absolute',left:30,top:294}}>
      <Label x={28} y={24}>ARRAY · values stay here while ranges split</Label>
      {scene.values.map((v,index)=>{
        const filled=returning&&index>=scene.start&&index<=scene.end&&(index-scene.start<copyIndex||copyProgress===output.length);
        const childFilled=childReturning&&(index%2<childIndex||childProgress===2);
        return <g key={index}><Tile x={50+index*140} y={55} value={childFilled?children[Math.floor(index/2)].output[index%2]:filled?output[index-scene.start]:v} fill={filled||childFilled||scene.action==='finish'?C.green:C.card} opacity={index<scene.start||index>scene.end?.4:1}/><Label x={90+index*140} y={151} size={21} anchor="middle">{index}</Label></g>;
      })}
      <path d={`M${46+scene.start*140},164 v14 H${134+scene.end*140} v-14`} stroke={C.ink} strokeWidth={2} fill="none"/>
      {scene.action==='split'&&<g opacity={interpolate(p,[.12,.32],[0,1],clamp)}>
        <path d={`M${40+((scene.mid??0)+1)*140},48 v112`} stroke={C.rose} strokeWidth={4} strokeDasharray="8 6"/>
        <Label x={65} y={260}>LEFT: {scene.start}..{scene.mid}</Label><Label x={355} y={260}>RIGHT: {(scene.mid??0)+1}..{scene.end}</Label>
        <Label x={330} y={350} anchor="middle" size={25}>Both children must finish before the parent merge.</Label>
        <Label x={330} y={402} anchor="middle" color={C.muted}>No array writes during this split.</Label>
      </g>}
      {children.map((child,group)=>{
        const x=50+group*280,centre=x+110;
        const localOutput=child.output.length+(childCopying&&landed?1:0);
        const chosen=child.chosen==='left'?0:1;
        const showLabels=!childReturning||p<.16||p>=.82;
        return <g key={group}>
          {showLabels&&<>
            <Label x={centre} y={222} anchor="middle" size={24}>{group===0?'LEFT':'RIGHT'} CHILD · {child.start}..{child.end}</Label>
            <Label x={centre} y={270} anchor="middle" size={25} color={C.ink}>{scene.action==='children-base'?'1 value + 1 value':childReturning?'Sorted result returned':scene.action==='children-leftover'?'No comparison needed':child.comparison}</Label>
          </>}
          {!childReturning&&[child.left[0],child.right[0]].map((value,k)=>{
            const consumed=(k===0?child.i:child.j)>0||(childCopying&&landed&&k===chosen);
            return <g key={k}><Tile x={x+k*140} y={305} value={value} fill={k===0?C.blue:C.rose} opacity={consumed?.27:1}/><Label x={x+k*140+40} y={399} anchor="middle" size={20}>{scene.action==='children-base'?'sorted':k===0?'L':'R'}</Label></g>;
          })}
          {scene.action!=='children-base'&&<>
            {showLabels&&(!childCopying||p<.38||landed)&&<Label x={centre} y={438} anchor="middle" size={20}>{localOutput===2?'TEMP · complete':'TEMP · next slot outlined'}</Label>}
            {[0,1].map(k=><g key={k}><rect x={x+k*140} y={455} width={80} height={66} rx={5} fill={C.card} stroke={k===localOutput?C.ink:C.line} strokeWidth={k===localOutput?3:1} strokeDasharray="6 5"/>{k<child.output.length&&<Tile x={x+k*140} y={455} value={child.output[k]} fill={C.green}/>}</g>)}
          </>}
          {childCopying&&<Tile x={lerp(x+chosen*140,x+child.output.length*140,move)} y={lerp(305,455,move)-Math.sin(Math.PI*move)*26} value={child.value} fill={C.green} opacity={p<.38?0:1}/>}
          {childReturning&&<Tile x={x+childIndex*140} y={lerp(455,55,childMove)} value={child.output[childIndex]} fill={C.green}/>}
        </g>;
      })}
      {children.length>0&&<Label x={330} y={564} anchor="middle" size={18} color={C.muted}>Side-by-side overview · Java runs left, then right.</Label>}
      {active&&<>
        {copying&&<>
        <Label x={60} y={231} color={C.muted}>LEFT · read from array</Label><Label x={360} y={231} color={C.muted}>RIGHT · read from array</Label>
        {[[left,60,i,'L',C.blue],[right,360,j,'R',C.rose]].map(([values,x,ptr,name,fill],group)=>{
          const cursor=(ptr as number)+(copying&&landed&&((group===0)===chosenLeft)?1:0);
          return <g key={group}>{(values as number[]).map((v,k)=><g key={k}><Tile x={(x as number)+k*94} y={260} value={v} fill={fill as string} opacity={k<cursor?.27:1}/>{k===cursor&&copying&&<><path d={`M${(x as number)+k*94+40},342 l-7,12 h14 Z`} fill={C.ink}/><Label x={(x as number)+k*94+40} y={380} anchor="middle" size={22}>{name as string}</Label></>}</g>)}</g>;
        })}
        </>}
        {((copying&&(p<.38||landed))||(returning&&(p<.16||p>=.82)))&&<Label x={28} y={418}>{returning?'TEMP · copy back into the active array range':nextOutput===scene.end-scene.start+1?'TEMP · this sorted output is complete':'TEMP · next output position is outlined'}</Label>}
        {Array.from({length:scene.end-scene.start+1},(_,k)=><g key={k}><rect x={50+k*140} y={440} width={80} height={66} rx={5} fill={C.card} stroke={k===nextOutput&&copying?C.ink:C.line} strokeWidth={k===nextOutput&&copying?3:1} strokeDasharray={k>=output.length?'6 5':undefined}/>{k<output.length&&<Tile x={50+k*140} y={440} value={output[k]} fill={C.green}/>}<Label x={90+k*140} y={538} anchor="middle" size={21}>{k}</Label></g>)}
      </>}
      {copying&&<>
        <Tile x={lerp(sourceX,targetX,move)} y={lerp(sourceY,targetY,move)-Math.sin(Math.PI*move)*38} value={scene.value!} fill={C.green} opacity={p<.38?0:1}/>
      </>}
      {returning&&<Tile x={lerp(50+copyIndex*140,50+(scene.start+copyIndex)*140,copyMove)} y={lerp(440,55,copyMove)-Math.sin(Math.PI*copyMove)*20} value={output[copyIndex]} fill={C.green}/>}
      {(scene.action==='intro'||scene.action==='finish')&&<>
        <Label x={330} y={290} anchor="middle" size={30}>{scene.action==='intro'?'Split → finish children → merge':'2, 3, 5, 7 · sorted'}</Label>
        <Label x={330} y={350} anchor="middle" size={25}>{scene.action==='intro'?'Watch both children side by side.':'Both child merges and the final merge are complete.'}</Label>
        <Label x={330} y={410} anchor="middle" color={C.muted}>{scene.action==='intro'?'Watch copies travel. Values are never swapped.':'Equal fronts? Choose LEFT first for stability.'}</Label>
      </>}
    </svg>
    <div style={{position:'absolute',left:44,right:44,top:868,minHeight:75,fontSize:28,lineHeight:1.35,fontWeight:600,borderTop:`2px solid ${C.ink}`,paddingTop:15}}>{scene.caption}</div>
    <div style={{position:'absolute',left:44,right:44,top:970,background:C.card,border:`1px solid ${C.line}`,padding:'13px 0 15px'}}>
      <div style={{fontSize:18,color:C.muted,padding:'0 18px 10px'}}>{panelLabel}</div>
      {code.map((line,index)=><div key={index} style={{fontFamily:'Consolas, monospace',fontSize:19,lineHeight:'29px',whiteSpace:'pre',padding:'0 15px',background:highlighted.includes(index)?C.blue:'transparent'}}><span style={{display:'inline-block',width:25,color:C.muted}}>{index+1}</span>{line}</div>)}
    </div>
    <div style={{position:'absolute',left:44,right:44,bottom:28,fontSize:17,color:C.muted}}>AI narration: Microsoft Ava · Original instructional animation</div>
    <Html5Audio src={staticFile(scene.audio)}/>
  </AbsoluteFill>;
}
