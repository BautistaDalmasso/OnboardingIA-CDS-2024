from datetime import datetime
from pydantic import BaseModel


class CreateBookDTO(BaseModel):
    id: str
    isbn: str
    name: str
    author: str
    expirationDate: datetime
    confirmedLoanDate: datetime
    confirmedLoan: bool
    requested: bool


class LoanConfirmedDTO(BaseModel):
    id: str
    isbn: str
    name: str
    author: str
    expirationDate: datetime


class RequestedBookDTO(BaseModel):
    id: str
    isbn: str
    name: str
    author: str
