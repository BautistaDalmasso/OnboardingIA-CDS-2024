import pytest
import sqlite3
from app.loan_management.book_loans_service import LoanService
from app.loan_management.book_loans_dtos import LoanDTO, RequestedBookDTO
import sqlite3
from app.database.initialize_db import  initialize_database
from pathlib import Path

@pytest.fixture(scope="module")
def loan_service():
    db_path = "test.db"
    initialize_database(Path(db_path))
    return LoanService(db_path)

def test_add_confirmed_loan_success(loan_service):
    loan_data = {"isbn": "1234567890", "copy_id": "1", "expiration_date": "2023-03-15", "user_email": "user@example.com"}
    loan = LoanDTO(**loan_data)
    result = loan_service.add_confirmed_loan(loan)
    assert result == loan_data

def test_add_confirmed_loan_failure(loan_service):
    loan_data = {"isbn": "1234567890", "copy_id": "1", "expiration_date": "2023-03-15", "user_email": "user@example.com"}
    loan = LoanDTO(**loan_data)
    with pytest.raises(sqlite3.IntegrityError) as e:
        loan_service.add_confirmed_loan(loan)
    assert "UNIQUE constraint failed" in str(e.value)

def test_add_requested_book_success(loan_service):
    book_data = {"isbn": "1234567890", "copy_id": "1", "user_email": "user@example.com"}
    book = RequestedBookDTO(**book_data)
    result = loan_service.add_requested_book(book)
    assert result == book_data

def test_add_requested_book_failure(loan_service):
    book_data = {"isbn": "1234567890", "copy_id": "1", "user_email": "user@example.com"}
    book = RequestedBookDTO(**book_data)
    with pytest.raises(sqlite3.IntegrityError) as e:
        loan_service.add_requested_book(book)
    assert "UNIQUE constraint failed" in str(e.value)