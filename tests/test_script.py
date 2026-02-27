import os
import datetime
import pytest
from playwright.sync_api import Page, expect

def test_current_year_updated(page: Page):
    """
    Test that the script.js correctly updates the current year in the footer.
    """
    # Get absolute path to index.html
    # Assumes tests/ is in the repo root along with index.html
    index_path = os.path.abspath("index.html")

    # Load the page
    page.goto(f"file://{index_path}")

    # Get current year
    current_year = str(datetime.datetime.now().year)

    # Verify that the element with id 'current-year' has the correct year text
    expect(page.locator("#current-year")).to_have_text(current_year)

def test_script_no_console_errors(page: Page):
    """
    Test that loading the page produces no console errors from script.js.
    This implicitly checks that document.getElementById("current-year") did not fail (return null).
    """
    # Capture console messages
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg) if msg.type == "error" else None)

    # Capture unhandled exceptions
    page_errors = []
    page.on("pageerror", lambda err: page_errors.append(err))

    # Get absolute path to index.html
    index_path = os.path.abspath("index.html")

    # Load the page
    page.goto(f"file://{index_path}")

    # Assert no errors
    assert len(console_errors) == 0, f"Console errors found: {console_errors}"
    assert len(page_errors) == 0, f"Page errors found: {page_errors}"
