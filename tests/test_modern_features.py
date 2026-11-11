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
        """Verify all 6 portfolio projects and live app / GitHub links are rendered."""
        projects_section = self.page.locator("#projects")
        self.assertTrue(projects_section.is_visible())

        project_titles = [
            "Canonic MDM (Firm Association Platform)",
            "Entity Standardizer",
            "Query Builder",
            "Data Quality Check Platform",
            "Hobby Habit (Hobby Tracker)",
            "Hobby Heroes",
        ]
        for title in project_titles:
            self.assertTrue(
                projects_section.locator(f"h3:has-text('{title}')").is_visible(),
                f"Expected project '{title}' to be visible",
            )

        # Verify live app launch buttons exist for hosted apps
        self.assertEqual(
            projects_section.locator('a[aria-label="Launch Canonic MDM App"]').get_attribute("href"),
            "/firm_network/",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="Launch Entity Standardizer App"]').get_attribute("href"),
            "/entity-standardizer/",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="Launch Query Builder App"]').get_attribute("href"),
            "/query-builder/",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="Launch Hobby Habit App"]').get_attribute("href"),
            "/hobby-habit/",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="Open Hobby Habit Hub"]').get_attribute("href"),
            "/hub?launch=1",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="Launch Hobby Heroes App"]').get_attribute("href"),
            "/hobby-heroes/",
        )
        self.assertEqual(
            projects_section.locator('a[aria-label="View Hobby Heroes on GitHub"]').count(),
            0,
            "Hobby Heroes is a private repo and should not expose a public GitHub link",
        )

        # Verify Entity Standardizer Studio UI has all 5 interactive capability tabs (including Batch CSV Upload) and readable layout/contrast
        studio_path = self.repo_root / "entity-standardizer" / "index.html"
        self.assertTrue(studio_path.exists())
        self.page.set_viewport_size({"width": 1280, "height": 800})
        self.page.goto(studio_path.as_uri())
        self.assertEqual(self.page.locator(".studio-tab").count(), 5)
        self.assertEqual(self.page.locator("#csv-file-input").count(), 1)
        es_styles = self.page.evaluate(
            """() => {
            const hdr = getComputedStyle(document.querySelector('.studio-header'));
            const title = getComputedStyle(document.querySelector('.studio-header h1'));
            const activeTab = getComputedStyle(document.querySelector('.studio-tab.active'));
            const input = getComputedStyle(document.querySelector('#addr-street1'));
            const col5 = document.querySelector('#panel-address .col-lg-5').getBoundingClientRect();
            const col7 = document.querySelector('#panel-address .col-lg-7').getBoundingClientRect();
            return {
                hdrBg: hdr.backgroundImage,
                titleColor: title.color,
                tabBg: activeTab.backgroundColor,
                tabColor: activeTab.color,
                inputBg: input.backgroundColor,
                inputColor: input.color,
                sideBySide: col7.left >= col5.right - 5
            };
        }"""
        )
        self.assertIn("linear-gradient", es_styles["hdrBg"])
        self.assertNotEqual(es_styles["tabBg"], es_styles["tabColor"])
        self.assertNotEqual(es_styles["inputBg"], es_styles["inputColor"])
        self.assertTrue(es_styles["sideBySide"], "Entity Standardizer columns must sit side-by-side on desktop")

        # Verify persistent Client CSV Import & Templates banner and downloadable template files
        self.assertTrue(self.page.locator(".client-csv-banner").is_visible())
        self.assertTrue(self.page.locator("#btn-quick-upload-csv").is_visible())
        self.assertTrue(self.page.locator("#btn-quick-sample-csv").is_visible())
        self.assertTrue(self.page.locator("#btn-header-csv-jump").is_visible())
        for tpl_name in (
            "entity_standardizer_crm_template.csv",
            "entity_standardizer_address_template.csv",
            "entity_standardizer_phone_template.csv",
        ):
            tpl_file = self.repo_root / "entity-standardizer" / "templates" / tpl_name
            self.assertTrue(tpl_file.exists(), f"Missing template {tpl_name}")
            self.assertGreaterEqual(len(tpl_file.read_text(encoding="utf-8").strip().splitlines()), 2)

        # Clicking the header CSV jump button switches to Tab 5 and focuses the CSV panel heading
        self.page.locator("#btn-header-csv-jump").click()
        self.assertTrue(self.page.locator("#panel-csv").is_visible())
        self.assertTrue(self.page.locator("#csv-raw-textarea").is_visible())

        # Verify Hobby Habit Studio Showcase UI has all 3 interactive capability tabs and readable layout/contrast
        hh_studio_path = self.repo_root / "hobby-habit" / "index.html"
        self.assertTrue(hh_studio_path.exists())
        self.page.goto(hh_studio_path.as_uri())
        self.assertEqual(self.page.locator(".hh-tab").count(), 3)
        hh_styles = self.page.evaluate(
            """() => {
            const backBtn = getComputedStyle(document.querySelector('.hh-header .btn-outline-light'));
            const hubBtn = getComputedStyle(document.querySelector('#open-full-hub-btn'));
            const kpis = Array.from(document.querySelectorAll('section[aria-label=\"Workspace Summary Metrics\"] > div')).map(el => el.getBoundingClientRect());
            return {
                backColor: backBtn.color,
                hubBg: hubBtn.backgroundColor,
                hubColor: hubBtn.color,
                kpisSameRow: kpis.length === 4 && Math.abs(kpis[0].top - kpis[3].top) < 5
            };
        }"""
        )
        self.assertEqual(hh_styles["backColor"], "rgb(255, 255, 255)")
        self.assertNotEqual(hh_styles["hubBg"], hh_styles["hubColor"])
        self.assertTrue(hh_styles["kpisSameRow"], "Hobby Habit 4 KPI cards must sit in a single row on desktop")

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

    def test_synfinii_and_salespage_logos(self):
        """Verify the Synfinii role uses synfinii_logo.png and SalesPage roles use salespage_technologies_logo.jpg."""
        timeline_items = self.page.locator("#experience .timeline-item")
        self.assertEqual(timeline_items.count(), 4)

        synfinii_img = timeline_items.nth(0).locator("img.logo-img")
        self.assertIn("synfinii_logo.png", synfinii_img.get_attribute("src"))
        self.assertEqual(synfinii_img.get_attribute("alt"), "Synfinii Logo")
        self.assertTrue(synfinii_img.evaluate("img => img.naturalWidth > 0"))

        for idx in (1, 2):
            sp_img = timeline_items.nth(idx).locator("img.logo-img")
            self.assertIn("salespage_technologies_logo.jpg", sp_img.get_attribute("src"))
            self.assertEqual(sp_img.get_attribute("alt"), "SalesPage Technologies Logo")
            self.assertTrue(sp_img.evaluate("img => img.naturalWidth > 0"))


if __name__ == "__main__":
    unittest.main()
