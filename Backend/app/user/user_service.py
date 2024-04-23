import json
import random
import sqlite3
import string
from datetime import datetime, timedelta

import jwt
from passlib.context import CryptContext

from ..database import execute_in_database, query_database
from ..jwt_config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from ..models import User
from .user_dtos import UpdateUserDniDTO

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(user: User):
    hashed_password = pwd_context.hash(user.password)

    try:
        execute_in_database(
            """INSERT INTO users (firstName, lastName, email, password)
                        VALUES (?, ?, ?, ?)""",
            (user.firstName, user.lastName, user.email, hashed_password),
        )
        return {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
        }
    except sqlite3.IntegrityError:
        return {"error": "El email ya está registrado"}


def authenticate_user(email: str, password: str) -> User | None:
    user = get_user_by_email(email)

    if user:
        if pwd_context.verify(password, user.password):
            return {
                "email": user.email,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "dni": user.dni,
            }


def create_access_token(data: dict):
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str) -> User:
    user_data = query_database("""SELECT * FROM users WHERE email = ?""", (email,))

    if user_data:
        user = User(
            firstName=user_data[1],
            lastName=user_data[2],
            email=user_data[3],
            password=user_data[4],
            challengeKey=user_data[5],
            dni=user_data[6],
        )
        return user


def update_public_rsa(user_email: str, public_rsa: str, device_uid: int):

    if device_rsa_exists(user_email, device_uid):
        update_existing_public_rsa(user_email, public_rsa, device_uid)
    else:
        create_new_public_rsa(user_email, public_rsa, device_uid)


def device_rsa_exists(user_email: str, device_uid: int) -> bool:
    device_rsa = query_database(
        """SELECT * FROM deviceRSAS WHERE email = ? AND deviceUID = ?""",
        (user_email, device_uid),
    )

    return bool(device_rsa)


def update_existing_public_rsa(user_email: str, public_rsa: str, device_uid: int):

    execute_in_database(
        """UPDATE deviceRSAS SET publicRSA = ? WHERE email = ? AND deviceUID = ?""",
        (public_rsa, user_email, device_uid),
    )


def create_new_public_rsa(user_email: str, public_rsa: str, device_uid: int):

    execute_in_database(
        """INSERT INTO deviceRSAS (email, deviceUID, publicRSA)
                        VALUES (?, ?, ?)""",
        (user_email, device_uid, public_rsa),
    )


def get_public_rsa(user_email: str, device_uid: int) -> str | None:
    deviceRSA = query_database(
        """SELECT * FROM deviceRSAS WHERE email = ? AND deviceUID = ?""",
        (user_email, device_uid),
    )

    if deviceRSA is not None:
        return deviceRSA[3]
    return None


def generate_new_uid(user_email: str):
    result = {"deviceUID": 0}

    latest_user_device = query_database(
        """SELECT MAX(deviceUID) FROM deviceRSAS WHERE email = ?""", (user_email,)
    )

    if latest_user_device[0] is not None:
        result["deviceUID"] = latest_user_device[0] + 1

    print(result)
    return result


def create_challenge(email: str):
    challenge = generate_random_challenge(20)

    execute_in_database(
        """UPDATE users SET challengeKey = ? WHERE email = ?""", (challenge, email)
    )

    return challenge


def delete_challenge(email: str):
    execute_in_database(
        """UPDATE users SET challengeKey = ? WHERE email = ?""", (None, email)
    )


def verify_challenge(user: User, device_uid: int, encrypted_text: list[int]):
    user_rsa = get_public_rsa(user.email, device_uid)

    if user_rsa is None:
        return False

    public_key = json.loads(user_rsa)

    e, n = public_key["e"], public_key["n"]
    decrypted_text = [chr((char**e) % n) for char in encrypted_text]
    decrypted_text = "".join(decrypted_text)

    return decrypted_text == user.challengeKey


def generate_random_challenge(length: int):
    letters_and_digits = string.ascii_letters + string.digits
    return "".join((random.choice(letters_and_digits) for i in range(length)))


def update_user(user: UpdateUserDniDTO, email: str):

    try:
        execute_in_database(
            """UPDATE users SET dni = ?
                        WHERE email = ?""",
            (user.dni, email),
        )
        return {
            "dni": user.dni,
        }
    except sqlite3.IntegrityError:
        return {"error": "No se pudo actualizar el usuario"}
