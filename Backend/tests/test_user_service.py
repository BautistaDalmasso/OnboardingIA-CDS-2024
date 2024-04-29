import pytest

from app.user.user_dtos import CreateUserDTO
from app.user import user_service

from tests.common_fixtures import db_path


# IMPORTANT: the `db_path` fixture handles initializing and then deleting the test db.
# Make sure to use it in your tests that rely on a database even if you won't use the `db_path` path itself.


def test_user_is_created(db_path, user_1):
    user_service.create_user(user_1)

    user_in_db = user_service.get_user_by_email(user_1.email)

    assert user_in_db.firstName == "Joaquin"


def test_repeated_email_causes_error(db_path, user_1):
    user_service.create_user(user_1)

    user2 = user_1
    user2.firstName = "Manuel"
    user2.lastName = "Rodriguez"

    result = user_service.create_user(user2)

    assert result["error"] == "El email ya está registrado"


def test_repeated_user_creation_causes_error(db_path, user_1):
    user_service.create_user(user_1)

    result = user_service.create_user(user_1)

    assert result["error"] == "El email ya está registrado"


def test_authenticating_user(db_path, user_1):
    user_service.create_user(user_1)

    result = user_service.authenticate_user("enriquez_test@gmail.com", "123456")

    assert result.firstName == "Joaquin"


def test_wrong_password_doesnt_auth(db_path, user_1):
    user_service.create_user(user_1)

    result = user_service.authenticate_user("enriquez_test@gmail.com", "wrong")

    assert result is None


def test_wrong_email_doesnt_auth(db_path, user_1):
    user_service.create_user(user_1)

    result = user_service.authenticate_user("enriquez_wrong@gmail.com", "123456")

    assert result is None


def test_create_new_rsa(db_path, user_1, public_key_1):
    user_service.create_user(user_1)

    user_service.update_public_rsa(user_1.email, public_key_1, 0)

    assert user_service.get_public_rsa(user_1.email, 0) == public_key_1


def test_wrong_device_uid_doesnt_exist(db_path, user_1, public_key_1):
    user_service.create_user(user_1)

    user_service.update_public_rsa(user_1.email, public_key_1, 0)

    assert not user_service.device_rsa_exists(user_1.email, 1)


def test_rsa_is_updated(db_path, user_1, public_key_1, public_key_2):
    user_service.create_user(user_1)
    user_service.update_public_rsa(user_1.email, public_key_1, 0)

    user_service.update_public_rsa(user_1.email, public_key_2, 0)

    assert user_service.get_public_rsa(user_1.email, 0) == public_key_2


def test_generate_new_uid_without_any_previous_uids(db_path, user_1):
    user_service.create_user(user_1)

    assert user_service.generate_new_uid(user_1.email) == {"deviceUID": 0}


def test_generate_new_uid_with_a_previous_uid(
    db_path, user_1, public_key_1, public_key_2
):
    user_service.create_user(user_1)
    user_service.update_public_rsa(user_1.email, public_key_1, 0)

    assert user_service.generate_new_uid(user_1.email) == {"deviceUID": 1}


@pytest.fixture
def user_1():
    """Creates CreateUserDTO of User "Joaquin Enriquez"."""

    return CreateUserDTO(
        firstName="Joaquin",
        lastName="Enriquez",
        email="enriquez_test@gmail.com",
        password="123456",
    )


@pytest.fixture
def public_key_1():
    return '{"e":5,"n":7663}'


@pytest.fixture
def public_key_2():
    return '{"e":7,"n":3599}'
