import pytest
import os

from app.loan_management.book_loans_service import LoanService
from app.loan_management.book_loans_dtos import LoanDTO, RequestedBookDTO

from app.database.initialize_db import initialize_database
from pathlib import Path


@pytest.fixture(scope="module")
def loan_service():
    db_path = "test.db"
    initialize_database(Path(db_path))
    return LoanService(db_path)


# Testing Function Call Structure
def test_add_function_call_structure(loan_service):
    loan_data = {
        "isbn": "1234567890",
        "copy_id": "1",
        "expiration_date": "2023-03-15",
        "user_email": "user@example.com",
    }
    book_data = {
        "isbn": "0987654321",
        "copy_id": "2",
        "user_email": "other_user@example.com",
    }

    loan_dto = LoanDTO(**loan_data)
    result_loan = loan_service.add_confirmed_loan(loan_dto)
    requested_book_dto = RequestedBookDTO(**book_data)
    result_book = loan_service.add_requested_book(requested_book_dto)

    assert isinstance(result_loan, dict)
    assert isinstance(result_book, dict)
    assert result_loan != result_book


# Testing Function Behavior with Valid Data:
def test_add_confirmed_loan_valid_data(loan_service):
    loan_data = {
        "isbn": "1234567890",
        "copy_id": "1",
        "expiration_date": "2023-03-15",
        "user_email": "user@example.com",
    }
    loan_dto = LoanDTO(**loan_data)
    result = loan_service.add_confirmed_loan(loan_dto)
    assert isinstance(result, dict)
    if "error" in result:
        assert "Error al registrar un prestamo realizado" in result["error"]
    else:
        assert result == loan_data


def test_add_requested_book_valid_data(loan_service):
    book_data = {
        "isbn": "1234567890",
        "copy_id": "1",
        "user_email": "user@example.com",
    }
    requested_book_dto = RequestedBookDTO(**book_data)
    result = loan_service.add_requested_book(requested_book_dto)
    assert isinstance(result, dict)
    if "error" in result:
        assert "Error al registrar un libro solicitado" in result["error"]
    else:
        assert result == book_data


# Testing Error
def test_add_confirmed_loan_failure(loan_service):
    loan_data = {
        "isbn": "1234567890",
        "copy_id": "1",
        "expiration_date": "2023-03-15",
        "user_email": "user@example.com",
    }
    loan = LoanDTO(**loan_data)
    result = loan_service.add_confirmed_loan(loan)
    assert isinstance(result, dict)
    assert "error" in result
    assert "Error al registrar un prestamo realizado" in result["error"]


def test_add_requested_book_failure(loan_service):
    book_data = {"isbn": "1234567890", "copy_id": "1", "user_email": "user@example.com"}
    book = RequestedBookDTO(**book_data)
    result = loan_service.add_requested_book(book)
    assert isinstance(result, dict)
    assert "error" in result
    assert "Error al registrar un libro solicitado" in result["error"]


@pytest.fixture(autouse=True, scope="module")
def cleanup():
    yield
    db_path = "test.db"
    if os.path.exists(db_path):
        os.remove(db_path)
