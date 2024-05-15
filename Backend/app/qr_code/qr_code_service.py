import json
import qrcode

from app.database.database_user import DatabaseUser
from app.user.user_service import UserService


class QrCodeService(DatabaseUser):
    def make_qr(self, user_email: str):
        user = UserService(self._db_path).get_user_by_email(user_email)

        data = json.dumps(
            {
                "email": user_email,
                "first_name": user.firstName,
                "last_name": user.lastName,
                "dni": user.dni,
                "licence_level": user.licenceLevel,
            }
        )

        return qrcode.make(data)
