# Original merge-sort sound cues

These three mono 48 kHz, 16-bit PCM WAVs are synthesized deterministically by
`scripts/generate-csi247-video-sfx.py` using mathematical sine waves and smooth
envelopes. No recordings, samples, music, or third-party sound libraries are
used. They were created for this repository's instructional animation.

The generated cues and their generator are dedicated to the public domain
under CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/

- `compare.wav`: 50 ms, a restrained tick as the two fronts are highlighted.
- `land.wav`: 80 ms, a soft low tone when a copied tile reaches its destination.
- `merge.wav`: 200 ms, two gentle rising tones when a complete range returns.

Suggested Remotion playback volumes: compare 0.45, land 0.50, merge 0.40.
The files already have low peaks; these volumes keep them beneath Ava.
For simultaneous lanes, play one cue for the shared beat rather than stacking
identical cues. Use completion only when a whole range returns. Do not loop.

Regenerate from the repository root with:

```sh
python scripts/generate-csi247-video-sfx.py
```
