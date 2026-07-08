"""Render all logo SVGs to PNG using Playwright browser."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
LOGOS = [
    "logo-1-amber-stone",
    "logo-2-abacus-dot",
    "logo-3-bud",
    "logo-4-pen-bead",
    "logo-5-page-arc",
]


async def render_svg(playwright, name: str, size: int = 400):
    """Render an SVG to PNG by opening it in the browser and screenshotting."""
    svg_path = ROOT / f"{name}.svg"
    browser = await playwright.chromium.launch()
    page = await browser.new_page(viewport={"width": size, "height": size})
    # Embed SVG in HTML page for accurate rendering
    svg_content = svg_path.read_text(encoding="utf-8")
    html = f"""<!doctype html><html><head><style>
        html, body {{ margin: 0; padding: 0; background: #FFF8EE; }}
        .wrap {{ width: {size}px; height: {size}px; display: flex; align-items: center; justify-content: center; }}
        svg {{ width: {size}px; height: {size}px; }}
    </style></head><body><div class="wrap">{svg_content}</div></body></html>"""
    await page.set_content(html)
    png_path = ROOT / f"{name}.png"
    await page.locator("svg").screenshot(path=str(png_path), omit_background=False)
    await browser.close()
    print(f"saved: {png_path.name}")


async def main():
    async with async_playwright() as p:
        for name in LOGOS:
            await render_svg(p, name)


if __name__ == "__main__":
    asyncio.run(main())