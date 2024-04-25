import requests
from fastapi import HTTPException, UploadFile

from app.database import execute_in_database
from app.user.user_service import get_user_by_email
from app.server_config import ServerConfig


BASE_URL = ServerConfig().get_facial_recognition_server()


async def upload_facial_profile(user_email: str, user_face: bytes) -> None:
    r = requests.post(f"{BASE_URL}/facial_profile", files={"file": (user_face)})

    try:
        if r.status_code == 200:
            face_id = r.json()["id"]

            execute_in_database(
                """UPDATE users SET faceID = ? WHERE email = ?""", (face_id, user_email)
            )
        else:
            # raise requests.HTTPError(
            #    f"Failed to upload facial profile. Status code: {r.status_code}"
            # )
            raise HTTPException(
                status_code=400, detail={"error": "Failed to upload facial profile."}
            )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"error": "Failed to upload facial profile."}
        )


async def compare_facial_profile(user_email: str, user_face: bytes) -> bool | None:
    user = get_user_by_email(user_email)

    r = requests.post(
        f"{BASE_URL}/facial_profile/{user.faceId}/compare", files={"file": (user_face)}
    )

    try:
        if r.status_code == 200:
            return r.json()["success"]
        else:
            # raise requests.HTTPError(
            #    f"Failed to upload facial profile. Status code: {r.status_code}"
            # )
            raise HTTPException(
                status_code=400, detail={"error": "Failed to upload facial profile."}
            )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail={"error": "Failed to compare facial profile."}
        )
