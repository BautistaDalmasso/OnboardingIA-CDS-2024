from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CreateUserDTO(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    dni: None = None
    licenceLevel: int = 0
    role: str = "basic"
    lastPermissionUpdate: Optional[datetime] = None


class UserDTO(BaseModel):
    firstName: str
    lastName: str
    email: str
    dni: Optional[str] = None
    licenceLevel: Optional[int] = None
    role: Optional[str] = "basic"
    lastPermissionUpdate: datetime


class LoginDTO(BaseModel):
    email: str
    password: str


class CheckChallengeDTO(BaseModel):
    email: str
    deviceUID: int
    challenge: list[int]


class UpdateRSADTO(BaseModel):
    publicRSA: str
    deviceUID: int


class UpdateUserDniDTO(BaseModel):
    dni: str


class TokenDataDTO(BaseModel):
    email: str
    role: Optional[str] = "basic"
    licenceLevel: int = 0
