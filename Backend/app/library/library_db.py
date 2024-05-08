from pathlib import Path
import random
import shutil

from app.file_paths import EXAMPLE_LIBRARY
from app.database.database_actions import execute_in_database


def initialize_database(db_path: Path) -> None:
    if not db_path.exists():
        shutil.copyfile(EXAMPLE_LIBRARY, db_path)

    execute_in_database(
        """CREATE TABLE IF NOT EXISTS books
            (isbn TEXT PRIMARY KEY,
            title TEXT,
            availableCopies INTEGER)""",
        tuple(),
        db_path,
    )
    execute_in_database(
        """CREATE TABLE IF NOT EXISTS physicalCopies
                (isbn TEXT,
                copyID TEXT,
                status TEXT,
                PRIMARY KEY (isbn, copyID))""",
        tuple(),
        db_path,
    )


def fill_database(entries: list[tuple[str, str]], db_path):
    """
        Support function to generate a library database, not meant to be used in prod.

        Pass a list of tuples of the form (isbn, title)

        ([('978-987-8266-77-0', 'Rayuela'), ('978-950-07-6717-0', 'Cien años de soledad'), ('978-987-8317-09-0', 'Sobre héroes y tumbas'), ('978-950-07-6720-0',
    'El amor en los tiempos del cólera'), ('978-950-07-6722-4', 'Crónica de una muerte anunciada'), ('978-631-90182-5-7', 'Martín Fierro')])
    """

    for entry in entries:
        copies = random.randint(1, 4)

        execute_in_database(
            """INSERT INTO books (isbn, title, availableCopies)
                      VALUES (?, ?, ?)""",
            (entry[0], entry[1], copies),
            db_path,
        )

        for i in range(copies + 1):
            execute_in_database(
                """INSERT INTO physicalCopies (isbn, copyID, status)
                      VALUES (?, ?, ?)""",
                (entry[0], str(i), "available"),
                db_path,
            )
