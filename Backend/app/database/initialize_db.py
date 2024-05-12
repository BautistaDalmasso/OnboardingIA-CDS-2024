from pathlib import Path

from app.database.database_actions import execute_in_database


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
        "CREATE INDEX IF NOT EXISTS email_index ON users(email);",
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

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS licenceRequirements
                    (isbn TEXT PRIMARY KEY,
                    licenceLevel INTEGER)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS loans
                (isbn TEXT,
                copyId TEXT,
                expirationDate DATE,
                userEmail TEXT,
                PRIMARY KEY (isbn, expirationDate))""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS requested_books
                (isbn TEXT,
                copyId TEXT,
                userEmail TEXT,
                PRIMARY KEY (isbn, userEmail))""",
        tuple(),
        db_path,
    )
