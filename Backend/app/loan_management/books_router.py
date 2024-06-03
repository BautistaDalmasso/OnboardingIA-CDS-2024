from fastapi import APIRouter, Query
from app.licence_levels.licence_service import (
    BookDataWithLicence,
    BookWithLicenceBrowser,
)
from app.file_paths import DATABASE_PATH, CATALOGUE_PATH

router = APIRouter(prefix="/books", tags=["Library"])

licence_service = BookWithLicenceBrowser(DATABASE_PATH, CATALOGUE_PATH)


@router.get("/show_books", response_model=list[BookDataWithLicence])
async def consult_books_by_page(
    page_size: int = Query(...), page_number: int = Query(...)
):
    books = licence_service.consult_books_by_page(page_size, page_number)

    return books


@router.get("/show_books/filter", response_model=list[BookDataWithLicence])
async def consult_filtered_books(filter_category: str, filter_value: str):
    books = licence_service.consult_filtered_books(filter_category, filter_value)

    return books


@router.get("/show_books/isbn", response_model=list[BookDataWithLicence])
async def consult_book_by_isbn(isbn: str):
    book = licence_service.consult_book_data(isbn)

    if book is None:
        return []
    return [
        book,
    ]
