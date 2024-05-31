from datetime import datetime
from app.database.database_user import DatabaseUser


class ModifyLicenceService(DatabaseUser):

    def modify_licence_level(
        self, user_email: str, licence_level: int, now: datetime = datetime.now()
    ):

        # TODO: update other instances of licence updating to use this method.
        self.execute_in_database(
            """UPDATE users
                SET lastPermissionUpdate = ?, licenceLevel = ?
                WHERE email = ?""",
            (now, licence_level, user_email),
        )
