from typing import Literal
from pydantic import BaseModel
from datetime import datetime

class BookData(BaseModel):
    isbn: str
    title: str
    available_copies: int

    def __eq__(self, other):
        if not isinstance(other, BookData):
            return False
        return self.isbn == other.isbn

    def __hash__(self):
        return hash(self.isbn)


class PhysicalCopyData(BaseModel):
    isbn: str
    copy_id: str
    status: Literal["available"] | Literal["borrowed"]
 
    
class LoanDTO(BaseModel):
    isbn: str
    copy_id: str
    expiration_date: datetime
    user_email:str
    
    
class RequestedBookDTO(BaseModel):
    isbn: str
    copy_id: str
    user_email:str
    
    
     
