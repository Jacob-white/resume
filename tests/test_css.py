import pathlib
from playwright.sync_api import Page, expect

def test_timeline_padding_mobile(page: Page):
    """
    Test that the timeline item padding is responsive.
    """
    # Get absolute path to index.html relative to this test file
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"

    # Load the page
    page.goto(index_path.as_uri())

    # Set viewport to mobile size
    page.set_viewport_size({"width": 768, "height": 800})

    # Get the first timeline item
    timeline_item = page.locator(".timeline-item").first

    # Check computed style for mobile
    # 1.5rem = 24px
    expect(timeline_item).to_have_css("padding-bottom", "24px")

    # Set viewport to desktop size to verify media query is not global
    page.set_viewport_size({"width": 1200, "height": 800})

    # Check computed style for desktop
    # 3rem = 48px
    expect(timeline_item).to_have_css("padding-bottom", "48px")
