import { AlertTriangle, HardHat } from 'lucide-react';

export function SemesterWorkInProgress({ semester }: { semester: string }) {
  return <aside className="semester-wip-banner" role="note" aria-label={`${semester} content status`}>
    <div className="semester-wip-icon"><HardHat size={25} /></div>
    <div>
      <span><AlertTriangle size={13} /> Work in progress</span>
      <h2>{semester} is not study-ready yet</h2>
      <p>Notes, examples, questions, and source coverage are still being expanded and checked. Do not rely on this section as your only exam resource; verify every topic against current lectures, the official outline, and the Resource Hub.</p>
    </div>
  </aside>;
}
