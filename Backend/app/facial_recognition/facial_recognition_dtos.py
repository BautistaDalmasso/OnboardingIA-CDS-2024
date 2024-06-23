from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from app.loan_management.book_loans_dtos import LoanInformationDTO


class RegisterFaceDTO(BaseModel):
    embedding: list[float]


class LoginFaceDTO(BaseModel):
    email: str
    embedding: list[float]
