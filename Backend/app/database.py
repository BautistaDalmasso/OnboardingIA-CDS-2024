import os
import sqlite3

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
                  email TEXT UNIQUE,
                  deviceUID TEXT,
                  publicRSA TEXT)"""
    )
    conn.commit()
    conn.close()
