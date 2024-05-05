from fastapi import FastAPI, HTTPException
from app.library.library_service import (
    BookAlreadyReturned,
    BookNotFound,
    LibraryService,
    NoCopiesAvailable,
)
from app.file_paths import LIBRARY_DB_PATH

router = FastAPI()
library_service = LibraryService(LIBRARY_DB_PATH)


@router.get("books")
async def get_books_by_page():
    books = library_service.consult_books_by_page(10, 0)
    return books


@router.post("books/{isbn}/borrow/")
async def borrow_book(isbn: str):
    try:
        copy_data = library_service.borrow_book(isbn)
        return copy_data
    except (BookNotFound, NoCopiesAvailable) as e:
        raise HTTPException(status_code=400, detail=str(e))
