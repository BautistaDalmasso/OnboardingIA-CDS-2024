from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.chatbot import Skynet
from app.ai.topics import Topics


class QuestionRequest(BaseModel):
    question: str


topics = Topics()
skynet = Skynet(topics)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("")
async def chatbot_question(question_request: QuestionRequest):
    question = question_request.question
    print(f"Usuario: {question}")
    answer = skynet.answer(question)
    print(f"Chatbot: {answer}")

    return {"answer": answer}
