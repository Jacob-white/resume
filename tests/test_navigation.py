import unittest
import threading
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

class TestNavigation(unittest.TestCase):
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

    def test_internal_links(self):
        """Verify internal navigation links scroll to the correct section."""
        links = {
            'About': '#aboutme',
            'Skills': '#skills',
            'Experience': '#experience',
            'Education': '#education',
            'Projects': '#projects'
        }

        for text, selector in links.items():
            with self.subTest(link=text):
                # Ensure the link is clicked
                self.page.click(f'nav >> text={text}')

                # Verify URL update
                self.page.wait_for_url(f'**/{selector}')

                # Verify the target section is present
                element = self.page.locator(selector)
                self.assertTrue(element.count() > 0, f"Section {selector} not found")

    def test_resume_link(self):
        """Verify the Resume download link points to the correct PDF."""
        link = self.page.locator('text=Download CV (PDF)')
        self.assertTrue(link.is_visible())
        href = link.get_attribute('href')
        # Check against relative path or full URL
        self.assertIn('pdf/Jacob%20White%20Resume.pdf', href)

    def test_view_experience_aria_label(self):
        """Verify that the View Experience button has the correct aria-label."""
        button = self.page.locator('a[href="#experience"].btn-custom-primary')
        self.assertTrue(button.is_visible(), "View Experience button not visible")
        aria_label = button.get_attribute('aria-label')
        self.assertEqual(aria_label, "View Experience Section", "Incorrect aria-label")

    def test_contact_email_obfuscation(self):
        """Verify the email obfuscation script generates the correct mailto link."""
        link = self.page.locator('a.email-link')
        # Wait for the href attribute to be updated by JS
        try:
            link.wait_for(state="attached")
            # Wait specifically for the href to start with mailto:
            self.page.wait_for_function("document.querySelector('a.email-link').href.startsWith('mailto:')")
        except Exception as e:
            self.fail(f"Email link obfuscation failed or timed out: {e}")

        href = link.get_attribute('href')
        self.assertEqual(href, 'mailto:jacob.samuel.white@gmail.com')

    def test_scrollspy(self):
        """Verify that scrolling to a section updates the active nav link via Bootstrap ScrollSpy."""
        # Experience section
        section = '#experience'
        # Corresponding nav link
        nav_link = self.page.locator('nav a[href="#experience"]')

        # Scroll to the section
        self.page.locator(section).scroll_into_view_if_needed()

        # Wait for ScrollSpy (debounce/throttle)
        self.page.wait_for_timeout(1000)

        # Check for 'active' class
        # We need to re-fetch the attribute because it changes dynamically
        classes = nav_link.get_attribute('class')
        self.assertIn('active', classes, f"Nav link for {section} should be active after scrolling")

if __name__ == '__main__':
    unittest.main()
