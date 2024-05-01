from pathlib import Path
import sqlite3

from app.database_actions import execute_in_database


def initialize_database(db_path: Path) -> None:
    if not db_path.exists():
        open(db_path, "a").close()

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstName TEXT,
                    lastName TEXT,
                    email TEXT UNIQUE,
                    password TEXT,
                    challengeKey TEXT,
                    dni TEXT,
                    faceID TEXT,
                    licenceLevel INTEGER,
                    role TEXT)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS deviceRSAS
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    deviceUID INTEGER,
                    publicRSA TEXT,
                    UNIQUE(email, deviceUID))""",
        tuple(),
        db_path,
    )
