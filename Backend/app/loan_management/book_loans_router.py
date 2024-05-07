from fastapi import APIRouter, Depends, HTTPException
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

loan_service = LoanService(DATABASE_PATH)
licence_service = LicenceService(DATABASE_PATH, LIBRARY_DB_PATH)


@router.post("/loan/")
async def create_confirmed_loan(book: LoanDTO):
    return loan_service.add_confirmed_loan(book)


@router.post("/requested_book/")
async def create_requested_book(book: RequestedBookDTO, token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)
    book_level: int = licence_service._consult_book_licence_req(book.isbn)

    user_data.licenceLevel = 1  # Delete later, temporary solution.

    if book_level == user_data.licenceLevel:
        result = loan_service.add_requested_book(book)
        if "error" in result:
            raise HTTPException(
                status_code=400, detail=result["error en solicitar libro"]
            )
    else:
        raise HTTPException(
            status_code=401, detail="No tienes permisos para solicitar este libro"
        )


@router.get("/user_loans")
async def book_loans_by_user_email(email: str):
    result = loan_service.consult_book_loans_by_user_email(email)
    return result
