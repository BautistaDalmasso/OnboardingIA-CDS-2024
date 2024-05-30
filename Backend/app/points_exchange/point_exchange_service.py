from pathlib import Path
import sqlite3
from app.licence_levels.licence_level import LicenceLevel
from app.licence_levels.modify_licence_service import ModifyLicenceService
from app.points_exchange.point_addition_service import apply_minus_points_in_transaction
from app.user.user_errors import UserNotFound
from app.points_exchange.points import TRUSTED_LICENCE_UPGRADE_COST
from app.database.database_user import DatabaseUser


class PointExchangeService(DatabaseUser):

    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
        self._modify_licence_service = ModifyLicenceService(db_path)

    def exchange_for_trusted_licence(self, user_email: str):

        self._remove_points_if_theres_enough(user_email, TRUSTED_LICENCE_UPGRADE_COST)

        self._modify_licence_service.modify_licence_level(
            user_email,
            LicenceLevel.TRUSTED,
        )

    def _remove_points_if_theres_enough(self, user_email: str, point_cost: int):
        try:
            connection = sqlite3.connect(self._db_path)
            cursor = connection.cursor()

            cursor.execute("BEGIN")

            cursor.execute("SELECT points FROM users WHERE email = ?", (user_email,))

            points_tuple = cursor.fetchone()

            if points_tuple is None:
                raise UserNotFound(f"Usuario con email: '{user_email}', no encontrado.")

            points = points_tuple[0]

            if points < point_cost:
                raise InsufficientPoints(
                    f"Usuario con email '{user_email}', no tiene suficientes puntos para esta acción ({points} < {point_cost})."
                )

            apply_minus_points_in_transaction(user_email, point_cost, cursor)

            cursor.execute("COMMIT")
        finally:
            cursor.close()
            connection.close()


class InsufficientPoints(Exception): ...
