from datetime import datetime
from enum import auto
from pydantic import BaseModel

from app.models import auto_index


class LoanInformationDTO(BaseModel):
    id: int
    inventory_number: int
    title: str
    expiration_date: datetime
    user_email: str


class LIDI(auto_index):
    """Indexes for LoanInformationDTO"""

    id = auto()
    inventory_number = auto()
    title = auto()
    expiration_date = auto()
    user_email = auto()


class LoanDTO(BaseModel):
    isbn: str
    expiration_date: datetime
    user_email: str


class RequestedBookDTO(BaseModel):
    isbn: str
    user_email: str
