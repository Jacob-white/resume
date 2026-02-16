import pytest
from playwright.sync_api import Page, expect
import pathlib

def test_headshot_styles(page: Page):
    """
    Verify that the headshot image has the correct styles.
    """
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"
    page.goto(index_path.as_uri())

    headshot = page.locator(".headshot-container img")
    expect(headshot).to_be_visible()

    # Check CSS properties
    # Note: computed styles might be returned in different formats.
    # object-position: top usually computes to "50% 0%"

    # Check aspect-ratio
    # Note: aspect-ratio might be computed as "1 / 1" or just "1" depending on browser.
    # But usually "1 / 1" is returned if set explicitly.
    expect(headshot).to_have_css("aspect-ratio", "1 / 1")

    # Check object-fit
    expect(headshot).to_have_css("object-fit", "cover")

    # Check object-position
    # Playwright's expect matches against the computed value.
    expect(headshot).to_have_css("object-position", "50% 0%")

def test_timeline_dot_styles(page: Page):
    """
    Verify that the timeline dot marker has the correct left offset.
    """
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"
    page.goto(index_path.as_uri())

    # Get the first timeline item
    timeline_item = page.locator(".timeline-item").first
    expect(timeline_item).to_be_visible()

    # Verify pseudo-element style via evaluate
    left = timeline_item.evaluate("el => getComputedStyle(el, '::before').left")
    assert left == "-6px", f"Expected left to be -6px, got {left}"
