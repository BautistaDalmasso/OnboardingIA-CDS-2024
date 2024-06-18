import pytest

from app.licence_levels.licence_level import LicenceLevel
from app.points_exchange.point_addition_service import PointAdditionService
from app.points_exchange.points import TRUSTED_LICENCE_UPGRADE_COST, POINTS_PER_EARLY_DAY
from app.user.user_dtos import CreateUserDTO, TokenDataDTO
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
    user_dto = TokenDataDTO(
        email="doesntexist@email.com",
        licenceLevel=LicenceLevel.REGULAR,
    )

    with pytest.raises(UserNotFound):
        point_exchange_service.exchange_for_trusted_licence(user_dto)


def test_user_without_enough_points_raises_insufficient_points(point_exchange_service):
    user_token = create_user_with_points(0)

    with pytest.raises(InsufficientPoints):
        point_exchange_service.exchange_for_trusted_licence(user_token)


def test_points_are_removed(point_exchange_service, user_service):
    user_token = create_user_with_points(TRUSTED_LICENCE_UPGRADE_COST)

    point_exchange_service.exchange_for_trusted_licence(user_token)

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

    return TokenDataDTO(
        email=user_email,
        licenceLevel=LicenceLevel.REGULAR,
    )


def test_nonexistent_user_to_increase_limit(point_exchange_service):
    user_dto = TokenDataDTO(
        email="doesntexist@email.com",
        licenceLevel=LicenceLevel.REGULAR,
    )
    with pytest.raises(UserNotFound):
        point_exchange_service.exchange_for_increase_limit(user_dto)


def test_user_without_enough_points_to_increase_limit(point_exchange_service):
    user_token = create_user_with_points(0)

    with pytest.raises(InsufficientPoints):
        point_exchange_service.exchange_for_increase_limit(user_token)


def test_points_are_removed_to_increase_limit(point_exchange_service, user_service):
    user_token = create_user_with_points(POINTS_PER_EARLY_DAY)

    point_exchange_service.exchange_for_increase_limit(user_token)

    user = user_service.get_user_by_email("user@email.com")

    assert user.points == 0
    
    
def test_increase_limit(point_exchange_service, user_service):
    user_token = create_user_with_points(POINTS_PER_EARLY_DAY)
    point_exchange_service.exchange_for_increase_limit(user_token)
    user = user_service.get_user_by_email("user@email.com")
    user_in_db =user_service.query_database("""SELECT loanLimit FROM users WHERE email= ?""", (user.email,))
    assert user_in_db[0]==6
 
    
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
