from datetime import datetime
from enum import auto
from typing import Literal
from pydantic import BaseModel

from app.models import auto_index


LOAN_STATUS = (
    Literal["reserved"]
    | Literal["loaned"]
    | Literal["reservation_canceled"]
    | Literal["loan_return_overdue"]
    | Literal["returned"]
)


class LoanInformationDTO(BaseModel):
    inventory_number: int
    isbn: str
    title: str
    expiration_date: datetime
    user_email: str
    loan_status: LOAN_STATUS


class ReservationRequestDTO(BaseModel):
    isbn: str
    expiration_date: datetime
    user_email: str


class PhysicalCopyDTO(BaseModel):
    inventoryNumber: int
    isbn: str
    status: Literal["available"] | Literal["borrowed"]


class PCDI(auto_index):
    "Physical Copy Data Indexes"
    inventoryNumber = auto()
    isbn = auto()
    status = auto()
