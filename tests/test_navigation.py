import pytest
from playwright.sync_api import Page, expect
import pathlib
import os
import re

@pytest.fixture
def index_page(page: Page):
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"
    page.goto(index_path.as_uri())
    return page

def test_internal_links(index_page: Page):
    """Verify internal navigation links scroll to the correct section."""
    links = {
        'About': '#aboutme',
        'Skills': '#skills',
        'Experience': '#experience',
        'Education': '#education',
        'Projects': '#projects'
    }

    for text, selector in links.items():
        # Click the link in the nav
        # We target the link specifically in the nav to avoid footer links or others
        nav_link = index_page.locator(f"#main-nav a.nav-link:has-text('{text}')")

        # Ensure it's visible
        expect(nav_link).to_be_visible()

        nav_link.click()

        # Check URL hash using regex
        expect(index_page).to_have_url(re.compile(f"{selector}$"))

        # Verify target section is visible
        section = index_page.locator(selector)
        expect(section).to_be_visible()

def test_resume_link(index_page: Page):
    """Verify the Resume download link points to the correct PDF."""
    link = index_page.get_by_role("link", name="Download CV (PDF)")
    expect(link).to_be_visible()
    href = link.get_attribute('href')
    assert 'pdf/Jacob%20White%20Resume.pdf' in href

def test_contact_email_obfuscation(index_page: Page):
    """Verify the email obfuscation script generates the correct mailto link."""
    # This tests that script.js is running correctly
    link = index_page.locator('a.email-link').first

    # Check href attribute
    # expect automatically waits/retries until assertion passes
    expect(link).to_have_attribute('href', 'mailto:jacob.samuel.white@gmail.com')
