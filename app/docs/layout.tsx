import { source } from '@/lib/source';
import { slimTree } from '@/lib/slim-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions, docsTabs } from '@/lib/layout.shared';
import { SidebarProgress } from '@/features/progress';
import { TimerTrigger } from '@/features/study-timer';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = slimTree(source.getPageTree());
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      tree={tree}
      nav={{ ...base.nav, mode: 'top' }}
      tabMode="navbar"
      tabs={docsTabs(tree)}
      sidebar={{ collapsible: false, banner: <SidebarProgress key="progress"><TimerTrigger /></SidebarProgress> }}
    >
      {children}
    </DocsLayout>
  );
}
