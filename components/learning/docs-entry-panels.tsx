'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Binary,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Command,
  FileQuestion,
  Focus,
  GraduationCap,
  Layers3,
  Search,
  Target,
  TimerReset,
} from 'lucide-react';

const semesters = [
  {
    label: 'Semester I (WIP)',
    eyebrow: 'Foundations',
    status: 'In progress',
    href: '/docs/sem1',
    description: 'Discrete reasoning, Java fundamentals, computing systems, pre-calculus, and academic literacy.',
    courses: ['CSI131', 'CSI141', 'CSI161', 'MAT111', 'COM141'],
  },
  {
    label: 'Semester II (WIP)',
    eyebrow: 'Application',
    status: 'In progress',
    href: '/docs/sem2',
    description: 'Proof, object-oriented Java, calculus, probability, and academic writing.',
    courses: ['CSI132', 'CSI142', 'MAT122', 'STA122', 'COM142'],
  },
  {
    label: 'Semester III',
    eyebrow: 'Core depth',
    status: null,
    href: '/docs/sem3',
    description: 'Data structures, functional programming, discrete structures, calculus, and management.',
    courses: ['CSI247', 'CSI243', 'CSI213', 'MAT221', 'MGT202'],
  },
  {
    label: 'Semester V',
    eyebrow: 'Advanced study',
    status: null,
    href: '/docs/sem5',
    description: 'Algorithm design and advanced data-structure problem solving.',
    courses: ['CSI323'],
  },
];

export function DocsWelcome() {
  return <div className="docs-welcome">
    <section className="welcome-hero">
      <div className="welcome-hero-copy">
        <div className="welcome-kicker">University of Botswana Computer Science study system</div>
        <h1 id="welcome-to-university-docs"><span className="welcome-title-line">Learn the course.</span><span className="welcome-title-line welcome-title-muted">Prove you know it.</span></h1>
        <p>Complete notes, active-recall review, guided questions, difficult mock exams, and original lecture resources—organized into one dependable route from first contact to exam readiness.</p>
        <div className="welcome-actions">
          <Link className="welcome-primary" href="/docs/sem1">Browse courses <ArrowRight size={17} /></Link>
          <Link className="welcome-secondary" href="/docs/study-tools"><TimerReset size={17} /> Start a focus block</Link>
        </div>
      </div>
      <div className="welcome-system-card" aria-label="Study flow overview">
        <div className="system-card-head"><div><span>Study flow</span><strong>One topic. Four stages.</strong></div><Focus size={19} /></div>
        <div className="system-stages">
          <div><span>01</span><BookOpenCheck size={18} /><strong>Notes</strong><small>Build the full model</small></div>
          <div><span>02</span><BrainCircuit size={18} /><strong>Review</strong><small>18 flashcards + quiz</small></div>
          <div><span>03</span><FileQuestion size={18} /><strong>Questions</strong><small>15 guided problems</small></div>
          <div><span>04</span><GraduationCap size={18} /><strong>Exam</strong><small>30 advanced problems</small></div>
        </div>
      </div>
    </section>

    <section className="welcome-stats" aria-label="Documentation coverage">
      <div><strong>4</strong><span>semesters</span></div>
      <div><strong>16</strong><span>courses</span></div>
      <div><strong>59</strong><span>guided topics in Semesters I–II</span></div>
      <div><strong>137+</strong><span>local source resources</span></div>
    </section>

    <section className="welcome-section">
      <div className="welcome-section-head"><div><span>Course library</span><h2>Choose where you are studying</h2></div><Layers3 size={21} /></div>
      <div className="semester-grid">
        {semesters.map((semester, index) => <Link key={semester.href} className={`semester-card ${semester.status ? 'semester-card-wip' : ''}`} href={semester.href}>
          <div className="semester-card-top"><span>{semester.eyebrow}</span><div>{semester.status && <b className="semester-wip">{semester.status}</b>}<em>0{index + 1}</em></div></div>
          <h3>{semester.label}</h3>
          <p>{semester.description}</p>
          <div className="course-chips">{semester.courses.map((course) => <span key={course}>{course}</span>)}</div>
          <div className="semester-open">Open semester <ArrowRight size={15} /></div>
        </Link>)}
      </div>
    </section>

    <section className="welcome-search-tip">
      <div className="search-key"><Search size={18} /></div>
      <div><strong>Jump directly to anything</strong><p>Search course codes, definitions, methods, or resource titles from anywhere in the docs.</p></div>
      <kbd><Command size={13} /> K</kbd>
    </section>
  </div>;
}

export function StudyWorkspaceHeader() {
  return <section className="study-workspace-header">
    <div className="study-workspace-icon"><TimerReset size={24} /></div>
    <div className="study-workspace-copy">
      <div className="welcome-kicker"><Clock3 size={14} /> Personal focus workspace</div>
      <h1 id="pomodoro-focus-timer">Protect one block of attention.</h1>
      <p>Choose one task, start the timer, and keep the same countdown while you move through notes, questions, and review pages. Settings and today’s focus totals remain saved on this device.</p>
      <div className="workspace-features">
        <span><CheckCircle2 size={14} /> Persistent progress</span>
        <span><CheckCircle2 size={14} /> Custom cycles</span>
        <span><CheckCircle2 size={14} /> One global timer</span>
      </div>
    </div>
    <div className="workspace-sequence" aria-label="Three-step workflow">
      <div><span>01</span><strong>Choose one task</strong></div>
      <ArrowRight size={15} />
      <div><span>02</span><strong>Focus</strong></div>
      <ArrowRight size={15} />
      <div><span>03</span><strong>Take a break</strong></div>
    </div>
  </section>;
}
