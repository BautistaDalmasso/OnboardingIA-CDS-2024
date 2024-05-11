from pydantic import BaseModel


class MarcBookData(BaseModel):
    isbn: str
    title: str
    place: str
    publisher: str
    date_issued: str
    edition: str
    abstract: str | None
    description: str
    ddc_class: str
    authors: list[str]
    topics: list[str]
