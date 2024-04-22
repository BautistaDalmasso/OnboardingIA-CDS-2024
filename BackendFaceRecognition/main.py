import uvicorn

from app.server_config import ServerConfig

if __name__ == "__main__":
    server_config = ServerConfig()

    uvicorn.run(
        "app.api:app",
        host=server_config.get_server_ip(),
        port=server_config.get_server_port(),
        reload=False,
    )
