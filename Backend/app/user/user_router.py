from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from passlib.context import CryptContext

from ..middlewares import verify_token
from .user_dtos import CheckChallengeDTO, CreateUser, LoginDTO, UpdateRSADTO
from .user_service import UserService

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/users", tags=["User"])


@router.post("")
async def create_user(user: CreateUser):
    result = UserService.create_user(user)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    access_token = UserService.create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "user": user}


@router.post("/login")
async def login_for_access_token(loginData: LoginDTO):
    user = UserService.authenticate_user(loginData.email, loginData.password)

    if not user:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    access_token = UserService.create_access_token(data={"sub": user["email"]})

    return {"access_token": access_token, "user": user}


@router.post("/rsa")
async def update_rsa(updateRSADTO: UpdateRSADTO, token=Depends(HTTPBearer())):
    user_email: str = await verify_token(token.credentials)

    UserService.update_public_rsa(user_email, updateRSADTO.publicRSA)


@router.get("/challenge")
async def generate_challenge(user_email: str):
    print(user_email)
    user = UserService.get_user_by_email(user_email)
    print(user)
    if not user:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    challenge = UserService.create_challenge(user_email)
    return {"challenge": challenge}


@router.post("/verify_challenge")
async def verify_challenge(challengeDTO: CheckChallengeDTO):
    user = UserService.get_user_by_email(challengeDTO.email)
    if not user:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    valid_challenge = UserService.verify_challenge(user, challengeDTO.challenge)

    if not valid_challenge:
        raise HTTPException(status_code=401, detail="El dispositivo no esta autorizado")

    UserService.delete_challenge(challengeDTO.email)

    access_token = UserService.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "user": {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
        },
    }
