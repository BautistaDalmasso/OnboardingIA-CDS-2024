from fastapi import HTTPException
from jwt import PyJWTError, decode

from .jwt_config import ALGORITHM, SECRET_KEY


async def verify_token(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        return email
    except PyJWTError as error:
        raise HTTPException(status_code=401, detail="Invalid token")
