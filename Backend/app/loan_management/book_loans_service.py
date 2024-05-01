import sqlite3
from .book_loans_dtos import RequestedBookDTO,LoanConfirmedDTO
from ..database import execute_in_database


def add_confirmed_loan(book:LoanConfirmedDTO):
    try:
        execute_in_database(
            """INSERT INTO confirmed_book_loans (id, isbn, expirationDate, userEmail)
                     VALUES (?, ?, ?, ?)""",
            (book.id, book.isbn, book.expirationDate, book.userEmail),
        )
        return {
            "id": book.id,
            "isbn": book.isbn,
            "expirationDate": book.expirationDate,
            "userEmail": book.userEmail,
        }
    
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un prestamo realizado"}


def add_requested_book(book: RequestedBookDTO):
    try:
        execute_in_database(
            """INSERT INTO requested_books (id, isbn, userEmail)
                        VALUES (?, ?, ?, ?)""",
            (book.id, book.isbn, book.userEmail),
        )
        return {
            "id": book.id,
            "isbn": book.isbn,
            "userEmail": book.userEmail,
        }
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un libro solicitado"}
