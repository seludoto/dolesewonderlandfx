#!/usr/bin/env python3
"""Simple static site builder: convert markdown files in `markdowns_docs/` to HTML in `dist/`.

Usage:
  python -m pip install -r requirements.txt
  python build_site.py
"""
from pathlib import Path
import re
import sys

try:
    import markdown
except Exception:
    print("Missing 'markdown' package. Install with: python -m pip install -r requirements.txt")
    raise

ROOT = Path(__file__).parent
SRC = ROOT / "markdowns_docs"
OUT = ROOT / "dist"

def title_from_md(text, default):
    m = re.search(r'^#\s+(.*)', text, flags=re.MULTILINE)
    return m.group(1).strip() if m else default

def make_page(md_path: Path):
    text = md_path.read_text(encoding='utf-8')
    title = title_from_md(text, md_path.stem)
    html_body = markdown.markdown(text, extensions=['extra', 'toc'])
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>{title}</title>
  <style>
  body{{font-family:Segoe UI,Arial,Helvetica,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem;line-height:1.6}}
  header{{border-bottom:1px solid #eee;margin-bottom:1rem;padding-bottom:1rem}}
  a{{color:#0066cc}}
  </style>
</head>
<body>
  <header><h1>{title}</h1></header>
  <main>{html_body}</main>
  <footer><p>Generated from {md_path.name}</p></footer>
</body>
</html>"""
    out_path = OUT / (md_path.stem + ".html")
    out_path.write_text(html, encoding='utf-8')
    return out_path.name, title

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    if not SRC.exists():
        print(f"Source folder not found: {SRC}")
        sys.exit(1)
    md_files = sorted([p for p in SRC.glob("*.md")])
    if not md_files:
        print("No markdown files found in markdowns_docs/")
        return
    pages = []
    for md in md_files:
        name, title = make_page(md)
        print(f"Wrote {name}")
        pages.append((name, title))
    # generate index
    idx = OUT / "index.html"
    links = "\n".join(f'<li><a href="{p}">{t}</a></li>' for p,t in pages)
    idx.write_text(f"""<!doctype html><html><head><meta charset=\"utf-8\"/><title>Docs</title></head><body><h1>Documents</h1><ul>{links}</ul></body></html>""", encoding='utf-8')
    print("Wrote index.html")

if __name__ == '__main__':
    build()
