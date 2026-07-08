"""Generate 5 logo PNGs + brand options poster — all drawn directly with Pillow.

Draws each logo using Pillow's primitive drawing functions (polygons, circles,
arcs) instead of relying on SVG → PNG conversion (which has Windows issues
with cairo native libs).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).parent
SIZE = 400  # logo render size

# --- Color tokens ---
BG = (255, 248, 238)
INK = (31, 22, 17)
INK_SOFT = (74, 60, 46)
AMBER_DARK = (214, 130, 15)
AMBER = (240, 154, 26)
AMBER_LIGHT = (253, 181, 106)
AMBER_PALE = (255, 234, 208)
WHITE_WARM = (255, 248, 238)


def load_font(name, size):
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts") / f"{name}.ttc",
    ]
    for c in candidates:
        if c.exists():
            return ImageFont.truetype(str(c), size)
    return ImageFont.load_default()


# ============================================================
# Logo 1 — Amber Stone
# ============================================================
def draw_amber_stone(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Outer cut-corner pentagon
    pts = [(size*0.5, size*0.05),
           (size*0.88, size*0.28),
           (size*0.82, size*0.82),
           (size*0.18, size*0.82),
           (size*0.12, size*0.28)]
    # Fill with gradient (manual: top lighter, bottom darker)
    d.polygon(pts, fill=AMBER, outline=INK, width=6)
    # Inner three arcs (AI workflow layers)
    arc_pad = 30
    arc_top = size*0.34
    arc_bot = size*0.74
    for i, opacity in enumerate([180, 140, 100]):
        y = arc_top + i * (arc_bot - arc_top) / 2
        # Draw arc using chord approximation
        bbox = [arc_pad, y - 25, size - arc_pad, y + 25]
        d.arc(bbox, start=200, end=340, fill=INK, width=4)

    # Highlight (top-left pale spot)
    highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.ellipse([size*0.18, size*0.08, size*0.55, size*0.45],
               fill=(255, 248, 238, 180))
    highlight = highlight.filter(ImageFilter.GaussianBlur(15))
    img.alpha_composite(highlight)

    # Outer outline re-stroke (since blur softens it)
    d.polygon(pts, outline=INK, width=6)
    return img


# ============================================================
# Logo 2 — Abacus Pixel
# ============================================================
def draw_abacus_dot(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, cy = size / 2, size / 2
    r_outer = 32  # outline dot radius
    r_center = 44  # filled center dot radius (bigger)
    gap = size * 0.22

    # Connecting faint grid lines
    line_color = (31, 22, 17, 80)
    for dx, dy in [(-gap, -gap), (0, -gap), (gap, -gap),
                   (-gap, 0), (gap, 0),
                   (-gap, gap), (0, gap), (gap, gap)]:
        x0, y0 = cx + dx, cy + dy
        # Each line from this dot to neighbors (only orthogonal)
    grid_positions = [(cx + dx, cy + dy) for dx in [-gap, 0, gap] for dy in [-gap, 0, gap]]
    for x, y in grid_positions:
        # to neighbors
        for nx, ny in grid_positions:
            if (nx, ny) == (x, y):
                continue
            # only orth adjacency
            if (nx == x) ^ (ny == y):
                d.line([(x, y), (nx, ny)], fill=line_color, width=2)

    # 8 outer dots (outline only)
    for dx, dy in [(-gap, -gap), (0, -gap), (gap, -gap),
                   (-gap, 0), (gap, 0),
                   (-gap, gap), (0, gap), (gap, gap)]:
        x, y = cx + dx, cy + dy
        d.ellipse([x - r_outer, y - r_outer, x + r_outer, y + r_outer],
                  fill=(0, 0, 0, 0), outline=INK, width=5)

    # Center dot (filled amber, bigger)
    d.ellipse([cx - r_center, cy - r_center, cx + r_center, cy + r_center],
              fill=AMBER, outline=INK, width=6)
    return img


# ============================================================
# Logo 3 — Bud
# ============================================================
def draw_bud(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, cy = size / 2, size / 2

    # Baseline (account book bottom edge)
    d.line([(size*0.1, size*0.88), (size*0.9, size*0.88)],
           fill=INK, width=6)

    # Left leaf
    leaf_l_pts = [
        (cx, size*0.88), (cx - size*0.30, size*0.55),
        (cx - size*0.27, size*0.50), (cx - size*0.05, size*0.75),
        (cx, size*0.86)
    ]
    d.polygon(leaf_l_pts, fill=AMBER_LIGHT, outline=INK)
    d.line([(cx - size*0.05, size*0.78), (cx - size*0.20, size*0.58)],
           fill=INK, width=3)

    # Right leaf
    leaf_r_pts = [
        (cx, size*0.88), (cx + size*0.30, size*0.55),
        (cx + size*0.27, size*0.50), (cx + size*0.05, size*0.75),
        (cx, size*0.86)
    ]
    d.polygon(leaf_r_pts, fill=AMBER, outline=INK)
    d.line([(cx + size*0.05, size*0.78), (cx + size*0.20, size*0.58)],
           fill=INK, width=3)

    # Main stem
    d.line([(cx, size*0.88), (cx, size*0.55)],
           fill=INK, width=6)

    # Top bud dot
    d.ellipse([cx - 14, size*0.50 - 14, cx + 14, size*0.50 + 14],
              fill=AMBER, outline=INK, width=4)
    return img


# ============================================================
# Logo 4 — Pen + Bead
# ============================================================
def draw_pen_bead(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Pen tip (rotated 45 deg around top-left of pen)
    pen_box = [size*0.15, size*0.15, size*0.55, size*0.55]
    # Create pen tip as rotated rectangle
    pen = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pen)
    pd.polygon([(size*0.20, size*0.20), (size*0.50, size*0.20),
                (size*0.50, size*0.50), (size*0.35, size*0.65),
                (size*0.20, size*0.50)], fill=INK)
    # Pen slit
    pd.line([(size*0.35, size*0.20), (size*0.35, size*0.65)],
            fill=(255, 248, 238), width=4)
    pen = pen.rotate(45, resample=Image.BICUBIC, center=(size*0.35, size*0.35))
    img.alpha_composite(pen)

    # Bead (amber circle)
    bead_x, bead_y = size*0.70, size*0.70
    bead_r = size * 0.16
    d.ellipse([bead_x - bead_r, bead_y - bead_r,
               bead_x + bead_r, bead_y + bead_r],
              fill=AMBER, outline=INK, width=6)
    # Bead hole
    d.ellipse([bead_x - 8, bead_y - 8, bead_x + 8, bead_y + 8],
              fill=(255, 248, 238), outline=INK, width=3)
    # Bead highlight
    d.ellipse([bead_x - bead_r*0.6, bead_y - bead_r*0.7,
               bead_x - bead_r*0.2, bead_y - bead_r*0.3],
              fill=(255, 255, 255, 180))
    return img


# ============================================================
# Logo 5 — Page + Arc
# ============================================================
def draw_page_arc(size=SIZE):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Left page
    d.polygon([(size*0.10, size*0.25), (size*0.50, size*0.18),
               (size*0.50, size*0.88), (size*0.10, size*0.82)],
              fill=(255, 248, 238), outline=INK, width=5)
    # Right page
    d.polygon([(size*0.50, size*0.18), (size*0.90, size*0.25),
               (size*0.90, size*0.82), (size*0.50, size*0.88)],
              fill=(255, 248, 238), outline=INK, width=5)
    # Center spine
    d.line([(size*0.50, size*0.18), (size*0.50, size*0.88)],
           fill=INK, width=2)

    # Text lines on left page
    for i in range(5):
        y = size*0.30 + i * size*0.10
        d.line([(size*0.16, y), (size*0.44, y - 4)],
               fill=INK_SOFT, width=2)

    # AI arc
    arc_pts = [(size*0.13, size*0.62)]
    steps = 30
    for i in range(1, steps + 1):
        t = i / steps
        x = size*0.13 + t * (size*0.87 - size*0.13)
        y = size*0.62 - (4 * t * (1 - t)) * size*0.5
        arc_pts.append((x, y))
    # Draw arc with thickness (draw multiple offset lines)
    for offset in range(8, 0, -1):
        c = (255, 248, 238, max(50, 255 - offset * 25))
        offset_pts = []
        for x, y in arc_pts:
            offset_pts.append((x, y - offset / 2))
        d.line(offset_pts, fill=c, width=offset + 2)
    d.line(arc_pts, fill=AMBER, width=4)

    # Arc "spirit" dot
    sx, sy = arc_pts[24]
    d.ellipse([sx - 16, sy - 16, sx + 16, sy + 16],
              fill=AMBER, outline=INK, width=4)
    d.ellipse([sx - 6, sy - 6, sx + 6, sy + 6],
              fill=(255, 248, 238))
    return img


# ============================================================
# Render all 5 to PNG
# ============================================================
RENDERERS = {
    "logo-1-amber-stone": draw_amber_stone,
    "logo-2-abacus-dot": draw_abacus_dot,
    "logo-3-bud": draw_bud,
    "logo-4-pen-bead": draw_pen_bead,
    "logo-5-page-arc": draw_page_arc,
}

BRANDS = [
    {"no": "01", "name": "账匠", "pinyin": "zhàng jiàng",
     "english": "LedgerCraft", "tagline": "账本工匠 · 工匠精神",
     "logo": "logo-1-amber-stone",
     "desc": "账 + 匠。手艺人的姿态：专业、专注、有耐心。\n契合财务圈「老法师」叙事，长期品牌资产价值高。",
     "verdict": "推荐"},
    {"no": "02", "name": "盘石", "pinyin": "pán shí",
     "english": "PanShi AI", "tagline": "算盘 + 磐石 · 稳定可靠",
     "logo": "logo-2-abacus-dot",
     "desc": "算盘是财务图腾，磐石是稳定可靠。\n视觉锤强（直接画算盘），适合 ToB 场景。",
     "verdict": ""},
    {"no": "03", "name": "财芽", "pinyin": "cái yá",
     "english": "FinBud", "tagline": "财务新芽 · 成长感",
     "logo": "logo-3-bud",
     "desc": "财 + 芽。AI 让传统财务工作重获生机。\n年轻、温暖、有成长感。",
     "verdict": ""},
    {"no": "04", "name": "算簿", "pinyin": "suàn bù",
     "english": "SuanBu", "tagline": "AI 簿记 · 回归本质",
     "logo": "logo-4-pen-bead",
     "desc": "算 + 簿。回归「簿记」最古老最严肃的中文术语。\n专业感最强，适合 B 端专业用户。",
     "verdict": ""},
    {"no": "05", "name": "账灵", "pinyin": "zhàng líng",
     "english": "LedgerMind", "tagline": "AI 账本 · 灵动",
     "logo": "logo-5-page-arc",
     "desc": "账 + 灵。账本被 AI 灵气赋能。\n叙事感强、动感、有故事。",
     "verdict": ""},
]


def main():
    # 1. Render individual logo PNGs
    print("=== Rendering individual logos ===")
    for name, fn in RENDERERS.items():
        img = fn()
        out = ROOT / f"{name}.png"
        img.save(out, "PNG")
        print(f"  saved: {out.name}")

    # 2. Generate poster
    print("=== Generating poster ===")
    font_zh = load_font("msyh.ttc", 28)
    font_zh_small = load_font("msyh.ttc", 18)
    font_zh_title = load_font("msyh.ttc", 64)
    font_zh_section = load_font("msyh.ttc", 22)
    font_zh_caption = load_font("msyh.ttc", 14)
    font_en = load_font("consola.ttf", 14)

    W, H = 1800, 1400
    canvas = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(canvas, "RGBA")

    # Top/bottom amber bands
    d.rectangle([(0, 0), (W, 8)], fill=AMBER)
    d.rectangle([(0, H - 8), (W, H)], fill=AMBER)

    # Title
    d.text((80, 60), "AI 财务品牌化探索", fill=INK, font=font_zh_title)
    d.text((80, 145), "5 个品牌名 × 5 个 LOGO  —  请选择",
           fill=INK_SOFT, font=font_zh_section)
    d.line([(80, 200), (W - 80, 200)], fill=(31, 22, 17, 40), width=1)

    # Cards
    card_w = (W - 80 * 2 - 4 * 24) // 5
    card_h = 900
    card_y = 240

    # Pre-render logo images
    logo_cache = {name: fn() for name, fn in RENDERERS.items()}

    for i, brand in enumerate(BRANDS):
        x0 = 80 + i * (card_w + 24)
        d.rounded_rectangle([(x0, card_y), (x0 + card_w, card_y + card_h)],
                             radius=20, fill=(255, 255, 255),
                             outline=(31, 22, 17, 40), width=1)

        if brand["verdict"]:
            badge_x0 = x0 + card_w - 90
            d.rounded_rectangle([(badge_x0, card_y + 24),
                                  (badge_x0 + 70, card_y + 54)],
                                 radius=15, fill=AMBER)
            d.text((badge_x0 + 12, card_y + 28), "推荐",
                   fill=(255, 255, 255), font=font_zh_small)

        d.text((x0 + 24, card_y + 24), brand["no"],
               fill=AMBER, font=font_zh_section)

        # Logo (square, paste centered)
        logo_img = logo_cache[brand["logo"]]
        logo_size = card_w - 80
        logo_resized = logo_img.resize((logo_size, logo_size), Image.LANCZOS)
        logo_x = x0 + (card_w - logo_size) // 2
        logo_y = card_y + 80
        canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)

        # Name
        name_y = logo_y + logo_size + 40
        d.text((x0 + 24, name_y), brand["name"], fill=INK, font=font_zh_title)

        # Pinyin + English
        meta_y = name_y + 76
        d.text((x0 + 24, meta_y), brand["pinyin"],
               fill=INK_SOFT, font=font_en)
        d.text((x0 + 24, meta_y + 22), brand["english"],
               fill=INK_SOFT, font=font_en)

        # Tagline
        tag_y = meta_y + 60
        d.text((x0 + 24, tag_y), brand["tagline"],
               fill=AMBER, font=font_zh_small)

        # Description
        desc_y = tag_y + 50
        for line in brand["desc"].split("\n"):
            d.text((x0 + 24, desc_y), line,
                   fill=INK_SOFT, font=font_zh_caption)
            desc_y += 26

    # Bottom hint
    hint_y = card_y + card_h + 50
    d.text((80, hint_y),
           "→ 选好后告诉我「名字 X」+「LOGO X」，我会替换顶栏 logo、favicon、品牌名",
           fill=INK, font=font_zh_section)

    out = ROOT / "brand-options-poster.png"
    canvas.save(out, "PNG", quality=95)
    print(f"  saved: {out.name} ({W}x{H})")


if __name__ == "__main__":
    main()