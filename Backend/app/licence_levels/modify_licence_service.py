from datetime import datetime
from pathlib import Path
from app.user.user_dtos import LOGIN_RESPONSE, TokenDataDTO
from app.user.user_service import UserService, create_UserDTO_from_login
from app.database.database_user import DatabaseUser


class ModifyLicenceService(DatabaseUser):

    def __init__(self, db_path: Path) -> None:
        super().__init__(db_path)
        self._user_service = UserService(db_path)

    # TODO: update other instances of licence updating to use this method.
    def modify_licence_level(
        self,
        user_email: str,
        new_licence_level: int,
        token_data: TokenDataDTO,
        now: datetime = datetime.now(),
    ) -> LOGIN_RESPONSE:
        user_dto = create_UserDTO_from_login(
            self._user_service.get_user_by_email(token_data.email)
        )
        user_dto.licenceLevel = new_licence_level

        self.execute_in_database(
            """UPDATE users
                SET lastPermissionUpdate = ?, licenceLevel = ?
                WHERE email = ?""",
            (now, new_licence_level, user_email),
        )

        return self._user_service.finish_login_data(user_dto)
