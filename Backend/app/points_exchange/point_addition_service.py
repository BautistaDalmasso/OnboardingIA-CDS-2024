import sqlite3
from app.database.database_user import DatabaseUser


class PointAdditionService(DatabaseUser):

    def apply_points(self, user_email: str, points: int):
        self.execute_in_database(
            """UPDATE users SET points = points + ? WHERE email = ?""",
            (points, user_email),
        )

    def apply_minus_points(self, user_email: str, points: int):
        self.apply_points(user_email, points * (-1))


def apply_points_in_transaction(user_email: str, points: int, cursor: sqlite3.Cursor):
    cursor.execute(
        """UPDATE users SET points = points + ? WHERE email = ?""",
        (points, user_email),
    )


def apply_minus_points_in_transaction(
    user_email: str, points: int, cursor: sqlite3.Cursor
):
    apply_points_in_transaction(user_email, points * (-1), cursor)
