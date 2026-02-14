import pathlib
import sys
from playwright.sync_api import sync_playwright

def check_timeline_alignment():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Determine the absolute path to index.html relative to this script
        script_dir = pathlib.Path(__file__).parent.resolve()
        repo_root = script_dir.parent
        index_path = repo_root / "index.html"

        if not index_path.exists():
             print(f"Error: index.html not found at {index_path}")
             sys.exit(1)

        file_uri = index_path.as_uri()
        print(f"Navigating to {file_uri}")
        page.goto(file_uri)

        # Get computed style of the pseudo-element
        style = page.evaluate("""
            () => {
                const item = document.querySelector('.timeline-item');
                const style = window.getComputedStyle(item, '::before');
                return {
                    left: style.left
                };
            }
        """)

        print(f"Timeline Item ::before left: {style['left']}")

        # Memory Requirement: The timeline dot marker (`.timeline-item::before`) requires a `left` offset of `-6px`
        if style['left'] != "-6px":
            print(f"Error: Expected .timeline-item::before left to be '-6px', but got '{style['left']}'")
            sys.exit(1)

        print("Timeline alignment verification passed!")
        browser.close()

if __name__ == "__main__":
    check_timeline_alignment()
