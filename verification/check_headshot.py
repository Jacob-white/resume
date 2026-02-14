import pathlib
import sys
from playwright.sync_api import sync_playwright

def test_headshot():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Determine the absolute path to index.html using pathlib
        # Assuming script is run from repo root or its own directory
        # The original script assumed cwd was repo root.
        # We will make it robust relative to the script location.
        script_dir = pathlib.Path(__file__).parent.resolve()
        # If script is in verification/, index.html is in parent
        # If script is in root (not likely based on path), logic adjusts
        repo_root = script_dir.parent
        index_path = repo_root / "index.html"

        if not index_path.exists():
             print(f"Error: index.html not found at {index_path}")
             sys.exit(1)

        file_uri = index_path.as_uri()

        print(f"Navigating to {file_uri}")
        page.goto(file_uri)

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
