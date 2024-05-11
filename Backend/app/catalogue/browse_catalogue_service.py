from app.catalogue.book_models import MBDI, MarcBookData
from app.database.database_user import DatabaseUser


class BrowseCatalogueService(DatabaseUser):

    def browse_by_isbn(self, isbn: str) -> MarcBookData | None:
        result = self.query_database(
            """
            SELECT book.isbn, book.title, book.place, book.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName) AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE book.isbn = ?
            GROUP BY book.isbn, book.title, book.place, book.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (isbn,),
        )

        if result is None:
            return None

        return create_marc_book_data(result)

    def browse_books_by_page(
        self, page_size: int, page_number: int
    ) -> list[MarcBookData]:
        result = self.query_multiple_rows(
            f"""
            SELECT book.isbn, book.title, book.place, book.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName) AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            GROUP BY book.isbn, book.title, book.place, book.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass
            LIMIT {page_size} OFFSET {page_number*page_size};
            """,
            tuple(),
        )

        return [create_marc_book_data(book_data) for book_data in result]

    def get_number_of_books(self) -> int:

        return self.query_database("SELECT count(*) FROM book", tuple())[0]


def create_marc_book_data(query_result) -> MarcBookData:
    return MarcBookData(
        isbn=query_result[MBDI.isbn.value],
        title=query_result[MBDI.title.value],
        place=query_result[MBDI.place.value],
        publisher=query_result[MBDI.publisher.value],
        date_issued=query_result[MBDI.date_issued.value],
        edition=query_result[MBDI.edition.value],
        abstract=query_result[MBDI.abstract.value],
        description=query_result[MBDI.description.value],
        ddc_class=query_result[MBDI.ddc_class.value],
        authors=split_authors(query_result[MBDI.authors.value]),
        topics=split_topics(query_result[MBDI.topics.value]),
    )


def split_authors(authors_string: str) -> list[str]:
    authors = authors_string.split(",")

    grouped_authors = [",".join(authors[i : i + 2]) for i in range(0, len(authors), 2)]

    return grouped_authors


def split_topics(topics_string: str) -> list[str]:
    return topics_string.split(",")
