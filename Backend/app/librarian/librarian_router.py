# TODO: temp router development only, add access token requirements that check for librarian status.

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.catalogue.update_catalogue_service import UpdateCatalogueService
from app.loan_management.book_loans_service import BookNotFound
from app.middlewares import verify_token
from app.user.user_dtos import TokenDataDTO, UpdateUserRoleDTO
from app.librarian.librarian_service import LibrarianService
from app.catalogue import catalogue_db
from app.catalogue.add_to_catalogue_service import AddToCatalogueService
from app.file_paths import CATALOGUE_PATH, DATABASE_PATH


router = APIRouter(prefix="/librarian", tags=["Librarian"])
librarian_cd_router = APIRouter(prefix="/librarianCD", tags=["LibrarianCD"])

add_to_catalogue_service = AddToCatalogueService(CATALOGUE_PATH)
update_catalogue_service = UpdateCatalogueService(CATALOGUE_PATH)
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


@router.patch("/update_book_data")
async def update_book_data(url: str):
    try:
        update_catalogue_service.update_book_by_url(url)
    except BookNotFound as e:
        raise HTTPException(status_code=404, detail=e)


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


@router.get("/update_licence_user")
async def update_licence(user_email: str, level: int, token=Depends(HTTPBearer())):
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


@librarian_cd_router.patch("/update_role_to_librarian")
async def add_librarian(user: UpdateUserRoleDTO, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)
    return librarian_service.upgrade_role_to_librarian(user)


@librarian_cd_router.patch("/downgrade_role_to_user")
async def downgrade_librarian(user: UpdateUserRoleDTO, token=Depends(HTTPBearer())):
    await librarian_permissions_verification(token.credentials)
    return librarian_service.downgrade_role_to_user(user)


# TODO: Delete later, Development only.
@librarian_cd_router.patch("/add_first_librarian")
async def add_first_librarian(user: UpdateUserRoleDTO):
    result = librarian_service.upgrade_role_to_librarian(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


# TODO: Delete later, Development only.
@librarian_cd_router.patch("/downgrade_role_to_user")
async def delete_librarian(user: UpdateUserRoleDTO):
    result = librarian_service.downgrade_role_to_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
