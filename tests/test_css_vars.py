import unittest
import os
import re

class TestCSSVariables(unittest.TestCase):
    FILE_PATH = "style.css"

    def setUp(self):
        # Determine project root (parent of tests directory)
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.css_path = os.path.join(self.project_root, self.FILE_PATH)

        with open(self.css_path, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_hero_variables_defined(self):
        """Test that hero gradient variables are defined in :root."""
        self.assertRegex(self.content, r"--color-hero-start:\s*#[0-9a-fA-F]{3,6}", "Missing --color-hero-start definition")
        self.assertRegex(self.content, r"--color-hero-end:\s*#[0-9a-fA-F]{3,6}", "Missing --color-hero-end definition")

    def test_hero_section_uses_variables(self):
        """Test that .hero-section uses the defined variables."""
        # Find .hero-section block
        hero_section_match = re.search(r"\.hero-section\s*\{([^}]+)\}", self.content, re.DOTALL)
        self.assertIsNotNone(hero_section_match, ".hero-section not found")

        hero_styles = hero_section_match.group(1)
        self.assertIn("var(--color-hero-start)", hero_styles, ".hero-section does not use --color-hero-start")
        self.assertIn("var(--color-hero-end)", hero_styles, ".hero-section does not use --color-hero-end")

if __name__ == "__main__":
    unittest.main()
