from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai.chatbot import Skynet
from app.ai.topics import Topics
from app.server_config import ServerConfig

server_config = ServerConfig()
topics = Topics()
skynet = Skynet(topics)

app = FastAPI()

origins = [server_config.get_origins()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
async def chatbot_question(question: str):
    return {"answer": skynet.answer(question)}
