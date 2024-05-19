from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from app.loan_management.book_loans_service import (
    BookNotFound,
    LoanService,
    NoCopiesAvailable,
)
from app.loan_management.book_loans_dtos import (
    LoanDTO,
    LoanInformationDTO,
    PhysicalCopyDTO,
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


@router.post("/borrow", response_model=PhysicalCopyDTO)
async def create_requested_book(book: LoanDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)
    requested_book = licence_service.consult_book_data(book.isbn)

    if requested_book.licence_required <= user_data.licenceLevel:
        try:
            result = loan_service.add_loan(book)

            return result
        except (BookNotFound, NoCopiesAvailable) as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(
            status_code=401, detail="No tienes permisos para solicitar este libro"
        )


@router.get("/user_loans", response_model=list[LoanInformationDTO])
async def book_loans_by_user_email(user_email: str):
    result = loan_service.consult_book_loans_by_user_email(user_email)
    return result
