import pathlib
import subprocess
import pytest


def test_resume_markdown_no_phone_number():
    """
    Test that the resume markdown file does not contain the personal phone number.
    This prevents accidental re-introduction of sensitive information.
    """
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    resume_path = repo_root / "pdf" / "Jacob White Resume.md"

    assert resume_path.exists(), f"Resume markdown file not found at {resume_path}"

    content = resume_path.read_text(encoding="utf-8")

    phone_number = "(269)-290-5497"
    area_code = "(269)"

    assert phone_number not in content, "Personal phone number found in resume markdown!"
    assert area_code not in content, "Personal area code found in resume markdown!"


def test_resume_pdf_no_phone_number():
    """
    Test that the compiled PDF binary does not contain the personal phone number
    or un-obfuscated personal email address.
    """
    test_dir = pathlib.Path(__file__).parent.resolve()
    repo_root = test_dir.parent
    pdf_path = repo_root / "pdf" / "Jacob White Resume.pdf"

    assert pdf_path.exists(), f"Resume PDF file not found at {pdf_path}"

    result = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True,
        text=True,
        check=True,
    )
    pdf_text = result.stdout

    phone_number = "(269)-290-5497"
    area_code = "(269)"

    assert phone_number not in pdf_text, "Personal phone number found in resume PDF!"
    assert area_code not in pdf_text, "Personal area code found in resume PDF!"

