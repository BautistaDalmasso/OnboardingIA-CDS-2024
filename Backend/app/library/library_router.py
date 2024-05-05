from fastapi import APIRouter, Depends, HTTPException
from library_service import add_requested_book,add_confirmed_loan
from library_models import LoanDTO, RequestedBookDTO
from fastapi.security import HTTPBearer 
from ..middlewares import verify_token
from ..user.user_dtos import (TokenDataDTO,)
from licence_levels.licence_service import consult_book_data

router = APIRouter(prefix="/book", tags=["Book"])


@router.post("loan")
async def create_confirmed_loan(book: LoanDTO):
    return add_confirmed_loan(book)
   
@router.post("requested_book")
async def create_requested_book(book: RequestedBookDTO,token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)
    book_level: int = consult_book_data(book.isbn) 
    if(book_level ==  user_data.licenceLevel):
        result = add_requested_book(book)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
    
