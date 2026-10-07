# CSI247 narrated recap experiments

Four original portrait recaps (720×1280, 24 fps) complement the full lessons:
merge returns, sorting movements, searching, and Java packages. They are optional
on the two chapter resource pages, never autoplay, and include captions plus a
complete accessible transcript. They are experiments, not replacements for the
reference diagrams or complete annotated Java lessons.

## Generate

1. Install the repository dependencies with `npm ci` (Node 22).
2. Install `edge-tts==7.2.8` and `mutagen==1.48.1` in a Python virtual environment.
3. Run `python scripts/narrate-csi247-videos.py` from that environment.
4. Install Chromium using `npx playwright install chromium`.
5. Run `node scripts/render-csi247-videos.mjs`.

Use `--stills-only` for a fast layout pass or `--only=merge-sort` for one render.
The renderer emits one QA still per scene in `tmp/csi247-video-qa`, plus MP4,
poster and WebVTT files in `public/files/sem3/csi247/videos`. The narration script
measures actual MP3 duration and adds a 0.75-second pause before the next scene.
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
own greater-than comparison. A persistent overview label and narration explain
that the accompanying Java executes left, then right; visual simultaneity is
not presented as parallel Java execution. Check provider terms and Remotion's applicable
license before expanding this prototype into a commercial production workflow.

## Review checklist

- Split ranges do not rearrange values; merges copy rather than swap.
- Each input pointer advances only when that input supplies the output.
- Leftovers do not perform another key comparison; copy-back is shown separately.
- Source code commands include a source file, output root and package identity.
- Inspect all scene stills, then play with sound and with captions.
- Text must fit the safe area at phone size; no hidden subtitle overflow.
- The full lesson remains the primary study path; video controls stay optional.
