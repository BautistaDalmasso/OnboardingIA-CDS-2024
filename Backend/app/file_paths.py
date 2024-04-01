from pathlib import Path

APP_DIR = Path(".") / "app"

CONFIG_FILE = APP_DIR / "server_config.json"

DATA_DIR = APP_DIR / "ai" / "data"
TOPICS_FILE = DATA_DIR / "topics.json"
RESPONSES_FILE = DATA_DIR / "responses.json"
MODEL_PATH = DATA_DIR / "skynet.h5"
