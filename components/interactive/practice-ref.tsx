import { preload } from 'react-dom';
import { describePracticeGroup } from '@/lib/practice-data';
import { PracticeLoader } from './practice-loader';

/**
 * Shows one group of practice questions from a JSON file under content/practice-data (see lib/practice-data.ts). The
 * questions are not part of the page: the page asks the browser to start downloading the data file early and the
 * questions appear when it arrives (see lib/lazy-data.ts).
 */
export async function PracticeRef({ src, group }: { src: string; group: string }) {
  const { count, url } = await describePracticeGroup(src, group);
  preload(url, { as: 'fetch', crossOrigin: 'anonymous', fetchPriority: 'low' });
  return <PracticeLoader url={url} group={group} count={count} />;
}
