import os
import sqlite3
from typing import Any

DATABASE_PATH = "sqlite.db"


def initialize_database():
    if not os.path.exists(DATABASE_PATH):
        open(DATABASE_PATH, "a").close()

    conn = sqlite3.connect(DATABASE_PATH)
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  firstName TEXT,
                  lastName TEXT,
                  email TEXT UNIQUE,
                  password TEXT,
                  challengeKey TEXT,
                  dni TEXT)"""
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
    conn.close()


def query_database(query: str, args: tuple[Any]) -> list[Any]:
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        c = conn.cursor()
        c.execute(query, args)
        data = c.fetchone()
        return data
    finally:
        conn.close()


def execute_in_database(command: str, args: tuple[Any]) -> None:
    try:
        conn = sqlite3.connect(DATABASE_PATH)

        with conn:
            conn.execute(command, args)
    finally:
        conn.close()
