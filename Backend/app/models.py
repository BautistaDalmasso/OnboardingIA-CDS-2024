from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    dni: Optional[str] = None
    challengeKey: Optional[str] = None
