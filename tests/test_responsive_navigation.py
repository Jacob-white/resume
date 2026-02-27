import unittest
import threading
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

class TestResponsiveNavigation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Determine project root (parent of tests directory)
        cls.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Custom handler to serve from project root
        class ProjectRootHandler(SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=cls.project_root, **kwargs)

        # Start server on port 0 (ephemeral)
        cls.server = HTTPServer(('localhost', 0), ProjectRootHandler)
        cls.port = cls.server.server_port

        cls.server_thread = threading.Thread(target=cls.server.serve_forever)
        cls.server_thread.daemon = True
        cls.server_thread.start()

        # Start Playwright and Browser
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context()
        self.page = self.context.new_page()

    def tearDown(self):
        self.context.close()

    def test_desktop_layout(self):
        """Verify navigation elements are arranged horizontally on desktop."""
        # Desktop viewport
        self.page.set_viewport_size({"width": 1280, "height": 800})
        self.page.goto(f'http://localhost:{self.port}')

        # Locators
        logo_container = self.page.locator('a[aria-label="Home"]')
        nav = self.page.locator('ul.nav')
        buttons = self.page.locator('.text-end')

        self.assertTrue(logo_container.is_visible())
        self.assertTrue(nav.is_visible())
        self.assertTrue(buttons.is_visible())

        box_logo = logo_container.bounding_box()
        box_nav = nav.bounding_box()
        box_buttons = buttons.bounding_box()

        # Check horizontal arrangement: Logo < Nav < Buttons
        self.assertLess(box_logo['x'], box_nav['x'], "Logo should be to the left of Nav on desktop")
        self.assertLess(box_nav['x'], box_buttons['x'], "Nav should be to the left of Buttons on desktop")

        # Check they are roughly on the same vertical level (tops aligned)
        # Using a tolerance of 50px
        self.assertTrue(abs(box_logo['y'] - box_nav['y']) < 50, f"Logo and Nav not vertically aligned: {box_logo['y']} vs {box_nav['y']}")
        self.assertTrue(abs(box_nav['y'] - box_buttons['y']) < 50, f"Nav and Buttons not vertically aligned: {box_nav['y']} vs {box_buttons['y']}")

    def test_mobile_layout(self):
        """Verify navigation elements are stacked vertically on mobile."""
        # Mobile viewport (iPhone SE-ish)
        self.page.set_viewport_size({"width": 375, "height": 667})
        self.page.goto(f'http://localhost:{self.port}')

        # Locators
        logo_container = self.page.locator('a[aria-label="Home"]')
        nav = self.page.locator('ul.nav')
        buttons = self.page.locator('.text-end')

        self.assertTrue(logo_container.is_visible())
        self.assertTrue(nav.is_visible())
        self.assertTrue(buttons.is_visible())

        box_logo = logo_container.bounding_box()
        box_nav = nav.bounding_box()
        box_buttons = buttons.bounding_box()

        # Check vertical stacking: Logo above Nav above Buttons
        # Note: Bounding box y is the top coordinate.

        # Bottom of Logo should be <= Top of Nav (with some margin)
        logo_bottom = box_logo['y'] + box_logo['height']
        self.assertGreaterEqual(box_nav['y'], logo_bottom, "Nav should be below Logo on mobile")

        # Bottom of Nav should be <= Top of Buttons
        nav_bottom = box_nav['y'] + box_nav['height']
        self.assertGreaterEqual(box_buttons['y'], nav_bottom, "Buttons should be below Nav on mobile")

if __name__ == '__main__':
    unittest.main()
