import unittest
import os

class TestTypos(unittest.TestCase):
    def setUp(self):
        self.html_path = os.path.join(os.getcwd(), 'index.html')
        self.md_path = os.path.join(os.getcwd(), 'pdf/Jacob White Resume.md')

        with open(self.html_path, 'r', encoding='utf-8') as f:
            self.html_content = f.read()

        with open(self.md_path, 'r', encoding='utf-8') as f:
            self.md_content = f.read()

    def test_hobby_habit_spelling(self):
        """Test for correct spelling of 'Hobby Habit' and its URL."""
        # Check index.html
        self.assertNotIn('Hobby Habbit', self.html_content, "Found 'Hobby Habbit' typo in index.html")
        self.assertNotIn('https://hobbyhabbit.com', self.html_content, "Found incorrect URL in index.html")
        self.assertIn('Hobby Habit', self.html_content, "'Hobby Habit' not found in index.html")
        self.assertIn('https://hobbyhabit.com', self.html_content, "Correct URL not found in index.html")

        # Check markdown
        self.assertNotIn('Hobby Habbit', self.md_content, "Found 'Hobby Habbit' typo in markdown")
        self.assertNotIn('https://hobbyhabbit.com', self.md_content, "Found incorrect URL in markdown")
        self.assertIn('Hobby Habit', self.md_content, "'Hobby Habit' not found in markdown")
        self.assertIn('https://hobbyhabit.com', self.md_content, "Correct URL not found in markdown")

    def test_fintrx_capitalization(self):
        """Test for correct capitalization of 'FINTRX'."""
        # Check index.html
        self.assertNotIn('FinTrx', self.html_content, "Found 'FinTrx' (should be FINTRX) in index.html")
        self.assertIn('FINTRX', self.html_content, "'FINTRX' not found in index.html")

        # Check markdown
        self.assertNotIn('FinTrx', self.md_content, "Found 'FinTrx' (should be FINTRX) in markdown")
        self.assertIn('FINTRX', self.md_content, "'FINTRX' not found in markdown")

if __name__ == '__main__':
    unittest.main()
