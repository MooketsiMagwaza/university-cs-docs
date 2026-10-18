'use client';

import { useState } from 'react';
import { clamp } from './picture-helpers';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Round what is typed to a whole number. */
  integer?: boolean;
  onChange(value: number): void;
};

/**
 * A labelled number input. While the reader is typing, the box keeps exactly what they typed (so they can clear it and
 * start again); every complete number is passed on, kept between min and max, and the box shows the kept value again
 * when they leave it.
 */
export function NumberField({ label, value, min, max, step = 1, integer = false, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <label className="pic-field">
      <span>{label}</span>
      <input
        type="number"
        inputMode={integer ? 'numeric' : 'decimal'}
        min={min}
        max={max}
        step={step}
        value={draft ?? String(value)}
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          const typed = Number(text);
          if (text.trim() === '' || !Number.isFinite(typed)) return;
          onChange(clamp(integer ? Math.round(typed) : typed, min, max));
        }}
        onBlur={() => setDraft(null)}
      />
    </label>
  );
}
