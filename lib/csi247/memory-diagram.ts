/**
 * Memory diagrams for CSI247: a stack on the left, a heap on the right, every variable a box, every reference an address
 * with an arrow, and old values crossed out instead of erased (the exam drawing rules, written up in
 * content/docs/sem3/csi247/06-object-oriented-programming/notes/drawing-memory-diagrams.mdx).
 *
 * A scenario is built with a small builder, one `snap` per line of code, so the stepper can show the diagram after each
 * line. `drawDiagram` turns one snapshot into SVG nodes (positions, arrows, crossed-out values, unreachable objects), and
 * `components/interactive/memory-diagram.tsx` renders them. Everything here is plain data and arithmetic, so it also runs
 * under node (`npm run test:memory-diagram`).
 */

export type MemValue = { t?: string; r?: number };

export type MemCell = {
  n: string | number;
  v: MemValue;
  old: string[];
  oldR: number[];
  fr: number;
};

export type MemVar = MemCell & { t?: string; y?: number; w?: number; via?: string };

export type MemObj = {
  addr: number;
  k: 'arr' | 'obj' | 'val' | 'node';
  fr: number;
  x: number;
  y: number;
  cw?: number;
  w?: number;
  t?: string;
  via?: string;
  cells: MemCell[];
};

export type MemState = { vars: MemVar[]; objs: MemObj[] };
export type MemStep = { line: number; note: string; s: MemState };
export type MemOptions = { dead?: boolean };
export type MemScenario = { title: string; code: string[]; steps: MemStep[]; opts: MemOptions };

type Input = string | number | MemValue;
type Extra = Record<string, number | string | MemValue | undefined>;

const MW = 7.8; // width of one monospace character at 13px
const VW = 112; // width of a stack box
const H = 40; // height of a box

const nv = (v: Input): MemValue => (v !== null && typeof v === 'object' ? v : { t: String(v) });
const dt = (v: MemValue) => (v.r != null ? String(v.r) : (v.t ?? ''));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

export function memoryBuilder() {
  const S: MemState = { vars: [], objs: [] };
  const steps: MemStep[] = [];
  let code: string[] = [];
  let opts: MemOptions = {};

  const find = (addr: number) => {
    const o = S.objs.find((x) => x.addr === addr);
    if (!o) throw new Error(`memory diagram: no object at ${addr}`);
    return o;
  };
  const slot = (addr: number, key: string | number) => {
    const o = find(addr);
    const c = o.k === 'arr' ? o.cells[Number(key)] : o.cells.find((x) => x.n === key);
    if (!c) throw new Error(`memory diagram: no slot ${key} at ${addr}`);
    return c;
  };
  const cell = (n: string | number, v: Input): MemCell => ({ n, v: nv(v), old: [], oldR: [], fr: 0 });
  const upd = (c: MemCell, v: Input, keep?: boolean) => {
    const value = nv(v);
    if (keep !== false) {
      c.old.push(dt(c.v));
      if (c.v.r != null) c.oldR.push(c.v.r);
    }
    c.v = value;
    c.fr = 1;
  };

  const B = {
    opt(o: MemOptions) {
      opts = o;
      return B;
    },
    code(lines: string[]) {
      code = lines;
      return B;
    },
    v(n: string, val: Input, o?: Extra) {
      S.vars.push({ ...cell(n, val), fr: 1, ...(o as object) } as MemVar);
      return B;
    },
    sv(n: string, val: Input, keep?: boolean) {
      const found = S.vars.find((x) => x.n === n);
      if (!found) throw new Error(`memory diagram: no variable ${n}`);
      upd(found, val, keep);
      return B;
    },
    unv(n: string) {
      S.vars = S.vars.filter((x) => x.n !== n);
      return B;
    },
    arr(addr: number, n: number, o: Extra = {}) {
      S.objs.push({
        addr,
        k: 'arr',
        fr: 1,
        cw: 66,
        x: 0,
        y: 0,
        cells: Array.from({ length: n }, (_, i) => cell(i, o.fill == null ? 'null' : (o.fill as Input))),
        ...(o as object),
      } as MemObj);
      return B;
    },
    obj(addr: number, fields: Array<[string, Input]>, o?: Extra) {
      S.objs.push({ addr, k: 'obj', fr: 1, w: 210, x: 0, y: 0, cells: fields.map(([n, v]) => cell(n, v)), ...(o as object) } as MemObj);
      return B;
    },
    val(addr: number, text: string, o?: Extra) {
      S.objs.push({
        addr,
        k: 'val',
        fr: 1,
        x: 0,
        y: 0,
        w: Math.max(84, text.length * MW + 28),
        cells: [cell('', text)],
        ...(o as object),
      } as MemObj);
      return B;
    },
    node(addr: number, data: Input, next: Input, o: Extra = {}) {
      const cells: MemCell[] = [];
      if ('prev' in o) cells.push(cell('prev', o.prev as Input));
      cells.push(cell('data', data), cell('next', next));
      S.objs.push({ addr, k: 'node', fr: 1, cw: 60, x: 0, y: 0, cells, ...(o as object) } as MemObj);
      return B;
    },
    set(addr: number, key: string | number, val: Input, keep?: boolean) {
      upd(slot(addr, key), val, keep);
      return B;
    },
    /** Forget the crossed-out history, so a later step is easier to read. */
    clean() {
      [...S.vars, ...S.objs.flatMap((o) => o.cells)].forEach((c) => {
        c.old = [];
        c.oldR = [];
      });
      return B;
    },
    drop(addr: number) {
      S.objs = S.objs.filter((o) => o.addr !== addr);
      return B;
    },
    snap(line: number, note: string) {
      steps.push({ line, note, s: clone(S) });
      S.vars.forEach((c) => (c.fr = 0));
      S.objs.forEach((o) => {
        o.fr = 0;
        o.cells.forEach((c) => (c.fr = 0));
      });
      return B;
    },
    done(title: string): MemScenario {
      return { title, code, steps, opts };
    },
  };
  return B;
}

/* ───────── geometry ───────── */

type Rect = { x: number; y: number; w: number; h: number };
type LaidOut = { vars: Array<{ c: MemVar; i: number; r: Rect }>; objs: Array<{ o: MemObj; fr: Rect; cells: Array<{ c: MemCell; r: Rect }> }> };

function layout(s: MemState): LaidOut {
  const L: LaidOut = { vars: [], objs: [] };
  s.vars.forEach((v, i) => {
    const y = v.y != null ? v.y : 44 + i * 80;
    L.vars.push({ c: v, i, r: { x: 20, y, w: v.w || VW, h: H } });
  });
  s.objs.forEach((o) => {
    let fr: Rect;
    let cells: Array<{ c: MemCell; r: Rect }>;
    if (o.k === 'arr' || o.k === 'node') {
      const cw = o.cw ?? 60;
      cells = o.cells.map((c, i) => ({ c, r: { x: o.x + i * cw, y: o.y, w: cw, h: H } }));
      fr = { x: o.x, y: o.y, w: cw * o.cells.length, h: H };
    } else if (o.k === 'val') {
      cells = [{ c: o.cells[0], r: { x: o.x, y: o.y, w: o.w ?? 84, h: H } }];
      fr = cells[0].r;
    } else {
      const w = o.w ?? 210;
      cells = o.cells.map((c, i) => ({ c, r: { x: o.x + 16, y: o.y + 36 + i * 64, w: w - 32, h: 38 } }));
      fr = { x: o.x, y: o.y, w, h: 30 + o.cells.length * 64 };
    }
    L.objs.push({ o, fr, cells });
  });
  return L;
}

/** An orthogonal route from the source box to the target frame. Returns the path and where to put the cross on it. */
function route(S: Rect, T: Rect, kind: number | null, dy: number, down: boolean): [string, number, number] {
  const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  let forceDown = false;
  if (down && T.y >= S.y + S.h) forceDown = true;
  let d: string;
  let kx: number;
  let ky: number;
  if (!forceDown && T.x >= S.x + S.w - 2) {
    const sx = S.x + S.w;
    const sy = S.y + S.h / 2 + dy;
    const tx = T.x;
    const ty = cl(sy, T.y + 10, T.y + T.h - 10);
    const mx = kind != null ? sx + 16 + kind * 14 : sx + Math.max(16, (tx - sx) / 2);
    d = Math.abs(ty - sy) < 1 ? `M${sx} ${sy}H${tx - 1}` : `M${sx} ${sy}H${mx}V${ty}H${tx - 1}`;
    kx = sx + 12;
    ky = sy;
  } else if (!forceDown && T.x + T.w <= S.x + 2) {
    const sx = S.x;
    const sy = S.y + S.h / 2 + dy;
    const tx = T.x + T.w;
    const ty = cl(sy, T.y + 10, T.y + T.h - 10);
    const mx = sx - Math.max(16, (sx - tx) / 2);
    d = Math.abs(ty - sy) < 1 ? `M${sx} ${sy}H${tx + 1}` : `M${sx} ${sy}H${mx}V${ty}H${tx + 1}`;
    kx = sx - 12;
    ky = sy;
  } else if (T.y >= S.y + S.h) {
    const sx = S.x + S.w / 2 + dy;
    const sy = S.y + S.h;
    const tx = cl(sx, T.x + 12, T.x + T.w - 12);
    const ty = T.y;
    const my = sy + Math.max(14, (ty - sy) / 2);
    d = Math.abs(tx - sx) < 1 ? `M${sx} ${sy}V${ty - 1}` : `M${sx} ${sy}V${my}H${tx}V${ty - 1}`;
    kx = sx;
    ky = sy + 11;
  } else {
    const sx = S.x + S.w / 2 + dy;
    const sy = S.y;
    const tx = cl(sx, T.x + 12, T.x + T.w - 12);
    const ty = T.y + T.h;
    const my = sy - Math.max(14, (sy - ty) / 2);
    d = Math.abs(tx - sx) < 1 ? `M${sx} ${sy}V${ty + 1}` : `M${sx} ${sy}V${my}H${tx}V${ty + 1}`;
    kx = sx;
    ky = sy - 11;
  }
  return [d, kx, ky];
}

/* ───────── drawing ───────── */

export type SvgNode = { tag: string; attrs: Record<string, string | number>; text?: string; children: SvgNode[] };
export type Drawing = { nodes: SvgNode[]; width: number; height: number };

export function drawDiagram(s: MemState, opts: MemOptions = {}): Drawing {
  const roots: SvgNode[] = [];
  const E = (tag: string, attrs: Record<string, string | number>, parent?: SvgNode | null, text?: string) => {
    const node: SvgNode = { tag, attrs, children: [], ...(text != null ? { text } : {}) };
    (parent ? parent.children : roots).push(node);
    return node;
  };

  const L = layout(s);
  const by: Record<number, LaidOut['objs'][number]> = {};
  L.objs.forEach((O) => (by[O.o.addr] = O));

  // reachability from the stack: anything else is garbage
  const seen = new Set<number>();
  const queue: number[] = [];
  L.vars.forEach((V) => {
    if (V.c.v.r != null) queue.push(V.c.v.r);
  });
  while (queue.length) {
    const a = queue.pop() as number;
    if (seen.has(a) || !by[a]) continue;
    seen.add(a);
    by[a].o.cells.forEach((c) => {
      if (c.v.r != null) queue.push(c.v.r);
    });
  }

  let W = 0;
  let Hh = 0;
  const grow = (x: number, y: number) => {
    W = Math.max(W, x);
    Hh = Math.max(Hh, y);
  };

  E('text', { x: 20, y: 16, class: 'hd' }, null, 'STACK');
  const hx = L.objs.length ? Math.min(...L.objs.map((O) => O.fr.x)) : 220;
  E('text', { x: hx, y: 16, class: 'hd' }, null, 'HEAP');

  /** A value, with older values crossed out in front of it. */
  const content = (g: SvgNode, c: MemCell, r: Rect) => {
    const items = c.old.concat(dt(c.v));
    const ws = items.map((t) => t.length * MW);
    const total = ws.reduce((a, b) => a + b, 0) + 10 * (items.length - 1);
    let x = r.x + r.w / 2 - total / 2;
    const cy = r.y + r.h / 2;
    items.forEach((t, i) => {
      const last = i === items.length - 1;
      E('text', { x, y: cy + 4.5, class: 'vl' + (last ? (items.length > 1 ? ' nw' : '') : ' old') }, g, t);
      if (!last) E('line', { x1: x - 3, y1: cy + 6, x2: x + ws[i] + 3, y2: cy - 7, class: 'st' }, g);
      x += ws[i] + 10;
    });
  };

  // stack variables
  L.vars.forEach((V) => {
    const g = E('g', {});
    const r = V.r;
    E('text', { x: r.x, y: r.y - 7, class: 'vn' }, g, (V.c.t ? V.c.t + ' ' : '') + V.c.n);
    E('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: 3, class: 'cb' + (V.c.fr ? ' fr' : '') }, g);
    content(g, V.c, r);
    grow(r.x + r.w, r.y + r.h);
  });

  // heap objects
  L.objs.forEach((O) => {
    const o = O.o;
    const f = O.fr;
    const gone = !seen.has(o.addr);
    const g = E('g', { class: gone ? 'gone' : '' });
    E('text', { x: f.x, y: f.y - 8, class: 'ad' }, g, String(o.addr));
    if (o.t) E('text', { x: f.x + String(o.addr).length * 7.4 + 10, y: f.y - 8, class: 'ty' }, g, o.t);
    if (o.k === 'obj') {
      E('rect', { x: f.x, y: f.y, width: f.w, height: f.h, rx: 6, class: 'ob' + (o.fr ? ' fr' : '') }, g);
      O.cells.forEach((C) => E('text', { x: C.r.x, y: C.r.y - 7, class: 'fl' }, g, String(C.c.n)));
    }
    if (o.k === 'node') E('rect', { x: f.x - 4, y: f.y - 4, width: f.w + 8, height: f.h + 8, rx: 7, class: 'ob' + (o.fr ? ' fr' : '') }, g);
    O.cells.forEach((C, i) => {
      const r = C.r;
      E('rect', { x: r.x, y: r.y, width: r.w, height: r.h, rx: o.k === 'node' ? 2 : 3, class: 'cb' + (o.k === 'node' ? ' nd' : '') + (C.c.fr || o.fr ? ' fr' : '') }, g);
      content(g, C.c, r);
      if (o.k === 'arr') E('text', { x: r.x + r.w / 2, y: r.y + r.h + 16, 'text-anchor': 'middle', class: 'ix' }, g, `[${i}]`);
      if (o.k === 'node') E('text', { x: r.x + r.w / 2, y: r.y + r.h + 19, 'text-anchor': 'middle', class: 'ix' }, g, String(C.c.n));
    });
    if (gone) E('text', { x: f.x, y: f.y + f.h + (o.k === 'arr' || o.k === 'node' ? 36 : 18), class: 'gc' }, g, 'unreachable → garbage');
    grow(Math.max(f.x + f.w + 6, gone ? f.x + 150 : 0), f.y + f.h + (o.k === 'arr' || o.k === 'node' ? 24 : 6) + (gone ? 20 : 0));
  });

  // arrows, drawn last so the heads sit on top
  const arrows = (src: Rect, c: MemCell & { via?: string }, kind: number | null, isNode: boolean, goneSrc: boolean, isArr: boolean) => {
    const both = c.v.r != null && c.oldR.length > 0 && opts.dead !== false;
    const dirOff = (T: Rect) => (isNode ? (T.x >= src.x + src.w - 2 ? -6 : T.x + T.w <= src.x + 2 ? 6 : 0) : 0);
    if (opts.dead !== false && !goneSrc) {
      c.oldR.forEach((a, k) => {
        const T = by[a];
        if (!T) return;
        const [d, kx0, ky0] = route(src, T.fr, kind, (both ? -8 : 0) + dirOff(T.fr), isArr);
        let kx = kx0;
        let ky = ky0;
        if (T.fr.x >= src.x + src.w - 2) kx += k * 16;
        else if (T.fr.y >= src.y + src.h) ky += k * 12;
        const g = E('g', { class: goneSrc ? 'gone' : '' });
        E('path', { d, class: 'ar dead', 'marker-end': 'url(#mD)' }, g);
        E('path', { d: `M${kx - 5} ${ky - 5}L${kx + 5} ${ky + 5}M${kx + 5} ${ky - 5}L${kx - 5} ${ky + 5}`, class: 'xx' }, g);
      });
    }
    if (c.v.r != null && by[c.v.r]) {
      const T = by[c.v.r];
      let [d] = route(src, T.fr, kind, (both ? 8 : 0) + dirOff(T.fr), isArr);
      if (c.via === 'under') {
        const tx = T.fr.x + T.fr.w - 30;
        d = `M${src.x + src.w} ${src.y + src.h / 2}H${tx}V${T.fr.y + T.fr.h + 5}`;
      }
      E('path', { d, class: 'ar' + (c.fr ? ' fr' : '') + (goneSrc ? ' gone' : ''), 'marker-end': c.fr ? 'url(#mB)' : 'url(#mA)' });
    }
  };
  L.vars.forEach((V) => arrows(V.r, V.c, V.i, false, false, false));
  L.objs.forEach((O) => O.cells.forEach((C) => arrows(C.r, C.c, null, O.o.k === 'node', !seen.has(O.o.addr), O.o.k === 'arr')));

  return { nodes: roots, width: W + 24, height: Hh + 14 };
}

/** The last step with every "just changed" highlight cleared: the finished exam answer. */
export function finalState(sc: MemScenario): MemState {
  const s = clone(sc.steps[sc.steps.length - 1].s);
  s.vars.forEach((c) => (c.fr = 0));
  s.objs.forEach((o) => {
    o.fr = 0;
    o.cells.forEach((c) => (c.fr = 0));
  });
  return s;
}
