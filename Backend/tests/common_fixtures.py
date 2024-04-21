import pytest

from app import database
from app.file_paths import TEST_DB_PATH


@pytest.fixture
def db_path():
    """Initializes a test database and deletes it after the test is finished."""
    database.initialize_database(TEST_DB_PATH)
    try:
        database.default_database = TEST_DB_PATH

        yield TEST_DB_PATH
    finally:
        TEST_DB_PATH.unlink()
