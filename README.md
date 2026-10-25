# Jake White — Technical Business Analyst & Systems Architect Portfolio

Personal portfolio and resume site for **Jake White**, showcasing experience across FinTech, Asset Management, Master Data Management (MDM), and full-stack data engineering.

## Highlights

- **Modern UI & Dark Mode**: Built with semantic HTML5 landmarks, accessible focus indicators, fluid typography (`text-wrap: balance` / `pretty`), and system-aware dark/light theme toggling (`color-scheme: light dark`).
- **Interactive Project Showcase**: Filterable project portfolio featuring **Canonic MDM**, **Entity Standardizer**, **Query Builder**, **Data Quality Check Platform**, and **Hobby Habit**.
- **Optimized Bundle**: Uses a tree-shaken 16KB custom Bootstrap stylesheet (`bootstrap-custom.min.css`) and `content-visibility: auto` for fast rendering.
- **Privacy & Security**: Content Security Policy (CSP), email obfuscation, external link `noopener noreferrer` enforcement, and automated PII checks on both Markdown and compiled PDF outputs.

## Testing & Verification

Install dependencies and Playwright browsers:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/playwright install chromium
```

Run the Playwright & unit test suite and verification checks:

```bash
.venv/bin/pytest -v
.venv/bin/python verification/check_headshot.py
.venv/bin/python verification/check_timeline_alignment.py
```
