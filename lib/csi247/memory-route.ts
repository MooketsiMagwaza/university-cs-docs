/**
 * Elbow arrows that go around boxes and labels instead of through them. The search runs on a sparse grid whose lines sit a
 * little way outside every obstacle (and midway through each gap, so an elbow bends in the middle of a channel), and it
 * prefers few bends and avoids running along an arrow that is already drawn. Start and goal points sit on the edge of a box:
 * the only way in or out of such a point is straight away from the box.
 */
import type { Rect } from './memory-layout';

export type Pt = { x: number; y: number };
export type Dir = 'E' | 'W' | 'N' | 'S';
/** A point on the edge of a box, the way out (or in), what it costs to use it, and where the arrow really starts when that is inside the box (a field of an object). */
export type Port = Pt & { dir: Dir; pen: number; pre?: Pt };

const MARGIN = 11;
const BEND = 22;
const OVERLAP = 90;
const CROSS = 10;
const DIRS: Dir[] = ['E', 'W', 'N', 'S'];
const DX = { E: 1, W: -1, N: 0, S: 0 } as const;
const DY = { E: 0, W: 0, N: -1, S: 1 } as const;
const EPS = 0.01;
/** An edge that runs this close to a box costs extra, so arrows keep their distance from boxes they pass. */
const CLEAR = 8;
const HUG = 1.4;

const uniq = (values: number[]) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const out: number[] = [];
  for (const v of sorted) if (!out.length || v - out[out.length - 1] > 0.5) out.push(v);
  return out;
};

/** Add a line (and two beside it) in the middle of every wide gap, so bends and parallel arrows have room. */
const densify = (lines: number[]) => {
  const out = lines.slice();
  for (let i = 0; i + 1 < lines.length; i++) {
    const gap = lines[i + 1] - lines[i];
    const mid = (lines[i] + lines[i + 1]) / 2;
    if (gap >= 26) out.push(mid);
    if (gap >= 46) out.push(mid - 8, mid + 8);
  }
  return uniq(out);
};

class Heap {
  private f: number[] = [];
  private s: number[] = [];
  get size() {
    return this.f.length;
  }
  push(f: number, s: number) {
    const F = this.f;
    const S = this.s;
    let i = F.length;
    F.push(f);
    S.push(s);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (F[p] <= F[i]) break;
      [F[p], F[i]] = [F[i], F[p]];
      [S[p], S[i]] = [S[i], S[p]];
      i = p;
    }
  }
  pop(): number {
    const F = this.f;
    const S = this.s;
    const top = S[0];
    const lf = F.pop() as number;
    const ls = S.pop() as number;
    if (F.length) {
      F[0] = lf;
      S[0] = ls;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < F.length && F[l] < F[m]) m = l;
        if (r < F.length && F[r] < F[m]) m = r;
        if (m === i) break;
        [F[m], F[i]] = [F[i], F[m]];
        [S[m], S[i]] = [S[i], S[m]];
        i = m;
      }
    }
    return top;
  }
}

export type Router = {
  /** The cheapest elbow route from any of the start ports to any of the goal ports, or null. The route is remembered. */
  route(starts: Port[], goals: Port[]): { path: Pt[]; start: Port; goal: Port } | null;
};

export function createRouter(width: number, height: number, obstacles: Rect[], ports: Pt[]): Router {
  const xs = densify(uniq([6, width - 6, ...obstacles.flatMap((r) => [r.x - MARGIN, r.x + r.w + MARGIN]), ...ports.map((p) => p.x)].filter((v) => v > 2 && v < width - 2)));
  const ys = densify(uniq([6, height - 6, ...obstacles.flatMap((r) => [r.y - MARGIN, r.y + r.h + MARGIN]), ...ports.map((p) => p.y)].filter((v) => v > 2 && v < height - 2)));
  const nx = xs.length;
  const ny = ys.length;
  const inside = (x: number, y: number) => obstacles.some((r) => x >= r.x - EPS && x <= r.x + r.w + EPS && y >= r.y - EPS && y <= r.y + r.h + EPS);
  const close = (x: number, y: number) => obstacles.some((r) => x >= r.x - CLEAR && x <= r.x + r.w + CLEAR && y >= r.y - CLEAR && y <= r.y + r.h + CLEAR);

  const nodeBlocked = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) nodeBlocked[j * nx + i] = inside(xs[i], ys[j]) ? 1 : 0;
  // an edge is blocked when its middle is inside a box (this also blocks running along a box's edge)
  const hBlocked = new Uint8Array((nx - 1) * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i + 1 < nx; i++) hBlocked[j * (nx - 1) + i] = inside((xs[i] + xs[i + 1]) / 2, ys[j]) ? 1 : 0;
  const vBlocked = new Uint8Array(nx * (ny - 1));
  for (let j = 0; j + 1 < ny; j++) for (let i = 0; i < nx; i++) vBlocked[j * nx + i] = inside(xs[i], (ys[j] + ys[j + 1]) / 2) ? 1 : 0;

  const hClose = new Uint8Array((nx - 1) * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i + 1 < nx; i++) hClose[j * (nx - 1) + i] = close((xs[i] + xs[i + 1]) / 2, ys[j]) ? 1 : 0;
  const vClose = new Uint8Array(nx * (ny - 1));
  for (let j = 0; j + 1 < ny; j++) for (let i = 0; i < nx; i++) vClose[j * nx + i] = close(xs[i], (ys[j] + ys[j + 1]) / 2) ? 1 : 0;

  const hUsed = new Uint8Array((nx - 1) * ny);
  const vUsed = new Uint8Array(nx * (ny - 1));
  const nodeH = new Uint8Array(nx * ny);
  const nodeV = new Uint8Array(nx * ny);

  const near = (lines: number[], v: number) => {
    let lo = 0;
    let hi = lines.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lines[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && Math.abs(lines[lo - 1] - v) < Math.abs(lines[lo] - v)) lo--;
    return lo;
  };

  const total = nx * ny * 4;
  const dist = new Float64Array(total);
  const from = new Int32Array(total);
  const closed = new Uint8Array(total);

  return {
    route(starts, goals) {
      dist.fill(Infinity);
      from.fill(-1);
      closed.fill(0);
      const nodeOf = (p: Pt) => near(ys, p.y) * nx + near(xs, p.x);
      const goalAt = new Map<number, Port>();
      goals.forEach((g) => {
        const n = nodeOf(g);
        const old = goalAt.get(n);
        if (!old || g.pen < old.pen) goalAt.set(n, g);
      });
      const allowed = new Set<number>([...goalAt.keys(), ...starts.map(nodeOf)]);
      const heuristic = (i: number, j: number) => {
        let best = Infinity;
        for (const g of goals) best = Math.min(best, Math.abs(g.x - xs[i]) + Math.abs(g.y - ys[j]));
        return best;
      };

      const heap = new Heap();
      const startOf = new Map<number, Port>();
      for (const s of starts) {
        const n = nodeOf(s);
        const d = DIRS.indexOf(s.dir);
        const st = n * 4 + d;
        if (s.pen < dist[st]) {
          dist[st] = s.pen;
          startOf.set(st, s);
          heap.push(s.pen + heuristic(n % nx, (n / nx) | 0), st);
        }
      }

      let found = -1;
      while (heap.size) {
        const st = heap.pop();
        if (closed[st]) continue;
        closed[st] = 1;
        const n = (st / 4) | 0;
        const d = st % 4;
        const i = n % nx;
        const j = (n / nx) | 0;
        const g = dist[st];
        if (goalAt.has(n) && !startOf.has(st)) {
          found = st;
          break;
        }
        for (let nd = 0; nd < 4; nd++) {
          const dir = DIRS[nd];
          const ni = i + DX[dir];
          const nj = j + DY[dir];
          if (ni < 0 || nj < 0 || ni >= nx || nj >= ny) continue;
          const to = nj * nx + ni;
          if (nodeBlocked[to] && !allowed.has(to)) continue;
          let edge: number;
          let used: number;
          let blocked: number;
          let near: number;
          if (nd < 2) {
            edge = nj * (nx - 1) + Math.min(i, ni);
            blocked = hBlocked[edge];
            used = hUsed[edge];
            near = hClose[edge];
          } else {
            edge = Math.min(j, nj) * nx + i;
            blocked = vBlocked[edge];
            used = vUsed[edge];
            near = vClose[edge];
          }
          if (blocked) continue;
          if (nd === (d ^ 1)) continue; // never turn straight back
          let cost = Math.abs(xs[ni] - xs[i]) + Math.abs(ys[nj] - ys[j]);
          if (nd !== d) cost += BEND;
          if (near) cost += cost * (HUG - 1);
          if (used) cost += OVERLAP;
          if (nd < 2 ? nodeV[to] : nodeH[to]) cost += CROSS;
          const goal = goalAt.get(to);
          if (goal) cost += goal.pen;
          const ns = to * 4 + nd;
          const ng = g + cost;
          if (ng < dist[ns]) {
            dist[ns] = ng;
            from[ns] = st;
            heap.push(ng + heuristic(ni, nj), ns);
          }
        }
      }
      if (found < 0) return null;

      const cells: number[] = [];
      for (let st = found; st >= 0; st = from[st]) cells.push(st);
      cells.reverse();
      const startPort = startOf.get(cells[0]) as Port;
      const goalPort = goalAt.get((found / 4) | 0) as Port;
      const pts: Pt[] = [{ x: startPort.x, y: startPort.y }];
      for (let k = 1; k < cells.length; k++) {
        const n = (cells[k] / 4) | 0;
        const p = { x: xs[n % nx], y: ys[(n / nx) | 0] };
        const last = pts[pts.length - 1];
        const before = pts[pts.length - 2];
        if (before && ((before.x === last.x && last.x === p.x) || (before.y === last.y && last.y === p.y))) pts[pts.length - 1] = p;
        else pts.push(p);
        // remember the edge
        const a = (cells[k - 1] / 4) | 0;
        const ai = a % nx;
        const aj = (a / nx) | 0;
        const bi = n % nx;
        const bj = (n / nx) | 0;
        if (aj === bj) {
          hUsed[bj * (nx - 1) + Math.min(ai, bi)] = 1;
          nodeH[a] = 1;
          nodeH[n] = 1;
        } else {
          vUsed[Math.min(aj, bj) * nx + ai] = 1;
          nodeV[a] = 1;
          nodeV[n] = 1;
        }
      }
      // the port coordinates are exact: put the first and last points on them, and keep the first and last segments straight
      pts[0] = { x: startPort.x, y: startPort.y };
      pts[pts.length - 1] = { x: goalPort.x, y: goalPort.y };
      if (pts.length > 2) {
        const n = pts.length;
        if (Math.abs(pts[1].x - pts[0].x) < 1) pts[1] = { x: pts[0].x, y: pts[1].y };
        else if (Math.abs(pts[1].y - pts[0].y) < 1) pts[1] = { x: pts[1].x, y: pts[0].y };
        if (Math.abs(pts[n - 2].x - pts[n - 1].x) < 1) pts[n - 2] = { x: pts[n - 1].x, y: pts[n - 2].y };
        else if (Math.abs(pts[n - 2].y - pts[n - 1].y) < 1) pts[n - 2] = { x: pts[n - 2].x, y: pts[n - 1].y };
      }
      return { path: pts, start: startPort, goal: goalPort };
    },
  };
}
