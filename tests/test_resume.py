import os
import pathlib
from urllib.parse import unquote
from playwright.sync_api import Page, expect

def test_resume_link_exists_and_valid(page: Page):
    """
    Test that the resume download link exists, points to a valid file,
    and has the correct attributes for security and UX.
    """
    # Get absolute path to index.html relative to this test file
    # This makes the test robust regardless of where it's run from
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"

    # Check if index.html exists
    assert index_path.exists(), f"index.html not found at {index_path}"

    # Load the page using a proper file URI
    page.goto(index_path.as_uri())

    # Locate the link
    # Using role and name to ensure accessibility
    download_link = page.get_by_role("link", name="Download CV (PDF)")

    # Verify it's visible
    expect(download_link).to_be_visible()

    # Get href
    href = download_link.get_attribute("href")
    assert href is not None, "Resume link has no href"

    # Decode URL (handle %20)
    decoded_href = unquote(href)

    # Construct full path to the resume file
    # href is relative to index.html (repo_root)
    # We need to handle if it starts with ./ or not
    file_path = (repo_root / decoded_href).resolve()

    # Check if file exists
    assert file_path.exists(), f"Resume file not found at: {file_path}"

    # Check if it is a PDF (simple extension check)
    assert file_path.suffix.lower() == ".pdf", "File is not a PDF based on extension"

    # Check file content header for %PDF magic bytes
    with open(file_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF", f"File header is not %PDF: {header}"

    # Check attributes for security and UX
    assert download_link.get_attribute("target") == "_blank", "Link should open in new tab (target='_blank')"
    rel_attr = download_link.get_attribute("rel")
    assert rel_attr is not None, "Link missing rel attribute"
    assert "noopener" in rel_attr, "Link missing 'noopener' in rel attribute"
    assert "noreferrer" in rel_attr, "Link missing 'noreferrer' in rel attribute"
