import pathlib
import sys
from playwright.sync_api import sync_playwright

def generate_pdf():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Determine the absolute path to index.html relative to this script
        script_dir = pathlib.Path(__file__).parent.resolve()
        repo_root = script_dir.parent
        index_path = repo_root / "index.html"
        pdf_path = repo_root / "pdf" / "Jacob White Resume.pdf"

        if not index_path.exists():
             print(f"Error: index.html not found at {index_path}")
             sys.exit(1)

        file_uri = index_path.as_uri()
        print(f"Navigating to {file_uri}")
        page.goto(file_uri)

        # Wait for images to load
        page.wait_for_load_state("networkidle")

        print(f"Generating PDF to {pdf_path}")
        # Use A4 format, print background, and standard margins
        page.pdf(path=pdf_path, format="A4", print_background=True, margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"})

        print("PDF generated successfully!")
        browser.close()

if __name__ == "__main__":
    generate_pdf()
