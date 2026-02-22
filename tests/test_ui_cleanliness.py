import os
import re
from playwright.sync_api import Page, expect

def test_hobby_habit_text_html(page: Page):
    """Test that 'Hobby Habbit' is corrected to 'Hobby Habit' in index.html"""
    page.goto(f"file://{os.path.abspath('index.html')}")
    expect(page.get_by_text("Hobby Habit")).to_be_visible()
    # Ensure the old typo is gone
    expect(page.get_by_text("Hobby Habbit")).not_to_be_visible()

def test_hobby_habit_link_html(page: Page):
    """Test that the link points to hobbyhabit.com in index.html"""
    page.goto(f"file://{os.path.abspath('index.html')}")
    # aria-label is 'Visit Hobby Habit website', so accessible name is that.
    # Alternatively, we can match by text if we don't care about accessibility name in this specific check,
    # but get_by_role uses accessible name.
    link = page.get_by_role("link", name="Visit Hobby Habit website")
    expect(link).to_have_attribute("href", "https://hobbyhabit.com")

def test_logo_images_class_html(page: Page):
    """Test that logo images have the .logo-img class in index.html"""
    page.goto(f"file://{os.path.abspath('index.html')}")

    # Locate all logo images in Experience and Education sections
    # Experience section images
    experience_images = page.locator("#experience .modern-card img")
    count = experience_images.count()
    assert count > 0, "No images found in Experience section"
    for i in range(count):
        expect(experience_images.nth(i)).to_have_class(re.compile(r"logo-img"))

    # Education section images
    education_images = page.locator("#education .modern-card img")
    count = education_images.count()
    assert count > 0, "No images found in Education section"
    for i in range(count):
        expect(education_images.nth(i)).to_have_class(re.compile(r"logo-img"))

def test_logo_img_css(page: Page):
    """Test that .logo-img class exists in style.css and has object-fit: contain"""
    # We can check the computed style of an element with this class
    # Or just check the file content. Let's check computed style on a dummy element or existing one.
    # Since we expect the class to be applied, we can check one of the images.

    page.goto(f"file://{os.path.abspath('index.html')}")

    # Check one logo image
    img = page.locator("#experience .modern-card img").first
    # We expect it to have the class, but since we haven't applied it yet, this test will fail initially.
    # If the class is applied, we check the CSS property.

    # To robustly test the CSS rule existence even if not applied yet in HTML (which is not possible with getComputedStyle on non-matching elements),
    # we can just read the CSS file text for this specific test, or rely on the previous test failing if class is missing.
    # But let's check the computed style assuming the class IS applied (which is the goal state).

    # If the class is NOT applied, this test might be irrelevant or fail on the class check.
    # So let's just check the CSS file content for the rule.
    with open("style.css", "r") as f:
        css_content = f.read()

    assert ".logo-img" in css_content, ".logo-img class not found in style.css"
    assert "object-fit: contain" in css_content, "object-fit: contain not found in style.css"

def test_hobby_habit_markdown():
    """Test that 'Hobby Habbit' is corrected to 'Hobby Habit' in resume markdown"""
    with open("pdf/Jacob White Resume.md", "r") as f:
        content = f.read()

    assert "Hobby Habit" in content, "'Hobby Habit' not found in markdown"
    assert "Hobby Habbit" not in content, "'Hobby Habbit' typo found in markdown"
    assert "https://hobbyhabit.com" in content, "Correct URL not found in markdown"
    assert "https://hobbyhabbit.com" not in content, "Incorrect URL found in markdown"
