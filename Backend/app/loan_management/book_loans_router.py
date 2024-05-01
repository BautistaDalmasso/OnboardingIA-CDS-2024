from fastapi import APIRouter, HTTPException
from app.loan_management import book_loans_service

from .book_loans_dtos import LoanDTO, RequestedBookDTO

router = APIRouter(prefix="/book", tags=["Book"])


@router.post("confirmed_loan")
async def create_confirmed_loan(book: LoanDTO):
    result = book_loans_service.add_confirmed_loan(book)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])


@router.post("requested_book")
async def create_requested_book(book: RequestedBookDTO):
    result = book_loans_service.add_requested_book(book)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
