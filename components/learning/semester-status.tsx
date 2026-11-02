import { AlertTriangle, HardHat } from 'lucide-react';

/**
 * The "work in progress" banner. Put it at the top of a semester page, or of a course or topic Overview, to say that the
 * section is still being written and checked. `semester` names what is unfinished ("Semester V", "CSI323: Algorithms",
 * "Trees & BSTs"); `name` is the same prop under a clearer name for a course or topic, and wins when both are given.
 */
export function SemesterWorkInProgress({ semester, name }: { semester?: string; name?: string }) {
  const label = name ?? semester ?? 'This section';
  return <aside className="semester-wip-banner" role="note" aria-label={`${label} content status`}>
    <div className="semester-wip-icon"><HardHat size={25} /></div>
    <div>
      <span><AlertTriangle size={13} /> Work in progress</span>
      <h2>{label} is not study-ready yet</h2>
      <p>Notes, examples, questions, and source coverage are still being expanded and checked. Do not rely on this section as your only exam resource; verify every topic against current lectures, the official outline, and the Resource Hub.</p>
    </div>
  </aside>;
}
