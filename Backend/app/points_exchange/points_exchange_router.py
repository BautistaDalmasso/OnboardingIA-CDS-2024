from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.file_paths import DATABASE_PATH
from app.middlewares import verify_token
from app.points_exchange.point_exchange_service import (
    InsufficientPoints,
    PointExchangeService,
)
from app.user.user_dtos import LOGIN_RESPONSE, TokenDataDTO


router = APIRouter(prefix="/points_exchange", tags=["Points Exchange"])

point_exchange_service = PointExchangeService(DATABASE_PATH)


@router.post("/trusted_licence", response_model=LOGIN_RESPONSE)
async def exchange_points_for_trusted_licence(token=Depends(HTTPBearer())):
    token_data: TokenDataDTO = await verify_token(token.credentials)

    try:
        result = point_exchange_service.exchange_for_trusted_licence(token_data)
    except InsufficientPoints as e:
        raise HTTPException(
            status_code=400,
            detail="El usuario no tiene puntos suficientes para esta acción",
        )

    return result
