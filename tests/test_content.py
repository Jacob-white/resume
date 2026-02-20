import os
import re
from playwright.sync_api import Page, expect

def test_content_integrity(page: Page):
    # Load the index.html file
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # Check that "FINTRX" appears in all caps
    # Locate the element containing the text and assert the content
    # Since we don't know exactly where it is, we check the whole body text
    body_text = page.inner_text("body")

    # Check for presence of "FINTRX"
    # Note: Currently it is "FinTrx" so this test will fail until fixed
    # expect(page.locator("body")).to_contain_text("FINTRX") # This is case-insensitive usually?
    # Playwright's to_contain_text is case-insensitive by default? No, it's usually case-insensitive.
    # Let's check documentation or assume case-insensitive.
    # If case-insensitive, it won't catch "FinTrx" vs "FINTRX".
    # So we should use Python's assertion on inner_text.

    # Check that "FinTrx" (mixed case) is NOT present
    # We use regex to find "FinTrx" specifically
    if re.search(r"FinTrx", body_text):
        assert False, "Found 'FinTrx' in content. It should be stylized as 'FINTRX'."

    # Check that "FINTRX" IS present
    if not re.search(r"FINTRX", body_text):
        # Allow failure for now as we haven't fixed it yet, but the test is intended to enforce it.
        # Actually, the test will fail until I fix the content. That's fine.
        assert False, "Did not find 'FINTRX' in content."

    # Check for "Synfinii" and "SalesPage Technologies"
    expect(page.locator("body")).to_contain_text("Synfinii")
    expect(page.locator("body")).to_contain_text("SalesPage Technologies")
