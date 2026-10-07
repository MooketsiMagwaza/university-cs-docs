"""Reject out-of-page glyphs in the generated chapter PDFs; pair with visual QA."""
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
problems = []
pages = 0
for path in sorted((root / 'public/files/sem3/csi247/study-guides').glob('*/*.pdf')):
    document = pdfium.PdfDocument(str(path))
    for index in range(len(document)):
        page = document[index]
        text = page.get_textpage()
        width, height = page.get_size()
        pages += 1
        for char in range(text.count_chars()):
            value = text.get_text_range(char, 1)
            if not value.strip():
                continue
            left, bottom, right, top = text.get_charbox(char)
            if right <= left or top <= bottom:
                continue
            # Page furniture has a smaller margin; body uses 13mm horizontal.
            margin = 10 if bottom < 42 or top > height-42 else 32
            if left < margin or right > width-margin or bottom < 7 or top > height-7:
                problems.append((path.name, index+1, value, tuple(round(n,1) for n in (left,bottom,right,top))))
        text.close()
        page.close()
    document.close()
if problems:
    for problem in problems[:35]:
        print(problem)
    raise SystemExit(f'{len(problems)} glyphs cross the safe PDF content boundary')
print(f'PDF layout bounds passed: {pages} pages; all glyphs inside safe page margins.')
