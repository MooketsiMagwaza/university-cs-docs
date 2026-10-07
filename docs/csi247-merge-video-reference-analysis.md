# Merge-sort video reference: frame-complete visual analysis

Reviewed 7 October 2026. Source: the user-supplied local MP4 titled
"Merge Sort (ft. NARUTO). This animation visualizes how merge sort splits a list in half until ea.mp4",
corresponding to Algo In Motion's Instagram reel `DeKZleQPl5V`.

## Method and limits

The video stream is 720 x 1280, 30 fps, 902 frames (30.067 seconds).
The container/audio extends to 30.183 seconds. Every video frame was decoded
and reviewed in 31 sequential, frame-numbered filmstrips; larger stills were
used to read small labels. Frame numbers below are zero-based. Transition
boundaries are the visible frame changes, not inferred source keyframes.

This is a visual/motion analysis. Audio was not transcribed or assessed, so
there are no claims here about its spoken wording, music or sound-effect timing.
Private review frames remain in `tmp/csi247-reference-analysis`; the reference
video, characters, backgrounds and soundtrack are not site assets.

## Timeline

| Frames / time | What actually changes | Teaching function |
|---|---|---|
| 0-62 / 0.00-2.07 s | Eight tiles remain in one row: 27, 3, 9, 38, 41, 12, 5, 14. A character banner slides in, holds, and leaves. Title, counters, caption and six-line Python panel retain fixed locations. | Establish one problem and one stable visual stage. |
| 63-115 / 2.10-3.83 s | Midpoint code highlights; the row separates into two four-value groups. The character duplication and supporting platforms communicate responsibility for each half. | The split changes grouping, not value order. |
| 116-167 / 3.87-5.57 s | The two groups become four pairs. Supports separate spatially while numbers remain identifiable. | Repeat the same split rule at a smaller size. |
| 168-212 / 5.60-7.07 s | Four pairs become eight singletons; the level counter reaches three. | Show the stopping size rather than merely saying "recursion". |
| 213-258 / 7.10-8.60 s | Base-case line highlights and each singleton receives a check mark. | One value is already sorted; no comparison is required. |
| 259-321 / 8.63-10.70 s | Dashed destination cells appear above the row. Each pair's smaller tile is emphasized, then travels upward into the first output slot; the leftover follows. Completed pairs flash green and regroup. | Anticipation, visible travel, arrival, confirmation. Four pair comparisons are counted together. |
| 322-435 / 10.73-14.50 s | Two pair-to-four merges run side by side. The left is emphasized while the right is dimmed. The highlighted fronts are first 3 and 9, then 27 and 9. Each winner travels to the next output cell. | Focus the learner on a single decision without losing the other group's context. |
| 436-483 / 14.53-16.10 s | Compare 27 with 38 and choose 27. The parallel right-side merge has its own third comparison. The total counter reaches ten. | Only the next unread value of each sorted group can be the next result. |
| 484-539 / 16.13-17.97 s | The remaining values are added without another comparison. Two sorted groups settle: [3, 9, 27, 38] and [5, 12, 14, 41]. | Distinguish leftovers from comparisons; give the returned result a readable hold. |
| 540-603 / 18.00-20.10 s | Final output slots appear. Compare 3 and 5, then animate 3 into the first slot. | Establish the final merge slowly before speeding up repeated decisions. |
| 604-627 / 20.13-20.90 s | Compare 9 and 5; move 5. | The unchosen 9 stays waiting. |
| 628-651 / 20.93-21.70 s | Compare 9 and 12; move 9. | Advance only the input that supplied the winner. |
| 652-675 / 21.73-22.50 s | Compare 27 and 12; move 12. | Repeat the same rule with no layout change. |
| 676-693 / 22.53-23.10 s | Compare 27 and 14; move 14. | The growing output makes progress visible. |
| 694-711 / 23.13-23.70 s | Compare 27 and 41; move 27. | Shorten the hold once the pattern is established. |
| 712-731 / 23.73-24.37 s | Compare 38 and 41; move 38. Counter reaches seventeen. | Last key comparison, not last movement. |
| 732-749 / 24.40-24.97 s | Copy leftover 41; completed row is [3, 5, 9, 12, 14, 27, 38, 41]. | Finish the output without inflating the comparison count. |
| 750-810 / 25.00-27.00 s | Final row confirms in green, groups combine into one, and the three-level complexity explanation appears. | Return to a single completed problem. |
| 811-901 / 27.03-30.03 s | Gold completion sweep and a large-input complexity comparison close the clip. The result stays visible. | End with the outcome and one takeaway instead of another new trace. |

## Why the motion is readable

- Object identity survives: a number can be followed from its old position to
  its destination instead of disappearing and reappearing in a different slide.
- Destination outlines appear before travel, so the learner knows where to look.
- Comparisons are announced and highlighted before the winning tile moves.
- Values move in short, eased arcs; the arrangement then holds for reading.
- Caption, code and counters occupy stable bands, with only one code line active.
- The unchanged side is visually quieter, while the chosen pair remains legible.

## What the course adaptation should change

The clone metaphor groups operations level by level and shows independent merges
simultaneously. That is a useful overview, but it is **not the execution order of
the single-threaded recursive Java implementation**. Our pilot should finish the
left child before visiting the right child, then merge the two returned results.

The reference also abstracts away memory. Our Java lesson must distinguish a
copy into temporary output, a pointer advance, and copying the completed result
back into the array. A merge is not a swap, and conceptual split movement must
not imply that splitting itself rearranges the input.

Use the site's own colours and type, larger Java fragments, Microsoft Ava, and
an original four-value example for a first lesson. Keep persistent array context,
explicit child returns, highlighted comparisons, destination guides, visible
copy paths and a comparison counter. Slow the first decisions enough for a
beginner; do not reproduce the reel's accelerated ending literally.

Do not reuse the reference's Naruto art, scene, banner, music or rendered frames.
The transferable reference is the motion and explanation structure.

### User-directed side-by-side adaptation

After the initial sequential prototype, the user explicitly requested both
children reordering at the same time, each with its own `x > y` statement and
Java below. The revised pilot therefore pairs the two independent child merge
traces on screen. Both lanes have their own comparison and temporary output;
the parent merge waits until both results have returned. A persistent label
and Ava explanation distinguish this side-by-side overview from the Java
implementation's left-then-right execution. The greater-than form chooses the
right front when true, otherwise the left, preserving left-first ties.

### Later user direction: eight bars and soft glass

The four-value/site-theme/counter recommendation above records the earlier
prototype, not the current target. The user subsequently asked for eight values,
a friendly explanation without operation-count filler, more visible bar motion,
and the B1 soft-glass visual reference for the video only. The new film keeps the
reference's persistent context, curved visible copies and simultaneous child
overview, with larger blue/mint bars and a traffic-light Java panel. Named
decisions follow measured Ava word boundaries. Quiet original synthetic cues
replace the earlier silent movement; no music or source-reel audio is used.
