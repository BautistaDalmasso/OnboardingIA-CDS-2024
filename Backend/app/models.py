from enum import Enum
from datetime import datetime
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
    lastPermissionUpdate: datetime


class auto_index(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return count
