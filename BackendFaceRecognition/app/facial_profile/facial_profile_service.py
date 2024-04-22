import numpy as np
import face_recognition
from PIL import Image
from io import BytesIO

from . import facial_profile_repository


def upload_facial_profile(bytes_image: bytes) -> str:
    face_encodings = _get_face_encodings(bytes_image)
    return facial_profile_repository.insert_one({"face_encodings": face_encodings})


def compare_facial_profile(facial_profile_id: int, bytes_image: bytes) -> bool:
    facial_profile = facial_profile_repository.search_by_id(facial_profile_id)
    face_encoding_to_check = _get_face_encodings(bytes_image)
    return _compare_faces(facial_profile["face_encodings"], face_encoding_to_check)


def _compare_faces(known_face_encodings: list, face_encoding_to_check: list) -> bool:
    results = face_recognition.compare_faces(
        [np.array(known_face_encodings)], np.array(face_encoding_to_check)
    )
    return bool(results[0])


def _get_face_encodings(bytes_image: bytes):
    pil_image = Image.open(BytesIO(bytes_image))
    image = np.array(pil_image)
    face_ubications = face_recognition.face_locations(image)

    if len(face_ubications) != 1:
        raise ValueError("La imagen debe contener un solo rostro")

    return face_recognition.face_encodings(image)[0].tolist()
