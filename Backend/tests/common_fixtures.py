import shutil

import pytest

from app.library.library_service import LibraryService
from app.facial_recognition.facial_recognition_service import FacialRecognitionService
from app.user.user_service import UserService
from app import initialize_db
from app.file_paths import TEST_DB_PATH, LIBRARY_DB_PATH, LIBRARY_TEST_PATH


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
    shutil.copyfile(LIBRARY_DB_PATH, LIBRARY_TEST_PATH)

    try:
        yield LibraryService(LIBRARY_TEST_PATH)
    finally:
        LIBRARY_TEST_PATH.unlink()
