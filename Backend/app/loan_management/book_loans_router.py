from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from app.library.library_models import PhysicalCopyData
from app.library.library_service import BookNotFound, NoCopiesAvailable
from app.loan_management.book_loans_service import LoanService
from app.loan_management.book_loans_dtos import LoanDTO, RequestedBookDTO
from fastapi.security import HTTPBearer
from ..middlewares import verify_token
from ..user.user_dtos import (
    TokenDataDTO,
)
from app.licence_levels.licence_service import LicenceService

router = APIRouter(prefix="/loans", tags=["Loan"])

from app.file_paths import LIBRARY_DB_PATH
from app.file_paths import DATABASE_PATH

loan_service = LoanService(DATABASE_PATH, LIBRARY_DB_PATH)
licence_service = LicenceService(DATABASE_PATH, LIBRARY_DB_PATH)


@router.post("/borrow", response_model=PhysicalCopyData)
async def create_requested_book(book: LoanDTO, token=Depends(HTTPBearer())):
    print(book)
    user_data: TokenDataDTO = await verify_token(token.credentials)
    requested_book = licence_service.consult_book_data(book.isbn)

    if requested_book.licence_required <= user_data.licenceLevel:
        try:
            result = loan_service.add_loan(book)

            return result
        except (BookNotFound, NoCopiesAvailable) as e:
            print(e)
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(
            status_code=401, detail="No tienes permisos para solicitar este libro"
        )


@router.get("/user_loans")
async def book_loans_by_user_email(email: str):
    result = loan_service.consult_book_loans_by_user_email(email)
    return result
