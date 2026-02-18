import pathlib
import sys
from playwright.sync_api import sync_playwright

def verify_fintrx():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Determine the absolute path to index.html
        script_dir = pathlib.Path(__file__).parent.resolve()
        repo_root = script_dir.parent
        index_path = repo_root / "index.html"

        if not index_path.exists():
             print(f"Error: index.html not found at {index_path}")
             sys.exit(1)

        file_uri = index_path.as_uri()
        print(f"Navigating to {file_uri}")
        page.goto(file_uri)

        # Locate the element containing FINTRX
        # It's in the Experience section, specifically in the list item for Data Onboarding
        locator = page.get_by_text("Data Onboarding:").locator("..")

        # Scroll to it
        locator.scroll_into_view_if_needed()

        # Check text
        content = locator.inner_text()
        if "FINTRX" in content:
            print("Found FINTRX in content.")
        else:
            print(f"Error: FINTRX not found in content: {content}")
            sys.exit(1)

        # Take screenshot of the Experience section
        # We can take a screenshot of the specific card or list item
        # The parent is .modern-card
        card = locator.locator("xpath=ancestor::div[contains(@class, 'modern-card')]")
        screenshot_path = script_dir / "fintrx_verification.png"
        card.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_fintrx()
