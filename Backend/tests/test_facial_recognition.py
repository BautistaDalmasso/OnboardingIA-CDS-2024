from pathlib import Path
import pytest

from app.user.user_dtos import CreateUserDTO
from app.user import user_service
from app.user.facial_recognition_service import (
    upload_facial_profile,
    compare_facial_profile,
)

from tests.common_fixtures import db_path


"""
If more testing of the face recognition module is required:
Create a tests/images folder and add photos that coincide with the fixtures.
(person1_image1.jpeg, person1_image2.jpeg, person2_image1.jpeg)

Using jpeg is important here!!
"""


@pytest.mark.skip(reason="Facial recognition tests should be run locally.")
@pytest.mark.asyncio
async def test_upload_face(db_path, user_1, person1_image1):
    user_service.create_user(user_1)

    await upload_facial_profile(user_1.email, person1_image1)

    user = user_service.get_user_by_email(user_1.email)

    assert user.faceId is not None


@pytest.mark.skip(reason="Facial recognition tests should be run locally.")
@pytest.mark.asyncio
async def test_same_person_gets_recognized(
    db_path, user_1, person1_image1, person1_image2
):
    user_service.create_user(user_1)
    await upload_facial_profile(user_1.email, person1_image1)

    assert await compare_facial_profile(user_1.email, person1_image2)


@pytest.mark.skip(reason="Facial recognition tests should be run locally.")
@pytest.mark.asyncio
async def test_different_person_doesnt_get_recognized(
    db_path, user_1, person1_image1, person2_image1
):
    user_service.create_user(user_1)
    await upload_facial_profile(user_1.email, person1_image1)

    assert not (await compare_facial_profile(user_1.email, person2_image1))


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
def person1_image1():
    image_path = Path("tests") / "images" / "person1_image1.jpeg"

    if not image_path.exists():
        raise FileNotFoundError(
            "Test images don't exist, follow test instructions to test locally."
        )

    with open(image_path, "rb") as image:
        yield image.read()


@pytest.fixture
def person1_image2():
    image_path = Path("tests") / "images" / "person1_image2.jpeg"

    if not image_path.exists():
        raise FileNotFoundError(
            "Test images don't exist, follow test instructions to test locally."
        )

    with open(image_path, "rb") as image:
        yield image.read()


@pytest.fixture
def person2_image1():
    image_path = Path("tests") / "images" / "person2_image1.jpeg"

    if not image_path.exists():
        raise FileNotFoundError(
            "Test images don't exist, follow test instructions to test locally."
        )

    with open(image_path, "rb") as image:
        yield image.read()
