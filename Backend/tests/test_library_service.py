import pytest

from app.library.library_service import (
    BookAlreadyReturned,
    BookNotFound,
    NoCopiesAvailable,
)
from tests.common_fixtures import library_service


def test_consult_known_book(library_service):
    book = library_service.consult_book_data("978-987-8266-77-0")

    assert book.title == "Rayuela"


def test_consult_unknown_book(library_service):
    book = library_service.consult_book_data("978-987-6832-42-7")

    assert book is None


def test_book_is_borrowed(library_service):
    isbn = "978-987-8266-77-0"
    before_borrow = library_service.consult_book_data(isbn)

    library_service.borrow_book(isbn)

    after_borrow = library_service.consult_book_data(isbn)

    assert after_borrow.available_copies < before_borrow.available_copies


def test_unknown_book_throws_exception(library_service):
    with pytest.raises(BookNotFound):
        library_service.borrow_book("978-987-6832-42-7")


def test_book_is_not_overborrowed(library_service):
    isbn = "978-987-8266-77-0"
    before_borrow = library_service.consult_book_data(isbn)

    for _ in range(before_borrow.available_copies):
        library_service.borrow_book(isbn)

    with pytest.raises(NoCopiesAvailable):
        library_service.borrow_book(isbn)


def test_book_is_returned(library_service):
    isbn = "978-987-8266-77-0"
    print(library_service.consult_book_data(isbn))
    borrowed_book = library_service.borrow_book(isbn)
    after_borrow = library_service.consult_book_data(isbn)

    library_service.return_book(borrowed_book.isbn, borrowed_book.copy_id)
    after_return = library_service.consult_book_data(isbn)

    assert after_borrow.available_copies < after_return.available_copies


def test_book_cant_be_returned_twice(library_service):
    isbn = "978-987-8266-77-0"
    borrowed_book = library_service.borrow_book(isbn)

    library_service.return_book(borrowed_book.isbn, borrowed_book.copy_id)

    with pytest.raises(BookAlreadyReturned):
        library_service.return_book(borrowed_book.isbn, borrowed_book.copy_id)
