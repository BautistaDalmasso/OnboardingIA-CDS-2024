from datetime import datetime
from pydantic import BaseModel


class LoanInformationDTO(BaseModel):
    isbn: str
    copy_id: str
    expiration_date: datetime
    user_email: str


class LoanDTO(BaseModel):
    isbn: str
    expiration_date: datetime
    user_email: str


class RequestedBookDTO(BaseModel):
    isbn: str
    user_email: str

