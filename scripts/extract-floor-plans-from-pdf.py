from pathlib import Path
import pymupdf

SOURCE = Path('/Users/anton/Downloads/Barnangshuset-ENG-Floorplans-8 sept (2).pdf')
OUTPUT = Path('output/floor-plans-2026-09-08')

# The source uses the same A4 landscape template on every suite page.
# These boxes isolate the two technical plans while excluding copy and AXO diagrams.
CROPS = {
    'main': pymupdf.Rect(10, 62, 427, 310),
    'mezzanine': pymupdf.Rect(438, 62, 837, 310),
}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = pymupdf.open(SOURCE)
    if source.page_count != 7:
        raise ValueError(f'Expected 7 suite pages, found {source.page_count}')

    for page_index, page in enumerate(source):
        suite = page_index + 1
        for level, crop in CROPS.items():
            isolated = pymupdf.open()
            isolated_page = isolated.new_page(width=crop.width, height=crop.height)
            isolated_page.show_pdf_page(isolated_page.rect, source, page_index, clip=crop)
            svg = isolated_page.get_svg_image(text_as_path=False)
            # Sanity serializes non-breaking spaces as the HTML-only `&nbsp;`
            # entity. That entity is invalid in standalone XML/SVG and causes the
            # browser to reject the whole image, so normalize it before upload.
            svg = (
                svg.replace('\u00a0', ' ')
                .replace('&#x00a0;', ' ')
                .replace('&#xA0;', ' ')
                .replace('&#160;', ' ')
                .replace('&nbsp;', ' ')
            )
            target = OUTPUT / f'suite-{suite}-{level}-2026-09-08.svg'
            target.write_text(svg, encoding='utf-8')
            isolated.close()
            print(target)


if __name__ == '__main__':
    main()
