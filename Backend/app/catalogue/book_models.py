from enum import Enum, auto
from pydantic import BaseModel

from app.models import auto_index


class BookContributor(BaseModel):
    name: str
    role: str | None


class MarcBookData(BaseModel):
    isbn: str
    title: str
    place: str
    publisher: str
    date_issued: str
    edition: str | None
    abstract: str | None
    description: str
    ddc_class: str
    authors: list[BookContributor]
    topics: list[str]


class MBDI(auto_index):
    """Marc Book Data Indices"""

    isbn = auto()
    title = auto()
    place = auto()
    publisher = auto()
    date_issued = auto()
    edition = auto()
    abstract = auto()
    description = auto()
    ddc_class = auto()
    authors = auto()
    topics = auto()
