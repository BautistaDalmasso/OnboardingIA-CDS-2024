from fastapi import APIRouter, FastAPI, HTTPException
from app.licence_levels.licence_level import LicenceLevel
from app.library.library_service import (
    BookAlreadyReturned,
    BookNotFound,
    LibraryService,
    NoCopiesAvailable,
)
from app.licence_levels.licence_service import BookDataWithLicence, LicenceService
from app.file_paths import LIBRARY_DB_PATH
from app.file_paths import DATABASE_PATH

router = APIRouter(prefix="/books", tags=["Library"])

library_service = LibraryService(LIBRARY_DB_PATH)
licence_service = LicenceService(DATABASE_PATH, LIBRARY_DB_PATH)


@router.get("/show_books/", response_model=list[BookDataWithLicence])
async def consult_books_by_page(page_size: int = 6, page_number: int = 0):
    books = licence_service.consult_books_by_page(page_size, page_number)
    for book in books:
        if book.licence_required == LicenceLevel.NONE:
            book.licence_required = "NONE"
        elif book.licence_required == LicenceLevel.REGULAR:
            book.licence_required = "REGULAR"
        elif book.licence_required == LicenceLevel.TRUSTED:
            book.licence_required = "TRUSTED"
        elif book.licence_required == LicenceLevel.RESEARCHER:
            book.licence_required = "RESEARCHER"
    return books


@router.post("/{isbn}/borrow/")
async def borrow_book(isbn: str):
    try:
        copy_data = library_service.borrow_book(isbn)
        return copy_data
    except (BookNotFound, NoCopiesAvailable) as e:
        raise HTTPException(status_code=400, detail=str(e))
