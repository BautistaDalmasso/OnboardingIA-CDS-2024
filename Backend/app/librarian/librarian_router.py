# TODO: temp router development only, add access token requirements that check for librarian status.

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.middlewares import verify_token
from app.user.user_dtos import TokenDataDTO
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


@router.get("/consult_user")
async def consult_user_by_email(user_email: str, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)

    user = librarian_service.get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=401, detail="No es usuario")
    return user


@router.get("/delete_user")
async def delete_user_by_email(user_email: str, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)

    return librarian_service.delete_user(user_email)


@router.get("/update_license_user")
async def update_license(user_email: str, level: int, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)

    return librarian_service.update_licence(user_email, level)


@router.get("/update_name_user")
async def update_name(user_email: str, new_user_name: str, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)

    return librarian_service.update_name(user_email, new_user_name)


@router.get("/update_lastName_user")
async def update_lastname(
    user_email: str, new_user_last_name: str, token=Depends(HTTPBearer())
):
    await librarian_permissions_verification(token.credentials)

    return librarian_service.update_lastName(user_email, new_user_last_name)


@router.get("/update_dni_user")
async def update_dni(user_email: str, new_user_dni: str, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)

    return librarian_service.update_dni(user_email, new_user_dni)


async def librarian_permissions_verification(token: str) -> TokenDataDTO:
    token_data = await verify_token(token)

    if token_data.role != "librarian":
        raise HTTPException(status_code=403, detail="Not a librarian.")

    return token_data
