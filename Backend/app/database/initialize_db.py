from pathlib import Path

from app.librarian.librarian_service import LibrarianService
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
                    role TEXT,
                    lastPermissionUpdate DATE,
                    points INTEGER,
                    loanLimit INTEGER )""",
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
        """CREATE TABLE IF NOT EXISTS bookInventory
            (inventoryNumber INTEGER PRIMARY KEY AUTOINCREMENT,
             isbn TEXT,
             status TEXT)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE INDEX IF NOT EXISTS idx_bookInventory_isbn
        ON bookInventory (isbn)""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS loan
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                inventoryNumber INTEGER,
                expirationDate DATE,
                userEmail TEXT,
                loanStatus TEXT,
                reservationDate DATE,
                checkoutDate DATE,
                returnDate DATE,
                FOREIGN KEY (inventoryNumber) REFERENCES bookInventory(inventoryNumber),
                FOREIGN KEY (userEmail) REFERENCES users(Email),
                UNIQUE(inventoryNumber, expirationDate));""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE INDEX IF NOT EXISTS idx_loan_userEmail ON loan (userEmail);""",
        tuple(),
        db_path,
    )

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS loginLog
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            userEmail TEXT,
            userLicence INTEGER,
            userRole TEXT,
            time TEXT)""",
        tuple(),
        db_path,
    )
