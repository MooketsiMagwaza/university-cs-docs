/**
 * Draws a flowchart as a themed SVG string in the `.jf-figure` vocabulary (app/styles/java-lessons.css), so the figure
 * follows the site's light and dark themes and needs no diagram library in the browser.
 *
 *   const { svg, alt } = drawFlow({ direction: 'TD', nodes: [{ id, text, shape }], edges: [{ from, to, label, dashed, arrow }] }, 'fig-id');
 *
 * `shape` is 'box' (default), 'decision' or 'round'. Layout: nodes are layered by their longest path from a source, ordered
 * inside a layer by the average position of their neighbours, then pulled towards their neighbours without overlapping.
 * Cycles are tolerated (an edge that points back to an earlier layer is drawn as a curve at the side).
 */

const CHAR = 7.3; // width of one character of 13px text
const LINE = 17;
const PAD_X = 16;
const PAD_Y = 10;
const GAP = 26; // between nodes in a layer
const RANK_GAP = 46; // between layers

const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(line, max) {
  const words = line.split(/\s+/).filter(Boolean);
  const out = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) out.push(cur);
  return out.length ? out : [''];
}

const looksLikeCode = (s) => /[(){};=\/\\]|\.java|\.class|\bjava\b|\bjavac\b|\[\]|->|::/.test(s);

function measure(node) {
  const raw = String(node.text ?? node.id).replace(/<br\s*\/?>/gi, '\n').replace(/\\n/g, '\n');
  const lines = raw.split('\n').flatMap((l) => wrap(l.trim(), 30));
  const width = Math.max(96, Math.min(260, Math.max(...lines.map((l) => l.length)) * CHAR + PAD_X * 2));
  const height = lines.length * LINE + PAD_Y * 2;
  return { ...node, lines, w: width, h: height };
}

export function drawFlow(spec, figId) {
  const horizontal = /^(LR|RL)$/.test(spec.direction ?? 'TD');
  const nodes = spec.nodes.map(measure);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges = spec.edges.filter((e) => byId.has(e.from) && byId.has(e.to));

  // 1. layers by longest path, ignoring edges that close a cycle
  const out = new Map(nodes.map((n) => [n.id, []]));
  const inn = new Map(nodes.map((n) => [n.id, []]));
  edges.forEach((e) => {
    out.get(e.from).push(e.to);
    inn.get(e.to).push(e.from);
  });
  const state = new Map();
  const back = new Set();
  const visit = (id) => {
    state.set(id, 1);
    for (const to of out.get(id)) {
      if (state.get(to) === 1) back.add(`${id}>${to}`);
      else if (!state.get(to)) visit(to);
    }
    state.set(id, 2);
  };
  nodes.forEach((n) => !state.get(n.id) && visit(n.id));
  const forward = edges.filter((e) => !back.has(`${e.from}>${e.to}`));
  const layerOf = new Map(nodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < nodes.length; pass++) {
    let changed = false;
    for (const e of forward) {
      if (layerOf.get(e.to) < layerOf.get(e.from) + 1) {
        layerOf.set(e.to, layerOf.get(e.from) + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }
  const depth = Math.max(...layerOf.values()) + 1;
  const layers = Array.from({ length: depth }, () => []);
  nodes.forEach((n) => layers[layerOf.get(n.id)].push(n));

  // 2. order inside each layer (barycentre sweeps, stable)
  const index = new Map();
  const reindex = () => layers.forEach((l) => l.forEach((n, i) => index.set(n.id, i)));
  reindex();
  const sweep = (list, neighbours) => {
    list.forEach((n) => {
      const ns = neighbours.get(n.id).filter((m) => layerOf.get(m) !== layerOf.get(n.id));
      n.bary = ns.length ? ns.reduce((s, m) => s + index.get(m), 0) / ns.length : index.get(n.id);
    });
    list.sort((a, b) => a.bary - b.bary || index.get(a.id) - index.get(b.id));
  };
  for (let round = 0; round < 3; round++) {
    for (let l = 1; l < depth; l++) {
      sweep(layers[l], inn);
      reindex();
    }
    for (let l = depth - 2; l >= 0; l--) {
      sweep(layers[l], out);
      reindex();
    }
  }

  // 3. coordinates: `across` is the position inside a layer, `along` the position between layers
  const size = (n) => (horizontal ? n.h : n.w); // extent across
  const thick = (n) => (horizontal ? n.w : n.h); // extent along
  layers.forEach((l) => {
    let x = 0;
    l.forEach((n) => {
      n.c = x + size(n) / 2;
      x += size(n) + GAP;
    });
    const total = x - GAP;
    l.forEach((n) => (n.c -= total / 2));
  });
  for (let pass = 0; pass < 6; pass++) {
    for (let l = 0; l < depth; l++) {
      const list = layers[l];
      list.forEach((n) => {
        const ns = [...inn.get(n.id), ...out.get(n.id)].map((m) => byId.get(m)).filter((m) => layerOf.get(m.id) !== l);
        if (ns.length) n.want = ns.reduce((s, m) => s + m.c, 0) / ns.length;
        else n.want = n.c;
      });
      list.forEach((n) => (n.c = (n.c + n.want) / 2));
      for (let i = 1; i < list.length; i++) {
        const min = list[i - 1].c + size(list[i - 1]) / 2 + GAP + size(list[i]) / 2;
        if (list[i].c < min) list[i].c = min;
      }
      for (let i = list.length - 2; i >= 0; i--) {
        const max = list[i + 1].c - size(list[i + 1]) / 2 - GAP - size(list[i]) / 2;
        if (list[i].c > max) list[i].c = max;
      }
    }
  }
  let along = 0;
  const hasLabel = edges.some((e) => e.label);
  layers.forEach((l) => {
    const t = Math.max(...l.map(thick));
    l.forEach((n) => (n.a = along + t / 2));
    along += t + RANK_GAP + (hasLabel ? 10 : 0);
  });
  along -= RANK_GAP + (hasLabel ? 10 : 0);

  // 4. shift everything to positive coordinates
  const minC = Math.min(...nodes.map((n) => n.c - size(n) / 2));
  const maxC = Math.max(...nodes.map((n) => n.c + size(n) / 2));
  const margin = 14;
  const sideRoom = back.size ? 34 : 0;
  nodes.forEach((n) => {
    const across = n.c - minC + margin + sideRoom / 2;
    const alongPos = n.a + margin;
    n.cx = horizontal ? alongPos : across;
    n.cy = horizontal ? across : alongPos;
  });
  const W = (horizontal ? along : maxC - minC) + margin * 2 + (horizontal ? 0 : sideRoom);
  const H = (horizontal ? maxC - minC : along) + margin * 2 + (horizontal ? sideRoom : 0);

  // 5. draw
  const incoming = new Set(edges.map((e) => e.to));
  const outgoing = new Set(edges.map((e) => e.from));
  const tone = (n) => {
    if (n.shape === 'decision') return 'f-a';
    if (!incoming.has(n.id) && outgoing.has(n.id)) return 'f-b';
    if (incoming.has(n.id) && !outgoing.has(n.id)) return 'f-g';
    return 'f-box';
  };
  const parts = [];
  const marker = `${figId}-flow`;
  parts.push(`<defs><marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk"/></marker></defs>`);

  // groups (subgraphs) behind everything
  for (const g of spec.groups ?? []) {
    const ms = g.nodes.map((id) => byId.get(id)).filter(Boolean);
    if (!ms.length) continue;
    const x0 = Math.min(...ms.map((n) => n.cx - n.w / 2)) - 10;
    const x1 = Math.max(...ms.map((n) => n.cx + n.w / 2)) + 10;
    const y0 = Math.min(...ms.map((n) => n.cy - n.h / 2)) - 22;
    const y1 = Math.max(...ms.map((n) => n.cy + n.h / 2)) + 10;
    parts.push(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="12" class="f-sub dash-outline"/>`);
    parts.push(`<text x="${x0 + 10}" y="${y0 + 14}" class="s t2">${escXml(g.title)}</text>`);
  }

  // edges
  const labels = [];
  for (const e of edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    const isBack = back.has(`${e.from}>${e.to}`);
    let d;
    let lx;
    let ly;
    if (!horizontal) {
      if (isBack) {
        const x = Math.max(a.cx + a.w / 2, b.cx + b.w / 2) + 22;
        d = `M${a.cx + a.w / 2} ${a.cy} H${x} V${b.cy} H${b.cx + b.w / 2 + 3}`;
        lx = x;
        ly = (a.cy + b.cy) / 2;
      } else {
        const x1 = a.cx;
        const y1 = a.cy + a.h / 2;
        const x2 = b.cx;
        const y2 = b.cy - b.h / 2 - 2;
        const ym = (y1 + y2) / 2;
        d = x1 === x2 ? `M${x1} ${y1} V${y2}` : `M${x1} ${y1} C${x1} ${ym}, ${x2} ${ym}, ${x2} ${y2}`;
        lx = (x1 + x2) / 2;
        ly = ym;
      }
    } else if (isBack) {
      const y = Math.max(a.cy + a.h / 2, b.cy + b.h / 2) + 22;
      d = `M${a.cx} ${a.cy + a.h / 2} V${y} H${b.cx} V${b.cy + b.h / 2 + 3}`;
      lx = (a.cx + b.cx) / 2;
      ly = y;
    } else {
      const x1 = a.cx + a.w / 2;
      const y1 = a.cy;
      const x2 = b.cx - b.w / 2 - 2;
      const y2 = b.cy;
      const xm = (x1 + x2) / 2;
      d = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} C${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`;
      lx = xm;
      ly = (y1 + y2) / 2;
    }
    const dashed = e.dashed ? ' dash' : '';
    const arrow = e.arrow === false ? '' : ` marker-end="url(#${marker})"`;
    parts.push(`<path d="${d}" class="ln${dashed}"${arrow}/>`);
    if (e.label) labels.push({ text: e.label, x: lx, y: ly });
  }

  // nodes
  for (const n of nodes) {
    const x = n.cx - n.w / 2;
    const y = n.cy - n.h / 2;
    const rx = n.shape === 'round' ? n.h / 2 : n.shape === 'decision' ? 14 : 10;
    parts.push(`<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="${rx}" class="${tone(n)}"/>`);
    const startY = n.cy - (n.lines.length * LINE) / 2 + LINE / 2 + 4;
    n.lines.forEach((line, i) => {
      const code = looksLikeCode(line);
      const strong = n.lines.length > 1 && i === 0 && !code;
      parts.push(`<text x="${n.cx}" y="${startY + i * LINE}" text-anchor="middle" class="${code ? 'm' : strong ? 'h' : ''}"${code || strong ? '' : ''}>${escXml(line)}</text>`.replace(' class=""', ''));
    });
  }

  // edge labels on top, each with a small backing box
  for (const l of labels) {
    const w = l.text.length * 6.4 + 12;
    parts.push(`<rect x="${l.x - w / 2}" y="${l.y - 9}" width="${w}" height="17" rx="8" class="f-box"/>`);
    parts.push(`<text x="${l.x}" y="${l.y + 4}" text-anchor="middle" class="s t2">${escXml(l.text)}</text>`);
  }

  const issues = [];
  for (let i = 0; i < nodes.length; i++) {
    const p = nodes[i];
    if (p.cx - p.w / 2 < 0 || p.cy - p.h / 2 < 0 || p.cx + p.w / 2 > W || p.cy + p.h / 2 > H) issues.push('node outside the picture: ' + p.id);
    for (let j = i + 1; j < nodes.length; j++) {
      const q = nodes[j];
      if (Math.abs(p.cx - q.cx) < (p.w + q.w) / 2 - 1 && Math.abs(p.cy - q.cy) < (p.h + q.h) / 2 - 1) issues.push('nodes overlap: ' + p.id + ' and ' + q.id);
    }
  }
  const alt = spec.alt ?? nodes.map((n) => n.lines.join(' ')).join('; ');
  const width = Math.ceil(W);
  const height = Math.ceil(H);
  const svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escXml(alt)}" style="max-width:${Math.max(width, 280)}px">${parts.join('')}</svg>`;
  return { svg, alt, width, height, issues };
}

/* ───────── Mermaid flowchart text -> spec ───────── */

function readNode(src, pos) {
  const idMatch = /^[A-Za-z0-9_]+/.exec(src.slice(pos));
  if (!idMatch) return null;
  const id = idMatch[0];
  let p = pos + id.length;
  let text = null;
  let shape = 'box';
  const open = src[p];
  const pairs = { '[': ']', '(': ')', '{': '}' };
  if (open && pairs[open]) {
    // read to the matching close, allowing quotes, and the double forms ([ ... ]) and (( ... ))
    let depth = 0;
    let i = p;
    let quote = false;
    for (; i < src.length; i++) {
      const ch = src[i];
      if (ch === '"') quote = !quote;
      if (quote) continue;
      if (ch === '[' || ch === '(' || ch === '{') depth++;
      if (ch === ']' || ch === ')' || ch === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    let inner = src.slice(p + 1, i);
    p = i + 1;
    inner = inner.replace(/^[\[(]+/, '').replace(/[\])]+$/, '');
    text = inner.trim().replace(/^"|"$/g, '');
    shape = open === '{' ? 'decision' : open === '(' ? 'round' : 'box';
  }
  return { id, text, shape, end: p };
}

const EDGE = /^\s*(?:(-->|---|-\.->|-\.-|==>|===)(?:\|([^|]*)\|)?|--\s+([^-]+?)\s+(-->|---)|-\.\s+([^-]+?)\s+\.->)/;

export function parseFlowchart(text) {
  const lines = text.split('\n').map((l) => l.replace(/%%.*$/, '').trim()).filter(Boolean);
  const header = /^(flowchart|graph)\s*(TD|TB|LR|RL|BT)?/i.exec(lines[0]);
  if (!header) throw new Error(`not a flowchart: ${lines[0]}`);
  const direction = (header[2] ?? 'TD').toUpperCase().replace('TB', 'TD');
  const nodes = new Map();
  const edges = [];
  const groups = [];
  const stack = [];
  const touch = (n) => {
    const cur = nodes.get(n.id) ?? { id: n.id, text: null, shape: 'box' };
    if (n.text != null) cur.text = n.text;
    if (n.shape !== 'box') cur.shape = n.shape;
    nodes.set(n.id, cur);
    for (const g of stack) if (!g.nodes.includes(n.id)) g.nodes.push(n.id);
    return cur;
  };
  for (const line of lines.slice(1)) {
    const sub = /^subgraph\s+([A-Za-z0-9_]+)(?:\s*\[\s*"?(.*?)"?\s*\])?\s*$/.exec(line) ?? /^subgraph\s+(.+)$/.exec(line);
    if (sub) {
      const g = { id: sub[1], title: (sub[2] ?? sub[1]).replace(/^"|"$/g, ''), nodes: [] };
      groups.push(g);
      stack.push(g);
      continue;
    }
    if (line === 'end') {
      stack.pop();
      continue;
    }
    if (/^(direction|style|classDef|class|linkStyle|click)\b/.test(line)) continue;
    let pos = 0;
    let prev = null;
    while (pos < line.length) {
      while (line[pos] === ' ' || line[pos] === ';') pos++;
      if (pos >= line.length) break;
      const node = readNode(line, pos);
      if (!node) throw new Error(`cannot read a node in: ${line}`);
      touch(node);
      if (prev) {
        // the edge was read before this node
      }
      pos = node.end;
      const rest = line.slice(pos);
      const m = EDGE.exec(rest);
      if (!m) {
        pos = line.length;
        break;
      }
      pos += m[0].length;
      const label = (m[2] ?? m[3] ?? m[5] ?? '').trim().replace(/^"|"$/g, '');
      const op = m[1] ?? m[4] ?? '.->';
      while (line[pos] === ' ') pos++;
      const next = readNode(line, pos);
      if (!next) throw new Error(`cannot read the node after an edge in: ${line}`);
      touch(next);
      edges.push({ from: node.id, to: next.id, label: label || undefined, dashed: op.includes('.'), arrow: !/^---$|^-\.-$/.test(op) });
      // continue a chain: A --> B --> C
      pos = next.end;
      let last = next;
      while (true) {
        const chain = EDGE.exec(line.slice(pos));
        if (!chain) break;
        pos += chain[0].length;
        while (line[pos] === ' ') pos++;
        const after = readNode(line, pos);
        if (!after) throw new Error(`cannot read a chained node in: ${line}`);
        touch(after);
        const lab = (chain[2] ?? chain[3] ?? chain[5] ?? '').trim().replace(/^"|"$/g, '');
        const o = chain[1] ?? chain[4] ?? '.->';
        edges.push({ from: last.id, to: after.id, label: lab || undefined, dashed: o.includes('.'), arrow: !/^---$|^-\.-$/.test(o) });
        last = after;
        pos = after.end;
      }
      prev = null;
    }
  }
  return { direction, nodes: [...nodes.values()], edges, groups: groups.filter((g) => g.nodes.length) };
}
