import unittest
import os
import re

class TestTypos(unittest.TestCase):
    INDEX_PATH = "index.html"
    RESUME_MD_PATH = "pdf/Jacob White Resume.md"

    def test_index_hobby_habit(self):
        """Verify 'Hobby Habit' spelling and URL in index.html."""
        if not os.path.exists(self.INDEX_PATH):
            self.fail(f"{self.INDEX_PATH} not found.")

        with open(self.INDEX_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for incorrect spelling "Hobby Habbit"
        self.assertNotIn("Hobby Habbit", content, "Found typo 'Hobby Habbit' in index.html")

        # Check for correct spelling "Hobby Habit"
        self.assertIn("Hobby Habit", content, "Missing 'Hobby Habit' in index.html")

        # Check for correct URL
        self.assertIn("https://hobbyhabit.com", content, "Missing correct URL 'https://hobbyhabit.com' in index.html")

    def test_resume_md_hobby_habit(self):
        """Verify 'Hobby Habit' spelling and URL in Jacob White Resume.md."""
        if not os.path.exists(self.RESUME_MD_PATH):
            self.skipTest(f"{self.RESUME_MD_PATH} not found.")

        with open(self.RESUME_MD_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for incorrect spelling "Hobby Habbit"
        self.assertNotIn("Hobby Habbit", content, "Found typo 'Hobby Habbit' in Jacob White Resume.md")

        # Check for correct spelling "Hobby Habit" (case insensitive check might be safer but exact match is usually desired for brand names)
        # We'll check for "Hobby Habit" specifically.
        # Note: If the resume uses a different casing, this test might fail, but brand names should be consistent.
        # Let's check if the resume even mentions it first to avoid false positives if it's not there at all.
        if "Hobby" in content:
             self.assertIn("Hobby Habit", content, "Missing 'Hobby Habit' in Jacob White Resume.md")

        # Check for correct URL if a URL is present
        # Resume markdown might not have the URL, but if it does, it should be correct.
        if "http" in content and "hobby" in content.lower():
            self.assertIn("https://hobbyhabit.com", content, "Missing correct URL 'https://hobbyhabit.com' in Jacob White Resume.md")

if __name__ == '__main__':
    unittest.main()
