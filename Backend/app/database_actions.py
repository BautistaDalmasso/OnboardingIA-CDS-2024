from pathlib import Path
import sqlite3
from typing import Any


def query_database(query: str, args: tuple[Any], db_path: Path) -> list[Any]:
    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute(query, args)
        data = c.fetchone()
        return data
    finally:
        conn.close()


def execute_in_database(command: str, args: tuple[Any], db_path: Path) -> None:
    try:
        conn = sqlite3.connect(db_path)

        with conn:
            conn.execute(command, args)
    finally:
        conn.close()
