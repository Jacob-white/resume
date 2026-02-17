import os
import pytest
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

@pytest.fixture
def html_content():
    file_path = "index.html"
    assert os.path.exists(file_path), f"{file_path} does not exist"
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

@pytest.fixture
def parsed_html(html_content):
    parser = ValidatingParser()
    try:
        parser.feed(html_content)
        parser.close()
    except Exception as e:
        pytest.fail(f"HTML parsing raised exception: {e}")
    return parser

def test_file_not_empty(html_content):
    """Test that the file is not empty."""
    assert len(html_content) > 0, "File is empty"

def test_has_doctype(html_content):
    """Test that the file starts with DOCTYPE."""
    assert html_content.strip().startswith("<!DOCTYPE html>"), "Missing DOCTYPE"

def test_valid_html_structure(parsed_html):
    """Test that the HTML structure is valid (balanced tags)."""
    if parsed_html.errors:
        pytest.fail(f"HTML validation errors: {'; '.join(parsed_html.errors)}")

    if parsed_html.stack:
        pytest.fail(f"Unclosed tags: {', '.join(parsed_html.stack)}")

def test_title_content(parsed_html):
    """Test that the title is correct."""
    expected_title = "Jake White - Business Analyst"
    assert parsed_html.title_content == expected_title, \
        f"Expected title '{expected_title}', got '{parsed_html.title_content}'"

def test_sections_exist(parsed_html):
    """Test that key sections exist by ID."""
    required_ids = [
        'main-nav',
        'aboutme',
        'skills',
        'experience',
        'education',
        'projects'
    ]
    missing_ids = [rid for rid in required_ids if rid not in parsed_html.found_ids]
    assert not missing_ids, f"Missing section IDs: {', '.join(missing_ids)}"
