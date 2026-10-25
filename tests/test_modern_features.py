import json
import pathlib
import unittest
from playwright.sync_api import sync_playwright


class TestModernFeatures(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.repo_root = pathlib.Path(__file__).parent.parent.resolve()
        cls.index_path = cls.repo_root / "index.html"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        self.page.goto(self.index_path.as_uri())

    def tearDown(self):
        self.context.close()

    def test_theme_toggle_functionality(self):
        """Verify the theme toggle switches between light and dark themes and updates ARIA attributes."""
        toggle_btn = self.page.locator("#theme-toggle")
        self.assertTrue(toggle_btn.is_visible())

        initial_pressed = toggle_btn.get_attribute("aria-pressed")
        self.assertIn(initial_pressed, ("true", "false"))

        # Click to toggle theme
        toggle_btn.click()

        new_pressed = toggle_btn.get_attribute("aria-pressed")
        self.assertNotEqual(new_pressed, initial_pressed, "Theme toggle should flip aria-pressed state")

        if new_pressed == "true":
            self.assertEqual(self.page.locator("html").get_attribute("data-theme"), "dark")
            self.assertEqual(self.page.locator('meta[name="color-scheme"]').get_attribute("content"), "dark")
        else:
            self.assertIsNone(self.page.locator("html").get_attribute("data-theme"))

        # Click again to revert to system default
        toggle_btn.click()
        self.assertEqual(toggle_btn.get_attribute("aria-pressed"), initial_pressed)
        self.assertEqual(self.page.locator('meta[name="color-scheme"]').get_attribute("content"), "light dark")

    def test_projects_rendered(self):
        """Verify all 5 portfolio projects are rendered and GitHub links exist."""
        projects_section = self.page.locator("#projects")
        self.assertTrue(projects_section.is_visible())

        project_titles = [
            "Canonic MDM (Firm Association Platform)",
            "Entity Standardizer",
            "Query Builder",
            "Data Quality Check Platform",
            "Hobby Habit (Hobby Tracker)",
        ]
        for title in project_titles:
            self.assertTrue(
                projects_section.locator(f"h3:has-text('{title}')").is_visible(),
                f"Expected project '{title}' to be visible",
            )

    def test_accessibility_landmarks_and_json_ld(self):
        """Verify semantic landmarks, skip link, JSON-LD Person schema, and custom Bootstrap bundle."""
        skip_link = self.page.locator("a.skip-link")
        self.assertEqual(skip_link.get_attribute("href"), "#main-content")
        self.assertEqual(self.page.locator("main#main-content").count(), 1)
        self.assertEqual(self.page.locator("header nav#main-nav").count(), 1)

        # Verify custom Bootstrap CSS is used and duplicate css/bootstrap.min.css is removed
        self.assertEqual(self.page.locator('link[href="bootstrap-custom.min.css"]').count(), 1)
        self.assertFalse((self.repo_root / "css" / "bootstrap.min.css").exists())

        # Verify JSON-LD structured data is valid JSON and describes Jake White
        json_ld_raw = self.page.locator('script[type="application/ld+json"]').text_content()
        self.assertIsNotNone(json_ld_raw)
        data = json.loads(json_ld_raw)
        self.assertEqual(data["@type"], "Person")
        self.assertEqual(data["name"], "Jake White")
        self.assertIn("Rust", data["knowsAbout"])
        self.assertIn("Master Data Management", data["knowsAbout"])


if __name__ == "__main__":
    unittest.main()
