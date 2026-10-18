'use client';

import { useStudyTimer } from '../timer-provider';
import { MAX_LABEL_LENGTH } from '../timer-types';

/** "What are you studying?" The label is kept with each finished focus block. `id` keeps two copies apart. */
export function TimerLabel({ id }: { id: string }) {
  const { state, setLabel } = useStudyTimer();
  return (
    <label className="timer-label" htmlFor={id}>
      <span>What are you studying?</span>
      <input
        id={id}
        className="timer-label-input"
        type="text"
        value={state.label}
        maxLength={MAX_LABEL_LENGTH}
        placeholder="Optional"
        autoComplete="off"
        onChange={(event) => setLabel(event.target.value)}
      />
    </label>
  );
}
