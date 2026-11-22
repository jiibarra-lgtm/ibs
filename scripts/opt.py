import sys
from PIL import Image
src, dst, mx = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src)
if im.mode in ('P','LA'): im = im.convert('RGBA')
im.thumbnail((mx, mx))
if dst.endswith('.png'):
    im.save(dst, optimize=True)
else:
    if im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (255,255,255)); bg.paste(im, mask=im.split()[3]); im = bg
    im.convert('RGB').save(dst, 'WEBP', quality=80, method=6)
