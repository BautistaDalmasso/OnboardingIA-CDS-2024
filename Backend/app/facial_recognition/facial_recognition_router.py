from fastapi import APIRouter, Depends, HTTPException, UploadFile, Request
from fastapi.security import HTTPBearer

from app.user.user_dtos import LOGIN_RESPONSE, TokenDataDTO
from app.user.user_service import UserService, create_UserDTO_from_login
from app.facial_recognition.facial_recognition_service import FacialRecognitionService
from app.middlewares import verify_token

from app.file_paths import DATABASE_PATH

from .facial_recognition_dtos import RegisterFaceDTO, LoginFaceDTO


router = APIRouter(prefix="/facial_recog", tags=["Facial Recognition"])

fr_service = FacialRecognitionService(DATABASE_PATH)
user_service = UserService(DATABASE_PATH)


@router.post("/register_face")
async def handle_facial_register(register_face_data: RegisterFaceDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)

    fr_service.upload_facial_profile(user_data.email, register_face_data.embedding)

    return {"message": "Facial profile uploaded successfully"}


@router.post("/login_face_recognition", response_model=LOGIN_RESPONSE)
async def login_face_recognition(login_face_data: LoginFaceDTO):
    result = fr_service.facial_login(login_face_data.email, login_face_data.embedding)

    if "error" in result:
        raise HTTPException(status_code=401, detail="Inicio de sesión fallido.")

    return result
