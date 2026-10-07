"""Generate Microsoft Ava narration with duration-driven Remotion scene timing.

Requires edge-tts==7.2.8 and mutagen==1.48.1. Sends only the authored lesson
scripts to Microsoft's online speech service. Does not use or clone reel audio.
"""
import asyncio
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path
import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parents[1]
VOICE = 'en-US-AvaMultilingualNeural'
FPS = 24

def word_index(words, text, occurrence=0):
    matches = [w for w in words if re.sub(r'[^a-z]', '', w['text'].lower()) == text]
    return matches[occurrence]

def motion_beats(scene, seconds):
    words, count = scene['words'], scene['groupSize']
    if count in (2, 4):
        # Hold both initial comparisons until Ava names both lanes.
        anchor = word_index(words, 'eight' if count == 2 else 'four')['end']
        first_end = anchor + .85
        ends = [first_end + (seconds-.25-first_end)*i/(count-1) for i in range(count)]
        starts = [0] + ends[:-1]
        moves = [anchor+.08] + [a+(b-a)*.3 for a,b in zip(starts[1:],ends[1:])]
        lands = [first_end-.2] + [a+(b-a)*.79 for a,b in zip(starts[1:],ends[1:])]
    else:
        # Named first values land as Ava says them, not on a uniform slide timer.
        anchors = [word_index(words, word)['end'] for word in ('one','two','three')]
        tail = word_index(words, 'out')['end']
        lands = anchors + [anchors[-1]+(tail-anchors[-1])*i/3 for i in (1,2,3)]
        lands += [tail+(seconds-.35-tail)*i/2 for i in (1,2)]
        ends = [t+.16 for t in lands]
        starts = [0] + ends[:-1]
        moves = [max(a+.05,b-.48) for a,b in zip(starts,lands)]
    return [dict(start=a/seconds, move=b/seconds, land=c/seconds, end=d/seconds)
            for a,b,c,d in zip(starts,moves,lands,ends)]

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
        fps = story.get('fps', FPS)
        for index, scene in enumerate(story['scenes']):
            timed = slug == 'merge-sort'
            digest = hashlib.sha256((VOICE + scene['narration'] + ('|word-timing-v1' if timed else '')).encode()).hexdigest()[:12]
            name = f'{slug}-{index+1}-{digest}.mp3'
            audio = destination / name
            metadata = audio.with_suffix('.words.jsonl')
            valid = False
            if audio.exists() and audio.stat().st_size:
                try:
                    valid = MP3(audio).info.length > 0 and (not timed or metadata.exists())
                except Exception:
                    pass
            if not valid:
                pending = audio.with_suffix('.pending.mp3')
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(scene['narration'], VOICE, rate='-4%', boundary='WordBoundary' if timed else 'SentenceBoundary').save(str(pending), str(metadata) if timed else None)
                        assert MP3(pending).info.length > 0, 'Speech service returned empty audio'
                        pending.replace(audio)
                        break
                    except Exception:
                        if attempt == 2:
                            raise
                        await asyncio.sleep(2 * (attempt + 1))
            duration = MP3(audio).info.length
            scene.update(audio=f'files/sem3/csi247/videos/narration/{name}',
                         fromFrame=frame, durationInFrames=math.ceil((duration + (.35 if slug == 'merge-sort' else .75)) * fps))
            if timed:
                scene['words'] = [dict(text=w['text'], start=w['offset']/10_000_000, end=(w['offset']+w['duration'])/10_000_000)
                                  for line in metadata.read_text(encoding='utf8').splitlines() if (w := json.loads(line))['type'] == 'WordBoundary']
                if scene['action'] == 'merge':
                    scene['beats'] = motion_beats(scene, scene['durationInFrames']/fps)
            frame += scene['durationInFrames']
        story.update(durationInFrames=frame, fps=fps, voice=VOICE)
        print(f'{slug}: {frame/fps:.1f}s; {VOICE}', flush=True)
    (ROOT / 'videos/csi247/timings.json').write_text(json.dumps(stories, indent=2)+'\n', encoding='utf8')

asyncio.run(main())
