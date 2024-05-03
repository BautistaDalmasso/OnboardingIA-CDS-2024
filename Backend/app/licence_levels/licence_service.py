from pathlib import Path
import random

from app.licence_levels.licence_level import LicenceLevel
from app.library.library_models import BookData
from app.library.library_service import LibraryService
from app.database.database_user import DatabaseUser


class BookDataWithLicence(BookData):
    licence_required: int


class LicenceService(DatabaseUser):
    def __init__(self, db_path: Path, library_db_path: Path) -> None:
        super().__init__(db_path)
        self._library_service = LibraryService(library_db_path)

    def consult_book_data(self, isbn: str) -> BookDataWithLicence | None:
        book = self._library_service.consult_book_data(isbn)

        if book is None:
            return None

        licence_level_required = self._consult_book_licence_req(isbn)

        return BookDataWithLicence(
            isbn=isbn,
            title=book.title,
            available_copies=book.available_copies,
            licence_required=licence_level_required,
        )

    def _consult_book_licence_req(self, isbn: str) -> int:
        licence_level = self.query_database(
            """SELECT licenceLevel FROM licenceRequirements
                                            WHERE isbn = ?""",
            (isbn,),
        )
        if licence_level is not None:
            return licence_level[0]

        # Default licence level requirement.
        return LicenceLevel.REGULAR

    def fill_with_random_entries(self):
        """
        Not meant for production, very hacky, DELETES ALL ROWS FROM licenceRequirements,
        fills all entries of the licenceRequirements with random licence levels.

        Kill after a better solution has been found.
        """
        all_books = self._library_service.consult_all_books()
        all_licences = self.query_multiple_rows(
            """SELECT * FROM licenceRequirements""", tuple()
        )

        if len(all_books) != all_licences:
            self.execute_in_database(
                """DELETE FROM licenceRequirements""",
                tuple(),
            )
            for book in all_books:
                self.execute_in_database(
                    """INSERT INTO licenceRequirements (isbn, licenceLevel)
                      VALUES (?, ?)""",
                    (book.isbn, random.randint(1, 3)),
                )
