from collections import defaultdict
from pathlib import Path
import random

from app.licence_levels.licence_level import LicenceLevel, default_licence
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

        return create_book_with_licence(book, licence_level_required)

    def _consult_book_licence_req(self, isbn: str) -> int:
        licence_level = self.query_database(
            """SELECT licenceLevel FROM licenceRequirements
                                            WHERE isbn = ?""",
            (isbn,),
        )
        if licence_level is not None:
            return licence_level[0]

        return default_licence()

    def consult_books_by_page(
        self, page_size: int, page_number: int
    ) -> list[BookDataWithLicence]:
        """Page numbering should start at 0"""
        consulted_books = self._library_service.consult_books_by_page(
            page_size, page_number
        )
        consulted_isbns = [book.isbn for book in consulted_books]

        consulted_licences = self._query_multiple_isbns(consulted_isbns)
        isbn_to_licence = defaultdict(default_licence)
        isbn_to_licence.update({entry[0]: entry[1] for entry in consulted_licences})

        return [
            create_book_with_licence(book, isbn_to_licence[book.isbn])
            for book in consulted_books
        ]

    def get_number_of_books(self) -> int:
        return self._library_service.get_number_of_books()

    def _query_multiple_isbns(self, isbns: list[str]):
        if len(isbns) == 0:
            isbns_str = "()"
        else:
            # (?, ?, ..., ?)
            tmp = "".join([", ?" for _ in range(len(isbns) - 1)])
            isbns_str = f"(?{tmp})"

        consulted_licences = self.query_multiple_rows(
            f"""SELECT * FROM licenceRequirements
                                 WHERE isbn IN {isbns_str}""",
            isbns,
        )
        return consulted_licences

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
                # Adjust weights for random selection
                random_value = random.randint(
                    1, 10
                )  # Choose a random number between 1 and 10
                if random_value <= 7:  # 70% chance for 1
                    licence_level = 1
                elif random_value <= 9:  # 20% chance for 2
                    licence_level = 2
                else:  # 10% chance for 3
                    licence_level = 3

                self.execute_in_database(
                    """INSERT INTO licenceRequirements (isbn, licenceLevel)
                      VALUES (?, ?)""",
                    (book.isbn, licence_level),
                )


def create_book_with_licence(book: BookData, licence_level: int) -> BookDataWithLicence:
    return BookDataWithLicence(
        isbn=book.isbn,
        title=book.title,
        available_copies=book.available_copies,
        licence_required=licence_level,
    )
