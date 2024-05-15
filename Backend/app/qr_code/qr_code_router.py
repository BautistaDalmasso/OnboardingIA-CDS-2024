from io import BytesIO
from fastapi import APIRouter, Depends, Response
from fastapi.security import HTTPBearer

from app.file_paths import DATABASE_PATH
from app.middlewares import verify_token
from app.qr_code.qr_code_service import QrCodeService
from app.user.user_dtos import TokenDataDTO


router = APIRouter(prefix="/qr", tags=["QR Code"])

qr_service = QrCodeService(DATABASE_PATH)


@router.get("")
async def get_qr(token=Depends(HTTPBearer())):
    user_data: TokenDataDTO = await verify_token(token.credentials)

    image = qr_service.make_qr(user_data.email)

    img_bytes_io = BytesIO()
    image.save(img_bytes_io, format="PNG")
    img_bytes_io.seek(0)

    return Response(content=img_bytes_io.getvalue(), media_type="image/png")
