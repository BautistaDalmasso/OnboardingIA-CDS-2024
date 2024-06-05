from pathlib import Path
from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from app.loan_management.manage_loans_service import BookNotFound
from app.catalogue.read_mods import ReadMod
from app.catalogue.book_models import BookContributor, MarcBookData
from app.database.database_user import DatabaseUser


class UpdateCatalogueService(DatabaseUser):
    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)

        self._catalogue_service = BrowseCatalogueService(db_path)

    def update_book_by_url(self, book_url: str) -> None:
        book_data = ReadMod(mods_url=book_url).get_marcs_data()

        if self._catalogue_service.browse_by_isbn(book_data.isbn) is None:
            raise BookNotFound(
                f"Ningun libro con isbn: {book_data.isbn} para actualizar."
            )

        self.update_book(book_data)

    def update_book(self, book_data: MarcBookData) -> None:
        self._update_book(book_data)
        self._update_authors(book_data.isbn, book_data.authors)
        self._update_publisher(book_data.isbn, book_data.publisher)
        self._update_topics(book_data.isbn, book_data.topics)

    def _update_book(self, book_data: MarcBookData) -> None:
        self.execute_in_database(
            """UPDATE book
                  SET title = ?, place = ?, dateIssued = ?, edition = ?, abstract = ?, description = ?, ddcClass = ?
                WHERE isbn = ?
            """,
            (
                book_data.title,
                book_data.place,
                book_data.date_issued,
                book_data.edition,
                book_data.abstract,
                book_data.description,
                book_data.ddc_class,
                book_data.isbn,
            ),
        )

    def _update_authors(self, isbn: str, authors: list[BookContributor]) -> None:
        self.execute_in_database(
            "DELETE FROM bookAuthor WHERE isbn = ?",
            (isbn,),
        )

        for author in authors:
            self.execute_in_database(
                "INSERT OR IGNORE INTO author (name) VALUES (?)",
                (author.name,),
            )

            self.execute_in_database(
                """INSERT INTO bookAuthor (isbn, authorName, role) VALUES (?, ?, ?)""",
                (isbn, author.name, author.role),
            )

    def _update_publisher(self, isbn: str, publisher: str) -> None:
        self.execute_in_database(
            "DELETE FROM bookPublisher WHERE isbn = ?",
            (isbn,),
        )

        self.execute_in_database(
            """INSERT OR IGNORE INTO publisher (publisherName) VALUES (?)""",
            (publisher,),
        )
        self.execute_in_database(
            """INSERT OR IGNORE INTO bookPublisher (isbn, publisher) VALUES (?, ?)""",
            (isbn, publisher),
        )

    def _update_topics(self, isbn: str, topics: list[str]) -> None:
        self.execute_in_database(
            "DELETE FROM bookTopic WHERE isbn = ?",
            (isbn,),
        )

        for topic in topics:
            self.execute_in_database(
                "INSERT OR IGNORE INTO topic (topicName) VALUES (?)",
                (topic,),
            )

            self.execute_in_database(
                """INSERT INTO bookTopic (isbn, topic) VALUES (?, ?)""",
                (isbn, topic),
            )
