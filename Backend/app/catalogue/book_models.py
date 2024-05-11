from enum import Enum, auto
from pydantic import BaseModel


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
    authors: list[str]
    topics: list[str]


class _auto(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return count


class MBDI(_auto):
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
