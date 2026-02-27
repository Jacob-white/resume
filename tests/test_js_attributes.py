import unittest
import threading
import os
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

class TestJSAttributes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Determine project root (parent of tests directory)
        cls.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Custom handler to serve from project root
        class ProjectRootHandler(SimpleHTTPRequestHandler):
            def do_GET(self):
                return super().do_GET()

            def log_message(self, format, *args):
                pass # suppress logging

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
        if hasattr(cls, 'browser'):
            cls.browser.close()
        if hasattr(cls, 'playwright'):
            cls.playwright.stop()
        if hasattr(cls, 'server'):
            cls.server.shutdown()
            cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        self.page.goto(f'http://localhost:{self.port}/index.html')

    def tearDown(self):
        if hasattr(self, 'context'):
            self.context.close()

    def test_valid_email_obfuscation(self):
        """Verify that existing valid links in index.html are correctly obfuscated."""
        # Wait for the script to run on DOMContentLoaded
        self.page.wait_for_function("document.querySelector('a.email-link').href.startsWith('mailto:')")

        link = self.page.locator('a.email-link').first
        href = link.get_attribute('href')

        # Verify it constructed the correct email
        self.assertEqual(href, 'mailto:jacob.samuel.white@gmail.com')

    def test_missing_attributes_logging(self):
        """Verify that missing attributes log an error and do not set href."""

        # Capture console errors
        console_errors = []
        def handle_console(msg):
            if msg.type == "error":
                console_errors.append(msg.text)

        self.page.on("console", handle_console)

        # Inject a bad link with class 'email-link' but missing data attributes
        # Then manually call obfuscateEmails() to process it
        self.page.evaluate("""
            const badLink = document.createElement('a');
            badLink.className = 'email-link';
            badLink.id = 'bad-link';
            // Missing data-user and data-domain
            document.body.appendChild(badLink);

            // Call the function explicitly to process the new link
            if (typeof obfuscateEmails === 'function') {
                obfuscateEmails();
            } else {
                console.error('obfuscateEmails function not found');
            }
        """)

        # Check href of the bad link
        bad_link = self.page.locator('#bad-link')
        href = bad_link.get_attribute('href')

        # It should NOT be a mailto link
        if href:
             self.assertFalse(href.startswith('mailto:'), f"Href should not start with mailto, got: {href}")
             self.assertNotIn('undefined', href)
             self.assertNotIn('null', href)

        # Check for expected console error from script.js
        # The error message in script.js is: "Missing data-user or data-domain attributes for email link"
        error_found = any("Missing data-user or data-domain" in err for err in console_errors)

        # Debug info if failure
        if not error_found:
            print(f"Captured console errors: {console_errors}")

        self.assertTrue(error_found, "Expected console error about missing attributes not found")

if __name__ == '__main__':
    unittest.main()
