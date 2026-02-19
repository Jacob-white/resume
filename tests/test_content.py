import pytest
from playwright.sync_api import Page, expect
import pathlib

def test_brand_name_fintrx(page: Page):
    """
    Test that the brand name 'FINTRX' is correctly stylized as 'FINTRX' (all caps)
    and 'FinTrx' (mixed case) is NOT present.
    """
    # Get absolute path to index.html relative to this test file
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"
    page.goto(index_path.as_uri())

    # Assert 'FINTRX' is visible
    expect(page.get_by_text("FINTRX", exact=False)).to_be_visible()

    # Assert 'FinTrx' is NOT present in the HTML text content
    # We check page content (HTML source) or innerText
    content = page.content()
    assert "FINTRX" in content, "FINTRX not found in HTML content"
    assert "FinTrx" not in content, "Found incorrect casing 'FinTrx' in HTML content"

def test_experience_roles_distinct(page: Page):
    """
    Test that 'Synfinii' and 'SalesPage Technologies' appear as distinct roles/entities.
    """
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    index_path = repo_root / "index.html"
    page.goto(index_path.as_uri())

    # Check for Synfinii
    # Using exact=False (default) but targeting the specific company name string
    expect(page.get_by_text("Synfinii (formerly SalesPage Technologies)")).to_be_visible()

    # Check for SalesPage Technologies
    # Using .first because there are multiple roles at SalesPage Technologies
    expect(page.get_by_text("SalesPage Technologies", exact=True).first).to_be_visible()
