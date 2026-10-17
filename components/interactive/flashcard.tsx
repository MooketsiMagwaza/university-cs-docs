'use client';

import { useState, type CSSProperties } from 'react';
import { RichText } from './rich-text';

// Flip mechanics are inline styles so they cannot be lost to a utility-class purge.
const FLIP_TRANSITION = 'transform 0.6s cubic-bezier(0.34, 1.18, 0.5, 1)';
const FACE: CSSProperties = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };

/** One two-sided card. Shared by the standalone Flashcard and the FlashcardDeck. */
export function FlipCard({
  front,
  back,
  flipped,
  onFlip,
  label = 'Flashcard',
}: {
  front: string;
  back: string;
  flipped: boolean;
  onFlip(): void;
  label?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${label}. Activate to ${flipped ? 'show the question' : 'reveal the answer'}.`}
      onClick={onFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onFlip();
        }
      }}
      className="ui-flip-card"
      style={{ perspective: '1400px' }}
    >
      <div
        className="ui-flip-inner"
        style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: FLIP_TRANSITION }}
      >
        <div className="ui-flip-face" style={{ ...FACE, transform: 'rotateY(0deg)' }}>
          <span className="ui-flip-label">Question</span>
          <div className="ui-flip-text ui-flip-front"><span><RichText text={front} /></span></div>
          <span className="ui-flip-hint">Select to reveal the answer</span>
        </div>
        <div className="ui-flip-face ui-flip-back" style={{ ...FACE, transform: 'rotateY(180deg)' }}>
          <span className="ui-flip-label">Answer</span>
          <div className="ui-flip-text"><span><RichText text={back} /></span></div>
          <span className="ui-flip-hint">Select to flip back</span>
        </div>
      </div>
    </div>
  );
}

export function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="ui-flip-single">
      <FlipCard front={front} back={back} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
    </div>
  );
}
