import pytest

from app.librarian.librarian_service import LibrarianService
from app.loan_management.book_loans_service import LoanService
from app.licence_levels.licence_service import LicenceService
from app.library.library_service import LibraryService
from app.facial_recognition.facial_recognition_service import FacialRecognitionService
from app.user.user_service import UserService
from app.database import initialize_db
from app.file_paths import CATALOGUE_PATH, TEST_DB_PATH, LIBRARY_TEST_PATH
from app.library.library_db import initialize_database as initialize_library


@pytest.fixture
def user_service():
    """Initializes a test database and deletes it after the test is finished."""
    initialize_db.initialize_database(TEST_DB_PATH)
    try:
        yield UserService(TEST_DB_PATH)
    finally:
        TEST_DB_PATH.unlink()


@pytest.fixture
def fr_service():
    yield FacialRecognitionService(TEST_DB_PATH)


@pytest.fixture
def library_service():
    initialize_library(LIBRARY_TEST_PATH)

    try:
        yield LibraryService(LIBRARY_TEST_PATH)
    finally:
        LIBRARY_TEST_PATH.unlink()


@pytest.fixture
def licence_req_service():
    initialize_db.initialize_database(TEST_DB_PATH)

    try:
        yield LicenceService(TEST_DB_PATH, CATALOGUE_PATH)
    finally:
        TEST_DB_PATH.unlink()


@pytest.fixture()
def loan_librarian_service():
    initialize_db.initialize_database(TEST_DB_PATH)

    try:
        yield (
            LoanService(TEST_DB_PATH, CATALOGUE_PATH),
            LibrarianService(TEST_DB_PATH),
        )
    finally:
        TEST_DB_PATH.unlink()
