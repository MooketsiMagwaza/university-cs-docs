# CSI247 visual and video plan

## Decision

The topic-embedded interactive walkthrough is the primary learning tool. A learner can stop before a pass, predict the next row, and compare their answer with the dry-run table.

Use Remotion for a short narrated recap for each method after the lesson scenes are stable. Remotion fits this project because the same React scene data can drive the website player, static screenshots, and a timed video composition. A generic YouTube video should be supplementary only: its arrays, notation, counting conventions, theme, and course terminology may differ from the notes.

Publish one video per method rather than one long Searching and Sorting video:

- Linear search: 1.5-2 minutes
- Binary search: 2-3 minutes
- Bubble sort: 2.5-3.5 minutes
- Selection sort: 2.5-3.5 minutes
- Insertion sort: 3-4 minutes
- Merge sort: 5-7 minutes
- Packages: three 2-3 minute videos for imports, folder identity, and compile/run lookup

## Shared visual grammar

- monochrome background and typography matching the site;
- blue = value or range being checked;
- red = saved key, movement, or boundary that will change;
- green = found value, sorted section, or completed output;
- show the full array whenever space allows;
- keep indexes visible under cards;
- one scene per search iteration, outer-loop pass, split level, or merge return;
- keep the relevant dry-run row visible while narration explains it;
- introduce Java only after the visual trace and properties;
- include captions and the full transcript beside the video.

## Voice recommendation

A real recording by the course author is the best final voice because it carries natural emphasis and matches the lecturer/student context. Record in short sections, remove long silences and noise, and keep the original pacing rather than over-processing it.

For a fast draft, Microsoft's Ava voice is a reasonable synthetic option. Treat it as a review track, not the only source: manually add pauses, verify pronunciation, and replace awkward readings of expressions such as `arr[j]`, `O(n squared)`, `low`, `mid`, and `high`. Keep the captions authoritative if the voice mispronounces notation.

## Script: Linear search

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | `[63, 29, 85, 72, 18, 42]`, key 18 above it | "Linear search starts at the left and checks one value at a time. It does not need a sorted array." |
| 2 | Index 0 blue; `63 == 18 -> false`; index 0 fades red | "At index zero, 63 is not 18. That position is ruled out, so we move exactly one place right." |
| 3 | Checks 29, 85, and 72; dry-run rows appear | "The same question repeats. A false answer gives us no information about distant positions, so none may be skipped." |
| 4 | Index 4 green; `18 == 18 -> true` | "At index four the condition is true. Return four immediately. Index five is never checked." |
| 5 | Best/worst comparison | "The best case is one comparison. If the key is last or absent, all n values are checked, giving O of n time." |

## Script: Binary search

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | Sorted array `[2, 6, 12, 32, 50, 59, 76, 83, 90]`, key 88 | "Binary search can discard values only because this array is sorted. Low and high mark every position where 88 could still be." |
| 2 | Low 0, mid 4, high 8; 50 blue | "The midpoint is four, holding 50. Since 50 is smaller than 88, indexes zero through four are too small. Low becomes five." |
| 3 | Mid 6 holding 76, then mid 7 holding 83 | "Each comparison removes the midpoint and one whole side. The possible range shrinks from nine values to four, then to two." |
| 4 | Mid 8 holding 90; all cards ruled out | "90 is larger than 88, so high becomes seven. Low is now eight and high is seven. The range is empty, so 88 is absent after four iterations." |
| 5 | `n -> n/2 -> n/4` | "Halving produces logarithmic time. Without sorted order, this reasoning is invalid even if the Java code still runs." |

## Script: Bubble sort

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | `[4, 2, 5, 1, 3]`; neighbour bracket | "Bubble sort compares neighbours from left to right. Swap only when the left value is larger." |
| 2 | Pass 1 comparisons grouped; 5 moves to final green cell | "During pass one, the largest unsorted value keeps moving right. After the pass, 5 is guaranteed to be final." |
| 3 | Passes 2 and 3; green suffix grows | "The next pass stops before the green suffix. Each completed pass fixes one more value on the right." |
| 4 | Pass 4 has no swap | "A complete pass with no swap proves that every adjacent pair is ordered. The optimized method can stop early." |
| 5 | Table and properties | "Bubble sort is stable when equal values are not swapped. Its worst case is O of n squared, but sorted input can take O of n with the early stop." |

## Script: Selection sort

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | Index 0 red; minimum 1 blue | "Selection sort fills one final position per pass. First scan the whole unsorted section to find its minimum." |
| 2 | Swap 4 and 1; index 0 becomes green | "The minimum is 1 at index three. Only after the scan ends do we swap it into index zero." |
| 3 | Pass 2 minimum already at index 1 | "If the minimum is already in place, no swap is needed. The scan still had to happen to prove that 2 was smallest." |
| 4 | Remaining passes and dry-run table | "The sorted prefix grows from the left. Selection sort always makes a quadratic number of comparisons, but at most one swap per pass." |
| 5 | Stability example `2a, 2b, 1` | "A long-distance swap can move equal records past each other, so the standard selection sort is not stable." |

## Script: Insertion sort

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | First card green; next card red | "Insertion sort keeps a sorted section on the left. Pick up the next card and save it as the key." |
| 2 | Pass 1, key 2; 4 shifts right | "Compare from right to left. Four is larger than two, so four shifts right and two fills the gap." |
| 3 | Pass 2, key 5; false comparison | "Four is not larger than five. Nothing shifts, and five stays where it is." |
| 4 | Pass 3, key 1; 5, 4, and 2 shift | "One is smaller than the whole sorted section. Hold one safely while 5, 4, and 2 each move one cell right." |
| 5 | Pass 4, key 3; stop after `2 > 3` is false | "Five and four shift. The false comparison with two identifies the gap immediately after two." |
| 6 | Pass table and complexity | "The key travels only as far as needed. That makes sorted or nearly sorted data fast, while reverse order produces O of n squared work." |

## Script: Merge sort

| Scene | Visual | Voice-over |
|---|---|---|
| 1 | One eight-card run | "Merge sort has two phases that must not be mixed up. Splitting creates smaller problems; merging creates sorted results." |
| 2 | Two halves, then one-value leaves | "The divide phase changes ranges, not values. Recursion keeps halving until a range contains one value, which is already sorted." |
| 3 | Pair merges appear in return order | "Now calls return. Compare the fronts of two sorted runs, copy the smaller front, and advance only that run's pointer." |
| 4 | `[29, 63]` merges with `[72, 85]` | "Because both inputs are sorted, the first front comparison is enough to choose the next output value. We never scan behind a larger front value." |
| 5 | Two sorted halves | "The entire left half finishes before recursion starts returning merges from the right half. This is why the trace is depth-first, not level-by-level." |
| 6 | Final merge with output row | "The final merge combines two sorted halves. When one side becomes empty, copy the other side's leftovers without further key comparisons." |
| 7 | Level bars: n work across log n levels | "Every merge level copies all n values, and there are about log base two of n levels. The time is O of n log n. The temporary array uses O of n extra space." |
| 8 | Equal left/right cards, left selected | "Choose the left value on a tie. That preserves the original order of equal records and makes the sort stable." |

## Script: Packages

### Imports and names

"A package is an address for related classes. In `java.util.Scanner`, `java.util` is the package address and `Scanner` is the class. An import lets this source file use the short class name. It does not copy the class, install a library, or include subpackages."

### User-defined folders

"Three representations must agree. The library class uses `package pkg;`, the path `src/pkg/A.java`, and the name `pkg.A`. The program uses `package app;`, the path `src/app/Tester.java`, and the name `app.Tester`. Dots describe package names; folders mirror them on disk."

### Compile and run

"The compiler begins at the source root and writes class files below the output root. The runtime begins at the classpath root and combines it with the fully qualified class name. Therefore `classes` plus `app.Tester` resolves to `classes/app/Tester.class`."

## Production checklist

- render 1920x1080 at 30 fps and verify a 1280x720 downscale;
- keep the first useful visual within two seconds;
- use sentence-level captions with high contrast;
- leave two beats for the learner to predict before revealing a pass;
- say whether counts mean comparisons, swaps, shifts, writes, or merges;
- never show a code line before its movement has been explained;
- test the final video with sound off and with the transcript alone;
- embed the video inside its matching topic, directly after the interactive trace;
- keep YouTube as the hosting option only if the course owns the upload and captions.
