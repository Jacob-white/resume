import datetime
import pathlib
from playwright.sync_api import sync_playwright

def test_footer_year():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine the absolute path to index.html relative to this test file
        base_dir = pathlib.Path(__file__).parent.parent.absolute()
        index_path = base_dir / "index.html"
        file_url = index_path.as_uri()

        # Navigate to the local index.html file
        page.goto(file_url)

        # Get the element with ID "current-year"
        year_element = page.locator("#current-year")

        # Get the text content
        year_text = year_element.text_content()

        # Get the current year
        current_year = str(datetime.datetime.now().year)

        # Assert that the text content matches the current year
        assert year_text == current_year, f"Expected year {current_year}, but got {year_text}"

        browser.close()
