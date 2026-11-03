/**
 * Checks a drawn memory diagram for the faults that make a diagram look shabby: boxes or labels on top of each other, text
 * wider than the box it is in, an arrow through a box or a label, anything outside the picture. Used by the unit test, which
 * runs it over every step of every scenario. Returns one sentence per fault; an empty list means the picture is clean.
 */
import type { Drawing } from './memory-draw';
import type { Pt } from './memory-route';
import type { Rect } from './memory-layout';

const open = (a: Rect, b: Rect, slack = 0) => a.x + slack < b.x + b.w && b.x + slack < a.x + a.w && a.y + slack < b.y + b.h && b.y + slack < a.y + a.h;
const label = (r: Rect) => `(${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.w)}x${Math.round(r.h)})`;

/** Does the segment a-b pass through the inside of the rectangle? (Touching its edge is allowed.) */
function crosses(a: Pt, b: Pt, r: Rect): boolean {
  const e = 0.5;
  if (Math.abs(a.y - b.y) < 1) {
    const y = a.y;
    return y > r.y + e && y < r.y + r.h - e && Math.max(a.x, b.x) > r.x + e && Math.min(a.x, b.x) < r.x + r.w - e;
  }
  if (Math.abs(a.x - b.x) < 1) {
    const x = a.x;
    return x > r.x + e && x < r.x + r.w - e && Math.max(a.y, b.y) > r.y + e && Math.min(a.y, b.y) < r.y + r.h - e;
  }
  return true; // a slanted segment means the router failed
}

export function checkDrawing(d: Drawing): string[] {
  const issues: string[] = [];
  const { boxes, labels, contents, arrows } = d.geom;
  const canvas: Rect = { x: 0, y: 0, w: d.width, h: d.height };
  const inside = (r: Rect) => r.x >= canvas.x - 0.5 && r.y >= canvas.y - 0.5 && r.x + r.w <= canvas.w + 0.5 && r.y + r.h <= canvas.h + 0.5;

  for (const b of boxes) if (!inside(b.r)) issues.push(`${b.id} ${label(b.r)} is outside the picture`);
  for (const l of labels) if (!inside(l.r)) issues.push(`label of ${l.id} ${label(l.r)} is outside the picture`);

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (open(boxes[i].r, boxes[j].r)) issues.push(`${boxes[i].id} and ${boxes[j].id} overlap`);
    }
  }
  for (const l of labels) {
    for (const b of boxes) {
      // a field's label belongs inside its own object's frame
      const own = l.id.startsWith('field ') && b.id === `object ${l.id.split(' ')[1]}`;
      if (!own && open(l.r, b.r, 1)) issues.push(`label of ${l.id} ${label(l.r)} sits on ${b.id}`);
    }
  }
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      if (open(labels[i].r, labels[j].r, 1)) issues.push(`label of ${labels[i].id} and label of ${labels[j].id} overlap`);
    }
  }
  for (const c of contents) {
    if (c.text.x < c.cell.x + 3 || c.text.x + c.text.w > c.cell.x + c.cell.w - 3) issues.push(`${c.id}: text ${label(c.text)} does not fit in its box ${label(c.cell)}`);
  }

  const obstacles: Array<{ id: string; r: Rect }> = [...boxes, ...labels.map((l) => ({ id: `label of ${l.id}`, r: l.r }))];
  for (const a of arrows) {
    const name = `arrow ${a.from} -> object ${a.to}`;
    if (!a.routed) {
      issues.push(`${name} could not be routed`);
      continue;
    }
    for (let k = a.pre ? 1 : 0; k + 1 < a.pts.length; k++) {
      for (const o of obstacles) {
        if (crosses(a.pts[k], a.pts[k + 1], o.r)) issues.push(`${name} runs through ${o.id}`);
      }
    }
    for (const p of a.pts) if (p.x < 0 || p.y < 0 || p.x > d.width || p.y > d.height) issues.push(`${name} leaves the picture`);
  }
  return [...new Set(issues)];
}

/** Arrows that run on top of each other for a stretch (not counting the last few pixels where they meet at a box). */
export function overlappingArrows(d: Drawing): string[] {
  const out: string[] = [];
  const segs = d.geom.arrows.map((a) => a.pts.slice(a.pre ? 1 : 0).flatMap((p, i, all) => (i + 1 < all.length ? [[p, all[i + 1]] as [Pt, Pt]] : [])));
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      for (const [a, b] of segs[i]) {
        for (const [c, e] of segs[j]) {
          const h = Math.abs(a.y - b.y) < 0.01 && Math.abs(c.y - e.y) < 0.01 && Math.abs(a.y - c.y) < 0.5;
          const v = Math.abs(a.x - b.x) < 0.01 && Math.abs(c.x - e.x) < 0.01 && Math.abs(a.x - c.x) < 0.5;
          if (!h && !v) continue;
          const lo = h ? Math.max(Math.min(a.x, b.x), Math.min(c.x, e.x)) : Math.max(Math.min(a.y, b.y), Math.min(c.y, e.y));
          const hi = h ? Math.min(Math.max(a.x, b.x), Math.max(c.x, e.x)) : Math.min(Math.max(a.y, b.y), Math.max(c.y, e.y));
          if (hi - lo > 14) out.push(`arrow ${d.geom.arrows[i].from} -> ${d.geom.arrows[i].to} and arrow ${d.geom.arrows[j].from} -> ${d.geom.arrows[j].to} share ${Math.round(hi - lo)}px`);
        }
      }
    }
  }
  return [...new Set(out)];
}
