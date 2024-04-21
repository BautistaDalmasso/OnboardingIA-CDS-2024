from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ai.chatbot_router import router as chatbot_router
from app.database import initialize_database
from app.server_config import ServerConfig
from app.user.user_router import router as user_router
from app.file_paths import DATABASE_PATH


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

initialize_database(DATABASE_PATH)
