from enum import auto
from typing import Literal
from pydantic import BaseModel

from app.models import auto_index


class BookData(BaseModel):
    isbn: str
    title: str
    available_copies: int

    def __eq__(self, other):
        if not isinstance(other, BookData):
            return False
        return self.isbn == other.isbn

    def __hash__(self):
        return hash(self.isbn)


class PhysicalCopyData(BaseModel):
    inventoryNumber: int
    isbn: str
    status: Literal["available"] | Literal["borrowed"]


class PCDI(auto_index):
    "Physical Copy Data Indexes"
    inventoryNumber = auto()
    isbn = auto()
    status = auto()
