import sqlite3
from .book_loans_dtos import RequestedBookDTO,LoanDTO
from app.database.database_actions import execute_in_database

def add_confirmed_loan(book:LoanDTO):
    try:
        execute_in_database(
            """INSERT INTO loans ( isbn, copy_id, expiration_date, user_email)
                     VALUES (?, ?, ?, ?)""",
            ( book.isbn,book.copy_id, book.expiration_date, book.user_email),
        )
        return { 
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "expiration_date": book.expiration_date,
            "user_email": book.user_email,
        }
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un prestamo realizado"}


def add_requested_book(book: RequestedBookDTO):
    try:
        execute_in_database(
            """INSERT INTO requested_books (isbn, copy_id, user_email)
                        VALUES (?, ?, ?, ?)""",
            ( book.isbn, book.copy_id, book.user_email),
        )
        return {
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "userEmail": book.user_email,
        }
        
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un libro solicitado"}
    
    
   