from app.file_paths import TEST_DB_PATH
from app.database.database_actions import execute_in_database
from tests.common_fixtures import licence_req_service


def test_default_licence(licence_req_service):
    book = licence_req_service.consult_book_data("978-987-8266-77-0")

    assert book.licence_required == 1


def test_correct_licence_fetched(licence_req_service):
    isbn = "978-987-8266-77-0"
    execute_in_database(
        """INSERT INTO licenceRequirements (isbn, licenceLevel)
                      VALUES (?, ?)""",
        (isbn, 3),
        TEST_DB_PATH,
    )

    book = licence_req_service.consult_book_data(isbn)
    assert book.licence_required == 3
