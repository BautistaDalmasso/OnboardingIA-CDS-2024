from pathlib import Path
from app.database.database_actions import execute_in_database


def initialize_database(db_path: Path):
    if not db_path.exists():
        db_path.touch()

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS book
                           (isbn TEXT PRIMARY KEY,
                            title TEXT,
                            place TEXT,
                            dateIssued TEXT,
                            edition TEXT,
                            abstract TEXT,
                            description TEXT,
                            ddcClass TEXT)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        "CREATE INDEX IF NOT EXISTS idx_book_title ON book (title);",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS author
                           (name TEXT PRIMARY KEY)""",
        tuple(),
        db_path,
    )

    # TODO: authors can have multiple roles (specially in cases like "creator-edition" or "creator-compilation")
    execute_in_database(
        """CREATE TABLE IF NOT EXISTS bookAuthor
                            (isbn TEXT,
                             authorName TEXT,
                             role TEXT,
                             FOREIGN KEY (isbn) REFERENCES book(isbn),
                             FOREIGN KEY (authorName) REFERENCES author(name),
                             PRIMARY KEY (isbn, authorName))""",
        tuple(),
        db_path,
    )
    execute_in_database(
        "CREATE INDEX IF NOT EXISTS idx_bookAuthor_isbn_authorName ON bookAuthor (isbn, authorName)",
        tuple(),
        db_path,
    )
    execute_in_database(
        "CREATE INDEX IF NOT EXISTS idx_bookAuthor_authorName_isbn ON bookAuthor (authorName, isbn)",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS publisher
                            (publisherName TEXT PRIMARY KEY)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS bookPublisher
                            (isbn TEXT,
                             publisher TEXT,
                             FOREIGN KEY (isbn) REFERENCES book(isbn),
                             FOREIGN KEY (publisher) REFERENCES publisher(publisherName),
                             PRIMARY KEY (isbn, publisher))""",
        tuple(),
        db_path,
    )
    execute_in_database(
        """CREATE INDEX IF NOT EXISTS idx_bookPublisher_isbn_publisher
                            ON bookPublisher (isbn, publisher)""",
        tuple(),
        db_path,
    )
    execute_in_database(
        """CREATE INDEX IF NOT EXISTS idx_bookPublisher_publisher_isbn
                            ON bookPublisher (publisher, isbn)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS topic
                           (topicName TEXT PRIMARY KEY)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS bookTopic
                           (isbn TEXT,
                            topic TEXT,
                            FOREIGN KEY (isbn) REFERENCES book(isbn),
                            FOREIGN KEY (topic) REFERENCES topic(topicName),
                            PRIMARY KEY (isbn, topic))""",
        tuple(),
        db_path,
    )
    execute_in_database(
        "CREATE INDEX IF NOT EXISTS idx_bookTopic_isbn_topic ON bookTopic (isbn, topic)",
        tuple(),
        db_path,
    )
    execute_in_database(
        "CREATE INDEX IF NOT EXISTS idx_bookTopic_topic_isbn ON bookTopic (topic, isbn)",
        tuple(),
        db_path,
    )
