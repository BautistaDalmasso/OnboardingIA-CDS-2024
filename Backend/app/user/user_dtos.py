from typing import Optional
from pydantic import BaseModel


class CreateUserDTO(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str


class UserDTO(BaseModel):
    firstName: str
    lastName: str
    email: str
    dni: Optional[str] = None
    licenceLevel: Optional[int] = None
    role: Optional[str] = None


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
    licenceLevel: Optional[int] = 0
