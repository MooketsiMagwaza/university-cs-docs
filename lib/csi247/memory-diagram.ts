/**
 * Memory diagrams for CSI247: a stack on the left, a heap on the right, every variable a box, every reference an address
 * with an arrow, and old values crossed out instead of erased (the exam drawing rules, written up in
 * content/docs/sem3/csi247/06-object-oriented-programming/notes/drawing-memory-diagrams.mdx).
 *
 * A scenario is built with a small builder, one `snap` per line of code, so the stepper can show the diagram after each
 * line. The builder holds only the state; where things go is decided by memory-layout.ts (sizes from the content of every
 * step, positions from placement rules such as "below slot 3 of the array"), memory-route.ts (arrows routed around boxes and
 * labels) and memory-draw.ts (SVG nodes). Everything is plain data and arithmetic, so it also runs under node
 * (`npm run test:memory-diagram`).
 */

export type MemValue = { t?: string; r?: number };

export type MemCell = {
  n: string | number;
  v: MemValue;
  old: string[];
  oldR: number[];
  fr: number;
};

/**
 * Where a heap object goes. `x` and `y` are measured from the top left of the heap area; `right` puts the object to the
 * right of the object at that address, `below` puts it underneath, centred under one slot (an array index or a field name).
 */
export type Place =
  | { x: number; y: number }
  | { right: number; dy?: number; gap?: number }
  | { below: number; slot?: number | string; dx?: number; gap?: number };

export type MemVar = MemCell & { n: string; t?: string; at?: number | false; w?: number };

export type MemObj = {
  addr: number;
  k: 'arr' | 'obj' | 'val' | 'node';
  fr: number;
  at: Place;
  cw?: number;
  w?: number;
  t?: string;
  cells: MemCell[];
};

export type MemState = { vars: MemVar[]; objs: MemObj[] };
export type MemStep = { line: number; note: string; s: MemState };
/** `dead: false` draws no crossed-out arrows (a traversal); `history: false` forgets crossed-out values after each step, so a step shows only its own changes. */
export type MemOptions = { dead?: boolean; history?: boolean };
export type MemScenario = { title: string; code: string[]; steps: MemStep[]; opts: MemOptions };

type Input = string | number | MemValue;

export type VarOptions = { t?: string; at?: number | false; w?: number };
export type ArrOptions = { at: Place; cw?: number; t?: string; fill?: Input };
export type ObjOptions = { at: Place; w?: number; t?: string };
export type ValOptions = { at: Place; w?: number; t?: string };
export type NodeOptions = { at: Place; cw?: number; t?: string; prev?: Input };

export const nv = (v: Input): MemValue => (v !== null && typeof v === 'object' ? v : { t: String(v) });
/** What is written in a box for this value: the address for a reference, the text otherwise. */
export const cellText = (v: MemValue) => (v.r != null ? String(v.r) : (v.t ?? ''));
export const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

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
      c.old.push(cellText(c.v));
      if (c.v.r != null) c.oldR.push(c.v.r);
    }
    c.v = value;
    c.fr = 1;
  };
  const fresh = (addr: number) => {
    if (S.objs.some((o) => o.addr === addr)) throw new Error(`memory diagram: address ${addr} is used twice`);
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
    v(n: string, val: Input, o: VarOptions = {}) {
      if (S.vars.some((x) => x.n === n)) throw new Error(`memory diagram: variable ${n} is declared twice`);
      S.vars.push({ ...cell(n, val), n, fr: 1, ...o });
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
    arr(addr: number, n: number, o: ArrOptions) {
      fresh(addr);
      const { fill, ...rest } = o;
      S.objs.push({ addr, k: 'arr', fr: 1, cells: Array.from({ length: n }, (_, i) => cell(i, fill == null ? 'null' : fill)), ...rest });
      return B;
    },
    obj(addr: number, fields: Array<[string, Input]>, o: ObjOptions) {
      fresh(addr);
      S.objs.push({ addr, k: 'obj', fr: 1, cells: fields.map(([n, v]) => cell(n, v)), ...o });
      return B;
    },
    val(addr: number, text: string, o: ValOptions) {
      fresh(addr);
      S.objs.push({ addr, k: 'val', fr: 1, cells: [cell('', text)], ...o });
      return B;
    },
    node(addr: number, data: Input, next: Input, o: NodeOptions) {
      fresh(addr);
      const { prev, ...rest } = o;
      const cells: MemCell[] = [];
      if (prev !== undefined) cells.push(cell('prev', prev));
      cells.push(cell('data', data), cell('next', next));
      S.objs.push({ addr, k: 'node', fr: 1, cells, ...rest });
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
      if (opts.history === false) B.clean();
      return B;
    },
    done(title: string): MemScenario {
      return { title, code, steps, opts };
    },
  };
  return B;
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
