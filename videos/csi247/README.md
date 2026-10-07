# CSI247 narrated recap experiments

Four original recaps complement the full lessons. The merge-sort film is
1440×1440 at 60 fps; sorting movements, searching and packages retain their
720×1280, 24 fps pilots. They are optional
on the two chapter resource pages, never autoplay, and include captions plus a
complete accessible transcript. They are experiments, not replacements for the
reference diagrams or complete annotated Java lessons.

## Generate

1. Install the repository dependencies with `npm ci` (Node 22).
2. Install `edge-tts==7.2.8` and `mutagen==1.48.1` in a Python virtual environment.
3. Run `python scripts/narrate-csi247-videos.py` from that environment.
4. Run `python scripts/generate-csi247-video-sfx.py` for the original quiet cues.
5. Install Chromium using `npx playwright install chromium`.
6. Run `node scripts/render-csi247-videos.mjs --only=merge-sort --stills-only --beats`.
7. Review the beat frames, then run `node scripts/render-csi247-videos.mjs --only=merge-sort`.

Use `--stills-only` for a fast layout pass or `--only=merge-sort` for one render.
The renderer emits one QA still per scene in `tmp/csi247-video-qa`, plus MP4,
poster and WebVTT files in `public/files/sem3/csi247/videos`. The narration script
measures actual MP3 duration and adds a 0.35-second pause for merge, 0.75 seconds
for the older pilots. `--beats` checks each decision, travel and landing. With
Pillow installed, `python scripts/inspect-csi247-video.py` makes contact sheets;
add `--encoded` to inspect equivalent frames decoded from the actual MP4 and
validate dimensions, frame rate, codecs and audio/video duration.
Use `--captions-only --only=merge-sort` to rebuild speech-timed captions without
re-rendering the film; punctuation is restored from the authored narration.
Matching voice/text hashes reuse existing recordings without a network call.

## Sources and narration

`storyboards.json` contains the first pilots' authored scripts. The revised merge
pilot uses `merge-journey.mjs` as its execution-derived source of truth; the
narration builder replaces that pilot's original storyboard with this trace.
`timings.json` is generated;
the website uses it for accurate durations and transcripts. Narration uses
Microsoft `en-US-AvaMultilingualNeural` through the Edge online speech service
with [edge-tts](https://github.com/rany2/edge-tts), not a cloned voice. Generating
new narration sends the lesson text to that service and requires network access.
The output explicitly identifies AI narration. Offline video playback needs no
speech service, Remotion runtime, or third-party embed.

Animations use [Remotion](https://www.remotion.dev/docs/). No Instagram video,
music, images, branding, or audio is included in the published assets. The
initial web embeds were inaccessible. The user subsequently supplied the actual
merge-sort MP4; all 902 frames were reviewed locally. See
`docs/csi247-merge-video-reference-analysis.md` for timestamped findings and the
adaptation rationale. The revised merge pilot carries over persistent context,
visible copy paths, comparison holds and code highlighting, using original
graphics. Both child merges animate together as the user requested, with their
own greater-than comparison. A persistent overview label explains
that the accompanying Java executes left, then right; visual simultaneity is
not presented as parallel Java execution. Check provider terms and Remotion's applicable
license before expanding this prototype into a commercial production workflow.

## Soft-glass storytelling revision

The user selected the B1 soft-glass reference for the video only. The study-site
theme and existing diagrams are unchanged. Eight values, `[7,3,8,2,6,1,5,4]`,
split into singles, return as four pairs, return as two ordered halves, then
join into `[1,2,3,4,5,6,7,8]`. Bars retain their input colour during each merge;
colour roles reset for the new inputs at the next level. Active fronts are also
outlined and pointed to, so colour is not the only cue.

The motion prompt is adapted to a narrated instructional film in Remotion,
not its unrelated 14-second UI-widget loop. A persistent soft white stage,
blue/mint bars, curved copy paths, deterministic critically damped springs and
traffic-light Java editor provide the visual language. It is not an exact
HTML/Playwright/tmix implementation; the final export is native 60 fps with no
temporal blur applied to instructional text. No music, particles or decorative
UI controls are added. The finish deliberately holds the sorted answer instead
of silently undoing it to make a seamless loop.

Ava's measured word boundaries drive named decisions and short caption cues.
The first comparisons stay visible until she names both lanes. The first three
final values land at their spoken word endings. Original procedural sound cues
are scheduled with their measured waveform peaks on the decision/landing/return
events, at low gain under speech. There are no on-screen or spoken operation
totals. The full trace still has regression checks for correctness and stable
ties; those technical checks are not part of the beginner narration.

## Review checklist

- Split ranges do not rearrange values; merges copy rather than swap.
- Each input pointer advances only when that input supplies the output.
- Leftovers do not perform another key comparison; copy-back is shown separately.
- Source code commands include a source file, output root and package identity.
- Inspect all scene stills, then play with sound and with captions.
- Text must fit the safe area at phone size; no hidden subtitle overflow.
- The full lesson remains the primary study path; video controls stay optional.
