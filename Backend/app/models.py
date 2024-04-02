from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    publicRSA: Optional[str] = None
    challengeKey: Optional[str] = None
