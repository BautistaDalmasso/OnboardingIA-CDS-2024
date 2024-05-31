import pytest

from app.licence_levels.licence_level import LicenceLevel
from app.points_exchange.point_addition_service import PointAdditionService
from app.points_exchange.points import TRUSTED_LICENCE_UPGRADE_COST
from app.user.user_dtos import CreateUserDTO
from app.user.user_errors import UserNotFound
from app.database.initialize_db import initialize_database
from app.file_paths import TEST_DB_PATH
from app.points_exchange.point_exchange_service import (
    InsufficientPoints,
    PointExchangeService,
)
from app.user.user_service import UserService

# TODO: DeprecationWarning: The default datetime adapter is deprecated as of Python 3.12; see the sqlite3 documentation for suggested replacement recipes
pytestmark = pytest.mark.filterwarnings("ignore")


def test_nonexistent_user_raises_not_found(point_exchange_service):
    with pytest.raises(UserNotFound):
        point_exchange_service.exchange_for_trusted_licence("doesntexist@email.com")


def test_user_without_enough_points_raises_insufficient_points(point_exchange_service):
    create_user_with_points(0)

    with pytest.raises(InsufficientPoints):
        point_exchange_service.exchange_for_trusted_licence("user@email.com")


def test_points_are_removed(point_exchange_service, user_service):
    create_user_with_points(TRUSTED_LICENCE_UPGRADE_COST)

    point_exchange_service.exchange_for_trusted_licence("user@email.com")

    user = user_service.get_user_by_email("user@email.com")

    assert user.points == 0
    assert user.licenceLevel == LicenceLevel.TRUSTED


def create_user_with_points(points: int):
    user_email = "user@email.com"

    UserService(TEST_DB_PATH).create_user(
        CreateUserDTO(
            firstName="User",
            lastName="User",
            email=user_email,
            password="123456",
        )
    )

    PointAdditionService(TEST_DB_PATH).apply_points(user_email, points)


@pytest.fixture
def point_exchange_service():
    initialize_database(TEST_DB_PATH)

    try:
        yield PointExchangeService(TEST_DB_PATH)
    finally:
        TEST_DB_PATH.unlink()


@pytest.fixture
def user_service():
    return UserService(TEST_DB_PATH)
