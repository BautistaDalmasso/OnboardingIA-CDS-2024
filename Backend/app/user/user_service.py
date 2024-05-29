import json
import random
from pathlib import Path
import sqlite3
import string
from datetime import datetime, timedelta
from typing import List

import jwt
from passlib.context import CryptContext

from app.file_paths import CATALOGUE_PATH
from app.loan_management.book_loans_service import LoanService
from app.licence_levels.licence_level import LicenceLevel
from app.database.database_user import DatabaseUser

from ..jwt_config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from ..models import User
from .user_dtos import (
    LOGIN_RESPONSE,
    CreateUserDTO,
    LoginSuccessfulResponseDTO,
    TokenDataDTO,
    UpdateUserDniDTO,
    UserDTO,
)


class UserService(DatabaseUser):
    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)

        self._pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self._loans_service = LoanService(db_path, CATALOGUE_PATH)

    def create_user(self, register_information: CreateUserDTO):
        hashed_password = self._pwd_context.hash(register_information.password)
        time = datetime.now()

        try:
            self.execute_in_database(
                """INSERT INTO users (firstName, lastName, email, password, role, licenceLevel, lastPermissionUpdate, points)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    register_information.firstName,
                    register_information.lastName,
                    register_information.email,
                    hashed_password,
                    "basic",
                    LicenceLevel.NONE,
                    time,
                    0,
                ),
            )

            return create_UserDTO_from_registration(register_information, time)
        except sqlite3.IntegrityError:
            return {"error": "El email ya está registrado"}

    def authenticate_user(self, email: str, password: str) -> UserDTO | None:
        user = self.get_user_by_email(email)

        if user:
            if self._pwd_context.verify(password, user.password):
                return create_UserDTO_from_login(user)

        return None

    def create_access_token(self, data: TokenDataDTO):
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.now() + expires_delta
        data = {
            "sub": data.email,
            "role": data.role,
            "licenceLevel": data.licenceLevel,
            "exp": expire,
        }

        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def get_user_by_email(self, email: str) -> User | None:
        user_data = self.query_database(
            """SELECT * FROM users WHERE email = ?""",
            (email,),
        )

        if user_data:
            user = User(
                firstName=user_data[1],
                lastName=user_data[2],
                email=user_data[3],
                password=user_data[4],
                challengeKey=user_data[5],
                dni=user_data[6],
                faceId=user_data[7],
                licenceLevel=user_data[8],
                role=user_data[9],
                lastPermissionUpdate=user_data[10],
                points=user_data[11],
            )
            return user
        return None

    def update_public_rsa(self, user_email: str, public_rsa: str, device_uid: int):

        if self.device_rsa_exists(user_email, device_uid):
            self.update_existing_public_rsa(user_email, public_rsa, device_uid)
        else:
            self.create_new_public_rsa(user_email, public_rsa, device_uid)

    def device_rsa_exists(self, user_email: str, device_uid: int) -> bool:
        device_rsa = self.query_database(
            """SELECT * FROM deviceRSAS WHERE email = ? AND deviceUID = ?""",
            (user_email, device_uid),
        )

        return bool(device_rsa)

    def update_existing_public_rsa(
        self, user_email: str, public_rsa: str, device_uid: int
    ):

        self.execute_in_database(
            """UPDATE deviceRSAS SET publicRSA = ? WHERE email = ? AND deviceUID = ?""",
            (public_rsa, user_email, device_uid),
        )

    def create_new_public_rsa(self, user_email: str, public_rsa: str, device_uid: int):

        self.execute_in_database(
            """INSERT INTO deviceRSAS (email, deviceUID, publicRSA)
                            VALUES (?, ?, ?)""",
            (user_email, device_uid, public_rsa),
        )

    def get_public_rsa(self, user_email: str, device_uid: int) -> str | None:
        deviceRSA = self.query_database(
            """SELECT * FROM deviceRSAS WHERE email = ? AND deviceUID = ?""",
            (user_email, device_uid),
        )

        if deviceRSA is not None:
            return deviceRSA[3]
        return None

    def generate_new_uid(self, user_email: str):
        result = {"deviceUID": 0}

        latest_user_device = self.query_database(
            """SELECT MAX(deviceUID) FROM deviceRSAS WHERE email = ?""",
            (user_email,),
        )

        if latest_user_device[0] is not None:
            result["deviceUID"] = latest_user_device[0] + 1

        return result

    def create_challenge(self, email: str):
        challenge = self.generate_random_challenge(20)

        self.execute_in_database(
            """UPDATE users SET challengeKey = ? WHERE email = ?""",
            (challenge, email),
        )

        return challenge

    def delete_challenge(self, email: str):
        self.execute_in_database(
            """UPDATE users SET challengeKey = ? WHERE email = ?""",
            (None, email),
        )

    def verify_challenge(self, user: User, device_uid: int, encrypted_text: list[int]):
        user_rsa = self.get_public_rsa(user.email, device_uid)

        if user_rsa is None:
            return False

        public_key = json.loads(user_rsa)

        e, n = public_key["e"], public_key["n"]
        decrypted_text = [chr((char**e) % n) for char in encrypted_text]
        decrypted_text = "".join(decrypted_text)

        return decrypted_text == user.challengeKey

    def generate_random_challenge(self, length: int):
        letters_and_digits = string.ascii_letters + string.digits
        return "".join((random.choice(letters_and_digits) for i in range(length)))

    def upgrade_to_regular_licence(
        self, user: UpdateUserDniDTO, token_data: TokenDataDTO
    ):

        access_token_data = TokenDataDTO(
            email=token_data.email,
            role=token_data.role,
            licenceLevel=LicenceLevel.REGULAR,
        )
        try:
            self.execute_in_database(
                """UPDATE users
                SET dni = ?, lastPermissionUpdate = ?, licenceLevel = ?
                            WHERE email = ?""",
                (user.dni, datetime.now(), LicenceLevel.REGULAR, token_data.email),
            )

            return {
                "dni": user.dni,
                "access_token": self.create_access_token(access_token_data),
            }
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def get_all_users_by_role(
        self, page_size: int, page_number: int, role: str
    ) -> List[UserDTO]:
        """Page numbering should start at 0"""
        offset = page_number * page_size
        query = """
            SELECT firstName, lastName, email, dni, licenceLevel, role, lastPermissionUpdate, points
            FROM users
            WHERE role = ?
            LIMIT ? OFFSET ?;
        """
        result = self.query_multiple_rows(query, (role, page_size, offset))

        return [self.create_user_data(user_data) for user_data in result]

    def create_user_data(self, query_result) -> UserDTO:
        return UserDTO(
            firstName=query_result[0],
            lastName=query_result[1],
            email=query_result[2],
            dni=query_result[3],
            licenceLevel=query_result[4],
            role=query_result[5],
            lastPermissionUpdate=query_result[6],
            points=query_result[7],
        )

    def get_users(self, role: string) -> List[UserDTO]:
        """Page numbering should start at 0"""
        query = """
                SELECT firstName, lastName, email, dni, licenceLevel, role, lastPermissionUpdate, points
                FROM users
                WHERE role = ?;
            """
        result = self.query_multiple_rows(query, (role,))

        return [self.create_user_data(user_data) for user_data in result]

    def finish_login_data(self, user: UserDTO) -> LOGIN_RESPONSE:
        user_loans = self._loans_service.consult_book_loans_by_user_email(user.email)

        access_token = self.create_access_token(
            TokenDataDTO(
                email=user.email, role=user.role, licenceLevel=user.licenceLevel
            )
        )

        return LoginSuccessfulResponseDTO(
            access_token=access_token,
            user=user,
            loans=user_loans,
        )


def create_UserDTO_from_registration(
    register_info: CreateUserDTO, time: datetime
) -> UserDTO:
    return UserDTO(
        email=register_info.email,
        firstName=register_info.firstName,
        lastName=register_info.lastName,
        dni=None,
        role="basic",
        licenceLevel=0,
        lastPermissionUpdate=time,
        points=0,
    )


def create_UserDTO_from_login(user: User) -> UserDTO:
    return UserDTO(
        email=user.email,
        firstName=user.firstName,
        lastName=user.lastName,
        dni=user.dni,
        role=user.role,
        licenceLevel=user.licenceLevel,
        lastPermissionUpdate=user.lastPermissionUpdate,
        points=user.points,
    )
