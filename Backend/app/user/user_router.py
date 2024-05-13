from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.security import HTTPBearer
from passlib.context import CryptContext

from app.user.user_service import UserService, create_UserDTO
from app.file_paths import DATABASE_PATH


from ..middlewares import verify_token
from .user_dtos import (
    CheckChallengeDTO,
    CreateUserDTO,
    LoginDTO,
    TokenDataDTO,
    UpdateRSADTO,
    UpdateUserDniDTO,
)

user_service = UserService(DATABASE_PATH)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["User"])


@router.post("")
async def create_user(user: CreateUserDTO):
    result = user_service.create_user(user)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    access_token = user_service.create_access_token(
        TokenDataDTO(
            email=result["email"],
            role=result["role"],
            licenceLevel=result["licenceLevel"],
        )
    )

    return {"access_token": access_token, "user": user}


@router.post("/login")
async def login_for_access_token(loginData: LoginDTO):
    user = user_service.authenticate_user(loginData.email, loginData.password)

    if not user:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    access_token = user_service.create_access_token(
        TokenDataDTO(email=user.email, role=user.role, licenceLevel=user.licenceLevel)
    )

    return {"access_token": access_token, "user": user}


@router.post("/rsa")
async def update_rsa(updateRSADTO: UpdateRSADTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)

    user_service.update_public_rsa(
        user_data.email, updateRSADTO.publicRSA, updateRSADTO.deviceUID
    )


@router.get("/challenge")
async def generate_challenge(user_email: str):
    user = user_service.get_user_by_email(user_email)

    if not user:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    challenge = user_service.create_challenge(user_email)
    return {"challenge": challenge}


@router.post("/verify_challenge")
async def verify_challenge(challengeDTO: CheckChallengeDTO):
    user = user_service.get_user_by_email(challengeDTO.email)
    if not user:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    valid_challenge = user_service.verify_challenge(
        user, challengeDTO.deviceUID, challengeDTO.challenge
    )

    if not valid_challenge:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    user_service.delete_challenge(challengeDTO.email)

    access_token = user_service.create_access_token(
        TokenDataDTO(email=user.email, role=user.role, licenceLevel=user.licenceLevel)
    )

    return {
        "access_token": access_token,
        "user": create_UserDTO(user),
    }


@router.patch("/dni")
async def update_user(user: UpdateUserDniDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)

    result = user_service.upgrade_to_regular_licence(user, user_data)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.get("/deviceUID")
async def generate_device_UID(user_email: str):
    result = user_service.generate_new_uid(user_email)

    return result
