from PIL import Image

src = r"C:\Users\Abcom\documents\walnut\public\images\brand\WM_fevicon.webp"
out_dir = r"C:\Users\Abcom\documents\walnut\public\images\brand"

im = Image.open(src).convert("L")  # white WM on black
w, h = im.size
px = im.load()

# Build alpha from brightness: WM(white)->opaque, bg(black)->transparent
wm_black = Image.new("RGBA", (w, h), (0, 0, 0, 0))   # black WM on transparent
wm_white = Image.new("RGBA", (w, h), (255, 255, 255, 0))  # white WM on transparent
bp = wm_black.load()
wp = wm_white.load()
for y in range(h):
    for x in range(w):
        a = px[x, y]
        if a > 8:
            bp[x, y] = (17, 17, 17, a)   # ink color
            wp[x, y] = (255, 255, 255, a)

# autocrop to the WM shape bounding box (based on alpha)
def autocrop(img):
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img

wm_black_c = autocrop(wm_black)
wm_white_c = autocrop(wm_white)

wm_black_c.save(out_dir + r"\wm-ink.png")
wm_white_c.save(out_dir + r"\wm-white.png")
print("wm-ink", wm_black_c.size, "wm-white", wm_white_c.size)
