import pytest
import pathlib

def test_resume_md_no_phone_number():
    """
    Verify that the resume markdown file does not contain the personal phone number.
    This prevents accidental exposure of PII.
    """
    # Locate the file relative to this test file
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    resume_path = repo_root / "pdf" / "Jacob White Resume.md"

    assert resume_path.exists(), f"Resume MD file not found at {resume_path}"

    with open(resume_path, "r", encoding="utf-8") as f:
        content = f.read()

    phone_number = "(269)-290-5497"
    assert phone_number not in content, f"Security Breach: Phone number {phone_number} found in resume markdown!"
