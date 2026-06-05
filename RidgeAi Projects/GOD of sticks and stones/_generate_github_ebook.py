#!/usr/bin/env python3
"""Generate complete GitHub Pages ebook site for 'The God of Sticks and Stones'."""

import re
from pathlib import Path

MANUSCRIPT = Path(r"C:\Users\ridge\GitHub_Projects\RidgeAi Projects\GOD of sticks and stones\review_edition_literary_refined.md")
OUT_DIR = Path(r"C:\Users\ridge\GitHub_Projects\RidgeAi Projects\GOD of sticks and stones\github_ebook")

BOOK_TITLE = "The God of Sticks and Stones"
BOOK_SUBTITLE = "Scripture, Creation, and the Quiet Language of God"

ORDINAL_TO_NUM = {
    'One': '01', 'Two': '02', 'Three': '03', 'Four': '04',
    'Five': '05', 'Six': '06', 'Seven': '07', 'Eight': '08',
    'Nine': '09', 'Ten': '10', 'Eleven': '11', 'Twelve': '12',
    'Thirteen': '13', 'Fourteen': '14', 'Fifteen': '15',
    'Sixteen': '16', 'Seventeen': '17', 'Eighteen': '18',
}

# Navigation sequence — order defines Prev/Next arrows
PAGES = [
    ("front-matter",       "Front Matter"),
    ("chapter-01",         "Chapter One — Dust and Breath"),
    ("chapter-02",         "Chapter Two — The Tree and the Garden"),
    ("chapter-03",         "Chapter Three — Stone and Witness"),
    ("chapter-04",         "Chapter Four — Seed and Field"),
    ("chapter-05",         "Chapter Five — Brick and Empire"),
    ("chapter-06",         "Chapter Six — Wells and Depths"),
    ("chapter-07",         "Chapter Seven — Wilderness and Shepherds"),
    ("chapter-08",         "Chapter Eight — Mountains, Caves, and Lower Places"),
    ("chapter-09",         "Chapter Nine — Temple and Tabernacle"),
    ("chapter-10",         "Chapter Ten — The Carpenter and the Cross"),
    ("chapter-11",         "Chapter Eleven — Babel After Babel"),
    ("chapter-12",         "Chapter Twelve — The Language of Creation"),
    ("chapter-13",         "Chapter Thirteen — The Stone the Builders Rejected"),
    ("chapter-14",         "Chapter Fourteen — The Living Field"),
    ("chapter-15",         "Chapter Fifteen — The Harvest and the Laborers"),
    ("chapter-16",         "Chapter Sixteen — Rivers, Wells, and Living Water"),
    ("chapter-17",         "Chapter Seventeen — The Final City and the Restored Garden"),
    ("chapter-18",         "Chapter Eighteen — The God of Sticks and Stones"),
    ("closing-reflection", "Closing Reflection — The Laborer's Return"),
    ("a-final-word",       "A Final Word — The Meeting Place"),
    ("back-matter",        "Back Matter"),
]

TOC_GROUPS = [
    {"type": "link",      "slug": "front-matter",  "label": "Front Matter"},
    {
        "type": "accordion", "id": "part1",
        "label": "Part I — Foundations of Creation",
        "chapters": [
            ("chapter-01", "Chapter One — Dust and Breath"),
            ("chapter-02", "Chapter Two — The Tree and the Garden"),
            ("chapter-03", "Chapter Three — Stone and Witness"),
        ],
    },
    {
        "type": "accordion", "id": "part2",
        "label": "Part II — Babel and the Rise of Systems",
        "chapters": [
            ("chapter-04", "Chapter Four — Seed and Field"),
            ("chapter-05", "Chapter Five — Brick and Empire"),
            ("chapter-06", "Chapter Six — Wells and Depths"),
            ("chapter-07", "Chapter Seven — Wilderness and Shepherds"),
        ],
    },
    {
        "type": "accordion", "id": "part3",
        "label": "Part III — Temple, Christ, and Fulfillment",
        "chapters": [
            ("chapter-08", "Chapter Eight — Mountains, Caves, and Lower Places"),
            ("chapter-09", "Chapter Nine — Temple and Tabernacle"),
            ("chapter-10", "Chapter Ten — The Carpenter and the Cross"),
            ("chapter-11", "Chapter Eleven — Babel After Babel"),
            ("chapter-12", "Chapter Twelve — The Language of Creation"),
        ],
    },
    {
        "type": "accordion", "id": "part4",
        "label": "Part IV — Restoration and the Living Field",
        "chapters": [
            ("chapter-13", "Chapter Thirteen — The Stone the Builders Rejected"),
            ("chapter-14", "Chapter Fourteen — The Living Field"),
            ("chapter-15", "Chapter Fifteen — The Harvest and the Laborers"),
            ("chapter-16", "Chapter Sixteen — Rivers, Wells, and Living Water"),
            ("chapter-17", "Chapter Seventeen — The Final City and the Restored Garden"),
            ("chapter-18", "Chapter Eighteen — The God of Sticks and Stones"),
        ],
    },
    {"type": "link", "slug": "closing-reflection", "label": "Closing Reflection — The Laborer’s Return"},
    {"type": "link", "slug": "a-final-word",        "label": "A Final Word — The Meeting Place"},
    {"type": "link", "slug": "back-matter",          "label": "Back Matter"},
]


# ── Markdown → HTML conversion ────────────────────────────────────────────────

def inline_md(text):
    """Escape HTML entities and convert inline bold/italic markdown."""
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    return text


def render_table(table_lines):
    """Render markdown pipe-table lines as an HTML table."""
    rows = []
    header_done = False
    tbody_open = False
    for raw in table_lines:
        line = raw.strip()
        if not line or not line.startswith('|'):
            continue
        if re.match(r'^\|[\s\-:|]+\|$', line):
            if not tbody_open:
                rows.append('<tbody>')
                tbody_open = True
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if not header_done:
            rows.append('<thead><tr>' + ''.join(f'<th>{inline_md(c)}</th>' for c in cells) + '</tr></thead>')
            header_done = True
        else:
            if not tbody_open:
                rows.append('<tbody>')
                tbody_open = True
            rows.append('<tr>' + ''.join(f'<td>{inline_md(c)}</td>' for c in cells) + '</tr>')
    if tbody_open:
        rows.append('</tbody>')
    if not rows:
        return ''
    return '<div class="table-wrap"><table>\n' + '\n'.join(rows) + '\n</table></div>'


def lines_to_html(lines):
    """Convert a list of manuscript text lines to HTML."""
    html_parts = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        s = line.strip()

        # Skip page-break divs
        if s.startswith('<div style="page-break'):
            i += 1
            continue

        # Blank line — paragraph separator
        if not s:
            i += 1
            continue

        # Horizontal rule
        if s == '---':
            html_parts.append('<hr>')
            i += 1
            continue

        # H1: skip PART headers and Back Matter marker; render book title
        if s.startswith('# ') and not s.startswith('## '):
            if re.match(r'^# PART\s', s) or s == '# Back Matter':
                i += 1
                continue
            html_parts.append(f'<h1 class="book-title">{inline_md(s[2:])}</h1>')
            i += 1
            continue

        # H3
        if s.startswith('### '):
            html_parts.append(f'<h3>{inline_md(s[4:])}</h3>')
            i += 1
            continue

        # H2 (sub-sections within content, e.g. appendix headings)
        if s.startswith('## '):
            html_parts.append(f'<h2>{inline_md(s[3:])}</h2>')
            i += 1
            continue

        # Bullet list — collect consecutive
        if s.startswith('- '):
            items = []
            while i < n and lines[i].strip().startswith('- '):
                items.append(f'<li>{inline_md(lines[i].strip()[2:])}</li>')
                i += 1
            html_parts.append('<ul>\n' + '\n'.join(items) + '\n</ul>')
            continue

        # Markdown table
        if s.startswith('|') and '|' in s[1:]:
            table_lines = []
            while i < n and lines[i].strip().startswith('|'):
                table_lines.append(lines[i])
                i += 1
            html = render_table(table_lines)
            if html:
                html_parts.append(html)
            continue

        # Prose paragraph — collect until blank line or structural break
        para_lines = []
        while i < n:
            l = lines[i]
            ls = l.strip()
            if not ls:
                break
            if (ls.startswith('#') or ls.startswith('- ') or
                    ls.startswith('<div') or ls == '---' or
                    (ls.startswith('|') and '|' in ls[1:])):
                break
            para_lines.append(inline_md(l.rstrip()))
            i += 1

        if para_lines:
            html_parts.append('<p>' + '<br>'.join(para_lines) + '</p>')

    return '\n'.join(html_parts)


# ── Manuscript parsing ────────────────────────────────────────────────────────

def parse_manuscript(lines):
    """Slice manuscript lines into named content sections."""
    sections = {}

    toc_line = None
    chapter_lines = {}      # slug -> line index of ## heading
    back_matter_line = None
    closing_ref_line = None
    final_word_line = None
    appendix1_line = None

    for i, line in enumerate(lines):
        s = line.strip()

        if s == '## Table of Contents':
            toc_line = i

        elif s.startswith('## Chapter '):
            m = re.match(r'## Chapter (\w+)', s)
            if m:
                num = ORDINAL_TO_NUM.get(m.group(1))
                if num:
                    chapter_lines[f'chapter-{num}'] = i

        elif s == '# Back Matter':
            back_matter_line = i

        elif s == '## Closing Reflection' and back_matter_line is not None:
            closing_ref_line = i

        elif s == '## A Final Word' and back_matter_line is not None:
            final_word_line = i

        elif re.match(r'^## Appendix I\b', s) and appendix1_line is None:
            appendix1_line = i

    # Front matter: lines 0 → TOC start
    if toc_line:
        sections['front-matter'] = lines[:toc_line]

    # Chapters — slice content (skip the ## heading line itself)
    chapter_slugs = [slug for slug, _ in PAGES if slug.startswith('chapter-')]
    for idx, slug in enumerate(chapter_slugs):
        if slug not in chapter_lines:
            print(f'  WARNING: {slug} not found in manuscript')
            continue
        start = chapter_lines[slug] + 1
        if idx + 1 < len(chapter_slugs):
            next_slug = chapter_slugs[idx + 1]
            end = chapter_lines.get(next_slug, back_matter_line or len(lines))
        else:
            end = back_matter_line if back_matter_line is not None else len(lines)
        sections[slug] = lines[start:end]

    # Closing Reflection
    if closing_ref_line is not None and final_word_line is not None:
        sections['closing-reflection'] = lines[closing_ref_line + 1:final_word_line]
    elif closing_ref_line is not None:
        sections['closing-reflection'] = lines[closing_ref_line + 1:]

    # A Final Word
    if final_word_line is not None and appendix1_line is not None:
        sections['a-final-word'] = lines[final_word_line + 1:appendix1_line]
    elif final_word_line is not None:
        sections['a-final-word'] = lines[final_word_line + 1:]

    # Back matter (Appendix I through end)
    if appendix1_line is not None:
        sections['back-matter'] = lines[appendix1_line:]

    return sections


# ── Navigation helpers ────────────────────────────────────────────────────────

def shorten_nav(title):
    """Abbreviate a page title for navigation buttons."""
    m = re.match(r'Chapter (\w+)', title)
    if m:
        return f'Ch. {ORDINAL_TO_NUM.get(m.group(1), m.group(1))}'
    if title == 'Front Matter':
        return 'Front Matter'
    if title.startswith('Closing Reflection'):
        return 'Closing'
    if title.startswith('A Final Word'):
        return 'Final Word'
    if title == 'Back Matter':
        return 'Back Matter'
    return title[:22] if len(title) > 22 else title


# ── HTML page builders ────────────────────────────────────────────────────────

CONTROLS_HTML = '''\
    <div class="controls">
      <button class="ctrl-btn" onclick="adjustFont(-2)" aria-label="Decrease font size">A&minus;</button>
      <button class="ctrl-btn" onclick="adjustFont(2)" aria-label="Increase font size">A+</button>
      <button class="ctrl-btn" onclick="toggleTheme()" id="theme-btn" aria-label="Toggle theme">&#9790;</button>
    </div>'''


def nav_bar(prev_info, next_info):
    def btn(info, direction):
        if info is None:
            return '<span class="nav-btn placeholder">&nbsp;</span>'
        slug, title = info
        label = shorten_nav(title)
        if direction == 'prev':
            return f'<a href="{slug}.html" class="nav-btn prev">&#8592; {label}</a>'
        return f'<a href="{slug}.html" class="nav-btn next">{label} &#8594;</a>'

    p = btn(prev_info, 'prev')
    n = btn(next_info, 'next')
    toc = '<a href="index.html" class="nav-btn toc">&#9776; Contents</a>'
    return f'  <nav class="nav-bar">\n    {p}\n    {toc}\n    {n}\n  </nav>'


def reading_page(slug, title, content_html, prev_info, next_info):
    nb = nav_bar(prev_info, next_info)
    return f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — {BOOK_TITLE}</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="site-header">
{CONTROLS_HTML}
  </header>
{nb}
  <main class="content">
    <h1 class="page-title">{title}</h1>
    <div class="prose">
{content_html}
    </div>
  </main>
{nb}
  <footer class="site-footer">
    <p><em>{BOOK_TITLE}</em></p>
    <p><a href="feedback.html" class="footer-nav">Reader Notes</a></p>
  </footer>
  <script src="assets/script.js"></script>
</body>
</html>'''


def build_index():
    items = []
    for group in TOC_GROUPS:
        if group['type'] == 'link':
            items.append(
                f'    <a href="{group["slug"]}.html" class="toc-link">{group["label"]}</a>'
            )
        else:
            gid = group['id']
            label = group['label']
            chapters_html = '\n'.join(
                f'      <li><a href="{s}.html">{t}</a></li>'
                for s, t in group['chapters']
            )
            items.append(f'''    <div class="accordion-item">
      <button class="accordion-header" aria-expanded="false" aria-controls="{gid}-panel">
        {label}
        <span class="accordion-icon" aria-hidden="true">&#9662;</span>
      </button>
      <ul id="{gid}-panel" class="accordion-content" hidden>
{chapters_html}
      </ul>
    </div>''')

    toc_html = '\n'.join(items)

    return f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{BOOK_TITLE}</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header class="site-header">
{CONTROLS_HTML}
  </header>
  <div class="index-header">
    <h1>{BOOK_TITLE}</h1>
    <p class="subtitle">{BOOK_SUBTITLE}</p>
    <p class="edition-note">Beta Reading Edition</p>
  </div>
  <div class="toc-container">
    <div class="start-reading-wrap">
      <a href="front-matter.html" class="start-reading">Begin Reading &rarr;</a>
    </div>
    <h2 class="toc-heading">Table of Contents</h2>
{toc_html}
  </div>
  <footer class="site-footer">
    <p><em>{BOOK_TITLE}</em> &mdash; {BOOK_SUBTITLE}</p>
    <p><a href="feedback.html" class="footer-nav">Reader Notes</a></p>
    <p class="reader-count" id="reader-count"></p>
  </footer>
  <script src="assets/script.js"></script>
</body>
</html>'''


# ── CSS ───────────────────────────────────────────────────────────────────────

CSS = '''\
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #f9f7f4;
  --surface: #f0ebe5;
  --text: #2c2c2a;
  --text-subtle: #7a6e65;
  --accent: #6b4c3b;
  --accent-hover: #8a6350;
  --border: #d8d0c8;
  --font-size: 18px;
  --max-width: 700px;
}

[data-theme="dark"] {
  --bg: #1c1c1c;
  --surface: #272727;
  --text: #e8e4df;
  --text-subtle: #9a8d82;
  --accent: #c9956b;
  --accent-hover: #d9a87a;
  --border: #3a3a3a;
}

html {
  font-size: var(--font-size);
  scroll-behavior: smooth;
}

body {
  font-family: Georgia, 'Times New Roman', Times, serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.85;
  transition: background 0.25s ease, color 0.25s ease;
  min-height: 100vh;
}

/* ── Header & controls ─────────────────────────────────────────────────── */

.site-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: flex-end;
}

.controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.ctrl-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.25rem 0.55rem;
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  border-radius: 3px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
}

.ctrl-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* ── Navigation bar ────────────────────────────────────────────────────── */

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  margin: 1rem auto;
  padding: 0 1.25rem;
  gap: 0.5rem;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--accent);
  text-decoration: none;
  font-size: 0.83rem;
  white-space: nowrap;
  background: var(--surface);
  transition: background 0.15s, color 0.15s;
  line-height: 1.2;
}

.nav-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.nav-btn.placeholder {
  visibility: hidden;
}

.nav-btn.toc {
  flex-shrink: 0;
}

/* ── Main content ──────────────────────────────────────────────────────── */

.content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.page-title {
  font-size: 1.55rem;
  font-weight: normal;
  line-height: 1.35;
  color: var(--accent);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

/* ── Prose typography ──────────────────────────────────────────────────── */

.prose h1.book-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 2rem 0 1rem;
  line-height: 1.3;
}

.prose h2 {
  font-size: 1.15rem;
  font-weight: bold;
  color: var(--accent);
  margin: 2.5rem 0 0.75rem;
  line-height: 1.3;
}

.prose h3 {
  font-size: 1.05rem;
  font-weight: bold;
  margin: 2rem 0 0.6rem;
  line-height: 1.3;
}

.prose p {
  margin-bottom: 1.3rem;
}

.prose hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
}

.prose ul {
  margin: 0.5rem 0 1.3rem 1.75rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose em { font-style: italic; }
.prose strong { font-weight: bold; }

/* ── Tables ────────────────────────────────────────────────────────────── */

.table-wrap {
  overflow-x: auto;
  margin: 1.5rem 0;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.88rem;
}

th, td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

th {
  background: var(--surface);
  font-weight: bold;
}

/* ── Footer ────────────────────────────────────────────────────────────── */

.site-footer {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-subtle);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  margin-top: 2rem;
}

/* ── Index page ────────────────────────────────────────────────────────── */

.index-header {
  text-align: center;
  max-width: var(--max-width);
  margin: 3rem auto 2rem;
  padding: 0 1.5rem;
}

.index-header h1 {
  font-size: 2rem;
  font-weight: normal;
  color: var(--accent);
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.index-header .subtitle {
  color: var(--text-subtle);
  font-style: italic;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.index-header .edition-note {
  color: var(--text-subtle);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.toc-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.toc-heading {
  font-size: 0.85rem;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  margin: 1.5rem 0 0.75rem;
}

.start-reading-wrap {
  text-align: center;
  margin: 0.5rem 0 1.5rem;
}

.start-reading {
  display: inline-block;
  padding: 0.7rem 2rem;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: background 0.15s;
}

.start-reading:hover {
  background: var(--accent-hover);
}

/* ── Accordion ─────────────────────────────────────────────────────────── */

.toc-link {
  display: block;
  padding: 0.7rem 1rem;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 0.4rem;
  background: var(--surface);
  font-size: 0.92rem;
  transition: background 0.15s, color 0.15s;
}

.toc-link:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.accordion-item {
  margin-bottom: 0.4rem;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  text-align: left;
  gap: 0.5rem;
  transition: background 0.15s, color 0.15s;
}

.accordion-header:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.accordion-header[aria-expanded="true"] {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  border-radius: 4px 4px 0 0;
}

.accordion-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
  font-style: normal;
}

.accordion-header[aria-expanded="true"] .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  list-style: none;
  border: 1px solid var(--accent);
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0.4rem 0.5rem;
  background: var(--bg);
}

.accordion-content[hidden] {
  display: none;
}

.accordion-content a {
  display: block;
  padding: 0.45rem 1rem;
  color: var(--accent);
  text-decoration: none;
  border-radius: 3px;
  font-size: 0.88rem;
  transition: background 0.12s;
}

.accordion-content a:hover {
  background: var(--surface);
}

/* ── Mobile ─────────────────────────────────────────────────────────────── */

@media (max-width: 520px) {
  :root {
    --font-size: 17px;
  }

  .index-header h1 {
    font-size: 1.6rem;
  }

  .nav-bar {
    padding: 0 0.75rem;
    gap: 0.3rem;
  }

  .nav-btn {
    padding: 0.35rem 0.55rem;
    font-size: 0.78rem;
  }

  .content {
    padding: 1.5rem 1rem 2.5rem;
  }

  .page-title {
    font-size: 1.3rem;
  }
}

/* ── Footer navigation ──────────────────────────────────────────────────── */

.footer-nav {
  color: var(--text-subtle);
  text-decoration: none;
  font-size: 0.8rem;
  display: inline-block;
  margin-top: 0.35rem;
}

.footer-nav:hover {
  color: var(--accent);
}

.reader-count {
  font-size: 0.75rem;
  color: var(--text-subtle);
  margin-top: 0.5rem;
  opacity: 0.7;
  min-height: 1.1em;
}

/* ── Feedback form ──────────────────────────────────────────────────────── */

.feedback-intro {
  margin-bottom: 2.5rem;
}

.feedback-intro p {
  margin-bottom: 1.1rem;
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-label {
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-subtle);
  margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  font-family: Georgia, \'Times New Roman\', Times, serif;
  font-size: 0.95rem;
  padding: 0.6rem 0.75rem;
  line-height: 1.65;
  transition: border-color 0.15s;
  -webkit-appearance: none;
  appearance: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M0 0l5 6 5-6\' fill=\'none\' stroke=\'%237a6e65\' stroke-width=\'1.2\'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 9px;
  padding-right: 2.25rem;
}

.form-submit {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--accent);
  font-family: inherit;
  font-size: 0.88rem;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  margin-top: 0.25rem;
}

.form-submit:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.form-thankyou {
  display: none;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-subtle);
  font-style: italic;
  margin-top: 1.5rem;
  line-height: 1.65;
}
'''

# ── JavaScript ────────────────────────────────────────────────────────────────

JS = '''\
(function () {
  'use strict';

  /* ── Theme ────────────────────────────────────────────────────────────── */
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('gosss-theme') || 'light';
  root.dataset.theme = savedTheme;
  syncThemeBtn();

  function toggleTheme() {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('gosss-theme', next);
    syncThemeBtn();
  }

  function syncThemeBtn() {
    var btn = document.getElementById('theme-btn');
    if (!btn) return;
    if (root.dataset.theme === 'dark') {
      btn.textContent = '☀'; // sun
      btn.title = 'Switch to light mode';
    } else {
      btn.textContent = '☽'; // crescent moon
      btn.title = 'Switch to dark mode';
    }
  }

  /* ── Font size ────────────────────────────────────────────────────────── */
  var MIN_FONT = 14, MAX_FONT = 28;
  var fontSize = parseInt(localStorage.getItem('gosss-font') || '18', 10);
  applyFont();

  function adjustFont(delta) {
    fontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, fontSize + delta));
    localStorage.setItem('gosss-font', String(fontSize));
    applyFont();
  }

  function applyFont() {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
  }

  /* ── Accordion ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.accordion-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all panels
      document.querySelectorAll('.accordion-header').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });

      // Open the clicked panel if it was closed
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }
    });
  });

  /* ── Expose to onclick handlers ───────────────────────────────────────── */
  window.toggleTheme = toggleTheme;
  window.adjustFont = adjustFont;

  /* ── GoatCounter analytics ────────────────────────────────────────────── */
  // SETUP: replace YOURSITE with your GoatCounter site code (e.g. 'godofsticks')
  // Create a free account at https://www.goatcounter.com
  (function () {
    var gc = document.createElement('script');
    gc.dataset.goatcounter = 'https://YOURSITE.goatcounter.com/count';
    gc.async = true;
    gc.src = '//gc.zgo.at/count.js';
    document.head.appendChild(gc);
  }());

  /* ── Visitor counter (homepage only) ─────────────────────────────────── */
  // Requires GoatCounter to be configured above and public stats enabled.
  // Displays "Readers served: N" in the footer of the homepage only.
  var counterEl = document.getElementById('reader-count');
  if (counterEl) {
    fetch('https://YOURSITE.goatcounter.com/counter//.json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.count) {
          counterEl.textContent = 'Readers served: ' + d.count;
        }
      })
      .catch(function () {}); // fails silently if not configured
  }

}());
'''


# ── Main build ────────────────────────────────────────────────────────────────

def main():
    print(f'Reading manuscript from:\n  {MANUSCRIPT}')
    text = MANUSCRIPT.read_text(encoding='utf-8')
    lines = text.splitlines()
    print(f'  {len(lines):,} lines read')

    print('\nParsing sections...')
    sections = parse_manuscript(lines)
    for slug, content in sections.items():
        print(f'  {slug}: {len(content)} lines')

    print('\nCreating output directory structure...')
    (OUT_DIR / 'assets').mkdir(parents=True, exist_ok=True)

    # .nojekyll
    (OUT_DIR / '.nojekyll').write_text('', encoding='utf-8')
    print('  .nojekyll')

    # CSS
    (OUT_DIR / 'assets' / 'style.css').write_text(CSS, encoding='utf-8')
    print('  assets/style.css')

    # JS
    (OUT_DIR / 'assets' / 'script.js').write_text(JS, encoding='utf-8')
    print('  assets/script.js')

    # index.html
    (OUT_DIR / 'index.html').write_text(build_index(), encoding='utf-8')
    print('  index.html')

    # Reading pages
    print('\nGenerating reading pages...')
    for idx, (slug, title) in enumerate(PAGES):
        prev_info = PAGES[idx - 1] if idx > 0 else None
        next_info = PAGES[idx + 1] if idx < len(PAGES) - 1 else None

        content_lines = sections.get(slug, [])
        if not content_lines:
            print(f'  WARNING: no content for {slug} — writing placeholder')
            content_html = '<p><em>(Content not found in manuscript.)</em></p>'
        else:
            content_html = lines_to_html(content_lines)

        html = reading_page(slug, title, content_html, prev_info, next_info)
        out_path = OUT_DIR / f'{slug}.html'
        out_path.write_text(html, encoding='utf-8')
        size_kb = out_path.stat().st_size / 1024
        print(f'  {slug}.html  ({size_kb:.1f} KB)')

    # Summary
    all_files = list(OUT_DIR.rglob('*'))
    file_count = sum(1 for f in all_files if f.is_file())
    total_bytes = sum(f.stat().st_size for f in all_files if f.is_file())
    print(f'\nDone. {file_count} files, {total_bytes / 1024:.0f} KB total')
    print(f'Site root: {OUT_DIR}')
    print('\nTo deploy: push github_ebook/ contents to a GitHub Pages repository.')


if __name__ == '__main__':
    main()
