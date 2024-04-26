from fastapi import APIRouter, Depends, HTTPException, UploadFile, Request
from fastapi.security import HTTPBearer

from app.user import user_service
from app.facial_recognition.facial_recognition_service import (
    compare_facial_profile,
    upload_facial_profile,
)
from app.middlewares import verify_token


router = APIRouter(prefix="/facial_recog", tags=["Facial Recognition"])


@router.post("/register_face")
async def handle_facial_register(face: UploadFile, token=Depends(HTTPBearer())):
    face_file = await face.read()
    user_email = await verify_token(token.credentials)

    await upload_facial_profile(user_email, face_file)

    return {"message": "Facial profile uploaded successfully"}


@router.post("/login_face_recognition")
async def login_face_recognition(user_email: str, face: UploadFile):
    bytes_image = await face.read()
    result = await compare_facial_profile(user_email, bytes_image)

    if "error" in result:
        raise HTTPException(status_code=401, detail="Inicio de sesión fallido.")

    if result["success"]:
        user = user_service.get_user_by_email(user_email)
        access_token = user_service.create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "user": user}
