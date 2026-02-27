import unittest
import os

class TestRobotsTxt(unittest.TestCase):
    def test_robots_txt_exists(self):
        """Test that robots.txt exists."""
        self.assertTrue(os.path.exists("robots.txt"), "robots.txt does not exist")

    def test_robots_txt_content(self):
        """Test that robots.txt has the correct content."""
        expected_content = "User-agent: *\nDisallow:\n"
        with open("robots.txt", "r") as f:
            content = f.read()
        self.assertEqual(content, expected_content)

if __name__ == "__main__":
    unittest.main()
