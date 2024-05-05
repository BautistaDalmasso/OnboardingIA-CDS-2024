import sqlite3
from .book_loans_dtos import RequestedBookDTO,LoanDTO
from app.database.database_actions import execute_in_database
from pathlib import Path
from typing import Any
from app.server_config import ServerConfig
import requests

BASE_URL = ServerConfig().get_loans_service()

class DatabaseLoan:
    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path
    
    def execute_in_database(self, command: str, args: tuple[Any]) -> None:
        execute_in_database(command, args, self._db_path)


class LoanService(DatabaseLoan):
    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
    
    def add_confirmed_loan(self, book:LoanDTO):
        r = requests.post(f"{BASE_URL}/loans")
        
        try:
             if r.status_code == 200:
                self.execute_in_database(
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


    def add_requested_book(self, book: RequestedBookDTO):
        try:
            self.execute_in_database(
                """INSERT INTO requested_books (isbn, copy_id, user_email)
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
        
        