from collections import defaultdict
from pathlib import Path

from pydantic import BaseModel

from app.catalogue.book_models import MarcBookData
from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from app.licence_levels.licence_level import default_licence
from app.database.database_user import DatabaseUser


class UnkwnownFilter(Exception): ...


class BookDataWithLicence(BaseModel):
    book_data: MarcBookData
    licence_required: int
    available_books: int
    borrowed_books: int

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
        availability = self._consult_book_availability(isbn)

        return create_book_with_licence(book, licence_level_required, availability)

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

        return self._consult_multiple_books(consulted_books)

    def consult_filtered_books(
        self, filter_category: str, filter_value: str
    ) -> list[BookDataWithLicence]:

        match filter_category:
            case "author":
                consulted_books = self._catalogue_service.browse_by_author(filter_value)
            case "title":
                consulted_books = self._catalogue_service.browse_by_title(filter_value)
            case "publisher":
                consulted_books = self._catalogue_service.browse_by_publisher(
                    filter_value
                )
            case "topic":
                consulted_books = self._catalogue_service.browse_by_topic(filter_value)
            case _:
                raise UnkwnownFilter(f'Unkwnown filter: "{filter_category}".')

        return self._consult_multiple_books(consulted_books)

    def _consult_multiple_books(
        self,
        consulted_books: list[MarcBookData],
    ) -> list[BookDataWithLicence]:
        consulted_isbns = [book.isbn for book in consulted_books]

        consulted_licences = self._query_multiple_isbns(consulted_isbns)
        isbn_to_licence = defaultdict(default_licence)
        isbn_to_licence.update({entry[0]: entry[1] for entry in consulted_licences})
        book_availability = self.consult_book_inventory(consulted_isbns)

        return [
            create_book_with_licence(
                book,
                isbn_to_licence[book.isbn],
                book_availability.get(book.isbn, (0, 0)),
            )
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

    def consult_book_inventory(self, isbns: list[str]) -> dict[str, tuple[int, int]]:
        if len(isbns) == 0:
            isbns_str = "()"
        else:
            # (?, ?, ..., ?)
            tmp = "".join([", ?" for _ in range(len(isbns) - 1)])
            isbns_str = f"(?{tmp})"

        result = self.query_multiple_rows(
            f"""SELECT isbn,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_books,
                    SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) AS borrowed_books
                FROM bookInventory
                WHERE isbn IN {isbns_str}
                GROUP BY isbn""",
            isbns,
        )

        return {book[0]: (book[1], book[2]) for book in result}

    def _consult_book_availability(self, isbn: str) -> int:
        availability = self.query_database(
            """SELECT
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_books,
                    SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) AS borrowed_books
                FROM bookInventory
                WHERE isbn = ?""",
            (isbn,),
        )

        if availability == (None, None):
            return (0, 0)

        return (availability[0], availability[1])


def create_book_with_licence(
    book_data: MarcBookData, licence_level: int, availability: tuple[int, int]
) -> BookDataWithLicence:
    return BookDataWithLicence(
        book_data=book_data,
        licence_required=licence_level,
        available_books=availability[0],
        borrowed_books=availability[1],
    )
