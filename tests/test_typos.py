import unittest
import os

class TestTypos(unittest.TestCase):
    def test_typos_in_files(self):
        files_to_check = ["index.html", "pdf/Jacob White Resume.md"]

        typos = {
            "Hobby Habbit": "Hobby Habit",
            "FinTrx": "FINTRX",
            "https://hobbyhabbit.com": "https://hobbyhabit.com"
        }

        for file_path in files_to_check:
            with self.subTest(file=file_path):
                self.assertTrue(os.path.exists(file_path), f"File {file_path} does not exist")
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                for typo, correction in typos.items():
                    self.assertNotIn(typo, content, f"Found typo '{typo}' in {file_path}. Should be '{correction}'.")
                    # Also check that the correction is present (at least once)
                    # This ensures we didn't just remove the typo but actually fixed it
                    # However, we only expect the correction if the typo was expected to be there.
                    # But since we are fixing existing content, we expect the correction to be there.
                    self.assertIn(correction, content, f"Correction '{correction}' not found in {file_path}.")

if __name__ == "__main__":
    unittest.main()
