from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.server_config import ServerConfig
from app.facial_profile import facial_profile_router

server_config = ServerConfig()

app = FastAPI()

origins = server_config.get_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(facial_profile_router.router)
