import pytest
import os
import re
import datetime
from playwright.sync_api import Page, expect

@pytest.fixture
def index_url():
    return f"file://{os.path.abspath('index.html')}"

def parse_date(date_str):
    date_str = date_str.strip()
    if date_str.lower() == 'present':
        return datetime.datetime.now()

    # Try multiple formats
    for fmt in ('%b %Y', '%Y', '%B %Y', '%B, %Y'):
        try:
            return datetime.datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def test_resume_date_consistency(page: Page, index_url):
    """Verify resume date ranges for logical consistency."""
    page.goto(index_url)

    # Locate elements that contain date ranges
    # Specifically badges in timeline items or education
    badges = page.locator('.badge')
    count = badges.count()

    current_date = datetime.datetime.now()

    for i in range(count):
        text = badges.nth(i).inner_text().strip()

        # Check if it looks like a date range "Start – End" or "Year – Year"
        # Using regex to split by en dash, em dash, hyphen
        if re.search(r'[–-]', text):
            parts = re.split(r'\s*[–-]\s*', text)

            if len(parts) == 2:
                start_str, end_str = parts

                start_date = parse_date(start_str)
                end_date = parse_date(end_str)

                # Only check if both look like dates
                if start_date and end_date:
                    # Check logical order
                    assert start_date <= end_date, f"Start date {start_str} is after end date {end_str} in '{text}'"

                    # If end date is 'Present', start date must be <= now
                    if end_str.lower() == 'present':
                        assert start_date <= current_date, f"Job marked 'Present' starts in the future: {start_str} (Now: {current_date})"
