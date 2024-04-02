import json

from app.file_paths import CONFIG_FILE


class ServerConfig:

    def __init__(self) -> None:
        self._configs = _load_config()

    def get_origins(self) -> list[str]:
        return self._configs["request_origins"][0]

    def get_server_ip(self) -> str:
        return self._configs["server_ip"]

    def get_server_port(self) -> int:
        return self._configs["server_port"]

    def get_jwt_secret(self) -> int:
        return self._configs["jwt_secret"]


def _load_config():
    with open(CONFIG_FILE) as config_file:
        configs = json.loads(config_file.read())

    return configs
