import pytest
import os
import pathlib
from playwright.sync_api import Page, expect

@pytest.fixture
def index_url():
    return pathlib.Path(__file__).parent.parent.joinpath("index.html").resolve().as_uri()

def test_timeline_dot_offset(page: Page, index_url):
    """Verify the timeline dot marker offset."""
    page.goto(index_url)

    # We need to check the ::before pseudo-element of .timeline-item
    # Since we can't select pseudo-elements directly, we evaluate JS
    offset = page.locator('.timeline-item').first.evaluate("""
        (element) => {
            const style = window.getComputedStyle(element, '::before');
            return style.left;
        }
    """)
    assert offset == '-6px', f"Expected -6px offset for timeline dot, got {offset}"

def test_last_timeline_item_border(page: Page, index_url):
    """Verify the last timeline item has transparent border-left."""
    page.goto(index_url)

    last_item = page.locator('.timeline-item').last

    # In some browsers transparent is returned as rgba(0, 0, 0, 0)
    expect(last_item).to_have_css('border-left-color', 'rgba(0, 0, 0, 0)')

def test_headshot_styles(page: Page, index_url):
    """Verify headshot image styles."""
    page.goto(index_url)

    headshot = page.locator('.headshot-container img')

    expect(headshot).to_have_css('object-fit', 'cover')
    expect(headshot).to_have_css('object-position', '50% 0%') # "top" usually computes to "50% 0%"

    # checking aspect-ratio might be tricky as computed style might return '1 / 1' or just '1' or 'auto' depending on browser support for property
    # But let's try '1 / 1'
    expect(headshot).to_have_css('aspect-ratio', '1 / 1')
