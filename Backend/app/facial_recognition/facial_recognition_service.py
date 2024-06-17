import json
from pathlib import Path
import requests
from fastapi import HTTPException
import numpy as np

from app.database.database_user import DatabaseUser
from app.database.database_actions import execute_in_database
from app.user.user_service import UserService
from app.server_config import ServerConfig
from app.file_paths import DATABASE_PATH
from app.user.user_dtos import UserDTO


BASE_URL = ServerConfig().get_facial_recognition_server()

user_service = UserService(DATABASE_PATH)


class FacialRecognitionService(DatabaseUser):

    def upload_facial_profile(self, user_email: str, embedding: list[float]) -> None:
        user_service.update_embedding(user_email, embedding)

    def facial_login(
        self, user_email: str, embedding: list[float]
    ) -> UserDTO | None:
        user = user_service.get_user_by_email(user_email)

        same_face = is_same_face(embedding, json.loads(user.embedding))

        if (same_face == False):
            return {"error": "Failed to compare facial profile."}
        
        user_dto = UserDTO(
            email=user.email,
            firstName=user.firstName,
            lastName=user.lastName,
            dni=user.dni,
            role=user.role,
            licenceLevel=user.licenceLevel,
            lastPermissionUpdate=user.lastPermissionUpdate,
            points=user.points,
            embedding=json.loads(user.embedding)
        )

        return user_service.finish_login_data(user_dto)

def euclidean_distance(embedding1: list[float], embedding2: list[float]):
    return np.linalg.norm(np.array(embedding1) - np.array(embedding2))

def is_same_face(embedding1: list[float], embedding2: list[float], threshold=3.5):
    distance = euclidean_distance(embedding1, embedding2)
    return distance < threshold
