from pathlib import Path
import sqlite3
from typing import Any

from app.file_paths import DATABASE_PATH

default_database = DATABASE_PATH


def initialize_database(db_path: Path) -> None:
    if not db_path.exists():
        open(db_path, "a").close()

    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute(
            """CREATE TABLE IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstName TEXT,
                    lastName TEXT,
                    email TEXT UNIQUE,
                    password TEXT,
                    challengeKey TEXT,
                    dni TEXT,
                    faceID TEXT)"""
        )
        c.execute(
            """CREATE TABLE IF NOT EXISTS deviceRSAS
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    deviceUID INTEGER,
                    publicRSA TEXT,
                    UNIQUE(email, deviceUID))"""
        )
        conn.commit()
    finally:
        conn.close()


def query_database(query: str, args: tuple[Any]) -> list[Any]:
    try:
        conn = sqlite3.connect(default_database)
        c = conn.cursor()
        c.execute(query, args)
        data = c.fetchone()
        return data
    finally:
        conn.close()


def execute_in_database(command: str, args: tuple[Any]) -> None:
    try:
        conn = sqlite3.connect(default_database)

        with conn:
            conn.execute(command, args)
    finally:
        conn.close()
