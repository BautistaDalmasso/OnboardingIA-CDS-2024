from .server_config import ServerConfig

server_config = ServerConfig()

SECRET_KEY = server_config.get_jwt_secret()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
