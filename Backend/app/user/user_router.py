from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
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
    UpdateUserRoleDTO,
    UserDTO,
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
            email=result.email,
            role=result.role,
            licenceLevel=result.licenceLevel,
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


@router.patch("/update_role_to_librarian")
async def add_librarian(user: UpdateUserRoleDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)
    if user_data.role == "librarian":
        result = user_service.upgrade_role_to_librarian(user)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.patch("/downgrade_role_to_user")
async def add_librarian(user: UpdateUserRoleDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)
    if user_data.role == "librarian":
        result = user_service.downgrade_role_to_user(user)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

    return result


# TODO: Delete later, Development only.
@router.patch("/add_first_librarian")
async def add_first_librarian(user: UpdateUserRoleDTO):
    result = user_service.upgrade_role_to_librarian(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


# TODO: Delete later, Development only.
@router.patch("/downgrade_role_to_user")
async def delete_librarian(user: UpdateUserRoleDTO):
    result = user_service.downgrade_role_to_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.get("/get_all_users", response_model=List[UserDTO])
async def get_all_users(page_size: int = Query(...), page_number: int = Query(...)):
    result = user_service.get_all_users(page_size, page_number)
    return result
