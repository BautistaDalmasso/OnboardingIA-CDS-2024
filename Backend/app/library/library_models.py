from typing import Literal
from pydantic import BaseModel


class BookData(BaseModel):
    isbn: str
    title: str
    available_copies: int


class PhysicalCopyData(BaseModel):
    isbn: str
    copy_id: str
    status: Literal["available"] | Literal["borrowed"]
