import os
import re
import pathlib
import pytest
from playwright.sync_api import Page, expect

@pytest.fixture
def index_url():
    # Use absolute path for file:// URI
    return pathlib.Path(__file__).parent.parent.joinpath("index.html").resolve().as_uri()

def test_internal_links(page: Page, index_url):
    """Verify internal navigation links scroll to the correct section."""
    page.goto(index_url)

    links = {
        'About': '#aboutme',
        'Skills': '#skills',
        'Experience': '#experience',
        'Education': '#education',
        'Projects': '#projects'
    }

    for text, selector in links.items():
        # Click the link
        page.click(f'nav >> text={text}')

        # Verify URL hash updates
        # Check that the URL ends with the correct selector (hash)
        # Using expect.to_have_url with regex is robust
        expect(page).to_have_url(re.compile(f"{re.escape(selector)}$"))

        # Verify the target section is visible
        # Note: visibility check might require scrolling which click() handles
        section = page.locator(selector)
        expect(section).to_be_visible()

def test_scrollspy_active_link(page: Page, index_url):
    """Verify that scrolling to a section updates the active class in the navbar."""
    page.goto(index_url)

    # Check if ScrollSpy works - scroll to Experience section
    # We might need to wait for JS to initialize if we add it
    section = page.locator('#experience')
    section.scroll_into_view_if_needed()

    # Check if 'Experience' link in nav has .active class
    # Bootstrap adds 'active' class to the nav-link
    nav_link = page.locator('nav .nav-link', has_text='Experience')
    # Use expect with timeout to allow scrollspy to update
    expect(nav_link).to_have_class(re.compile(r"active"), timeout=5000)

def test_contact_email_obfuscation(page: Page, index_url):
    """Verify the email obfuscation script generates the correct mailto link."""
    page.goto(index_url)

    link = page.locator('a.email-link')
    # Wait for JS to run
    expect(link).to_have_attribute('href', 'mailto:jacob.samuel.white@gmail.com')
