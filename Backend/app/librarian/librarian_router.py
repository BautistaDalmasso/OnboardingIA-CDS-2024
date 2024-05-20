# TODO: temp router development only, add access token requirements that check for librarian status.

from fastapi import APIRouter

from app.librarian.librarian_service import LibrarianService
from app.catalogue import catalogue_db
from app.catalogue.add_to_catalogue_service import AddToCatalogueService
from app.file_paths import CATALOGUE_PATH, DATABASE_PATH


router = APIRouter(prefix="/librarian", tags=["Librarian"])

add_to_catalogue_service = AddToCatalogueService(CATALOGUE_PATH)
librarian_service = LibrarianService(DATABASE_PATH)


@router.post("/reset_catalogue")
async def reset_catalogue():
    # TODO: REMOVE, DEVELOPMENT ONLY, ERASES ENTIRE CATALOGUE
    CATALOGUE_PATH.unlink()
    catalogue_db.initialize_database(CATALOGUE_PATH)


@router.post("/add_to_catalogue")
async def add_to_catalogue(url: str):
    # TODO: temp, add error handling
    add_to_catalogue_service.add_book_by_url(url)


@router.post("/add_exemplar")
async def add_exemplar(isbn: str):
    # TODO: add error handling.
    librarian_service.add_exemplar(isbn)
