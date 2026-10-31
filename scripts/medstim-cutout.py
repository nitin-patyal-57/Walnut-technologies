"""Create a transparent-background cutout of the MedStim product shot.

Source: public/images/products/medstim-neuro-devices.webp (847x536, white
studio background). Background pixels are the near-white regions connected to
the image border, so white parts inside the product (console face, cart panels)
are preserved. Result is cropped to the product bounding box.
"""
from PIL import Image, ImageDraw, ImageFilter

SRC = 'public/images/products/medstim-neuro-devices.webp'
DST = 'public/images/products/medstim-neuro-devices-cutout.webp'

im = Image.open(SRC).convert('RGB')
w, h = im.size

# Flood-fill the background from many border seed points. Magenta marks
# background; thresh is the max tolerated difference from the seed colour.
MAGENTA = (255, 0, 255)
filled = im.copy()
seeds = []
for x in range(0, w, 40):
    seeds += [(x, 0), (x, h - 1)]
for y in range(0, h, 40):
    seeds += [(0, y), (w - 1, y)]
for seed in seeds:
    px = filled.getpixel(seed)
    if px != MAGENTA:
        ImageDraw.floodfill(filled, seed, MAGENTA, thresh=40)

# Build alpha: 0 where flood-marked, 255 elsewhere.
mask = Image.new('L', (w, h), 255)
fp = filled.load()
mp = mask.load()
for y in range(h):
    for x in range(w):
        if fp[x, y] == MAGENTA:
            mp[x, y] = 0

# Soften the 1px cut edge slightly so it doesn't look jagged.
mask = mask.filter(ImageFilter.GaussianBlur(0.6))

rgba = im.convert('RGBA')
rgba.putalpha(mask)

# Crop to the product bounding box with a little breathing room.
bbox = mask.point(lambda v: 255 if v > 24 else 0).getbbox()
pad = 12
l, t, r, b = bbox
crop = rgba.crop((max(0, l - pad), max(0, t - pad),
                  min(w, r + pad), min(h, b + pad)))
crop.save(DST, 'WEBP', quality=95, method=6)
print('saved', DST, crop.size)
