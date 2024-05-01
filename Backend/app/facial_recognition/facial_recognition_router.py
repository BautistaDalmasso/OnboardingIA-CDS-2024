from fastapi import APIRouter, Depends, HTTPException, UploadFile, Request
from fastapi.security import HTTPBearer

from app.user.user_dtos import TokenDataDTO
from app.user import user_service
from app.facial_recognition.facial_recognition_service import FacialRecognitionService
from app.middlewares import verify_token

from app.file_paths import DATABASE_PATH


router = APIRouter(prefix="/facial_recog", tags=["Facial Recognition"])

fr_service = FacialRecognitionService(DATABASE_PATH)


@router.post("/register_face")
async def handle_facial_register(face: UploadFile, token=Depends(HTTPBearer())):
    face_file = await face.read()
    user_data: TokenDataDTO = await verify_token(token.credentials)

    await fr_service.upload_facial_profile(user_data.email, face_file)

    return {"message": "Facial profile uploaded successfully"}


@router.post("/login_face_recognition")
async def login_face_recognition(user_email: str, face: UploadFile):
    bytes_image = await face.read()
    result = await fr_service.compare_facial_profile(user_email, bytes_image)

    if "error" in result:
        raise HTTPException(status_code=401, detail="Inicio de sesión fallido.")

    if result["success"]:
        user = user_service.get_user_by_email(user_email)
        access_token = user_service.create_access_token(
            TokenDataDTO(
                email=user.email, role=user.role, licenceLevel=user.licenceLevel
            )
        )
        return {"access_token": access_token, "user": user}
