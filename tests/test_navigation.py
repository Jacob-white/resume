import os
import pathlib
import pytest
from playwright.sync_api import Page, expect

@pytest.fixture
def index_url():
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    return (repo_root / "index.html").as_uri()

@pytest.mark.parametrize("text,selector", [
    ('About', '#aboutme'),
    ('Skills', '#skills'),
    ('Experience', '#experience'),
    ('Education', '#education'),
    ('Projects', '#projects')
])
def test_internal_links(page: Page, index_url, text, selector):
    """Verify internal navigation links scroll to the correct section."""
    page.goto(index_url)

    # Ensure the link is clicked
    # We use force=True or just click. If it's covered by sticky nav, it might fail.
    # But usually Playwright handles scrolling.
    # The sticky nav is `.glass-nav`.

    page.click(f'nav >> text={text}')

    # Verify URL update
    expect(page).to_have_url(f"{index_url}{selector}")

    # Verify the target section is visible
    element = page.locator(selector)
    expect(element).to_be_visible()

def test_resume_link(page: Page, index_url):
    """Verify the Resume download link points to the correct PDF."""
    page.goto(index_url)

    link = page.locator('text=Download CV (PDF)')
    expect(link).to_be_visible()
    href = link.get_attribute('href')

    # Check against relative path or full URL
    assert 'pdf/Jacob%20White%20Resume.pdf' in href

def test_contact_email_obfuscation(page: Page, index_url):
    """Verify the email obfuscation script generates the correct mailto link."""
    page.goto(index_url)

    link = page.locator('a.email-link')

    # Wait for the href attribute to be updated by JS
    expect(link).to_have_attribute("href", "mailto:jacob.samuel.white@gmail.com")
