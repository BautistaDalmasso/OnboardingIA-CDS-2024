from collections import defaultdict
from pathlib import Path

from pydantic import BaseModel

from app.catalogue.book_models import MarcBookData
from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from app.licence_levels.licence_level import default_licence
from app.database.database_user import DatabaseUser


class BookDataWithLicence(BaseModel):
    book_data: MarcBookData
    licence_required: int

    def __hash__(self) -> int:
        return hash(self.book_data.isbn)

    def __eq__(self, other: "BookDataWithLicence") -> bool:
        return (
            isinstance(other, BookDataWithLicence)
            and self.book_data.isbn == other.book_data.isbn
        )


class LicenceService(DatabaseUser):
    def __init__(self, db_path: Path, catalogue_db: Path) -> None:
        super().__init__(db_path)
        self._catalogue_service = BrowseCatalogueService(catalogue_db)

    def consult_book_data(self, isbn: str) -> BookDataWithLicence | None:
        book = self._catalogue_service.browse_by_isbn(isbn)

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
        consulted_books = self._catalogue_service.browse_books_by_page(
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
        return self._catalogue_service.get_number_of_books()

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


def create_book_with_licence(
    book_data: MarcBookData, licence_level: int
) -> BookDataWithLicence:
    return BookDataWithLicence(
        book_data=book_data,
        licence_required=licence_level,
    )
