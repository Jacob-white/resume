import unittest
import threading
import os
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

class TestCSS(unittest.TestCase):
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
        self.page.goto(f'http://localhost:{self.port}')

    def tearDown(self):
        self.context.close()

    def test_text_muted_contrast(self):
        """Verify --color-text-muted is updated to #495057 or darker for contrast."""
        # Get the computed value of the CSS variable
        # We need to find an element that uses it or just check :root
        color = self.page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim()")

        # Check if it matches expected darker color or acceptable range
        # Current expected: #495057
        self.assertEqual(color, '#495057', f"Expected --color-text-muted to be #495057, got {color}")

    def test_timeline_list_style(self):
        """Verify .timeline-list has no padding and list-style is none without !important."""
        # Verify the computed style
        element = self.page.locator('.timeline-list')

        # Check padding-left
        padding_left = element.evaluate("el => getComputedStyle(el).paddingLeft")
        self.assertEqual(padding_left, '0px', f"Expected padding-left: 0px, got {padding_left}")

        # Check list-style-type
        list_style = element.evaluate("el => getComputedStyle(el).listStyleType")
        self.assertEqual(list_style, 'none', f"Expected list-style-type: none, got {list_style}")

    def test_timeline_item_style(self):
        """Verify .timeline-item has correct styles."""
        element = self.page.locator('.timeline-item').first

        # Check list-style-type (should be none, inherited or set)
        list_style = element.evaluate("el => getComputedStyle(el).listStyleType")
        self.assertEqual(list_style, 'none', f"Expected list-style-type: none, got {list_style}")

        # Check before pseudo-element position
        # Note: Playwright can't directly select pseudo-elements easily, but we can evaluate JS
        left_pos = element.evaluate("""el => {
            const before = window.getComputedStyle(el, '::before');
            return before.left;
        }""")
        self.assertEqual(left_pos, '-6px', f"Expected ::before left: -6px, got {left_pos}")

    def test_print_styles(self):
        """Verify print styles are correctly applied."""
        # Emulate print media
        self.page.emulate_media(media="print")

        # Check hidden elements (nav, .btn, footer)
        for selector in ['nav', '.btn', 'footer']:
            # Check the first visible element if multiple exist, or just check the style rule
            # Since display: none removes it from the render tree, we need to check computed style
            # However, Playwright locator might not find it if it's hidden.
            # We can use evaluate to find the element and check style.

            # Locate elements. Note: if there are multiple .btn, check all or first.
            count = self.page.locator(selector).count()
            if count > 0:
                display = self.page.locator(selector).first.evaluate("el => getComputedStyle(el).display")
                self.assertEqual(display, 'none', f"Expected {selector} to be hidden in print, got {display}")

        # Check body styles
        body_bg = self.page.evaluate("getComputedStyle(document.body).backgroundColor")
        body_color = self.page.evaluate("getComputedStyle(document.body).color")

        # Browsers might return 'rgb(255, 255, 255)' or 'white' or 'rgba(0, 0, 0, 0)' if transparent/default
        # The CSS explicitly sets it to white and black.
        self.assertIn(body_bg, ['rgb(255, 255, 255)', 'white', '#ffffff'], f"Expected body background white, got {body_bg}")
        self.assertIn(body_color, ['rgb(0, 0, 0)', 'black', '#000000'], f"Expected body color black, got {body_color}")

        # Check anchor styles
        # Find a link
        link = self.page.locator('a').first
        if link.count() > 0:
            text_decoration = link.evaluate("el => getComputedStyle(el).textDecorationLine")
            color = link.evaluate("el => getComputedStyle(el).color")

            self.assertEqual(text_decoration, 'none', f"Expected link text-decoration none, got {text_decoration}")
            self.assertIn(color, ['rgb(0, 0, 0)', 'black', '#000000'], f"Expected link color black, got {color}")

if __name__ == '__main__':
    unittest.main()
