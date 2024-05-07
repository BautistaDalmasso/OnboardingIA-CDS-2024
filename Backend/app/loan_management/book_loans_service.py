from app.library.library_service import LibraryService
from .book_loans_dtos import RequestedBookDTO, LoanDTO

from pathlib import Path
from app.database.database_user import DatabaseUser
from typing import List
from typing import Any


class LoanService(DatabaseUser):
    def __init__(self, db_path: Path, library_path: Path) -> None:
        super().__init__(db_path)
        self._library_service = LibraryService(library_path)

    def add_loan(self, book_request: LoanDTO):
        """Add a loan without requiring any confirmation."""
        copy_data = self._library_service.borrow_book(book_request.isbn)

        self.execute_in_database(
            """INSERT INTO loans ( isbn, copyId, expirationDate, userEmail)
                        VALUES (?, ?, ?, ?)""",
            (
                copy_data.isbn,
                copy_data.copy_id,
                book_request.expiration_date,
                book_request.user_email,
            ),
        )

        return copy_data

    def consult_book_loans_by_user_email(self, email: str) -> List[LoanDTO]:
        loans = self.query_multiple_rows(
            """SELECT * FROM loans WHERE userEmail =?""",
            (email,),
        )
        return [self.create_loan_data(entry) for entry in loans]

    def create_loan_data(self, db_entry: list[Any]) -> LoanDTO:
        return LoanDTO(
            isbn=db_entry[0],
            copy_id=db_entry[1],
            expiration_date=db_entry[2],
            user_email=db_entry[3],
        )
