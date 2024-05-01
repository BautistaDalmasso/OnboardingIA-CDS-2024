
from datetime import datetime
from pydantic import BaseModel


class CreateBookDTO(BaseModel):
    id: str
    isbn: str
    name: str
    author: str
    expirationDate: datetime
    confirmedLoanDate: datetime
    confirmedLoan: bool
    requested: bool
    
    
    
class RequestedBookDTO(BaseModel):
    id: str
    isbn: str
    userEmail:str
    
    
    
class LoanDTO(BaseModel):
    id: str
    isbn: str
    expirationDate: datetime
    userEmail:str
     
