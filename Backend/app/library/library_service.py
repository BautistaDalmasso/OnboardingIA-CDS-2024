import sqlite3
from typing import Any
from app.database.database_user import DatabaseUser
from app.library.library_models import BookData, PhysicalCopyData, LoanDTO,RequestedBookDTO
from app.database.database_actions import execute_in_database

class BookNotFound(Exception):
    pass


class NoCopiesAvailable(Exception):
    pass


class BookAlreadyReturned(Exception):
    pass


class LibraryService(DatabaseUser):

    def consult_book_data(self, isbn: str) -> BookData | None:
        bookEntry = self.query_database(
            """SELECT * FROM books WHERE isbn = ?""", (isbn,)
        )

        if bookEntry is not None:
            return create_book_data(bookEntry)
        return None

    def consult_all_books(self) -> list[BookData]:
        all_books = self.query_multiple_rows("""SELECT * FROM books""", tuple())

        return [create_book_data(entry) for entry in all_books]

    def consult_books_by_page(self, page_size: int, page_number: int):
        """Page numbering should start at 0"""
        selected_books = self.query_multiple_rows(
            f"""SELECT * FROM books
                                                  LIMIT {page_size} OFFSET {page_number*page_size}""",
            tuple(),
        )

        return [create_book_data(entry) for entry in selected_books]

    def get_number_of_books(self) -> int:

        return self.query_database("SELECT count(*) FROM books", tuple())[0]

    def borrow_book(self, isbn: str) -> PhysicalCopyData:
        """Mark a book as "borrowed". This is not the same as making a loan!

        Raises `BookNotFound` if the isbn doesn't match any book in the db.
        Raises `NoCopiesAvailable` if there are no copies of that book available.
        """
        connection = sqlite3.connect(self._db_path)
        cursor = connection.cursor()

        try:
            connection.execute("BEGIN")
            cursor.execute("SELECT * FROM books WHERE isbn = ?", (isbn,))
            data = cursor.fetchone()
            if data is None:
                raise BookNotFound(f"Book with isbn: {isbn} not found.")

            data = create_book_data(data)
            if data.available_copies <= 0:
                raise NoCopiesAvailable(
                    f"Book with isbn: {isbn} has no copies available."
                )

            cursor.execute(
                """SELECT * FROM physicalCopies
                           WHERE isbn = ? AND status = 'available' LIMIT 1""",
                (isbn,),
            )
            copy_data = create_copy_data(cursor.fetchone())

            cursor.execute(
                """UPDATE books SET availablecopies = availablecopies-1
                           WHERE isbn = ?""",
                (isbn,),
            )
            cursor.execute(
                """UPDATE physicalCopies SET status = 'borrowed'
                           WHERE isbn = ? AND copyID = ?""",
                (isbn, copy_data.copy_id),
            )

            connection.commit()

            copy_data.status = "borrowed"
            return copy_data
        except Exception as e:
            connection.rollback()
            print("Transaction rolled back due to error:", e)
            raise e
        finally:
            cursor.close()
            connection.close()

    def return_book(self, isbn: str, copy_id: str):
        """Mark a book as "available". This is not the same as returning a loan!"""
        connection = sqlite3.connect(self._db_path)
        cursor = connection.cursor()

        try:
            connection.execute("BEGIN")
            cursor.execute(
                """SELECT * FROM physicalCopies
                           WHERE isbn = ? AND copyId = ?""",
                (isbn, copy_id),
            )
            copy_data = create_copy_data(cursor.fetchone())

            if copy_data.status == "available":
                raise BookAlreadyReturned(
                    f"Copy with [isbn: {isbn} and copyId: {copy_id}] was already available."
                )

            cursor.execute(
                """UPDATE physicalCopies SET status = 'available'
                           WHERE isbn = ? AND copyID = ?""",
                (isbn, copy_id),
            )

            cursor.execute(
                """UPDATE books SET availablecopies = availablecopies+1
                           WHERE isbn = ?""",
                (isbn,),
            )

            connection.commit()
        except Exception as e:
            connection.rollback()
            print("Transaction rolled back due to error:", e)
            raise e
        finally:
            cursor.close()
            connection.close()


def create_book_data(db_entry: list[Any]) -> BookData:
    return BookData(
        isbn=db_entry[0],
        title=db_entry[1],
        available_copies=db_entry[2],
    )


def create_copy_data(db_entry: list[Any]) -> PhysicalCopyData:
    return PhysicalCopyData(
        isbn=db_entry[0],
        copy_id=db_entry[1],
        status=db_entry[2],
    )



def add_confirmed_loan(book:LoanDTO):
    try:
        execute_in_database(
            """INSERT INTO loans ( isbn, copy_id, expiration_date, user_email)
                     VALUES (?, ?, ?, ?)""",
            ( book.isbn,book.copy_id, book.expiration_date, book.user_email),
        )
        return { 
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "expiration_date": book.expiration_date,
            "user_email": book.user_email,
        }
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un prestamo realizado"}


def add_requested_book(book: RequestedBookDTO):
    try:
        execute_in_database(
            """INSERT INTO requested_books (isbn, copy_id, user_email)
                        VALUES (?, ?, ?, ?)""",
            ( book.isbn, book.copy_id, book.user_email),
        )
        return {
            "isbn": book.isbn,
            "copy_id": book.copy_id,
            "userEmail": book.user_email,
        }
        
    except sqlite3.IntegrityError:
        return {"error": "Error al registrar un libro solicitado"}
    
    
   