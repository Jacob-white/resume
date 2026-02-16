import os
import datetime
from playwright.sync_api import Page, expect

def test_csp_headers(page: Page):
    # Load the index.html file
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # Verify CSP meta tag existence
    csp_meta = page.locator('meta[http-equiv="Content-Security-Policy"]')
    expect(csp_meta).to_have_count(1)

    # Verify CSP content
    expected_csp = "default-src 'self'; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
    expect(csp_meta).to_have_attribute("content", expected_csp)

def test_js_functionality(page: Page):
    # Load the index.html file
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # Verify Footer Year
    current_year = str(datetime.datetime.now().year)
    footer_year = page.locator("#current-year")
    expect(footer_year).to_have_text(current_year)

    # Verify Email Obfuscation
    # The script constructs mailto:jacob.samuel.white@gmail.com
    email_link = page.locator(".email-link")
    expect(email_link).to_have_attribute("href", "mailto:jacob.samuel.white@gmail.com")
