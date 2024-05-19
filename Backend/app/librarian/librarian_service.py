from datetime import datetime
from Backend.app.licence_levels.licence_level import LicenceLevel
from app.database.database_user import DatabaseUser


class LibrarianService(DatabaseUser):

    def add_exemplars(self, isbns: list[str]):

        for isbn in isbns:
            self.add_exemplar(isbn)

    def add_exemplar(self, isbn: str):
        self.execute_in_database(
            """INSERT INTO bookInventory (isbn, status)
            VALUES (?, ?)""",
            (isbn, "available"),
        )
