from datetime import datetime

import jwt
from app.user.user_service import UserService
from app.user.user_dtos import TokenDataDTO, UpdateUserRoleDTO, UserDTO
from app.database.database_user import DatabaseUser
from pathlib import Path
import sqlite3

user_service = UserService(DatabaseUser)


class LibrarianService(DatabaseUser):

    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
        self._user_service = UserService(db_path)

    def add_exemplars(self, isbns: list[str]):

        for isbn in isbns:
            self.add_exemplar(isbn)

    def add_exemplar(self, isbn: str, inventory_number: int | None = None):
        if inventory_number:
            self.execute_in_database(
                """INSERT INTO bookInventory (inventoryNumber, isbn, status)
                VALUES (?, ?, ?)""",
                (inventory_number, isbn, "available"),
            )

        self.execute_in_database(
            """INSERT INTO bookInventory (isbn, status)
            VALUES (?, ?)""",
            (isbn, "available"),
        )

    def get_user_by_email(self, email: str) -> UserDTO:
        user_data = self._user_service.get_user_by_email(email)

        if user_data:
            return user_data
        return None

    # TODO: make improved delete user.

    def update_licence(self, user_email: str, level: int) -> UserDTO:
        try:
            self.execute_in_database(
                """UPDATE users
                    SET lastPermissionUpdate = ?, licenceLevel = ?
                    WHERE email = ?""",
                (datetime.now(), level, user_email),
            )
            return self.get_user_by_email(user_email)

        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_name(self, user_email: str, new_user_name: str) -> UserDTO:
        try:
            self.execute_in_database(
                """UPDATE users
                    SET firstName = ?, lastPermissionUpdate = ?
                    WHERE email = ?""",
                (new_user_name, datetime.now(), user_email),
            )
            return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_lastName(self, user_email: str, new_user_lastName: str) -> UserDTO:
        try:
            self.execute_in_database(
                """UPDATE users SET lastName = ?, lastPermissionUpdate = ?
                    WHERE email = ?""",
                (new_user_lastName, datetime.now(), user_email),
            )
            return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_dni(self, user_email: str, new_user_dni: str) -> UserDTO:
        try:
            self.execute_in_database(
                """UPDATE users SET dni = ?, lastPermissionUpdate = ?
                    WHERE email = ?""",
                (new_user_dni, datetime.now(), user_email),
            )
            return self.get_user_by_email(
                user_email,
            )
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def upgrade_role_to_librarian(self, user: UpdateUserRoleDTO):

        access_token_data = TokenDataDTO(
            email=user.email,
            role="librarian",
        )

        try:
            self.execute_in_database(
                """UPDATE users
                SET role = ? WHERE email = ?""",
                ("librarian", user.email),
            )

            return {
                "role": user.role,
            }
        except sqlite3.IntegrityError:
            return {"error": "No se pudo agregar bibliotecario"}

    def downgrade_role_to_user(self, user: UpdateUserRoleDTO):

        access_token_data = TokenDataDTO(
            email=user.email,
            role="basic",
        )

        try:
            self.execute_in_database(
                """UPDATE users
                SET role = ? WHERE email = ?""",
                ("basic", user.email),
            )

            return {
                "role": user.role,
            }
        except sqlite3.IntegrityError:
            return {"error": "No se pudo agregar bibliotecario"}
