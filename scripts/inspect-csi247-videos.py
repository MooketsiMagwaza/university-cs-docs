"""Assemble already-rendered scene stills for a complete video layout review."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
directory = root / 'tmp/csi247-video-qa'
stories = json.loads((root / 'videos/csi247/timings.json').read_text(encoding='utf8'))
for slug, story in stories.items():
    count = len(story['scenes'])
    sheet = Image.new('RGB', (900, 562 * ((count+2)//3)), '#c4c4c4')
    draw = ImageDraw.Draw(sheet)
    for index in range(count):
        frame = Image.open(directory / f'{slug}-{index+1}.png').convert('RGB')
        frame.thumbnail((290, 522))
        x, y = index%3*300+5, index//3*562
        draw.text((x, y+6), f'{slug} / {index+1}', fill='black')
        sheet.paste(frame, (x, y+26))
    sheet.save(directory / f'{slug}-contact.png')
    print(f'{slug}: {count} scene stills')
