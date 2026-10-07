"""Generate Microsoft Ava narration with duration-driven Remotion scene timing.

Requires edge-tts==7.2.8 and mutagen==1.48.1. Sends only the authored lesson
scripts to Microsoft's online speech service. Does not use or clone reel audio.
"""
import asyncio
import hashlib
import json
import math
from pathlib import Path
import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parents[1]
VOICE = 'en-US-AvaMultilingualNeural'
FPS = 24

async def main():
    stories = json.loads((ROOT / 'videos/csi247/storyboards.json').read_text(encoding='utf8'))
    destination = ROOT / 'public/files/sem3/csi247/videos/narration'
    destination.mkdir(parents=True, exist_ok=True)
    for slug, story in stories.items():
        frame = 0
        for index, scene in enumerate(story['scenes']):
            digest = hashlib.sha256((VOICE + scene['narration']).encode()).hexdigest()[:12]
            name = f'{slug}-{index+1}-{digest}.mp3'
            audio = destination / name
            if not audio.exists():
                await edge_tts.Communicate(scene['narration'], VOICE, rate='-4%').save(str(audio))
            duration = MP3(audio).info.length
            scene.update(audio=f'files/sem3/csi247/videos/narration/{name}',
                         fromFrame=frame, durationInFrames=math.ceil((duration + .75) * FPS))
            frame += scene['durationInFrames']
        story.update(durationInFrames=frame, fps=FPS, voice=VOICE)
        print(f'{slug}: {frame/FPS:.1f}s; {VOICE}', flush=True)
    (ROOT / 'videos/csi247/timings.json').write_text(json.dumps(stories, indent=2)+'\n', encoding='utf8')

asyncio.run(main())
