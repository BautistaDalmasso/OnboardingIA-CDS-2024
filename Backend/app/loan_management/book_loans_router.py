from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from app.loan_management.book_loans_service import (
    BookNotFound,
    LoanNotFound,
    LoanService,
    NoCopiesAvailable,
)
from app.loan_management.book_loans_dtos import (
    ReservationRequestDTO,
    LoanInformationDTO,
)
from fastapi.security import HTTPBearer
from ..middlewares import verify_token
from ..user.user_dtos import (
    TokenDataDTO,
)
from app.licence_levels.licence_service import LicenceService

from app.file_paths import DATABASE_PATH, CATALOGUE_PATH

router = APIRouter(prefix="/loans", tags=["Loan"])

loan_service = LoanService(DATABASE_PATH, CATALOGUE_PATH)
licence_service = LicenceService(DATABASE_PATH, CATALOGUE_PATH)


@router.post("/reserve", response_model=LoanInformationDTO)
async def request_book_reservation(
    book: ReservationRequestDTO, token=Depends(HTTPBearer())
) -> LoanInformationDTO:
    user_data: TokenDataDTO = await verify_token(token.credentials)
    requested_book = licence_service.consult_book_data(book.isbn)

    if requested_book.licence_required <= user_data.licenceLevel:
        try:
            result = loan_service.reserve_book(book)

            return result

        except BookNotFound as e:
            print(e)
            raise HTTPException(status_code=404, detail=str(e))
        except NoCopiesAvailable as e:
            print(e)
            raise HTTPException(status_code=409, detail=str(e))
    else:
        raise HTTPException(
            status_code=403, detail="No tienes permisos para solicitar este libro"
        )


@router.get("/all_loans", response_model=list[LoanInformationDTO])
async def all_book_loans(token=Depends(HTTPBearer())):
    token_data = await verify_token(token.credentials)

    if token_data.role != "librarian":
        raise HTTPException(status_code=403, detail="Solo bibliotecarios.")

    result = loan_service.consult_all_book_loans()
    return result


@router.get("/loans_by_title", response_model=list[LoanInformationDTO])
async def book_loans_by_title(title: str, token=Depends(HTTPBearer())):
    token_data = await verify_token(token.credentials)

    if token_data.role != "librarian":
        raise HTTPException(status_code=403, detail="Solo bibliotecarios.")

    result = loan_service.consult_book_loans_by_title(title)
    return result


@router.get("/loan_by_email", response_model=list[LoanInformationDTO])
async def book_loans_by_user_email(user_email: str, token=Depends(HTTPBearer())):
    token_data = await verify_token(token.credentials)

    if token_data.email == user_email or token_data.role == "librarian":
        result = loan_service.consult_book_loans_by_user_email(user_email)
        return result

    raise HTTPException(
        status_code=403,
        detail="No puedes acceder a prestamos de otro usario sin ser bibliotecario.",
    )


@router.patch("/set_status_loaned")
async def set_status_loaned(loan_id: int, due_date: str, token=Depends(HTTPBearer())):
    expiration_date = datetime.strptime(due_date, "%Y-%m-%d")
    try:
        token_data = await verify_token(token.credentials)

        if token_data.role == "librarian":
            result = loan_service.set_status_loaned(loan_id, expiration_date)

    except LoanNotFound as e:
        raise HTTPException(
            status_code=403,
            detail="No se pudo modificar el prestamo",
        )


@router.patch("/set_status_reserved")
async def set_status_reserved(loan_id: int, due_date: str, token=Depends(HTTPBearer())):
    expiration_date = datetime.strptime(due_date, "%Y-%m-%d")
    try:
        token_data = await verify_token(token.credentials)

        if token_data.role == "librarian":
            result = loan_service.set_status_reserved(loan_id, expiration_date)

    except LoanNotFound as e:
        raise HTTPException(
            status_code=403,
            detail="No se pudo modificar el prestamo",
        )


@router.patch("/set_status_returned")
async def set_status_returned(loan_id: int, token=Depends(HTTPBearer())):
    try:
        token_data = await verify_token(token.credentials)

        if token_data.role == "librarian":
            result = loan_service.set_status_returned(loan_id)

    except LoanNotFound as e:
        raise HTTPException(
            status_code=403,
            detail="No se pudo modificar el prestamo",
        )


@router.patch("/set_status_returned_overdue")
async def set_status_returned_overdue(loan_id: int, token=Depends(HTTPBearer())):
    try:
        token_data = await verify_token(token.credentials)
        if token_data.role == "librarian":
            result = loan_service.set_status_loan_return_overdue(loan_id)
    except LoanNotFound as e:
        raise HTTPException(
            status_code=403,
            detail="No se pudo modificar el prestamo",
        )


@router.patch("/set_status_reservation_Canceled")
async def set_status_reservation_Canceled(loan_id: int, token=Depends(HTTPBearer())):
    try:
        token_data = await verify_token(token.credentials)

        if token_data.role == "librarian":
            result = loan_service.set_status_reservation_Canceled(loan_id)

    except LoanNotFound as e:
        raise HTTPException(
            status_code=403,
            detail="No se pudo modificar el prestamo",
        )
