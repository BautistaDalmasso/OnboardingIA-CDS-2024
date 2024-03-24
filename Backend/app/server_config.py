import json

from app.file_paths import CONFIG_FILE


class ServerConfig:

    def __init__(self) -> None:
        self._configs = _load_config()

    def get_origins(self) -> list[str]:
        return self._configs["request_origins"]


def _load_config():
    with open(CONFIG_FILE) as config_file:
        configs = json.loads(config_file.read())

    return configs
