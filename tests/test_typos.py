import unittest
import os

class TestTypos(unittest.TestCase):
    def test_index_typos(self):
        file_path = "index.html"
        self.assertTrue(os.path.exists(file_path), f"{file_path} does not exist")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for Hobby Habit
        self.assertIn("Hobby Habit", content, "Hobby Habit spelling is incorrect in index.html")
        self.assertNotIn("Hobby Habbit", content, "Hobby Habbit typo found in index.html")

        # Check for URL
        self.assertIn("https://hobbyhabit.com", content, "Hobby Habit URL is incorrect in index.html")
        self.assertNotIn("https://hobbyhabbit.com", content, "Hobby Habbit URL typo found in index.html")

        # Check for FINTRX
        self.assertIn("FINTRX", content, "FINTRX spelling/capitalization is incorrect in index.html")
        self.assertNotIn("FinTrx", content, "FinTrx incorrect capitalization found in index.html")

    def test_md_typos(self):
        file_path = "pdf/Jacob White Resume.md"
        self.assertTrue(os.path.exists(file_path), f"{file_path} does not exist")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for Hobby Habit
        self.assertIn("Hobby Habit", content, "Hobby Habit spelling is incorrect in markdown")
        self.assertNotIn("Hobby Habbit", content, "Hobby Habbit typo found in markdown")

        # Check for URL
        self.assertIn("https://hobbyhabit.com", content, "Hobby Habit URL is incorrect in markdown")
        self.assertNotIn("https://hobbyhabbit.com", content, "Hobby Habbit URL typo found in markdown")

        # Check for FINTRX
        self.assertIn("FINTRX", content, "FINTRX spelling/capitalization is incorrect in markdown")
        self.assertNotIn("FinTrx", content, "FinTrx incorrect capitalization found in markdown")

if __name__ == "__main__":
    unittest.main()
