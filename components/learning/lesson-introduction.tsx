import { BookOpenCheck, Route, Target } from 'lucide-react';
import type { ReactNode } from 'react';

export function LessonIntroduction({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="learning-introduction">
      <div className="learning-eyebrow"><BookOpenCheck size={15} />{eyebrow ?? 'Lesson orientation'}</div>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

/** An item is plain text; `backticked` words become inline code. */
function withCode(text: string) {
  return text.split(/(`[^`\n]+`)/g).map((part, index) =>
    part.length > 2 && part.startsWith('`') && part.endsWith('`') ? <code key={index}>{part.slice(1, -1)}</code> : part,
  );
}

export function LearningObjectives({ items }: { items: string[] }) {
  return (
    <section className="learning-list learning-objectives">
      <h2><Target size={19} /> Learning objectives</h2>
      <ul>{items.map((item) => <li key={item}>{withCode(item)}</li>)}</ul>
    </section>
  );
}

export function Prerequisites({ items }: { items: string[] }) {
  return (
    <section className="learning-list learning-prerequisites">
      <h2><Route size={19} /> Prerequisites</h2>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
