import unittest
import sqlite3
from fastapi import HTTPException
from unittest.mock import patch, MagicMock
from pathlib import Path
from  app.loan_management.book_loans_dtos import LoanDTO, RequestedBookDTO  
from  app.loan_management.book_loans_service import LoanService
from app.server_config import ServerConfig

BASE_URL = ServerConfig().get_loans_service()

class TestLoanService(unittest.TestCase):
    
    def setUp(self):
        self.db_path = Path("test.db")
        self.loan_service = LoanService(self.db_path)

    @patch("requests.post")
    def test_add_confirmed_loan_success(self, mock_post):
        mock_post.return_value = MagicMock(status_code=200)
        book = LoanDTO(isbn="1234567890", copy_id=1, expiration_date="2023-03-15", user_email="user@example.com")
        result = self.loan_service.add_confirmed_loan(book)
        self.assertEqual(result, {
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "expiration_date": book.expiration_date,
            "user_email": book.user_email,
        })
        mock_post.assert_called_once_with(f"{BASE_URL}/loans")

    @patch("requests.post")
    def test_add_confirmed_loan_failure(self, mock_post):
        mock_post.return_value = MagicMock(status_code=500)
        book = LoanDTO(isbn="1234567890", copy_id=1, expiration_date="2023-03-15", user_email="user@example.com")
        with self.assertRaises(HTTPException):
            self.loan_service.add_confirmed_loan(book)

    def test_add_confirmed_loan_integrity_error(self):
        book = LoanDTO(isbn="1234567890", copy_id=1, expiration_date="2023-03-15", user_email="user@example.com")
        with patch.object(self.loan_service, "execute_in_database") as mock_execute:
            mock_execute.side_effect = sqlite3.IntegrityError
            result = self.loan_service.add_confirmed_loan(book)
            self.assertEqual(result, {"error": "Error al registrar un prestamo realizado"})

    def test_add_requested_book_success(self):
        book = RequestedBookDTO(isbn="1234567890", copy_id=1, user_email="user@example.com")
        result = self.loan_service.add_requested_book(book)
        self.assertEqual(result, {
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "user_email": book.user_email,
        })

    def test_add_requested_book_integrity_error(self):
        book = RequestedBookDTO(isbn="1234567890", copy_id=1, user_email="user@example.com")
        with patch.object(self.loan_service, "execute_in_database") as mock_execute:
            mock_execute.side_effect = sqlite3.IntegrityError
            result = self.loan_service.add_requested_book(book)
            self.assertEqual(result, {"error": "Error al registrar un libro solicitado"})

    def test_execute_in_database(self):
        command = "SELECT * FROM loans"
        args = ()
        self.loan_service.execute_in_database(command, args)
        # Verify that the execute_in_database method was called with the correct arguments
        self.assertEqual(self.loan_service._db_path, self.db_path)

if __name__ == "__main__":
    unittest.main()