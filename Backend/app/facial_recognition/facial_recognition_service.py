from pathlib import Path
import requests
from fastapi import HTTPException

from app.database_actions import execute_in_database
from app.user.user_service import UserService
from app.server_config import ServerConfig


BASE_URL = ServerConfig().get_facial_recognition_server()


class FacialRecognitionService:
    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path

    async def upload_facial_profile(self, user_email: str, user_face: bytes) -> None:
        r = requests.post(f"{BASE_URL}/facial_profile", files={"file": user_face})

        try:
            if r.status_code == 200:
                face_id = r.json()["id"]

                execute_in_database(
                    """UPDATE users SET faceID = ? WHERE email = ?""",
                    (face_id, user_email),
                    self._db_path,
                )
            else:
                print(r.json())
                raise HTTPException(
                    status_code=500,
                    detail={"error": "Failed to upload facial profile."},
                )

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail={"error": "Failed to upload facial profile."}
            )

    async def compare_facial_profile(
        self, user_email: str, user_face: bytes
    ) -> bool | None:
        user_service = UserService(self._db_path)
        user = user_service.get_user_by_email(user_email)

        r = requests.post(
            f"{BASE_URL}/facial_profile/{user.faceId}/compare",
            files={"file": (user_face)},
        )

        try:
            if r.status_code == 200:
                return r.json()
            else:
                print(r.json())
                return {"error": "Failed to compare facial profile."}
        except Exception as e:
            print(e)
            return {"error": "Failed to compare facial profile."}
