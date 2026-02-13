import os
import sys
from playwright.sync_api import sync_playwright

def test_headshot():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Determine the absolute path to index.html
        cwd = os.getcwd()
        file_path = f"file://{cwd}/index.html"

        print(f"Navigating to {file_path}")
        page.goto(file_path)

        # Locate the headshot image
        image_selector = ".headshot-container img"
        image = page.locator(image_selector)

        # Check if the image is visible
        if not image.is_visible():
            print("Error: Headshot image is not visible")
            sys.exit(1)

        # Check if the image loaded correctly (naturalWidth > 0)
        is_loaded = image.evaluate("img => img.naturalWidth > 0")
        if not is_loaded:
            print("Error: Headshot image failed to load (naturalWidth == 0)")
            sys.exit(1)

        # Verify specific attributes
        src = image.get_attribute("src")
        if "Formal-Headshot.jpg" not in src:
            print(f"Error: Expected src to contain Formal-Headshot.jpg, but got {src}")
            sys.exit(1)

        alt = image.get_attribute("alt")
        expected_alt = "Headshot of Jake White"
        if alt != expected_alt:
            print(f"Error: Expected alt to be '{expected_alt}', but got '{alt}'")
            sys.exit(1)

        print("Headshot verification passed!")
        browser.close()

if __name__ == "__main__":
    test_headshot()
