import pathlib
import pytest

def test_resume_markdown_no_phone_number():
    """
    Test that the resume markdown file does not contain the personal phone number.
    This prevents accidental re-introduction of sensitive information.
    """
    # Get absolute path to the resume markdown file
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    resume_path = repo_root / "pdf" / "Jacob White Resume.md"

    # Check if the file exists
    assert resume_path.exists(), f"Resume markdown file not found at {resume_path}"

    # Read the file content
    content = resume_path.read_text(encoding="utf-8")

    # The phone number that should not be present
    phone_number = "(269)-290-5497"
    area_code = "(269)"

    # Assert that the phone number is not in the content
    assert phone_number not in content, "Personal phone number found in resume markdown!"
    assert area_code not in content, "Personal area code found in resume markdown!"
