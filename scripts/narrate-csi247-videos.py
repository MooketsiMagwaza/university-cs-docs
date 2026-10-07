"""Generate Microsoft Ava narration with duration-driven Remotion scene timing.

Requires edge-tts==7.2.8 and mutagen==1.48.1. Sends only the authored lesson
scripts to Microsoft's online speech service. Does not use or clone reel audio.
"""
import asyncio
import hashlib
import json
import math
import subprocess
from pathlib import Path
import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parents[1]
VOICE = 'en-US-AvaMultilingualNeural'
FPS = 24

async def main():
    stories = json.loads((ROOT / 'videos/csi247/storyboards.json').read_text(encoding='utf8'))
    # The revised merge pilot is generated from the same computed operations
    # that drive its visuals, not separately transcribed intermediate arrays.
    stories['merge-sort'] = json.loads(subprocess.check_output([
        'node', '--input-type=module', '-e',
        'import {createMergeJourney} from "./videos/csi247/merge-journey.mjs"; console.log(JSON.stringify(createMergeJourney()));'
    ], cwd=ROOT, text=True, encoding='utf8'))
    destination = ROOT / 'public/files/sem3/csi247/videos/narration'
    destination.mkdir(parents=True, exist_ok=True)
    for slug, story in stories.items():
        frame = 0
        for index, scene in enumerate(story['scenes']):
            digest = hashlib.sha256((VOICE + scene['narration']).encode()).hexdigest()[:12]
            name = f'{slug}-{index+1}-{digest}.mp3'
            audio = destination / name
            valid = False
            if audio.exists() and audio.stat().st_size:
                try:
                    valid = MP3(audio).info.length > 0
                except Exception:
                    pass
            if not valid:
                pending = audio.with_suffix('.pending.mp3')
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(scene['narration'], VOICE, rate='-4%').save(str(pending))
                        assert MP3(pending).info.length > 0, 'Speech service returned empty audio'
                        pending.replace(audio)
                        break
                    except Exception:
                        if attempt == 2:
                            raise
                        await asyncio.sleep(2 * (attempt + 1))
            duration = MP3(audio).info.length
            scene.update(audio=f'files/sem3/csi247/videos/narration/{name}',
                         fromFrame=frame, durationInFrames=math.ceil((duration + .75) * FPS))
            frame += scene['durationInFrames']
        story.update(durationInFrames=frame, fps=FPS, voice=VOICE)
        print(f'{slug}: {frame/FPS:.1f}s; {VOICE}', flush=True)
    (ROOT / 'videos/csi247/timings.json').write_text(json.dumps(stories, indent=2)+'\n', encoding='utf8')

asyncio.run(main())
