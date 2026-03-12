import unittest
import os
from html.parser import HTMLParser

class LinkSecurityParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.insecure_links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            attrs_dict = dict(attrs)
            target = attrs_dict.get('target')
            href = attrs_dict.get('href', 'unknown')

            if target == '_blank':
                rel = attrs_dict.get('rel', '')
                rel_values = rel.split()

                has_noopener = 'noopener' in rel_values
                has_noreferrer = 'noreferrer' in rel_values

                if not (has_noopener and has_noreferrer):
                    self.insecure_links.append({
                        'href': href,
                        'target': target,
                        'rel': rel,
                        'missing': [] + (['noopener'] if not has_noopener else []) + (['noreferrer'] if not has_noreferrer else [])
                    })

class TestExternalLinks(unittest.TestCase):
    FILE_PATH = "index.html"

    def test_external_links_security(self):
        """Test that all external links (target="_blank") have rel="noopener noreferrer"."""
        if not os.path.exists(self.FILE_PATH):
             self.fail(f"{self.FILE_PATH} does not exist. Run tests from repository root.")

        with open(self.FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        parser = LinkSecurityParser()
        parser.feed(content)
        parser.close()

        if parser.insecure_links:
            error_msg = "Found insecure external links (missing 'noopener noreferrer'):\n"
            for link in parser.insecure_links:
                error_msg += f"  - href: {link['href']}, rel: '{link['rel']}' (Missing: {', '.join(link['missing'])})\n"
            self.fail(error_msg)

if __name__ == "__main__":
    unittest.main()
