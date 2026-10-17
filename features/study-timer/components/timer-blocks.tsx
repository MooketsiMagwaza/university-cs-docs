'use client';

import { useStudyTimer } from '../timer-provider';

const SHOWN = 8;

function clock(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Today's finished focus blocks, newest first. Nothing is shown until there is one. */
export function TimerBlocks() {
  const { state } = useStudyTimer();
  if (state.blocks.length === 0) return null;
  return (
    <div className="timer-blocks">
      <p className="timer-blocks-title">Today</p>
      <ul>
        {state.blocks.slice(-SHOWN).reverse().map((block) => (
          <li key={block.id}>
            <time dateTime={new Date(block.at).toISOString()}>{clock(block.at)}</time>
            <span>{block.label || 'Focus block'}</span>
            <small>{block.minutes} min</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
