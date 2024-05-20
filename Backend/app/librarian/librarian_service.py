from datetime import datetime
from app.user.user_dtos import UserDTO
from app.database.database_user import DatabaseUser
from pathlib import Path
import sqlite3
from app.database.database_user import DatabaseUser


class LibrarianService(DatabaseUser):

    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)

    def add_exemplars(self, isbns: list[str]):

        for isbn in isbns:
            self.add_exemplar(isbn)

    def add_exemplar(self, isbn: str):
        self.execute_in_database(
            """INSERT INTO bookInventory (isbn, status)
            VALUES (?, ?)""",
            (isbn, "available"),
        )

    def get_user_by_email(self, email: str) -> UserDTO:
        user_data = self.query_database(
            """SELECT
            firstName, lastName, email, dni, licenceLevel, role, lastPermissionUpdate
            FROM users WHERE email = ?""",
            (email,),
        )

        if user_data:
            user = UserDTO(
                firstName=user_data[0],
                lastName=user_data[1],
                email=user_data[2],
                dni=user_data[3],
                licenceLevel=user_data[4],
                role=user_data[5],
                lastPermissionUpdate=user_data[6],
            )
            return user

    def delete_user(self, user_email: str) -> UserDTO:
        try:
            books_not_returned = self.query_database(
                """SELECT * FROM loan WHERE userEmail = ? AND expirationDate >= date('now')""",
                (user_email,),
            )
            queries = [
                f"DELETE FROM users WHERE email = ?",
                f"DELETE FROM deviceRSAS WHERE email = ?",
                f"DELETE FROM requested_books WHERE userEmail = ?",
            ]
            if not books_not_returned:
                for query in queries:
                    self.execute_in_database(query, (user_email,))

                return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {
                "error": "No se pudo dar de baja el usuario, tiene que devolver libros prestados."
            }

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
