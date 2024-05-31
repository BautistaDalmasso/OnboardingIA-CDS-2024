from datetime import datetime
from enum import auto
from typing import Literal
from pydantic import BaseModel

from app.catalogue.book_models import MarcBookData
from app.models import auto_index


LOAN_STATUS = (
    Literal["reserved"]
    | Literal["loaned"]
    | Literal["reservation_canceled"]
    | Literal["loan_return_overdue"]
    | Literal["returned"]
)


class LoanInformationDTO(BaseModel):
    id: int | None = None
    inventory_number: int
    catalogue_data: MarcBookData
    expiration_date: datetime
    user_email: str
    loan_status: LOAN_STATUS
    reservation_date: datetime | None
    checkout_date: datetime | None
    return_date: datetime | None


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
