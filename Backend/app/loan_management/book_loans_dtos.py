
from datetime import datetime
from pydantic import BaseModel
   
class LoanDTO(BaseModel):
    isbn: str
    copy_id: str
    expiration_date: datetime
    user_email:str
    
    
class RequestedBookDTO(BaseModel):
    isbn: str
    copy_id: str
    user_email:str
    
     
