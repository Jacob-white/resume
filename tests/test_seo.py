import os
import pytest
from playwright.sync_api import Page, expect

def test_seo_meta_tags(page: Page):
    # Load the index.html file
    # Using absolute path for local file access
    file_path = os.path.abspath("index.html")
    page.goto(f"file://{file_path}")

    # Verify title
    expect(page).to_have_title("Jake White - Business Analyst")

    # Verify Meta Description
    description = page.locator('meta[name="description"]')
    expect(description).to_have_count(1)
    expect(description).to_have_attribute("content", "Technical Business Analyst portfolio of Jake White. Expert in SQL, Python, and Data Strategy with experience in FinTech and Asset Management.")

    # Verify OG Title
    og_title = page.locator('meta[property="og:title"]')
    expect(og_title).to_have_count(1)
    expect(og_title).to_have_attribute("content", "Jake White - Business Analyst")

    # Verify OG Description
    og_description = page.locator('meta[property="og:description"]')
    expect(og_description).to_have_count(1)
    expect(og_description).to_have_attribute("content", "Technical Business Analyst portfolio of Jake White. Expert in SQL, Python, and Data Strategy with experience in FinTech and Asset Management.")

    # Verify OG Image
    og_image = page.locator('meta[property="og:image"]')
    expect(og_image).to_have_count(1)
    expect(og_image).to_have_attribute("content", "./images/Formal-Headshot.jpg")

    # Verify OG Type
    og_type = page.locator('meta[property="og:type"]')
    expect(og_type).to_have_count(1)
    expect(og_type).to_have_attribute("content", "website")
