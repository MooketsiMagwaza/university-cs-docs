/**
 * Where everything goes in a memory diagram. The layout is worked out once for a whole scenario, from every step at once, so
 * that a box is as wide as the widest thing it ever holds (a crossed-out value and its replacement), nothing moves when the
 * reader steps forward, and the picture is the same size at every step. Positions come from placement rules (see `Place`),
 * never from pixels written by hand.
 */
import { cellText, type MemCell, type MemObj, type MemScenario, type MemState, type Place } from './memory-diagram';

export type Rect = { x: number; y: number; w: number; h: number };
export type Label = { x: number; y: number; text: string; cls: string; anchor?: 'middle'; r: Rect };

/** Width of one character: values at 13px, crossed-out values at 11.5px, names and addresses, types, array indexes. */
export const CHAR = { val: 7.8, old: 6.9, name: 7.8, addr: 7.6, type: 6.6, index: 6.6 } as const;
export const H = 40; // height of a box
export const FIELD_PITCH = 64;
/** Space between a crossed-out value and the next, and the padding left and right of a cell's contents. */
export const GAP = 8;
export const PAD = 12;
const MIN_VAR = 96;
const MIN_CELL = 52;
const MIN_VAL = 56;
const MIN_OBJ = 170;
const STACK_X = 20;
const HEAP_GUTTER = 72;
const TOP = 48;
const VAR_PITCH = 80;

export type ObjGeom = { addr: number; k: MemObj['k']; t?: string; frame: Rect; cells: Rect[]; labels: Label[]; head: Label[] };
export type VarGeom = { n: string; box: Rect; label: Label };
export type Layout = {
  width: number;
  height: number;
  stack: Label;
  heap: Label;
  vars: Map<string, VarGeom>;
  objs: Map<number, ObjGeom>;
};

const label = (x: number, y: number, text: string, cls: string, cw: number, anchor?: 'middle'): Label => {
  const w = Math.ceil(text.length * cw);
  return { x, y, text, cls, ...(anchor ? { anchor } : {}), r: { x: anchor === 'middle' ? x - w / 2 : x, y: y - 12, w, h: 16 } };
};

/** The width a cell needs for its value and every value crossed out in front of it. */
export function cellNeed(c: MemCell): number {
  const items = c.old.length + 1;
  const text = c.old.reduce((a, t) => a + Math.ceil(t.length * CHAR.old), 0) + Math.ceil(cellText(c.v).length * CHAR.val);
  return text + GAP * (items - 1) + PAD;
}

type UObj = { addr: number; k: MemObj['k']; at: Place; t?: string; cw?: number; w?: number; names: Array<string | number>; need: number[] };
type UVar = { n: string; t?: string; at?: number | false; w?: number; need: number; firstRef?: number; from: number; to: number };

type Size = { w: number; h: number; cells: Rect[]; below: number };

function sizeOf(u: UObj): Size {
  const n = u.need.length;
  if (u.k === 'arr') {
    const cw = Math.max(u.cw ?? MIN_CELL, ...u.need);
    return { w: cw * n, h: H, cells: u.need.map((_, i) => ({ x: i * cw, y: 0, w: cw, h: H })), below: 24 };
  }
  if (u.k === 'node') {
    const ws = u.need.map((need) => Math.max(u.cw ?? MIN_CELL, need));
    let x = 0;
    const cells = ws.map((w) => {
      const r = { x, y: 0, w, h: H };
      x += w;
      return r;
    });
    return { w: x, h: H, cells, below: 24 };
  }
  if (u.k === 'val') {
    const w = Math.max(u.w ?? 0, MIN_VAL, u.need[0] + 12);
    return { w, h: H, cells: [{ x: 0, y: 0, w, h: H }], below: 0 };
  }
  const names = Math.max(0, ...u.names.map((s) => String(s).length * CHAR.name));
  const w = Math.ceil(Math.max(u.w ?? MIN_OBJ, MIN_OBJ, 32 + Math.max(...u.need), names + 32));
  return {
    w,
    h: 30 + n * FIELD_PITCH,
    cells: u.need.map((_, i) => ({ x: 16, y: 36 + i * FIELD_PITCH, w: w - 32, h: H })),
    below: 0,
  };
}

function union(states: MemState[]) {
  const objs = new Map<number, UObj>();
  const vars = new Map<string, UVar>();
  states.forEach((s, step) => {
    for (const o of s.objs) {
      let u = objs.get(o.addr);
      if (!u) {
        if (!o.at) throw new Error(`memory diagram: object ${o.addr} has no placement`);
        u = { addr: o.addr, k: o.k, at: o.at, t: o.t, cw: o.cw, w: o.w, names: o.cells.map((c) => c.n), need: o.cells.map(() => 0) };
        objs.set(o.addr, u);
      }
      o.cells.forEach((c, i) => (u!.need[i] = Math.max(u!.need[i], o.k === 'val' ? Math.ceil(String(cellText(c.v)).length * CHAR.val) + PAD : cellNeed(c))));
    }
    for (const v of s.vars) {
      let u = vars.get(v.n);
      if (!u) {
        u = { n: v.n, t: v.t, at: v.at, w: v.w, need: 0, from: step, to: step };
        vars.set(v.n, u);
      }
      u.to = step;
      u.need = Math.max(u.need, cellNeed(v));
      if (u.firstRef == null && v.v.r != null) u.firstRef = v.v.r;
    }
  });
  return { objs, vars };
}

export function layoutStates(states: MemState[]): Layout {
  const { objs: uobjs, vars: uvars } = union(states);
  const sizes = new Map<number, Size>();
  uobjs.forEach((u, a) => sizes.set(a, sizeOf(u)));

  // heap positions, relative to the top left of the heap area
  const rel = new Map<number, { x: number; y: number }>();
  const resolve = (addr: number, path: number[]): { x: number; y: number } => {
    const done = rel.get(addr);
    if (done) return done;
    const u = uobjs.get(addr);
    if (!u) throw new Error(`memory diagram: a placement refers to ${addr}, which is never created`);
    if (path.includes(addr)) throw new Error(`memory diagram: placements of ${path.concat(addr).join(' -> ')} refer to each other`);
    const me = sizes.get(addr) as Size;
    const at = u.at;
    let p: { x: number; y: number };
    if ('right' in at) {
      const a = resolve(at.right, path.concat(addr));
      p = { x: a.x + (sizes.get(at.right) as Size).w + (at.gap ?? 70), y: a.y + (at.dy ?? 0) };
    } else if ('below' in at) {
      const a = resolve(at.below, path.concat(addr));
      const as = sizes.get(at.below) as Size;
      const au = uobjs.get(at.below) as UObj;
      let x = a.x + (at.dx ?? 0);
      if (at.slot != null) {
        const i = typeof at.slot === 'number' ? at.slot : au.names.indexOf(at.slot);
        const c = as.cells[i];
        if (!c) throw new Error(`memory diagram: ${at.below} has no slot ${at.slot}`);
        x = a.x + c.x + c.w / 2 - me.w / 2 + (at.dx ?? 0);
      }
      p = { x, y: a.y + as.h + as.below + (at.gap ?? 52) };
    } else {
      p = { x: at.x, y: at.y };
    }
    rel.set(addr, p);
    return p;
  };
  uobjs.forEach((_, a) => resolve(a, []));

  // the stack column
  const varList = [...uvars.values()];
  const varW = (u: UVar) => Math.max(u.w ?? 0, MIN_VAR, u.need);
  const stackW = Math.max(MIN_VAR, ...varList.map((u) => Math.max(varW(u), Math.ceil(((u.t ? u.t.length + 1 : 0) + u.n.length) * CHAR.name))));
  const X0 = varList.length ? STACK_X + stackW + HEAP_GUTTER : STACK_X;

  const objs = new Map<number, ObjGeom>();
  uobjs.forEach((u, addr) => {
    const p = rel.get(addr) as { x: number; y: number };
    const s = sizes.get(addr) as Size;
    const frame: Rect = { x: X0 + p.x, y: TOP + p.y, w: s.w, h: s.h };
    const cells = s.cells.map((c) => ({ x: frame.x + c.x, y: frame.y + c.y, w: c.w, h: c.h }));
    const head: Label[] = [];
    const ad = label(frame.x, frame.y - 8, String(addr), 'ad', CHAR.addr);
    head.push(ad);
    if (u.t) head.push(label(frame.x + ad.r.w + 8, frame.y - 8, u.t, 'ty', CHAR.type));
    const labels: Label[] = [];
    if (u.k === 'obj') cells.forEach((c, i) => labels.push(label(c.x, c.y - 7, String(u.names[i]), 'fl', CHAR.name)));
    if (u.k === 'arr') cells.forEach((c, i) => labels.push(label(c.x + c.w / 2, c.y + c.h + 16, `[${i}]`, 'ix', CHAR.index, 'middle')));
    if (u.k === 'node') cells.forEach((c, i) => labels.push(label(c.x + c.w / 2, c.y + c.h + 16, String(u.names[i]), 'ix', CHAR.index, 'middle')));
    objs.set(addr, { addr, k: u.k, t: u.t, frame, cells, labels, head });
  });

  // stack variables line up with the object they first point at; a variable takes the first free place, and may reuse the
  // place of one that has gone out of scope by then
  const vars = new Map<string, VarGeom>();
  const placed: Array<{ u: UVar; y: number }> = [];
  varList.forEach((u) => {
    const target = u.at === false ? undefined : (u.at ?? u.firstRef);
    const t = target != null ? objs.get(target) : undefined;
    let y = t ? Math.max(TOP, t.frame.y + (t.k === 'obj' ? 36 : 0)) : TOP;
    for (;;) {
      const clash = placed.find((p) => p.u.from <= u.to && u.from <= p.u.to && Math.abs(p.y - y) < VAR_PITCH);
      if (!clash) break;
      y = clash.y + VAR_PITCH;
    }
    placed.push({ u, y });
    const box: Rect = { x: STACK_X, y, w: varW(u), h: H };
    vars.set(u.n, { n: u.n, box, label: label(box.x, box.y - 7, (u.t ? u.t + ' ' : '') + u.n, 'vn', CHAR.name) });
  });

  let width = 0;
  let height = 0;
  const grow = (r: Rect) => {
    width = Math.max(width, r.x + r.w);
    height = Math.max(height, r.y + r.h);
  };
  vars.forEach((v) => {
    grow(v.box);
    grow(v.label.r);
  });
  objs.forEach((o) => {
    grow(o.frame);
    o.labels.forEach((l) => grow(l.r));
    o.head.forEach((l) => grow(l.r));
    // room for the word "garbage" under the object, in case nothing points at it any more
    grow({ x: o.frame.x, y: o.frame.y + o.frame.h + (o.k === 'arr' || o.k === 'node' ? 38 : 17) + 4, w: 50, h: 0 });
  });

  return {
    width: Math.ceil(width + 16),
    height: Math.ceil(height + 16),
    stack: label(STACK_X, 20, 'Stack', 'hd', CHAR.name),
    heap: label(X0, 20, 'Heap', 'hd', CHAR.name),
    vars,
    objs,
  };
}

const cache = new WeakMap<MemScenario, Layout>();

/** The layout of a whole scenario, worked out from every step and remembered. */
export function layoutOf(sc: MemScenario): Layout {
  let l = cache.get(sc);
  if (!l) {
    l = layoutStates(sc.steps.map((s) => s.s));
    cache.set(sc, l);
  }
  return l;
}
