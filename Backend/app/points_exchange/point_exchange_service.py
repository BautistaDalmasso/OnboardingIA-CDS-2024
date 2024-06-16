from pathlib import Path
from app.user.user_dtos import LOGIN_RESPONSE, TokenDataDTO
from app.licence_levels.licence_level import LicenceLevel
from app.licence_levels.modify_licence_service import ModifyLicenceService
from app.points_exchange.point_addition_service import apply_minus_points_in_transaction
from app.user.user_errors import UserNotFound
from app.points_exchange.points import (
    TRUSTED_LICENCE_UPGRADE_COST,
    POINTS_PER_EARLY_DAY,
)
from app.database.database_user import DatabaseUser
from app.loan_management.manage_loans_service import LoanService
from app.file_paths import CATALOGUE_PATH


class PointExchangeService(DatabaseUser):

    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
        self._modify_licence_service = ModifyLicenceService(db_path)
        self._loan_service = LoanService(db_path, CATALOGUE_PATH)

    def exchange_for_trusted_licence(self, token_data: TokenDataDTO) -> LOGIN_RESPONSE:

        self._remove_points_if_theres_enough(
            token_data.email, TRUSTED_LICENCE_UPGRADE_COST
        )

        return self._modify_licence_service.modify_licence_level(
            token_data.email,
            LicenceLevel.TRUSTED,
            token_data,
        )

    def _remove_points_if_theres_enough(self, user_email: str, point_cost: int):
        with self.transaction() as cursor:
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

    def exchange_for_increase_limit(self, token_data: TokenDataDTO):
        self._remove_points_if_theres_enough(token_data.email, POINTS_PER_EARLY_DAY)
        self._loan_service.increase_limit_by_user_email(token_data.email)


class InsufficientPoints(Exception): ...
