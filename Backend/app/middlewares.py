from fastapi import HTTPException
from jwt import PyJWTError, decode

from app.user.user_dtos import TokenDataDTO

from .jwt_config import ALGORITHM, SECRET_KEY


async def verify_token(token: str) -> TokenDataDTO:
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        licenceLevel = payload.get("licenceLevel")

        return TokenDataDTO(email=email, role=role, licenceLevel=licenceLevel)
    except PyJWTError as error:
        raise HTTPException(status_code=401, detail="Invalid token")
