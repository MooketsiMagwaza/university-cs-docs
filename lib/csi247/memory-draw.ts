/**
 * Draws one step of a memory diagram as SVG nodes, in the style of the exam reference: a grey Stack and Heap, a name above
 * every dashed box, an address above every heap item, array cells in one dashed strip with their index underneath, objects
 * as solid frames with a label above each field, elbow arrows, old values struck through in red. Everything is positioned by
 * memory-layout.ts and every arrow is routed by memory-route.ts; the geometry is returned too, so a test can check it.
 */
import { cellText, finalState, type MemCell, type MemOptions, type MemScenario, type MemState } from './memory-diagram';
import { CHAR, GAP, layoutOf, layoutStates, type Label, type Layout, type ObjGeom, type Rect } from './memory-layout';
import { createRouter, type Port, type Pt } from './memory-route';

export type SvgNode = { tag: string; attrs: Record<string, string | number>; text?: string; children: SvgNode[] };

/** `pre` is true when the first point is inside the source frame (the edge of a field), so the first segment is not tested. */
export type Arrow = { from: string; to: number; dead: boolean; routed: boolean; pre: boolean; pts: Pt[] };
export type Geometry = {
  /** Every box that holds something: stack variables, object frames. */
  boxes: Array<{ id: string; r: Rect }>;
  labels: Array<{ id: string; r: Rect }>;
  /** What is written in a box, with the box it must fit in. */
  contents: Array<{ id: string; text: Rect; cell: Rect }>;
  arrows: Arrow[];
};
export type Drawing = { nodes: SvgNode[]; width: number; height: number; geom: Geometry };

type ArrowKind = 'next' | 'prev' | 'other';
type Source = { id: string; kind: 'var' | 'arr' | 'obj' | 'node'; cell: MemCell; rect: Rect; frame: Rect; name: string | number; gone: boolean };
type Job = { src: Source; target: number; dead: boolean; starts: Port[]; goals: Port[] };

const GARBAGE = 'garbage';

/** x values on a common lattice (every 6px), so that an arrow leaving the bottom of a cell can meet the top of a box exactly below it. */
const lattice = (lo: number, hi: number, step = 6): number[] => {
  const out: number[] = [];
  for (let x = Math.ceil((lo - 2) / 6) * 6 + 2; x <= hi; x += step) out.push(x);
  return out;
};

/** The pieces of a cell's value: the old values, then the current one. */
function pieces(c: MemCell) {
  const items = c.old.map((t) => ({ t, w: Math.ceil(t.length * CHAR.old), old: true }));
  const cur = cellText(c.v);
  items.push({ t: cur, w: Math.ceil(cur.length * CHAR.val), old: false });
  return items;
}

export function drawState(s: MemState, opts: MemOptions, L: Layout): Drawing {
  const roots: SvgNode[] = [];
  const E = (tag: string, attrs: Record<string, string | number>, parent?: SvgNode | null, text?: string) => {
    const node: SvgNode = { tag, attrs, children: [], ...(text != null ? { text } : {}) };
    (parent ? parent.children : roots).push(node);
    return node;
  };
  const geom: Geometry = { boxes: [], labels: [], contents: [], arrows: [] };

  const present = s.objs.map((o) => ({ o, g: L.objs.get(o.addr) as ObjGeom }));
  const by = new Map(present.map((p) => [p.o.addr, p]));

  // reachability from the stack: anything else is garbage
  const seen = new Set<number>();
  const queue: number[] = [];
  s.vars.forEach((v) => v.v.r != null && queue.push(v.v.r));
  while (queue.length) {
    const a = queue.pop() as number;
    if (seen.has(a) || !by.has(a)) continue;
    seen.add(a);
    (by.get(a) as { o: { cells: MemCell[] } }).o.cells.forEach((c) => c.v.r != null && queue.push(c.v.r));
  }
  const gone = (addr: number) => !seen.has(addr);
  const tagOf = (g: ObjGeom): Label => {
    const y = g.frame.y + g.frame.h + (g.k === 'arr' || g.k === 'node' ? 38 : 17);
    const w = Math.ceil(GARBAGE.length * CHAR.type);
    return { x: g.frame.x, y, text: GARBAGE, cls: 'gc', r: { x: g.frame.x, y: y - 12, w, h: 16 } };
  };

  const text = (parent: SvgNode | null, l: Label, id: string) => {
    E('text', { x: l.x, y: l.y, class: l.cls, ...(l.anchor ? { 'text-anchor': l.anchor } : {}) }, parent, l.text);
    if (l.cls !== 'hd') geom.labels.push({ id, r: l.r });
  };

  /** A value, with older values crossed out in front of it. */
  const content = (g: SvgNode, c: MemCell, r: Rect, id: string) => {
    const items = pieces(c);
    const total = items.reduce((a, b) => a + b.w, 0) + GAP * (items.length - 1);
    let x = r.x + r.w / 2 - total / 2;
    const cy = r.y + r.h / 2;
    geom.contents.push({ id, text: { x, y: cy - 8, w: total, h: 16 }, cell: r });
    items.forEach((it, i) => {
      const last = i === items.length - 1;
      E('text', { x, y: cy + 4.5, class: 'vl' + (last ? (items.length > 1 ? ' nw' : '') : ' old') }, g, it.t);
      if (!last) E('line', { x1: x - 3, y1: cy + 6, x2: x + it.w + 3, y2: cy - 7, class: 'st' }, g);
      x += it.w + GAP;
    });
  };

  // ---------- boxes ----------
  text(null, L.stack, 'heading');
  text(null, L.heap, 'heading');
  const obstacles: Rect[] = [L.stack.r, L.heap.r];
  const sources: Source[] = [];

  s.vars.forEach((v) => {
    const V = L.vars.get(v.n);
    if (!V) return;
    const g = E('g', {});
    text(g, V.label, `var ${v.n}`);
    E('rect', { x: V.box.x, y: V.box.y, width: V.box.w, height: V.box.h, class: 'cb' + (v.fr ? ' fr' : '') }, g);
    content(g, v, V.box, `var ${v.n}`);
    geom.boxes.push({ id: `var ${v.n}`, r: V.box });
    obstacles.push(V.box, V.label.r);
    sources.push({ id: `var ${v.n}`, kind: 'var', cell: v, rect: V.box, frame: V.box, name: v.n, gone: false });
  });

  present.forEach(({ o, g: G }) => {
    const dead = gone(o.addr);
    const g = E('g', { class: dead ? 'gone' : '' });
    const f = G.frame;
    G.head.forEach((l) => text(g, l, `address ${o.addr}`));
    obstacles.push(f, ...G.head.map((l) => l.r), ...G.labels.map((l) => l.r));
    if (dead) {
      const tag = tagOf(G);
      text(g, tag, `garbage tag ${o.addr}`);
      obstacles.push(tag.r);
    }
    geom.boxes.push({ id: `object ${o.addr}`, r: f });

    if (o.k === 'obj') {
      E('rect', { x: f.x, y: f.y, width: f.w, height: f.h, rx: 6, class: 'ob' + (o.fr ? ' fr' : '') }, g);
    } else if (o.k === 'arr' || o.k === 'node') {
      G.cells.forEach((r, i) => (o.cells[i].fr || o.fr) && E('rect', { x: r.x, y: r.y, width: r.w, height: r.h, class: 'cf' }, g));
      E('rect', { x: f.x, y: f.y, width: f.w, height: f.h, class: o.k === 'arr' ? 'cb strip' : 'ob' }, g);
      G.cells.slice(1).forEach((r) => E('line', { x1: r.x, y1: r.y, x2: r.x, y2: r.y + r.h, class: 'dv' }, g));
    }
    G.cells.forEach((r, i) => {
      const c = o.cells[i];
      if (o.k === 'obj') E('rect', { x: r.x, y: r.y, width: r.w, height: r.h, class: 'cb' + (c.fr || o.fr ? ' fr' : '') }, g);
      if (o.k === 'val') E('rect', { x: r.x, y: r.y, width: r.w, height: r.h, class: 'cb' + (o.fr ? ' fr' : '') }, g);
      content(g, c, r, `object ${o.addr} cell ${i}`);
      sources.push({ id: `object ${o.addr} cell ${c.n}`, kind: o.k === 'val' ? 'obj' : o.k, cell: c, rect: r, frame: f, name: c.n, gone: dead });
    });
    if (o.k === 'obj') G.labels.forEach((l) => text(g, l, `field ${o.addr} ${l.text}`));
    if (o.k === 'arr' || o.k === 'node') G.labels.forEach((l) => text(g, l, `index ${o.addr} ${l.text}`));
  });

  // ---------- arrows ----------
  const jobs: Job[] = [];
  const kindOf = (src: Source): ArrowKind => (src.kind === 'node' && src.name === 'next' ? 'next' : src.kind === 'node' && src.name === 'prev' ? 'prev' : 'other');

  const sourcePorts = (src: Source, off: number): Port[] => {
    const r = src.rect;
    const f = src.frame;
    const cy = r.y + r.h / 2;
    const right = (y: number, pen: number): Port => ({ x: f.x + f.w, y, dir: 'E', pen });
    const left = (y: number, pen: number): Port => ({ x: f.x, y, dir: 'W', pen });
    const bottom = (x: number, pen: number): Port => ({ x, y: r.y + r.h, dir: 'S', pen });
    const dead = off < 0;
    const xb = dead ? r.x + 8 : r.x + r.w - 8;
    switch (src.kind) {
      case 'var':
        return [{ x: r.x + r.w, y: cy + off, dir: 'E', pen: 0 }, bottom(r.x + r.w / 2 + off, 40), { x: r.x + r.w / 2 + off, y: r.y, dir: 'N', pen: 40 }];
      case 'arr': {
        const half = Math.ceil((`[${String(src.name)}]`.length * CHAR.index) / 2) + 4;
        const zones = [
          [r.x + 6, r.x + r.w / 2 - half],
          [r.x + r.w / 2 + half, r.x + r.w - 6],
        ];
        const ports: Port[] = [];
        for (const [lo, hi] of zones) {
          for (const x of lattice(lo, hi)) {
            const toward = dead ? x - r.x : r.x + r.w - x; // new arrows like the right of the cell, old ones the left
            ports.push({ x, y: r.y + r.h, dir: 'S', pen: toward * 0.03 });
            ports.push({ x, y: r.y, dir: 'N', pen: 30 + toward * 0.03 });
          }
        }
        ports.push({ x: r.x + r.w, y: cy + off, dir: 'E', pen: 24 });
        return ports;
      }
      case 'obj':
        return [{ ...right(cy + off, 0), pre: { x: r.x + r.w, y: cy + off } }, { ...left(cy + off, 50), pre: { x: r.x, y: cy + off } }];
      default:
        if (src.name === 'next') return [right(r.y + 13 + (dead ? 14 : 0), 0), bottom(xb, 30)];
        if (src.name === 'prev') return [left(r.y + 27 - (dead ? 14 : 0), 0), bottom(r.x + 8, 30)];
        return [bottom(xb, 0)];
    }
  };

  const targetPorts = (T: ObjGeom, kind: ArrowKind, tagged: boolean, above: boolean, below: boolean): Port[] => {
    const f = T.frame;
    const headRight = Math.max(...T.head.map((l) => l.r.x + l.r.w)) + 8;
    const out: Port[] = [];
    const bias = above ? 26 : 0; // an arrow that comes from above should land on the top edge
    const W = (y: number, pen: number) => out.push({ x: f.x, y, dir: 'W', pen: pen + bias });
    const Ea = (y: number, pen: number) => out.push({ x: f.x + f.w, y, dir: 'E', pen: pen + bias });
    const S = (x: number, pen: number) => {
      const clear = !tagged || x > f.x + Math.ceil(GARBAGE.length * CHAR.type) + 8;
      if (clear) out.push({ x, y: f.y + f.h, dir: 'S', pen: below ? Math.max(0, pen - 26) : pen });
    };
    const topPorts = (lo: number, hi: number, pen: number) => lattice(Math.max(lo, headRight), hi).forEach((x) => out.push({ x, y: f.y, dir: 'N', pen: pen + Math.abs(x - (lo + hi) / 2) * 0.02 }));
    if (T.k === 'arr') {
      W(f.y + 20, 0);
      T.cells.forEach((c) => topPorts(c.x + 8, c.x + c.w - 8, 14));
      Ea(f.y + 20, 50);
    } else if (T.k === 'val') {
      W(f.y + 20, 8);
      topPorts(f.x + 6, f.x + f.w - 6, 0);
      lattice(f.x + 6, f.x + f.w - 6).forEach((x) => S(x, 20));
      Ea(f.y + 20, 50);
    } else if (T.k === 'node') {
      W(f.y + 13, kind === 'next' ? 0 : 6);
      W(f.y + 20, kind === 'other' ? 0 : 5);
      W(f.y + 27, kind === 'prev' ? 7 : 9);
      Ea(f.y + 27, kind === 'prev' ? 0 : 44);
      Ea(f.y + 20, 48);
      T.cells.forEach((c, i) => {
        topPorts(c.x + 6, c.x + c.w - 6, 16);
        if (i > 0) S(c.x, 30);
      });
      S(f.x + f.w - 12, 34);
    } else {
      T.cells.forEach((c, i) => W(c.y + c.h / 2, i * 2));
      topPorts(f.x + 12, f.x + f.w - 10, 14);
      T.cells.forEach((c) => Ea(c.y + c.h / 2, 42));
      for (let x = f.x + 20; x <= f.x + f.w - 10; x += 40) S(x, 48);
    }
    return out;
  };

  const showDead = opts.dead !== false;
  sources.forEach((src) => {
    const c = src.cell;
    const both = c.v.r != null && c.oldR.length > 0 && showDead;
    const newOff = both ? 8 : 0;
    const make = (target: number, dead: boolean, off: number) => {
      const T = by.get(target);
      if (!T) return;
      jobs.push({ src, target, dead, starts: sourcePorts(src, off), goals: targetPorts(T.g, kindOf(src), gone(target), src.rect.y + src.rect.h / 2 < T.g.frame.y - 20, src.rect.y + src.rect.h / 2 > T.g.frame.y + T.g.frame.h + 20) });
    };
    if (c.v.r != null) make(c.v.r, false, newOff);
    if (showDead && !src.gone && c.oldR.length) make(c.oldR[c.oldR.length - 1], true, -8); // the latest replaced arrow is crossed out; older ones are only struck through in the box
  });

  if (jobs.length) {
    const allPorts: Pt[] = jobs.flatMap((j) => [...j.starts, ...j.goals]);
    const router = createRouter(L.width, L.height, obstacles, allPorts);
    const dist = (j: Job) => {
      const s0 = j.starts[0];
      const t = (by.get(j.target) as { g: ObjGeom }).g.frame;
      return Math.abs(s0.x - (t.x + t.w / 2)) + Math.abs(s0.y - (t.y + t.h / 2));
    };
    // new arrows are routed before old ones, short ones before long ones
    const order = jobs.slice().sort((a, b) => Number(a.dead) - Number(b.dead) || dist(a) - dist(b));
    const arrows = E('g', {});
    const routed = new Map<Job, ReturnType<typeof router.route>>();
    order.forEach((j) => routed.set(j, router.route(j.starts, j.goals)));
    jobs.forEach((j) => {
      const hit = routed.get(j) ?? null;
      const ok = hit != null;
      let pts: Pt[];
      if (hit) pts = hit.path;
      else {
        const T = (by.get(j.target) as { g: ObjGeom }).g.frame;
        pts = [{ x: j.starts[0].x, y: j.starts[0].y }, { x: T.x, y: T.y + 20 }];
      }
      const full = hit?.start.pre ? [hit.start.pre, ...pts] : pts;
      const d = full.map((p, i) => `${i ? 'L' : 'M'}${Math.round(p.x * 10) / 10} ${Math.round(p.y * 10) / 10}`).join('');
      const fresh = !j.dead && j.src.cell.fr;
      const cls = 'ar' + (j.dead ? ' dead' : fresh ? ' fr' : '') + (j.src.gone ? ' gone' : '');
      E('path', { d, class: cls, 'marker-end': j.dead ? 'url(#mD)' : fresh ? 'url(#mB)' : 'url(#mA)' }, arrows);
      if (j.dead) {
        // a red cross on the old arrow, just outside the box it leaves
        const a = pts[0];
        const b = pts[1] ?? a;
        const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
        const at = Math.min(22, Math.max(8, len / 2));
        const ux = Math.sign(b.x - a.x);
        const uy = Math.sign(b.y - a.y);
        const kx = a.x + ux * at;
        const ky = a.y + uy * at;
        E('path', { d: `M${kx - 5} ${ky - 5}L${kx + 5} ${ky + 5}M${kx + 5} ${ky - 5}L${kx - 5} ${ky + 5}`, class: 'xx' }, arrows);
      }
      geom.arrows.push({ from: j.src.id, to: j.target, dead: j.dead, routed: ok, pre: full !== pts, pts: full });
    });
  }

  return { nodes: roots, width: L.width, height: L.height, geom };
}

/** One state drawn on its own, with a layout made from just that state. */
export function drawDiagram(s: MemState, opts: MemOptions = {}): Drawing {
  return drawState(s, opts, layoutStates([s]));
}

/** Step `index` of a scenario, drawn with the layout of the whole scenario so that nothing moves between steps. */
export function drawStep(sc: MemScenario, index: number): Drawing {
  return drawState(sc.steps[index].s, sc.opts, layoutOf(sc));
}

/** The finished diagram of a scenario. */
export function drawFinal(sc: MemScenario): Drawing {
  return drawState(finalState(sc), sc.opts, layoutOf(sc));
}

