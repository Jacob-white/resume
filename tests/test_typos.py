import unittest
import os
import re

class TestTypos(unittest.TestCase):
    FILE_PATH = "index.html"
    RESUME_PATH = "pdf/Jacob White Resume.md"

    def setUp(self):
        with open(self.FILE_PATH, "r", encoding="utf-8") as f:
            self.content = f.read()

        if os.path.exists(self.RESUME_PATH):
            with open(self.RESUME_PATH, "r", encoding="utf-8") as f:
                self.resume_content = f.read()
        else:
            self.resume_content = None

    def test_hobby_habit_spelling_index(self):
        """Test that 'Hobby Habit' is spelled correctly in index.html."""
        # Check for incorrect spelling
        self.assertNotIn("Hobby Habbit", self.content, "Found typo 'Hobby Habbit' in index.html")
        # Check for correct spelling
        self.assertIn("Hobby Habit", self.content, "Did not find correct spelling 'Hobby Habit' in index.html")

    def test_hobby_habit_url_index(self):
        """Test that the Hobby Habit URL is correct in index.html."""
        # Check for incorrect URL
        self.assertNotIn("hobbyhabbit.com", self.content, "Found incorrect URL 'hobbyhabbit.com' in index.html")
        # Check for correct URL
        self.assertIn("hobbyhabit.com", self.content, "Did not find correct URL 'hobbyhabit.com' in index.html")

    def test_hobby_habit_spelling_resume(self):
        """Test that 'Hobby Habit' is spelled correctly in resume markdown."""
        if self.resume_content:
            # Check for incorrect spelling
            self.assertNotIn("Hobby Habbit", self.resume_content, "Found typo 'Hobby Habbit' in resume markdown")
            # Check for correct spelling
            self.assertIn("Hobby Habit", self.resume_content, "Did not find correct spelling 'Hobby Habit' in resume markdown")

    def test_hobby_habit_url_resume(self):
        """Test that the Hobby Habit URL is correct in resume markdown."""
        if self.resume_content:
            # Check for incorrect URL
            self.assertNotIn("hobbyhabbit.com", self.resume_content, "Found incorrect URL 'hobbyhabbit.com' in resume markdown")
            # Check for correct URL
            self.assertIn("hobbyhabit.com", self.resume_content, "Did not find correct URL 'hobbyhabit.com' in resume markdown")

if __name__ == "__main__":
    unittest.main()
