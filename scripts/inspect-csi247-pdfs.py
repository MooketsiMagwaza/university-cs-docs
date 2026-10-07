"""Render every generated PDF page into contact sheets for visual QA.

Run with the bundled Python (pypdfium2, Pillow, pypdf). Detailed page renders
are retained for the map, code, complexity explanation and quiz of each guide.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
output = root / 'tmp' / 'csi247-pdf-qa'
output.mkdir(parents=True, exist_ok=True)
for path in sorted((root / 'public/files/sem3/csi247/study-guides').glob('*/*.pdf')):
    reader = PdfReader(path)
    texts = [page.extract_text() or '' for page in reader.pages]
    combined = '\n'.join(texts)
    for phrase in ['The whole process at a glance', 'Guided walkthrough', 'Topic quiz', 'Answer key']:
        assert phrase in combined, (path.name, 'Missing content', phrase)
    assert all(len(text.strip()) > 60 for text in texts), (path.name, 'Unexpected empty page')
    document = pdfium.PdfDocument(str(path))
    selected = {0}
    for phrase in ['Fully annotated Java', 'Why those complexities', 'Topic quiz', 'Answer key']:
        selected.update(i for i, text in enumerate(texts) if phrase in text)
    for start in range(0, len(document), 16):
        indices = list(range(start, min(start + 16, len(document))))
        sheet = Image.new('RGB', (1000, 382 * ((len(indices) + 3) // 4)), '#c4c4c4')
        draw = ImageDraw.Draw(sheet)
        for offset, i in enumerate(indices):
            page = document[i]
            thumbnail = page.render(scale=.40).to_pil().convert('RGB')
            thumbnail.thumbnail((240, 347))
            x, y = (offset % 4) * 250, (offset // 4) * 382
            sheet.paste(thumbnail, (x + 5, y + 24))
            draw.text((x + 8, y + 6), f'{path.stem} / {i + 1}', fill='black')
            if i in selected:
                page.render(scale=1.35).to_pil().save(output / f'{path.stem}-p{i+1}.png')
        sheet.save(output / f'{path.stem}-contact-{start // 16 + 1}.png')
    print(f'{path.stem}: {len(texts)} pages; all content markers present; {len(combined):,} extracted characters')
