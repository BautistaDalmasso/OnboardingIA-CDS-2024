from fastapi import APIRouter, HTTPException, UploadFile

from .facial_profile_dto import (
    CompareFacialProfileResponseDTO,
    UploadFacialProfileResponseDTO,
)
from . import facial_profile_service

router = APIRouter(prefix="/facial_profile", tags=["User"])


@router.post("")
async def upload_facial_profile(file: UploadFile) -> UploadFacialProfileResponseDTO:
    try:
        bytes_image = await file.read()
        facial_profile_id = facial_profile_service.upload_facial_profile(bytes_image)

        return {"id": facial_profile_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{facial_profile_id}/compare")
async def compare_facial_profile(
    facial_profile_id: str, file: UploadFile
) -> CompareFacialProfileResponseDTO:
    bytes_image = await file.read()
    result = facial_profile_service.compare_facial_profile(
        facial_profile_id, bytes_image
    )

    return {"success": result}
