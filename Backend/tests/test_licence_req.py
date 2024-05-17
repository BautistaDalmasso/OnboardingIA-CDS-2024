from app.file_paths import TEST_DB_PATH
from app.database.database_actions import execute_in_database
from tests.common_fixtures import licence_req_service


def test_default_licence(licence_req_service):
    book = licence_req_service.consult_book_data("9789875662445")

    assert book.licence_required == 1


def test_correct_licence_fetched(licence_req_service):
    isbn = "9789875662445"
    execute_in_database(
        """INSERT INTO licenceRequirements (isbn, licenceLevel)
                      VALUES (?, ?)""",
        (isbn, 3),
        TEST_DB_PATH,
    )

    book = licence_req_service.consult_book_data(isbn)
    assert book.licence_required == 3


def test_consult_by_pages(licence_req_service):
    number_of_books = licence_req_service.get_number_of_books()

    pages = []

    for i in range((number_of_books + 1) // 2):
        pages.append(licence_req_service.consult_books_by_page(2, i))

    all_books = set([book for page in pages for book in page])

    assert len(all_books) == number_of_books, "Not all books are contained in the pages"
