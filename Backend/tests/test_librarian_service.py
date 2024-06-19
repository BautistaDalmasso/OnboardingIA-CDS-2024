import pytest
from app.user.user_dtos import CreateUserDTO, UpdateUserRoleDTO
from tests.common_fixtures import librarian_service

USER = 0
LIBRARIAN = 1


# TODO: DeprecationWarning: The default datetime adapter is deprecated as of Python 3.12; see the sqlite3 documentation for suggested replacement recipes
pytestmark = pytest.mark.filterwarnings("ignore")


def test_update_licence(librarian_service, user_1):
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].update_licence(user_1.email, 2)
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.licenceLevel==2


def test_update_name(librarian_service, user_1) :
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].update_name(user_1.email, "Jose")
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.firstName=="Jose"


def test_update_lastName(librarian_service, user_1) :
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].update_lastName(user_1.email, "Perez")
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.lastName=="Perez"

    


def test_update_dni(librarian_service, user_1) :
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].update_dni(user_1.email, "12345678910")
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.dni=="12345678910"


def test_upgrade_role_to_librarian(librarian_service, user_1, new_librarian):
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].upgrade_role_to_librarian(new_librarian)
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.role=="librarian"
    
    
def test_downgrade_role_to_user(librarian_service, user_1,  new_librarian):
    librarian_service[USER].create_user(user_1)
    librarian_service[LIBRARIAN].upgrade_role_to_librarian(new_librarian)
    librarian_service[LIBRARIAN].downgrade_role_to_user(new_librarian)
    user_in_db = librarian_service[USER].get_user_by_email(user_1.email)
    assert user_in_db.role=="basic"


def test_delete_user(librarian_service, user_1) :
    email= librarian_service[USER].create_user(user_1).email
    librarian_service[LIBRARIAN].delete_user(email)
    assert librarian_service[USER].get_user_by_email(email)== None


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
def new_librarian():
    return UpdateUserRoleDTO(
        role="librarian",
        email="enriquez_test@gmail.com",
    )


