from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas
from pypdf import PdfReader
root = Path.cwd()
images = [root / 'public' / f'katalog{n}.png' for n in ['', '1','2','3','5','6','7','8','9','10','11','12','13','14']]
output = root / 'public' / 'katalog.pdf'
c = canvas.Canvas(str(output))
c.setTitle('Has Door - Asansor Kapi Sistemleri Katalogu')
c.setAuthor('Has Door Asansor Kapi Sistemleri')
for path in images:
    im = Image.open(path)
    w, h = im.size
    c.setPageSize((w,h))
    c.drawImage(str(path), 0, 0, width=w, height=h)
    c.showPage()
c.save()
assert len(PdfReader(output).pages) == len(images)
print(f'Created {output}: {len(images)} pages; originals preserved.')
try:
    import fitz
    out = root / 'docs' / 'qa'
    out.mkdir(exist_ok=True)
    doc = fitz.open(output)
    tiles=[]
    for page in doc:
        pix=page.get_pixmap(matrix=fitz.Matrix(.35,.35))
        im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
        im.thumbnail((180,240))
        tiles.append(im)
    sheet=Image.new('RGB',(180*7,240*2),'#eeeeee')
    for i,im in enumerate(tiles): sheet.paste(im,((i%7)*180,(i//7)*240))
    sheet.save(out/'catalog-review.png')
    print('Rendered all PDF pages for visual QA.')
except ImportError:
    print('PyMuPDF unavailable; use Poppler.')
