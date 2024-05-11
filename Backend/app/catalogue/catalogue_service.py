from Backend.app.catalogue.book_models import MarcBookData
from app.database.database_user import DatabaseUser


class CatalogueService(DatabaseUser):

    def add_book(self, book_data: MarcBookData) -> None:
        self._insert_book(book_data)
        self._insert_authors(book_data.isbn, book_data.authors)
        self._insert_topics(book_data.isbn, book_data.topics)

    def _insert_book(self, book_data: MarcBookData) -> None:
        self.execute_in_database(
            """INSERT INTO book
                    (isbn,
                    title,
                    place,
                    publisher,
                    dateIssued,
                    edition,
                    abstract,
                    description,
                    ddcClass)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                book_data.isbn,
                book_data.title,
                book_data.place,
                book_data.publisher,
                book_data.date_issued,
                book_data.edition,
                book_data.abstract,
                book_data.description,
                book_data.ddc_class,
            ),
        )

    def _insert_authors(self, isbn: str, authors: list[str]) -> None:

        for author in authors:
            self.execute_in_database(
                "INSERT OR IGNORE INTO author (name) VALUES (?)",
                (author,),
            )

            self.execute_in_database(
                """INSERT INTO bookAuthor (isbn, authorName) VALUES (?, ?)""",
                (isbn, author),
            )

    def _insert_topics(self, isbn: str, topics: list[str]) -> None:

        for topic in topics:
            self.execute_in_database(
                "INSERT OR IGNORE INTO topic (topicName) VALUES (?)",
                (topic,),
            )

            self.execute_in_database(
                """INSERT INTO bookTopic (isbn, topic) VALUES (?, ?)""",
                (isbn, topic),
            )
