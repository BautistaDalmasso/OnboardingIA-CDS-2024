from fastapi import APIRouter
from app.licence_levels.licence_service import BookDataWithLicence, LicenceService
from app.file_paths import DATABASE_PATH, CATALOGUE_PATH

router = APIRouter(prefix="/books", tags=["Library"])

licence_service = LicenceService(DATABASE_PATH, CATALOGUE_PATH)


@router.get("/show_books", response_model=list[BookDataWithLicence])
async def consult_books_by_page(page_size: int = 6, page_number: int = 0):
    books = licence_service.consult_books_by_page(page_size, page_number)

    return books
