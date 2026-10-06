'use client';

import React, { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

type RuleType = 'must' | 'avoid' | 'note';

interface Rule {
  type: RuleType;
  text: string;
}

const STORAGE_PREFIX = 'university-docs:checklist:';

/**
 * A self-assessment checklist. "must" items are checkboxes the student ticks when they can
 * do the thing described; progress is remembered on this device. "avoid" and "note" items
 * are reminders, so they carry a label instead of a checkbox.
 */
export function Checklist({ title, rules }: { title: string; rules: Rule[] }) {
  const pathname = usePathname();
  const headingId = useId();
  const storageKey = `${STORAGE_PREFIX}${pathname}:${title}`;
  const checkable = rules.map((rule, index) => (rule.type === 'must' ? index : -1)).filter((index) => index >= 0);

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  // Read saved progress after mount so server and client markup match on first render.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setChecked(saved ? (JSON.parse(saved) as Record<number, boolean>) : {});
    } catch {
      setChecked({});
    }
  }, [storageKey]);

  const persist = (next: Record<number, boolean>) => {
    setChecked(next);
    try {
      if (Object.values(next).some(Boolean)) window.localStorage.setItem(storageKey, JSON.stringify(next));
      else window.localStorage.removeItem(storageKey);
    } catch {
      // Storage can be unavailable (private windows, blocked site data); the checklist still works for this visit.
    }
  };

  const toggle = (index: number) => persist({ ...checked, [index]: !checked[index] });

  const done = checkable.filter((index) => checked[index]).length;
  const total = checkable.length;
  const complete = total > 0 && done === total;

  return (
    <section className="doc-checklist" aria-labelledby={headingId} data-complete={complete || undefined}>
      <header className="doc-checklist-head">
        <h4 id={headingId}>{title}</h4>
        {total > 0 && (
          <div className="doc-checklist-progress">
            <span aria-live="polite">{done} of {total} checked</span>
            <div className="doc-checklist-bar" role="progressbar" aria-label={`${title} progress`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
              <div style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
        )}
      </header>

      <ul className="doc-checklist-list">
        {rules.map((rule, index) => {
          if (rule.type === 'must') {
            const isChecked = Boolean(checked[index]);
            return (
              <li key={index}>
                <label className="doc-checklist-item" data-checked={isChecked || undefined}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggle(index)} />
                  <span className="doc-checklist-box" aria-hidden="true">{isChecked && <Check size={14} strokeWidth={3} />}</span>
                  <span className="doc-checklist-text">{rule.text}</span>
                </label>
              </li>
            );
          }
          return (
            <li key={index}>
              <div className="doc-checklist-item doc-checklist-reminder" data-kind={rule.type}>
                <span className="doc-checklist-tag">{rule.type === 'avoid' ? 'Avoid' : 'Note'}</span>
                <span className="doc-checklist-text">{rule.text}</span>
              </div>
            </li>
          );
        })}
      </ul>

      {done > 0 && (
        <footer className="doc-checklist-foot">
          <button type="button" onClick={() => persist({})}>Clear ticks</button>
        </footer>
      )}
    </section>
  );
}
