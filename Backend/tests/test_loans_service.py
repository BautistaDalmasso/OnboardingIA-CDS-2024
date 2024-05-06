import pytest
import sqlite3
from app.loan_management.book_loans_service import LoanService
from app.loan_management.book_loans_dtos import LoanDTO, RequestedBookDTO

@pytest.fixture
def loan_service():
    db_path = "test.db"
    return LoanService(db_path)

def test_add_confirmed_loan_success(loan_service):
    book = LoanDTO(isbn="1234567890", copy_id="1", expiration_date="2023-03-15", user_email="user@example.com")
    result = loan_service.add_confirmed_loan(book)
    assert result == {
        "isbn": book.isbn,
        "copy_id": book.copy_id,
        "expiration_date": book.expiration_date,
        "user_email": book.user_email,
    }

def test_add_confirmed_loan_failure(loan_service):
    book = LoanDTO(isbn="1234567890", copy_id="1", expiration_date="2023-03-15", user_email="user@example.com")
    with pytest.raises(sqlite3.IntegrityError):
        loan_service.add_confirmed_loan(book)

def test_add_requested_book_success(loan_service):
    book = RequestedBookDTO(isbn="1234567890", copy_id="1", user_email="user@example.com")
    result = loan_service.add_requested_book(book)
    assert result == {
        "isbn": book.isbn,
        "copy_id": book.copy_id,
        "user_email": book.user_email,
    }

def test_add_requested_book_failure(loan_service):
    book = RequestedBookDTO(isbn="1234567890", copy_id="1", user_email="user@example.com")
    with pytest.raises(sqlite3.IntegrityError):
        loan_service.add_requested_book(book)
def test_add_confirmed_loan_success():
    book = LoanDTO(isbn="1234567890", copy_id="1", expiration_date="2023-03-15", user_email="user@example.com")
    result = loan_service.add_confirmed_loan(book)
    assert result == {
        "isbn": book.isbn,
        "copy_id": book.copy_id,
        "expiration_date": book.expiration_date,
        "user_email": book.user_email,
    }

def test_add_confirmed_loan_failure(loan_service):
    book = LoanDTO(isbn="1234567890", copy_id="1", expiration_date="2023-03-15", user_email="user@example.com")
    with pytest.raises(sqlite3.IntegrityError):
        loan_service.add_confirmed_loan(book)

def test_add_requested_book_success(loan_service):
    book = RequestedBookDTO(isbn="1234567890", copy_id="1", user_email="user@example.com")
    result = loan_service.add_requested_book(book)
    assert result == {
        "isbn": book.isbn,
        "copy_id": book.copy_id,
        "user_email": book.user_email,
    }

def test_add_requested_book_failure(loan_service):
    book = RequestedBookDTO(isbn="1234567890", copy_id="1", user_email="user@example.com")
    with pytest.raises(sqlite3.IntegrityError):
        loan_service.add_requested_book(book)


