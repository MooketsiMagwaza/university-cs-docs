import stories from '@/videos/csi247/timings.json';

/** Native media controls; no Remotion runtime or autoplay in the study site. */
export function Csi247LessonVideo({ id }: { id: keyof typeof stories }) {
  const story = stories[id];
  const base = `/files/sem3/csi247/videos/${id}`;
  return <details className="my-4 rounded-lg border border-fd-border bg-fd-card p-4">
    <summary className="cursor-pointer font-medium">Watch: {story.title} <span className="text-sm text-fd-muted-foreground">({Math.round(story.durationInFrames / story.fps)}s)</span></summary>
    <p className="text-sm text-fd-muted-foreground">Experimental recap · AI narration by Microsoft Ava. Try the lesson diagram first, then use this to review.</p>
    <video className={`mx-auto my-4 max-h-[70vh] w-full rounded-lg ${id === 'merge-sort' ? 'max-w-2xl' : 'max-w-sm'}`} controls playsInline preload="none" poster={`${base}.png`} aria-label={story.title}>
      <source src={`${base}.mp4`} type="video/mp4" />
      <track kind="captions" src={`${base}.vtt`} srcLang="en" label="English" />
      Your browser does not support embedded video. <a href={`${base}.mp4`}>Download the recap</a>.
    </video>
    <details className="mt-4"><summary className="cursor-pointer text-sm font-medium">Read the complete transcript</summary>
      {story.scenes.map(scene => <div key={scene.fromFrame} className="mt-4"><h3 className="text-base font-semibold">{scene.heading}</h3><p>{scene.narration}</p></div>)}
    </details>
  </details>;
}
