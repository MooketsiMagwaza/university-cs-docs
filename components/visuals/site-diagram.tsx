'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';

type DiagramNode = { id: string; label: string; shape: 'box' | 'decision' | 'root' };
type DiagramEdge = { from: string; to: string; label?: string; dashed?: boolean };
type PositionedNode = DiagramNode & { x: number; y: number; width: number; height: number };

const NODE_WIDTH = 210;
const NODE_HEIGHT = 72;

function cleanLabel(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '').replace(/<br\s*\/?\s*>/gi, '\n').replace(/\\n/g, '\n');
}
function readNodeToken(token: string): Omit<DiagramNode, 'id'> {
  const body = token.trim();
  if (body.startsWith('{')) return { label: cleanLabel(body.slice(1, -1)), shape: 'decision' };
  if (body.startsWith('((')) return { label: cleanLabel(body.slice(2, -2)), shape: 'root' };
  if (body.startsWith('[')) return { label: cleanLabel(body.slice(1, -1)), shape: 'box' };
  return { label: cleanLabel(body), shape: 'box' };
}

function parseMindmap(lines: string[]) {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const stack: Array<{ indent: number; id: string }> = [];

  lines.slice(1).forEach((rawLine) => {
    if (!rawLine.trim()) return;
    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    const text = rawLine.trim();
    const id = `mind-${nodes.length}`;
    const parsed = readNodeToken(text.startsWith('root') ? text.slice(4) : text);
    nodes.push({ id, ...parsed, shape: text.startsWith('root') ? 'root' : parsed.shape });
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent) edges.push({ from: parent.id, to: id });
    stack.push({ indent, id });
  });

  return { direction: 'LR' as const, nodes, edges };
}

function parseFlowchart(lines: string[]) {
  const direction = lines[0]?.match(/flowchart\s+(LR|TD)/i)?.[1]?.toUpperCase() === 'LR' ? 'LR' : 'TD';
  const nodeMap = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  const nodePattern = /([A-Za-z][\w-]*)(\["[\s\S]*?"\]|\[[^\]]*\]|\{"[\s\S]*?"\}|\{[^}]*\}|\(\([^)]*\)\))/g;
  const nodePrefixPattern = /^([A-Za-z][\w-]*)(\["[\s\S]*?"\]|\[[^\]]*\]|\{"[\s\S]*?"\}|\{[^}]*\}|\(\([^)]*\)\))/;

  const ensureNode = (id: string, token?: string) => {
    const current = nodeMap.get(id);
    if (current && !token) return;
    const parsed = token ? readNodeToken(token) : { label: id, shape: 'box' as const };
    nodeMap.set(id, { id, ...parsed });
  };

  lines.slice(1).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || /^(subgraph|end|direction|style)\b/.test(line)) return;
    for (const match of line.matchAll(nodePattern)) ensureNode(match[1], match[2]);

    const solidIndex = line.indexOf('-->');
    const dashedIndex = line.indexOf('.->');
    const arrowIndex = solidIndex >= 0 ? solidIndex : dashedIndex;
    if (arrowIndex < 0) return;

    const left = line.slice(0, arrowIndex).trim();
    let right = line.slice(arrowIndex + 3).trim();
    const from = left.match(/^([A-Za-z][\w-]*)/)?.[1];
    if (!from) return;

    let label: string | undefined;
    const pipeLabel = right.match(/^\|([^|]+)\|\s*/);
    if (pipeLabel) {
      label = cleanLabel(pipeLabel[1]);
      right = right.slice(pipeLabel[0].length);
    } else {
      const sourceDefinition = left.match(nodePrefixPattern)?.[0] ?? from;
      const decoration = left.slice(sourceDefinition.length).replace(/^[\s.-]+|[\s.-]+$/g, '');
      if (decoration) label = cleanLabel(decoration);
    }

    const to = right.match(/^([A-Za-z][\w-]*)/)?.[1];
    if (!to) return;
    ensureNode(from);
    ensureNode(to);
    edges.push({ from, to, label, dashed: solidIndex < 0 });
  });

  return { direction: direction as 'LR' | 'TD', nodes: [...nodeMap.values()], edges };
}

function layoutDiagram(chart: string) {
  const lines = chart.split(/\r?\n/).filter((line) => line.trim());
  const parsed = lines[0]?.trim().startsWith('mindmap') ? parseMindmap(lines) : parseFlowchart(lines);
  const { nodes, edges, direction } = parsed;
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, [] as string[]]));
  edges.forEach((edge) => {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    outgoing.get(edge.from)?.push(edge.to);
  });

  const depths = new Map<string, number>();
  const queue = nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0).map((node) => node.id);
  if (!queue.length && nodes[0]) queue.push(nodes[0].id);
  queue.forEach((id) => depths.set(id, 0));
  while (queue.length) {
    const id = queue.shift()!;
    const nextDepth = (depths.get(id) ?? 0) + 1;
    outgoing.get(id)?.forEach((target) => {
      if (!depths.has(target)) {
        depths.set(target, nextDepth);
        queue.push(target);
      }
    });
  }
  nodes.forEach((node) => {
    if (!depths.has(node.id)) depths.set(node.id, Math.max(0, ...depths.values()) + 1);
  });

  const levels = new Map<number, DiagramNode[]>();
  nodes.forEach((node) => {
    const depth = depths.get(node.id) ?? 0;
    levels.set(depth, [...(levels.get(depth) ?? []), node]);
  });
  const maxAcross = Math.max(1, ...[...levels.values()].map((level) => level.length));
  const depthCount = Math.max(1, ...levels.keys()) + 1;
  const width = direction === 'LR' ? depthCount * 280 : maxAcross * 250;
  const height = direction === 'LR' ? maxAcross * 110 : depthCount * 125;
  const positioned: PositionedNode[] = [];
  [...levels.entries()].forEach(([depth, level]) => {
    level.forEach((node, index) => {
      if (direction === 'LR') {
        const levelHeight = level.length * 110;
        positioned.push({ ...node, x: 35 + depth * 280, y: (height - levelHeight) / 2 + index * 110 + 19, width: NODE_WIDTH, height: NODE_HEIGHT });
      } else {
        const levelWidth = level.length * 250;
        positioned.push({ ...node, x: (width - levelWidth) / 2 + index * 250 + 20, y: 25 + depth * 125, width: NODE_WIDTH, height: NODE_HEIGHT });
      }
    });
  });
  return { direction, nodes: positioned, edges, width: Math.max(width, 280), height: Math.max(height, 150) };
}

export function SiteDiagram({ chart, caption }: { chart: string; caption?: string }) {
  const markerId = `diagram-arrow-${useId().replace(/:/g, '')}`;
  const diagram = useMemo(() => layoutDiagram(chart.trim()), [chart]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const nodeById = useMemo(() => new Map(diagram.nodes.map((node) => [node.id, node])), [diagram.nodes]);

  const changeZoom = (amount: number) => setScale((current) => Math.min(3, Math.max(0.5, Number((current + amount).toFixed(2)))));
  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - position.x, offsetY: event.clientY - position.y };
    setIsDragging(true);
  };
  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    setPosition({ x: event.clientX - dragRef.current.offsetX, y: event.clientY - dragRef.current.offsetY });
  };
  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setIsDragging(false);
  };
  const zoomWithWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? 0.1 : -0.1);
  };

  useEffect(() => resetView(), [chart]);
  useEffect(() => {
    if (!isFullscreen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsFullscreen(false);
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const controls = (allowFullscreen: boolean) => (
    <div className="flex items-center gap-1 rounded-md border border-fd-border bg-fd-background/95 p-1 text-fd-muted-foreground shadow-sm">
      <button type="button" onClick={() => changeZoom(-0.1)} aria-label="Zoom out diagram" disabled={scale <= 0.5} className="rounded p-1 hover:bg-fd-muted hover:text-fd-foreground disabled:opacity-40"><Minus className="h-3.5 w-3.5" /></button>
      <span className="min-w-10 text-center text-[10px] tabular-nums">{Math.round(scale * 100)}%</span>
      <button type="button" onClick={() => changeZoom(0.1)} aria-label="Zoom in diagram" disabled={scale >= 3} className="rounded p-1 hover:bg-fd-muted hover:text-fd-foreground disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
      <button type="button" onClick={resetView} aria-label="Reset diagram view" className="rounded p-1 hover:bg-fd-muted hover:text-fd-foreground"><RotateCcw className="h-3.5 w-3.5" /></button>
      {allowFullscreen && <button type="button" onClick={() => setIsFullscreen(true)} aria-label="View diagram fullscreen" className="rounded p-1 hover:bg-fd-muted hover:text-fd-foreground"><Maximize2 className="h-3.5 w-3.5" /></button>}
    </div>
  );

  const svg = (fullscreen = false) => (
    <svg viewBox={`0 0 ${diagram.width} ${diagram.height}`} role="img" aria-label={caption ?? 'Course concept diagram'} className={`h-auto w-auto ${fullscreen ? 'max-h-[80vh] max-w-[92vw]' : 'max-h-[560px] max-w-full'} text-fd-muted-foreground ${isDragging ? '' : 'transition-transform duration-150'}`} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>
      <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,4 L0,8 z" className="fill-fd-muted-foreground" /></marker></defs>
      {diagram.edges.map((edge, index) => {
        const from = nodeById.get(edge.from);
        const to = nodeById.get(edge.to);
        if (!from || !to) return null;
        const horizontal = diagram.direction === 'LR';
        const x1 = horizontal ? from.x + from.width : from.x + from.width / 2;
        const y1 = horizontal ? from.y + from.height / 2 : from.y + from.height;
        const x2 = horizontal ? to.x : to.x + to.width / 2;
        const y2 = horizontal ? to.y + to.height / 2 : to.y;
        const path = horizontal ? `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}` : `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
        return <g key={`${edge.from}-${edge.to}-${index}`}><path d={path} fill="none" strokeWidth="2" strokeDasharray={edge.dashed ? '6 5' : undefined} markerEnd={`url(#${markerId})`} className="stroke-fd-muted-foreground/70" />{edge.label && <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}><rect x="-48" y="-11" width="96" height="22" rx="6" className="fill-fd-background stroke-fd-border" /><text textAnchor="middle" dominantBaseline="middle" className="fill-fd-muted-foreground text-[10px]">{edge.label}</text></g>}</g>;
      })}
      {diagram.nodes.map((node) => <g key={node.id} transform={`translate(${node.x}, ${node.y})`}><rect width={node.width} height={node.height} rx={node.shape === 'root' ? 36 : node.shape === 'decision' ? 18 : 12} strokeWidth={node.shape === 'decision' ? 2.5 : 1.5} className={node.shape === 'decision' ? 'fill-fd-primary/10 stroke-fd-primary' : node.shape === 'root' ? 'fill-fd-primary stroke-fd-primary' : 'fill-fd-card stroke-fd-border'} /><foreignObject width={node.width} height={node.height}><div className={`flex h-full items-center justify-center whitespace-pre-wrap px-3 text-center text-[12px] font-medium leading-4 ${node.shape === 'root' ? 'text-fd-primary-foreground' : 'text-fd-foreground'}`}>{node.label}</div></foreignObject></g>)}
    </svg>
  );

  const canvasEvents = { onPointerDown: startDrag, onPointerMove: drag, onPointerUp: stopDrag, onPointerCancel: stopDrag, onWheel: zoomWithWheel };
  return <><figure className="group relative my-6 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-sm not-prose"><div className="absolute right-2 top-2 z-10 opacity-80 transition-opacity group-hover:opacity-100 focus-within:opacity-100">{controls(true)}</div><div className={`flex min-h-[180px] w-full touch-none items-center justify-center overflow-hidden p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} {...canvasEvents}>{svg()}</div>{caption && <figcaption className="border-t border-fd-border bg-fd-muted/20 px-4 py-2 text-center text-xs text-fd-muted-foreground">{caption}</figcaption>}</figure>{isFullscreen && <div role="dialog" aria-modal="true" aria-label="Diagram, fullscreen" className="fixed inset-0 z-50 flex flex-col bg-fd-background/98 backdrop-blur-sm not-prose"><div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-3"><p className="text-sm text-fd-muted-foreground">{caption}</p><div className="flex items-center gap-2">{controls(false)}<button type="button" onClick={() => setIsFullscreen(false)} aria-label="Close fullscreen diagram" className="rounded-md border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground hover:text-fd-foreground"><X className="h-4 w-4" /></button></div></div><div className={`flex flex-1 touch-none items-center justify-center overflow-hidden p-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} {...canvasEvents}>{svg(true)}</div></div>}</>;
}

