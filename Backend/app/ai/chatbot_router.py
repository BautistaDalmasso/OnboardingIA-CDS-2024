from fastapi import APIRouter
from pydantic import BaseModel

from app.server_config import ServerConfig


class QuestionRequest(BaseModel):
    question: str


config = ServerConfig()

if config.is_using_chatbot():
    from app.ai.chatbot import Skynet
    from app.ai.topics import Topics

    topics = Topics()
    skynet = Skynet(topics)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("")
async def chatbot_question(question_request: QuestionRequest):
    question = question_request.question
    print(f"Usuario: {question}")

    if config.is_using_chatbot():
        answer = skynet.answer(question)
        print(f"Chatbot: {answer}")
    else:
        answer = "Chatbot deshabilitado durante desarrollo."

    return {"answer": answer}
