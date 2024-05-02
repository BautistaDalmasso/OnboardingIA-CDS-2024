from pathlib import Path
from typing import Any

from app.database.database_actions import execute_in_database, query_database


class DatabaseUser:
    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path

    def execute_in_database(self, command: str, args: tuple[Any]) -> None:
        execute_in_database(command, args, self._db_path)

    def query_database(self, query: str, args: tuple[Any]) -> list[Any]:
        return query_database(query, args, self._db_path)
