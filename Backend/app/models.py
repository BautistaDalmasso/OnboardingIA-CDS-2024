from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    dni: Optional[str] = None
    challengeKey: Optional[str] = None
    faceId: Optional[str] = None
    licenceLevel: Optional[int] = None
    role: Optional[str] = None


class Book(BaseModel):
        id: int
        isbn: str
        name: str
        author: str
        expirationDate: str
        confirmedLoanDate: str

