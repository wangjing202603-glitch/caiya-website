"""Render 财芽 logo in production-grade PNG using Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).parent
SIZE = 400

INK = (31, 22, 17)
AMBER_DARK = (168, 101, 11)
AMBER_MID = (214, 130, 15)
AMBER = (240, 154, 26)
AMBER_LIGHT = (253, 181, 106)
WHITE_WARM = (255, 248, 238)


def draw_caiya(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, base_y = size / 2, size * 0.875  # baseline at 87.5% down

    # 1. Account book baseline (with subtle shadow)
    d.line([(size * 0.09, base_y), (size * 0.91, base_y)],
           fill=INK, width=int(size * 0.04), joint="curve")
    d.line([(size * 0.15, base_y + size * 0.045),
            (size * 0.85, base_y + size * 0.045)],
           fill=(*INK, 80), width=int(size * 0.012))

    # 2. Left leaf — smooth bezier from stem to upper-left
    leaf_l = [
        (cx, base_y),
        (cx - size * 0.20, base_y - size * 0.18),
        (cx - size * 0.34, base_y - size * 0.30),
        (cx - size * 0.32, base_y - size * 0.32),
        (cx - size * 0.05, base_y - size * 0.16),
        (cx + 2, base_y - size * 0.04),
        (cx, base_y),
    ]
    d.polygon(leaf_l, fill=AMBER_LIGHT, outline=INK, width=int(size * 0.028))

    # Left leaf shading (slightly darker inner area)
    shade_l = [
        (cx - size * 0.02, base_y - size * 0.01),
        (cx - size * 0.20, base_y - size * 0.16),
        (cx - size * 0.30, base_y - size * 0.28),
        (cx - size * 0.10, base_y - size * 0.18),
        (cx, base_y - size * 0.02),
    ]
    d.polygon(shade_l, fill=AMBER)

    # Left leaf vein
    d.line([(cx - size * 0.01, base_y - size * 0.01),
            (cx - size * 0.28, base_y - size * 0.27)],
           fill=(*INK, 100), width=int(size * 0.014))

    # 3. Right leaf
    leaf_r = [
        (cx, base_y),
        (cx + size * 0.20, base_y - size * 0.18),
        (cx + size * 0.34, base_y - size * 0.30),
        (cx + size * 0.32, base_y - size * 0.32),
        (cx + size * 0.05, base_y - size * 0.16),
        (cx - 2, base_y - size * 0.04),
        (cx, base_y),
    ]
    d.polygon(leaf_r, fill=AMBER, outline=INK, width=int(size * 0.028))

    # Right leaf shading (darker)
    shade_r = [
        (cx + size * 0.02, base_y - size * 0.01),
        (cx + size * 0.20, base_y - size * 0.16),
        (cx + size * 0.30, base_y - size * 0.28),
        (cx + size * 0.10, base_y - size * 0.18),
        (cx, base_y - size * 0.02),
    ]
    d.polygon(shade_r, fill=AMBER_DARK)

    # Right leaf vein
    d.line([(cx + size * 0.01, base_y - size * 0.01),
            (cx + size * 0.28, base_y - size * 0.27)],
           fill=(*INK, 100), width=int(size * 0.014))

    # 4. Main stem
    d.line([(cx, base_y - size * 0.02), (cx, base_y - size * 0.34)],
           fill=INK, width=int(size * 0.028))

    # 5. Top bud (amber sphere with highlight)
    bud_r = size * 0.085
    bud_x, bud_y = cx, base_y - size * 0.42
    d.ellipse([bud_x - bud_r, bud_y - bud_r, bud_x + bud_r, bud_y + bud_r],
              fill=AMBER, outline=INK, width=int(size * 0.022))
    # Bud inner glow
    inner = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    id_ = ImageDraw.Draw(inner)
    id_.ellipse([bud_x - bud_r * 0.7, bud_y - bud_r * 0.7,
                 bud_x + bud_r * 0.3, bud_y + bud_r * 0.3],
                fill=(253, 181, 106, 200))
    inner = inner.filter(ImageFilter.GaussianBlur(8))
    img.alpha_composite(inner)
    # Re-stroke bud outline (since blur softens it)
    d.ellipse([bud_x - bud_r, bud_y - bud_r, bud_x + bud_r, bud_y + bud_r],
              outline=INK, width=int(size * 0.022))
    # Bud highlight dot
    d.ellipse([bud_x - bud_r * 0.45, bud_y - bud_r * 0.45,
               bud_x - bud_r * 0.10, bud_y - bud_r * 0.10],
              fill=(255, 248, 238, 220))

    return img


def main():
    # Full-size logo
    img = draw_caiya(400)
    out = ROOT / "logo-caiya.png"
    img.save(out, "PNG")
    print(f"saved: {out.name}")

    # Favicon (32x32 simplified)
    favicon = draw_caiya(64)
    favicon.save(ROOT / "favicon-32.png", "PNG")
    print(f"saved: favicon-32.png")

    # OG image (1200x630 with logo + brand name on warm bg)
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), (255, 248, 238))
    od = ImageDraw.Draw(og)

    # Logo at center-left
    logo = draw_caiya(360)
    og.paste(logo, (100, 135), logo)

    # Brand text right side
    from PIL import ImageFont
    def load_font(name, sz):
        for c in [Path("C:/Windows/Fonts") / name, Path("C:/Windows/Fonts") / f"{name}.ttc"]:
            if c.exists():
                return ImageFont.truetype(str(c), sz)
        return ImageFont.load_default()

    font_zh = load_font("msyh.ttc", 130)
    font_zh_small = load_font("msyh.ttc", 38)
    font_zh_slogan = load_font("msyh.ttc", 26)

    od.text((520, 200), "财芽", fill=INK, font=font_zh)
    od.text((520, 360), "CaiYa · AI 财务新芽",
            fill=(74, 60, 46), font=font_zh_small)
    od.text((520, 420), "让每个财务人都能用上 AI 助理",
            fill=(74, 60, 46), font=font_zh_slogan)

    # Top/bottom amber bands
    od.rectangle([(0, 0), (W, 8)], fill=AMBER)
    od.rectangle([(0, H - 8), (W, H)], fill=AMBER)

    og.save(ROOT / "og-image.png", "PNG", quality=92)
    print(f"saved: og-image.png")


if __name__ == "__main__":
    main()