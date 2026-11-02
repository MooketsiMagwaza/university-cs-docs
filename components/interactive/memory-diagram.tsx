'use client';

import { createElement, useId, useMemo, useState, type ReactNode } from 'react';
import { drawDiagram, finalState, type SvgNode } from '@/lib/csi247/memory-diagram';
import { buildMemoryScenario } from '@/lib/csi247/memory-scenarios';

const reactName = (name: string) => (name === 'class' ? 'className' : name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));

function renderNode(node: SvgNode, key: number, uid: string): ReactNode {
  const props: Record<string, unknown> = { key };
  for (const [name, value] of Object.entries(node.attrs)) {
    props[reactName(name)] = typeof value === 'string' ? value.replace(/url\(#(m[A-Z])\)/g, `url(#${uid}-$1)`) : value;
  }
  if (props.className === '') delete props.className;
  return createElement(node.tag, props, node.text ?? node.children.map((child, i) => renderNode(child, i, uid)));
}

function Drawing({ drawing, label }: { drawing: ReturnType<typeof drawDiagram>; label: string }) {
  const uid = useId().replace(/:/g, '');
  const marker = (id: string, tone: string) => (
    <marker id={`${uid}-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" className={tone} />
    </marker>
  );
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${drawing.width} ${drawing.height}`}
      style={{ maxWidth: drawing.width, minWidth: Math.round(drawing.width * 0.72) }}
    >
      <defs>
        {marker('mA', 'mk-t')}
        {marker('mB', 'mk-b')}
        {marker('mD', 'mk-d')}
      </defs>
      {drawing.nodes.map((node, i) => renderNode(node, i, uid))}
    </svg>
  );
}

/**
 * A memory diagram drawn the way the CSI247 exam wants it: stack on the left, heap on the right, addresses and arrows,
 * old values crossed out. By default it steps through the Java line by line; with `static` it shows only the finished
 * diagram. The scenarios are in lib/csi247/memory-scenarios.ts.
 */
export function MemoryDiagram({ scenario, static: isStatic = false }: { scenario: string; static?: boolean }) {
  const sc = useMemo(() => buildMemoryScenario(scenario), [scenario]);
  const [index, setIndex] = useState(0);
  const last = sc.steps.length - 1;

  if (isStatic) {
    return (
      <div className="jf-mem jf-mem-static">
        <div className="jf-mem-stage">
          <Drawing drawing={drawDiagram(finalState(sc), sc.opts)} label={`Memory diagram: ${sc.title}`} />
        </div>
      </div>
    );
  }

  const step = sc.steps[index];
  return (
    <div className="jf-mem">
      <div className="jf-mem-head">
        <b>Step through: {sc.title}</b>
        <span>
          step {index} of {last}
        </span>
      </div>
      {sc.code.length > 0 ? (
        <div className="jf-mem-code" aria-label="The Java being run">
          {sc.code.map((line, k) => (
            <div key={k} className={k === step.line ? 'on' : k < step.line ? 'done' : ''}>
              {line}
            </div>
          ))}
        </div>
      ) : null}
      <div className="jf-mem-stage">
        <Drawing drawing={drawDiagram(step.s, sc.opts)} label={`Memory diagram: ${sc.title}, step ${index}`} />
      </div>
      <p className="jf-mem-note" aria-live="polite">
        {step.note}
      </p>
      <div className="jf-mem-bar">
        <button type="button" className="jf-btn" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          Back
        </button>
        <button type="button" className="jf-btn jf-btn-primary" disabled={index >= last} onClick={() => setIndex((i) => Math.min(last, i + 1))}>
          Next step
        </button>
        <button type="button" className="jf-btn" disabled={index >= last} onClick={() => setIndex(last)}>
          Jump to final diagram
        </button>
        <button type="button" className="jf-btn" disabled={index === 0} onClick={() => setIndex(0)}>
          Start again
        </button>
      </div>
      <div className="jf-mem-legend">
        <span>
          <i className="sw-new" /> just changed
        </span>
        <span>
          <i className="sw-old" /> crossed out = old value or old arrow
        </span>
        <span>
          <i className="sw-gone" /> faded = garbage (nothing points to it)
        </span>
      </div>
    </div>
  );
}
