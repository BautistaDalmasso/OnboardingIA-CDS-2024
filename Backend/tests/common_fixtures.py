import pytest

from app.loan_management.consult_loans_service import ConsultLoansService
from app.librarian.librarian_service import LibrarianService
from app.loan_management.manage_loans_service import LoanService
from app.licence_levels.licence_service import BookWithLicenceBrowser
from app.facial_recognition.facial_recognition_service import FacialRecognitionService
from app.user.user_service import UserService
from app.database import initialize_db
from app.file_paths import CATALOGUE_PATH, TEST_DB_PATH, LIBRARY_TEST_PATH


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
def licence_req_service():
    initialize_db.initialize_database(TEST_DB_PATH)

    try:
        yield BookWithLicenceBrowser(TEST_DB_PATH, CATALOGUE_PATH)
    finally:
        TEST_DB_PATH.unlink()


@pytest.fixture()
def loan_librarian_service():
    initialize_db.initialize_database(TEST_DB_PATH)

    try:
        yield (
            LoanService(TEST_DB_PATH, CATALOGUE_PATH),
            LibrarianService(TEST_DB_PATH),
            ConsultLoansService(TEST_DB_PATH, CATALOGUE_PATH),
        )
    finally:
        TEST_DB_PATH.unlink()
        
@pytest.fixture()
def librarian_service():
    initialize_db.initialize_database(TEST_DB_PATH)

    try:
        yield (
            UserService(TEST_DB_PATH),
            LibrarianService(TEST_DB_PATH),
        )
    finally:
        TEST_DB_PATH.unlink()
