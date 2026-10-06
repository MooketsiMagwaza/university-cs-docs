'use client';

function Segment({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'blue' | 'red' | 'green' }) {
  const styles = tone === 'blue' ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300' : tone === 'red' ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300' : tone === 'green' ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-fd-border bg-fd-background text-fd-foreground';
  return <div className={`rounded-xl border-2 px-4 py-3 font-mono font-semibold ${styles}`}>{children}</div>;
}

export function PackageImportStory() {
  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual model</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">A package is the address; a class is the item at that address</h3></header>
      <div className="px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Fully qualified class name java dot util dot Scanner"><Segment tone="blue">java</Segment><span className="text-xl text-fd-muted-foreground">.</span><Segment tone="blue">util</Segment><span className="text-xl text-fd-muted-foreground">.</span><Segment tone="green">Scanner</Segment></div>
        <div className="mt-3 flex flex-wrap justify-center gap-6 text-xs text-fd-muted-foreground"><span><strong className="text-blue-700 dark:text-blue-300">java.util</strong> = package address</span><span><strong className="text-emerald-700 dark:text-emerald-300">Scanner</strong> = class name</span></div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-fd-border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Full address every time</div><code className="mt-3 block text-sm">java.util.Scanner input;</code><p className="mb-0 mt-2 text-sm text-fd-muted-foreground">No import required.</p></div>
          <div className="rounded-xl border border-fd-border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Import one class</div><code className="mt-3 block text-sm">import java.util.Scanner;</code><p className="mb-0 mt-2 text-sm text-fd-muted-foreground">Use the short name `Scanner` below.</p></div>
          <div className="rounded-xl border border-fd-border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Import direct classes</div><code className="mt-3 block text-sm">import java.util.*;</code><p className="mb-0 mt-2 text-sm text-fd-muted-foreground">Does not include subpackages.</p></div>
        </div>
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6"><table className="w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">What Java sees</th><th className="px-3 py-2">Meaning</th></tr></thead><tbody><tr className="border-b border-fd-border/70"><td className="px-3 py-2 font-mono">java.lang.String</td><td className="px-3 py-2">Automatically available; no import needed</td></tr><tr className="border-b border-fd-border/70"><td className="px-3 py-2 font-mono">java.util.Scanner</td><td className="px-3 py-2">Built-in class reached by import or full name</td></tr><tr><td className="px-3 py-2 font-mono">pkg.A</td><td className="px-3 py-2">User-defined class A inside package pkg</td></tr></tbody></table></div>
    </section>
  );
}

export function PackageFolderStory() {
  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual model</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Declarations define identities; folders make those identities easy to find</h3></header>
      <div className="package-story-grid px-4 py-6 sm:px-6">
        <div><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Source folders</div><pre className="mt-3 rounded-xl border border-fd-border bg-fd-muted/15 p-4 font-mono text-sm text-fd-foreground">{`project/
└─ src/
   ├─ pkg/
   │  ├─ A.java
   │  └─ B.java
   └─ app/
      └─ Tester.java`}</pre></div>
        <div className="text-center text-2xl text-fd-muted-foreground" aria-hidden="true">↔</div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Inside each file</div><div className="mt-3 space-y-3 rounded-xl border border-blue-500/50 bg-blue-500/5 p-4"><code className="block font-semibold text-blue-700 dark:text-blue-300">A.java → package pkg;</code><code className="block font-semibold text-blue-700 dark:text-blue-300">B.java → package pkg;</code><code className="block font-semibold text-blue-700 dark:text-blue-300">Tester.java → package app;</code><p className="mb-0 text-sm text-fd-muted-foreground">The source tree mirrors each declaration for source-path lookup. A folder alone does not declare a package.</p></div></div>
        <div className="text-center text-2xl text-fd-muted-foreground" aria-hidden="true">↔</div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Compiled folders</div><pre className="mt-3 rounded-xl border border-fd-border bg-fd-muted/15 p-4 font-mono text-sm text-fd-foreground">{`project/
└─ classes/
   ├─ pkg/
   │  ├─ A.class
   │  └─ B.class
   └─ app/
      └─ Tester.class`}</pre></div>
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6"><table className="trace-table w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Class</th><th className="px-3 py-2">Declaration</th><th className="px-3 py-2">Source path</th><th className="px-3 py-2">Runtime name</th></tr></thead><tbody>{[['A', 'pkg', 'src/pkg/A.java'], ['B', 'pkg', 'src/pkg/B.java'], ['Tester', 'app', 'src/app/Tester.java']].map(([name, packageName, path]) => <tr key={name} className="border-b border-fd-border/70 last:border-0"><td data-label="Class" className="px-3 py-2 font-mono">{name}</td><td data-label="Declaration" className="px-3 py-2 font-mono">package {packageName};</td><td data-label="Source path" data-wide className="px-3 py-2 font-mono">{path}</td><td data-label="Runtime name" data-wide className="px-3 py-2 font-mono">{packageName}.{name}</td></tr>)}</tbody></table></div>
    </section>
  );
}

export function PackageBuildStory() {
  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual model</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Compile from source roots; run from classpath roots</h3></header>
      <div className="px-4 py-6 sm:px-6">
        <div className="package-pipeline">
          <Segment tone="blue">A.java + B.java + Tester.java</Segment><span aria-hidden="true">→</span><Segment>javac -d classes</Segment><span aria-hidden="true">→</span><Segment tone="green">pkg/A.class + pkg/B.class + app/Tester.class</Segment><span aria-hidden="true">→</span><Segment tone="red">java -cp classes app.Tester</Segment>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-fd-border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Compile</div><code className="mt-2 block text-sm">javac -d classes -sourcepath src src/app/Tester.java</code></div><div className="rounded-xl border border-fd-border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Run</div><code className="mt-2 block text-sm">java -classpath classes app.Tester</code></div></div>
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6"><table className="w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Part</th><th className="px-3 py-2">Question it answers</th><th className="px-3 py-2">Value</th></tr></thead><tbody><tr className="border-b border-fd-border/70"><td className="px-3 py-2 font-mono">-sourcepath</td><td className="px-3 py-2">Where can javac find source package folders?</td><td className="px-3 py-2 font-mono">src</td></tr><tr className="border-b border-fd-border/70"><td className="px-3 py-2 font-mono">-d</td><td className="px-3 py-2">Where should compiled package folders be created?</td><td className="px-3 py-2 font-mono">classes</td></tr><tr className="border-b border-fd-border/70"><td className="px-3 py-2 font-mono">-classpath</td><td className="px-3 py-2">Where does the runtime begin looking?</td><td className="px-3 py-2 font-mono">classes</td></tr><tr><td className="px-3 py-2 font-mono">app.Tester</td><td className="px-3 py-2">Which class with main should run?</td><td className="px-3 py-2">Fully qualified name, no extension</td></tr></tbody></table></div>
    </section>
  );
}
