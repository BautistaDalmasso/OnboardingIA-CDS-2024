from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, time

from pytz import timezone
from apscheduler.schedulers.background import BackgroundScheduler

from app.loan_management.loan_parser import LoanParser
from app.loan_management.book_loans_router import router as book_loans_router
from app.ai.chatbot_router import router as chatbot_router
from app.loan_management.books_router import router as books_router
from app.database.initialize_db import initialize_database
from app.server_config import ServerConfig
from app.user.user_router import router as user_router
from app.file_paths import CATALOGUE_PATH, DATABASE_PATH
from app.facial_recognition.facial_recognition_router import (
    router as facial_recognition_router,
)
from app.qr_code.qr_code_router import router as qr_code_router
from app.librarian.librarian_router import router as librarian_router
from app.librarian.librarian_router import librarian_cd_router as librarian_cd_router


class QuestionRequest(BaseModel):
    question: str


server_config = ServerConfig()

app = FastAPI()

origins = [server_config.get_origins()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router)
app.include_router(user_router)
app.include_router(facial_recognition_router)
app.include_router(books_router)
app.include_router(book_loans_router)
app.include_router(qr_code_router)
app.include_router(librarian_router)
app.include_router(librarian_cd_router)


@app.get("/ping")
async def ping():
    return {"ping": "pong"}


def run_loan_parser():
    print(f"{datetime.now().time()}: RUNNING LOAN PARSER")
    loan_parser = LoanParser(DATABASE_PATH, CATALOGUE_PATH)
    loan_parser.parse_non_historic_loans()
    print(f"{datetime.now().time()}: LOAN PARSE FINISHED")


def start_scheduler():
    scheduler = BackgroundScheduler(timezone=timezone("America/Argentina/Buenos_Aires"))
    run_time = time(hour=3, minute=00)
    scheduler.add_job(
        run_loan_parser, "cron", hour=run_time.hour, minute=run_time.minute
    )
    scheduler.start()


initialize_database(DATABASE_PATH)
start_scheduler()
