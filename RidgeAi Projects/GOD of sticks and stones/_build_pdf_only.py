#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Fixed PDF builder for The God of Sticks and Stones — Review Edition."""

import re
from pathlib import Path
from fpdf import FPDF

PROJECT = Path(r"C:\Users\ridge\GitHub_Projects\RidgeAi Projects\GOD of sticks and stones")
OUT = PROJECT / "master_manuscript" / "07_publication_build"
MD_PATH = OUT / "review_edition_complete.md"

# ── Comprehensive character substitution (Latin-1 safe) ──────────────────────
SUBS = {
    '\u2014': '--',    # em dash
    '\u2013': '-',     # en dash
    '\u201c': '"',     # left double quote
    '\u201d': '"',     # right double quote
    '\u2018': "'",     # left single quote
    '\u2019': "'",     # right single quote
    '\u2192': '->',    # right arrow
    '\u2190': '<-',    # left arrow
    '\u2022': '-',     # bullet
    '\u00e9': 'e',     # e accent
    '\u00e8': 'e',
    '\u00ea': 'e',
    '\u00e0': 'a',
    '\u00e2': 'a',
    '\u00f4': 'o',
    '\u00fb': 'u',
    '\u00e7': 'c',
    '\u2705': '[OK]',  # checkmark emoji
    '\u26a0': '[!]',   # warning sign
    '\ufe0f': '',      # variation selector (emoji modifier)
    '\u2714': '[v]',   # heavy check mark
    '\u274c': '[x]',   # cross mark
}

def sanitize(text):
    """Replace non-Latin-1 chars and strip remaining non-printable ones."""
    for k, v in SUBS.items():
        text = text.replace(k, v)
    # Final pass: replace anything still outside Latin-1 printable range
    result = []
    for ch in text:
        try:
            ch.encode('latin-1')
            result.append(ch)
        except (UnicodeEncodeError, ValueError):
            result.append('?')
    return ''.join(result)

def strip_md(text):
    """Remove markdown syntax for clean plain-text rendering."""
    text = sanitize(text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*',     r'\1', text)
    text = re.sub(r'`([^`]*)`',     r'\1', text)
    text = re.sub(r'^#+\s*',        '',    text)
    return text.strip()

# ── PDF class ─────────────────────────────────────────────────────────────────
class ManuscriptPDF(FPDF):
    def header(self):
        pass

    def footer(self):
        self.set_y(-15)
        self.set_font('Times', 'I', 9)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f'Page {self.page_no()}', align='C')
        self.set_text_color(0, 0, 0)

def build():
    pdf = ManuscriptPDF(orientation='P', unit='mm', format='Letter')
    pdf.set_auto_page_break(auto=True, margin=22)
    pdf.set_margins(left=28, top=28, right=28)
    pdf.add_page()
    pdf.set_font('Times', '', 11)

    EW = pdf.epw  # effective page width

    def pb():
        pdf.add_page()

    def h1(txt):
        pdf.ln(8)
        pdf.set_font('Times', 'B', 20)
        pdf.multi_cell(EW, 10, strip_md(txt), align='C', new_x='LMARGIN', new_y='NEXT')
        pdf.ln(4)

    def h2(txt):
        pdf.ln(6)
        pdf.set_font('Times', 'B', 15)
        pdf.multi_cell(EW, 8, strip_md(txt), align='C', new_x='LMARGIN', new_y='NEXT')
        pdf.ln(2)

    def h3(txt):
        pdf.ln(4)
        pdf.set_font('Times', 'B', 12)
        pdf.multi_cell(EW, 7, strip_md(txt), align='C', new_x='LMARGIN', new_y='NEXT')
        pdf.ln(1)

    def body(txt, italic=False, bold=False, size=11, center=False):
        style = ''
        if bold:   style += 'B'
        if italic: style += 'I'
        pdf.set_font('Times', style, size)
        align = 'C' if center else 'L'
        txt = strip_md(txt)
        if not txt:
            return
        pdf.multi_cell(EW, 6, txt, align=align, new_x='LMARGIN', new_y='NEXT')

    def blank(h=4):
        pdf.ln(h)

    def rule():
        pdf.ln(3)
        pdf.set_draw_color(150, 150, 150)
        y = pdf.get_y()
        pdf.line(28, y, 28 + EW, y)
        pdf.set_draw_color(0, 0, 0)
        pdf.ln(4)

    def table_row(cells, sizes=None):
        """Render a table row as tab-spaced plain text."""
        if not cells or all(c.replace('-','').strip() == '' for c in cells):
            return
        txt = '    '.join(cells)
        txt = strip_md(txt)
        pdf.set_font('Times', '', 9)
        # If too long, truncate with ellipsis
        while txt and pdf.get_string_width(txt) > EW - 5:
            txt = txt[:-4] + '...'
        if txt:
            pdf.multi_cell(EW, 5, txt, align='L', new_x='LMARGIN', new_y='NEXT')

    # ── Parse markdown ────────────────────────────────────────────────────────
    md = MD_PATH.read_text(encoding='utf-8')
    lines = md.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i]

        # Page break
        if 'page-break-after' in line:
            pb()
            i += 1
            continue

        # H1
        if re.match(r'^# [^#]', line):
            h1(line[2:])
            i += 1
            continue

        # H2
        if re.match(r'^## [^#]', line):
            h2(line[3:])
            i += 1
            continue

        # H3
        if re.match(r'^### ', line):
            h3(line[4:])
            i += 1
            continue

        # Horizontal rule
        if line.strip() == '---':
            rule()
            i += 1
            continue

        # Table row
        if line.startswith('|'):
            cells = [sanitize(c.strip()) for c in line.split('|') if c.strip()]
            table_row(cells)
            i += 1
            continue

        # Blank line
        if not line.strip():
            blank(3)
            i += 1
            continue

        # Detect style
        stripped = line.strip()
        is_italic = stripped.startswith('*') and stripped.endswith('*') and len(stripped) > 2 and not stripped.startswith('**')
        is_bold   = stripped.startswith('**') and stripped.endswith('**') and len(stripped) > 4

        if is_italic:
            body(stripped[1:-1], italic=True)
        elif is_bold:
            body(stripped[2:-2], bold=True)
        else:
            body(stripped)

        i += 1

    return pdf

# ── RUN ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("Building PDF (fixed)...")
    try:
        pdf = build()
        out_path = OUT / "review_edition_complete.pdf"
        pdf.output(str(out_path))
        import shutil
        shutil.copy(out_path, PROJECT / "review_edition_complete.pdf")
        print(f"  -> {out_path}")
        print(f"  Pages: {pdf.page}")
        print("PDF complete.")
    except Exception as e:
        import traceback
        print(f"ERROR: {e}")
        traceback.print_exc()
