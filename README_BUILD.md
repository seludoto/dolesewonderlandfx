# Build: Convert markdowns to a simple static site

This small helper will convert the markdown files located in `markdowns_docs/` into HTML files inside `dist/`.

Windows (PowerShell) quick steps

```powershell
python -m pip install -r requirements.txt
python build_site.py
```

Output:

- `dist/index.html` — index linking all generated pages
- `dist/*.html` — one HTML file per markdown

Notes

- The script uses the `markdown` Python package.
- If you want a prettier template or site CSS, edit `build_site.py`.
