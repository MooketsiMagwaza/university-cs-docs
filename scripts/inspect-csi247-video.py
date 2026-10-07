"""Contact sheets for authored beat stills or decoded final-video frames (Pillow)."""
import argparse
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / 'tmp/csi247-video-qa'
STORY = json.loads((ROOT / 'videos/csi247/timings.json').read_text(encoding='utf8'))['merge-sort']

def samples():
    for scene_index, scene in enumerate(STORY['scenes'], 1):
        phases = [phase for beat in scene['beats'] for phase in ((beat['start']+beat['move'])/2, (beat['move']+beat['land'])/2, (beat['land']+beat['end'])/2)] if 'beats' in scene else [.02, .4, .98]
        for sample, phase in enumerate(phases, 1):
            yield scene_index, sample, scene['fromFrame'] + int((scene['durationInFrames']-1)*phase)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--encoded', action='store_true')
    args = parser.parse_args()
    prefix = 'encoded-glass' if args.encoded else 'glass'
    source = ROOT / 'public/files/sem3/csi247/videos/merge-sort.mp4'
    platform = 'win32-x64-msvc' if __import__('os').name == 'nt' else 'linux-x64-gnu'
    executables = ROOT / f'node_modules/@remotion/compositor-{platform}'
    suffix = '.exe' if __import__('os').name == 'nt' else ''
    if args.encoded:
        metadata = json.loads(subprocess.check_output([str(executables/f'ffprobe{suffix}'),'-v','error','-show_streams','-show_format','-of','json',str(source)]))
        video = next(s for s in metadata['streams'] if s['codec_type']=='video')
        audio = next(s for s in metadata['streams'] if s['codec_type']=='audio')
        assert (video['width'],video['height']) == (STORY['width'],STORY['height'])
        assert abs(float(video['duration'])-STORY['durationInFrames']/STORY['fps']) < .05
        assert abs(float(video['duration'])-float(audio['duration'])) < .1
        assert video['codec_name']=='h264' and audio['codec_name']=='aac'
        assert video['r_frame_rate']==f"{STORY['fps']}/1"
        (QA/'encoded-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf8')
    entries=list(samples())
    for first in range(0,len(entries),16):
        sheet=Image.new('RGB',(1440,1544),'#d7e4df')
        draw=ImageDraw.Draw(sheet)
        for index,(scene,sample,frame) in enumerate(entries[first:first+16]):
            x,y=(index%4)*360,(index//4)*386
            if args.encoded:
                raw=subprocess.check_output([str(executables/f'ffmpeg{suffix}'),'-v','error','-ss',str(frame/STORY['fps']),'-i',str(source),'-frames:v','1','-vf','scale=360:360','-c:v','rawvideo','-f','image2pipe','-pix_fmt','rgb24','-'])
                picture=Image.frombytes('RGB',(360,360),raw)
            else:
                picture=Image.open(QA/f'beat-{scene}-{sample}.png').convert('RGB').resize((360,360))
            sheet.paste(picture,(x,y+26))
            draw.text((x+6,y+6),f'Scene {scene} / sample {sample} / {frame/STORY["fps"]:.2f}s',fill='#172522')
        sheet.save(QA/f'{prefix}-{first//16+1}.png')
    print(f'{prefix}: {len(entries)} frames across {len(STORY["scenes"])} scenes; {len(range(0,len(entries),16))} contact sheets.')

if __name__=='__main__':
    main()
