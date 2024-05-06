import sqlite3
from .book_loans_dtos import RequestedBookDTO,LoanDTO

from pathlib import Path
from app.database.database_user import DatabaseUser

class LoanService(DatabaseUser):
    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
    
    def add_confirmed_loan(self, book:LoanDTO):    
        try:
            self.execute_in_database(
                """INSERT INTO loans ( isbn, copyId, expirationDate, userEmail)
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


    def add_requested_book(self, book: RequestedBookDTO):
        try:
            self.execute_in_database(
                """INSERT INTO requested_books (isbn, copyId, userEmail)
                            VALUES (?, ?, ?, ?)""",
                ( book.isbn, book.copy_id, book.user_email),
            )
            return {
                "isbn": book.isbn,
                "copy_id": book.copy_id,
                "user_email": book.user_email,
            }
            
        except sqlite3.IntegrityError:
            return {"error": "Error al registrar un libro solicitado"}
        
        