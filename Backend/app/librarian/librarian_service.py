from app.database.database_user import DatabaseUser
from pathlib import Path
import sqlite3
from app.database.database_user import DatabaseUser
from ..models import User


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

    def get_user_by_email(self, email: str) -> User:
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
            )
            return user

    # -------------------------------------------
    def delete_user(self, user_email: str) -> User:
        try:
            books_no_returned = self.query_database(
                """SELECT * FROM loan WHERE userEmail = ? AND expirationDate >= date('now')""",
                (user_email,),
            )
            queries = [
                f"DELETE FROM users WHERE email = ?",
                f"DELETE FROM deviceRSAS WHERE email = ?",
                f"DELETE FROM requested_books WHERE userEmail = ?",
            ]
            if not books_no_returned:
                for query in queries:
                    self.execute_in_database(query, (user_email,))
                return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {
                "error": "No se pudo dar de baja el usuario, tiene que devolver libros prestados."
            }

    def update_licence(self, user_email: str, level: int) -> User:
        try:
            self.execute_in_database(
                """UPDATE users SET licenceLevel = ? WHERE email = ?""",
                (level, user_email),
            )
            return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_name(self, user_email: str, new_user_name: str) -> User:
        try:
            self.execute_in_database(
                """UPDATE users SET firstName = ? WHERE email = ?""",
                (new_user_name, user_email),
            )
            return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_lastName(self, user_email: str, new_user_lastName: str) -> User:
        try:
            self.execute_in_database(
                """UPDATE users SET lastName = ? WHERE email = ?""",
                (new_user_lastName, user_email),
            )
            return self.get_user_by_email(user_email)
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}

    def update_dni(self, user_email: str, new_user_dni: str) -> User:
        try:
            self.execute_in_database(
                """UPDATE users SET dni = ? WHERE email = ?""",
                (new_user_dni, user_email),
            )
            return self.get_user_by_email(
                user_email,
            )
        except sqlite3.IntegrityError:
            return {"error": "No se pudo actualizar el usuario"}
