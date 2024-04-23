from pydantic import BaseModel


class UploadFacialProfileResponseDTO(BaseModel):
    id: str


class CompareFacialProfileResponseDTO(BaseModel):
    success: bool
