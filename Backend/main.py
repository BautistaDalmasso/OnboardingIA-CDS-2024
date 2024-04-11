import uvicorn

from app.ai.trainer import train
from app.server_config import ServerConfig

if __name__ == "__main__":
    action = input(
        "\n ------------------ \n0) Start server. \n1) Train model.\nSelect action: "
    )

    if action == "1":
        train()
    else:
        server_config = ServerConfig()

        uvicorn.run(
            "app.api:app",
            host=server_config.get_server_ip(),
            port=server_config.get_server_port(),
            reload=False,
        )
