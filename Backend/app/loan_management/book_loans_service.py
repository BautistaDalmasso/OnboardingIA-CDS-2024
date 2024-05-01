import sqlite3
from ..models import Book
from ..database import execute_in_database


def add_confirmed_loan(book: Book):
    try:
        execute_in_database(
            """INSERT INTO confirmed_book_loans (id, isbn, name, author, expirationDate)
                     VALUES (?, ?, ?, ?, ?)""",
            (book.id, book.isbn, book.name, book.author, book.expirationDate),
        )
        return {
            "id": book.id,
            "isbn": book.isbn,
            "name": book.name,
            "author": book.author,
            "expirationDate": book.expirationDate,
        }

    except sqlite3.IntegrityError:
        return {"error": ""}


def add_requested_book(book: Book):
    try:
        execute_in_database(
            """INSERT INTO requested_books (id, isbn, name, author)
                        VALUES (?, ?, ?, ?)""",
            (book.id, book.isbn, book.name, book.author),
        )
        return {
            "id": book.id,
            "isbn": book.isbn,
            "name": book.name,
            "author": book.author,
        }
    except sqlite3.IntegrityError:
        return {"error": ""}


def addgit_books_available_to_request():
    return {}


def remove_book():
    return {}


def get_book_by_id():
    return {}


def get_expiration_date():
    return {}
