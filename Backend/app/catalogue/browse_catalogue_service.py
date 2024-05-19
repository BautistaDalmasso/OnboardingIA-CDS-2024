from app.catalogue.book_models import MBDI, BookContributor, MarcBookData
from app.database.database_user import DatabaseUser


class BrowseCatalogueService(DatabaseUser):

    def browse_by_isbn(self, isbn: str) -> MarcBookData | None:
        result = self.query_database(
            """
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE book.isbn = ?
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (isbn,),
        )

        if result is None:
            return None

        return create_marc_book_data(result)

    def browse_by_title(self, book_title: str) -> list[MarcBookData]:
        results = self.query_multiple_rows(
            """
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE book.title LIKE ?
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (f"%{book_title}%",),
        )

        return [create_marc_book_data(row) for row in results]

    def browse_by_author(self, author_name: str) -> list[MarcBookData]:
        results = self.query_multiple_rows(
            """
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE book.isbn IN (
                SELECT bookAuthor.isbn
                FROM bookAuthor
                WHERE bookAuthor.authorName = ?
            )
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (author_name,),
        )

        return [create_marc_book_data(row) for row in results]

    def browse_by_publisher(self, publisher_name: str) -> list[MarcBookData]:
        results = self.query_multiple_rows(
            """
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE bookPublisher.publisher = ?
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (publisher_name,),
        )

        return [create_marc_book_data(row) for row in results]

    def browse_by_topic(self, topic_name: str) -> list[MarcBookData]:
        results = self.query_multiple_rows(
            """
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            WHERE book.isbn IN (
                SELECT bookTopic.isbn
                FROM bookTopic
                WHERE bookTopic.topic = ?
            )
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                    book.edition, book.abstract, book.description, book.ddcClass;
            """,
            (topic_name,),
        )

        return [create_marc_book_data(row) for row in results]

    def browse_books_by_page(
        self, page_size: int, page_number: int
    ) -> list[MarcBookData]:
        result = self.query_multiple_rows(
            f"""
            SELECT book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
                book.edition, book.abstract, book.description, book.ddcClass,
                GROUP_CONCAT(DISTINCT bookAuthor.authorName || '~~' || COALESCE(bookAuthor.role, '') || '|') AS authors,
                GROUP_CONCAT(DISTINCT bookTopic.topic) AS topics
            FROM book
                LEFT JOIN bookAuthor ON book.isbn = bookAuthor.isbn
                LEFT JOIN bookPublisher ON book.isbn = bookPublisher.isbn
                LEFT JOIN bookTopic ON book.isbn = bookTopic.isbn
            GROUP BY book.isbn, book.title, book.place, bookPublisher.publisher, book.dateIssued,
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


def split_authors(authors_string: str) -> list[BookContributor]:
    authors = authors_string.strip("|").split("|,")

    book_contributors = []

    for author_info in authors:
        name_role = author_info.split("~~")

        role = None if name_role[1] == "" else name_role[1]
        book_contributors.append(BookContributor(name=name_role[0], role=role))

    return book_contributors


def split_topics(topics_string: str) -> list[str]:
    return topics_string.split(",")
