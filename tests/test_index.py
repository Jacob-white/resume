import unittest
import os
from html.parser import HTMLParser

class ValidatingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_elements = {
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        }
        self.found_ids = set()
        self.title_content = ""
        self.in_title = False
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.stack.append(tag)

        for attr, value in attrs:
            if attr == 'id':
                self.found_ids.add(value)

        if tag == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag in self.void_elements:
            return

        if not self.stack:
            self.errors.append(f"Unexpected end tag: </{tag}>")
            return

        if self.stack[-1] == tag:
             self.stack.pop()
        else:
            if tag in self.stack:
                 while self.stack and self.stack[-1] != tag:
                     missing = self.stack.pop()
                     self.errors.append(f"Missing closing tag: </{missing}>")
                 self.stack.pop() # Pop the matching tag
            else:
                 self.errors.append(f"Stray end tag: </{tag}>")

        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title_content += data

class TestIndexHTML(unittest.TestCase):
    FILE_PATH = "index.html"

    def setUp(self):
        self.assertTrue(os.path.exists(self.FILE_PATH), f"{self.FILE_PATH} does not exist")
        with open(self.FILE_PATH, "r", encoding="utf-8") as f:
            self.content = f.read()

        self.parser = ValidatingParser()
        try:
            self.parser.feed(self.content)
            self.parser.close()
        except Exception as e:
            self.fail(f"HTML parsing raised exception: {e}")

    def test_file_not_empty(self):
        """Test that the file is not empty."""
        self.assertTrue(len(self.content) > 0, "File is empty")

    def test_has_doctype(self):
        """Test that the file starts with DOCTYPE."""
        self.assertTrue(self.content.strip().startswith("<!DOCTYPE html>"), "Missing DOCTYPE")

    def test_valid_html_structure(self):
        """Test that the HTML structure is valid (balanced tags)."""
        if self.parser.errors:
            self.fail(f"HTML validation errors: {'; '.join(self.parser.errors)}")

        if self.parser.stack:
            self.fail(f"Unclosed tags: {', '.join(self.parser.stack)}")

    def test_script_js_tag_present(self):
        """Test that script.js is included in the HTML."""
        self.assertIn('<script src="script.js"></script>', self.content)

    def test_title_content(self):
        """Test that the title is correct."""
        expected_title = "Jake White - Business Analyst"
        self.assertEqual(self.parser.title_content, expected_title,
                         f"Expected title '{expected_title}', got '{self.parser.title_content}'")

    def test_sections_exist(self):
        """Test that key sections exist by ID."""
        required_ids = [
            'main-nav',
            'aboutme',
            'skills',
            'experience',
            'education',
            'projects'
        ]
        missing_ids = [rid for rid in required_ids if rid not in self.parser.found_ids]
        self.assertFalse(missing_ids, f"Missing section IDs: {', '.join(missing_ids)}")

if __name__ == "__main__":
    unittest.main()
