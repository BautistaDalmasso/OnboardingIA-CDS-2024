from pathlib import Path

APP_DIR = Path(".") / "app"

CONFIG_FILE = APP_DIR / "server_config.json"

DATA_DIR = APP_DIR / "ai" / "data"
TOPICS_FILE = DATA_DIR / "topics.json"
MODEL_PATH = DATA_DIR / "skynet.h5"
WORDS_FILE = DATA_DIR / "words.pkl"
TOPIC_TYPES_FILE = DATA_DIR / "topic_types.pkl"
