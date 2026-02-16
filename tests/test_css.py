import pytest
from pathlib import Path
from playwright.sync_api import Page, expect

def test_print_styles(page: Page):
    """
    Verify that the print styles are correctly applied.
    """
    # Get the absolute path to index.html using pathlib
    file_path = Path(__file__).parent.parent / "index.html"
    page.goto(file_path.absolute().as_uri())

    # Emulate print media
    page.emulate_media(media="print")

    # Verify key elements are hidden
    # Using specific locators as seen in style.css
    expect(page.locator("nav")).to_be_hidden()
    expect(page.locator(".btn").first).to_be_hidden()
    # Check all buttons are hidden
    for btn in page.locator(".btn").all():
        expect(btn).to_be_hidden()
    expect(page.locator("footer")).to_be_hidden()

    # Verify body styles
    body_bg_color = page.evaluate("window.getComputedStyle(document.body).backgroundColor")
    body_color = page.evaluate("window.getComputedStyle(document.body).color")

    assert body_bg_color == "rgb(255, 255, 255)"
    assert body_color == "rgb(0, 0, 0)"
