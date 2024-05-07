from fastapi import APIRouter
from app.licence_levels.licence_level import LicenceLevel
from app.licence_levels.licence_service import BookDataWithLicence, LicenceService
from app.file_paths import LIBRARY_DB_PATH
from app.file_paths import DATABASE_PATH

router = APIRouter(prefix="/books", tags=["Library"])

licence_service = LicenceService(DATABASE_PATH, LIBRARY_DB_PATH)


# TODO: Improve later the if/elif part
@router.get("/show_books", response_model=list[BookDataWithLicence])
async def consult_books_by_page(page_size: int = 6, page_number: int = 0):
    books = licence_service.consult_books_by_page(page_size, page_number)
    for book in books:
        if book.licence_required == LicenceLevel.NONE:
            book.licence_required = "Ninguna"
        elif book.licence_required == LicenceLevel.REGULAR:
            book.licence_required = "Regular"
        elif book.licence_required == LicenceLevel.TRUSTED:
            book.licence_required = "Confiado"
        elif book.licence_required == LicenceLevel.RESEARCHER:
            book.licence_required = "Investigador"
    return books
