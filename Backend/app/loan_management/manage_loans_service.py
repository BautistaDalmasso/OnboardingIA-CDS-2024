from datetime import datetime, timezone
import sqlite3
from app.loan_management.consult_loans_service import ConsultLoansService
from app.points_exchange.point_addition_service import PointAdditionService
from app.points_exchange.points_calculator import calculate_points_for_returned_book
from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from .book_loans_dtos import (
    LOAN_STATUS,
    PCDI,
    ReservationRequestDTO,
    LoanInformationDTO,
    PhysicalCopyDTO,
    LoanValidDTO,
)
from pathlib import Path
from app.database.database_user import DatabaseUser


class BookNotFound(Exception):
    pass


class LoanNotFound(Exception):
    pass


class NoCopiesAvailable(Exception):
    pass


class BookAlreadyReturned(Exception):
    pass


class UnkwnownFilter(Exception):
    pass


class LoanService(DatabaseUser):
    def __init__(self, db_path: Path, catalogue_path: Path) -> None:
        super().__init__(db_path)
        self._catalogue_service = BrowseCatalogueService(catalogue_path)
        self._point_addition_service = PointAdditionService(db_path)
        self._consult_loans_service = ConsultLoansService(db_path, catalogue_path)

    def reserve_book(self, book_request: ReservationRequestDTO) -> LoanInformationDTO:
        """Mark a copy of a book as reserved.."""
        copy_data = self._find_available_copy_data(book_request.isbn)
        catalogue_data = self._catalogue_service.browse_by_isbn(book_request.isbn)

        loan_status: LOAN_STATUS = "reserved"
        today = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        loan_information = LoanInformationDTO(
            inventory_number=copy_data.inventoryNumber,
            catalogue_data=catalogue_data,
            expiration_date=book_request.expiration_date,
            user_email=book_request.user_email,
            loan_status=loan_status,
            reservation_date=today,
            checkout_date=None,
            return_date=None,
        )

        self.execute_in_database(
            """INSERT INTO loan (inventoryNumber, expirationDate, userEmail, loanStatus, reservationDate)
                        VALUES (?, ?, ?, ?,?)""",
            (
                loan_information.inventory_number,
                loan_information.expiration_date,
                loan_information.user_email,
                loan_information.loan_status,
                loan_information.reservation_date,
            ),
        )

        return loan_information

    def _find_available_copy_data(self, isbn) -> PhysicalCopyDTO:

        with self.transaction() as cursor:
            cursor.execute(
                """SELECT * FROM bookInventory
                WHERE isbn = ? AND status = ?""",
                (isbn, "available"),
            )
            data = cursor.fetchone()

            if data is None:
                raise NoCopiesAvailable(
                    f"Libro con isbn: {isbn} no tiene copias disponibles."
                )

            copy_data = PhysicalCopyDTO(
                inventoryNumber=data[PCDI.inventoryNumber.value],
                isbn=data[PCDI.isbn.value],
                status=data[PCDI.status.value],
            )

            cursor.execute(
                """UPDATE bookInventory SET status = ? WHERE inventoryNumber = ?""",
                ("borrowed", copy_data.inventoryNumber),
            )

            copy_data.status = "borrowed"
            return copy_data

    def return_book(
        self, inventory_number: int, today: datetime = datetime.now(timezone.utc)
    ):

        actual_loan_status = "loaned"
        new_loan_status = "returned"

        loan = self._consult_loans_service.get_loan_by_inventory_number_and_status(
            inventory_number,
            status=actual_loan_status,
        )

        if loan is None:
            raise LoanNotFound(
                f"Libro con número de inventario {inventory_number} no se encuentra en préstamo."
            )

        self.execute_in_database(
            """UPDATE loan
            SET loanStatus=?, returnDate=?
            WHERE inventoryNumber=? AND loanStatus=?""",
            (new_loan_status, today, inventory_number, actual_loan_status),
        )
        self.execute_in_database(
            """UPDATE bookInventory
            SET status=?
            WHERE inventoryNumber=?""",
            ("available", inventory_number),
        )

        points = calculate_points_for_returned_book(loan, today=today)
        self._point_addition_service.apply_points(loan.user_email, points)

    def set_status_loaned(self, loan_id: int, due_date: datetime):
        loan_status = "loaned"
        checkout_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        date_not_aviable = None
        try:
            connection = sqlite3.connect(self._db_path)
            cursor = connection.cursor()
            cursor.execute("BEGIN")

            cursor.execute(
                """UPDATE loan
                SET loanStatus = ?, expirationDate = ? , checkoutDate = ?, returnDate = ?
                WHERE id = ? """,
                (loan_status, due_date, checkout_date, date_not_aviable, loan_id),
            )
            cursor.execute("""COMMIT""")

        except sqlite3.Error as e:
            if connection:
                connection.rollback()
            print(f"An error occurred: {e}")

        finally:
            cursor.close()
            connection.close()

    def lend_book(self, book: LoanValidDTO) -> LoanInformationDTO:
        loan_status: LOAN_STATUS = "loaned"
        today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        self.execute_in_database(
            """UPDATE bookInventory
                SET status = ?
                WHERE inventoryNumber = ?""",
            ("borrowed", book.inventory_number),
        )

        self.execute_in_database(
            """INSERT INTO loan (inventoryNumber,expirationDate, userEmail, loanStatus, reservationDate ,checkoutDate)
                            VALUES (?, ?, ?, ?, ?, ?)""",
            (
                book.inventory_number,
                book.expiration_date,
                book.user_email,
                loan_status,
                today_str,
                today_str,
            ),
        )
        catalogue_data = self._catalogue_service.browse_by_isbn(book.isbn)
        return LoanInformationDTO(
            inventory_number=book.inventory_number,
            catalogue_data=catalogue_data,
            expiration_date=book.expiration_date,
            user_email=book.user_email,
            loan_status=loan_status,
            reservation_date=today_str,
            checkout_date=today_str,
            return_date=None,
        )

    def check_valid_loan(
        self, inventory_number: int, user_email: str
    ) -> LoanValidDTO | None:
        book = self.query_database(
            """SELECT inventoryNumber, isbn
                FROM bookInventory
                WHERE inventoryNumber = ? AND status =?  """,
            (inventory_number, "available"),
        )

        if bool(book):
            return LoanValidDTO(
                inventory_number=inventory_number,
                user_email=user_email,
                isbn=book[1],
                licence_level=1,
                expiration_date=None,
            )
        else:
            return None

    def consult_limit_by_user_email(self, email: str) -> bool:
        cant_reserved_loans = self.query_database(
            """SELECT COUNT(*)
                FROM loan
                WHERE userEmail = ?
                AND loanStatus = ? AND returnDate IS NULL""",
            (email, "reserved"),
        )
        cant_loaned_books = self.query_database(
            """SELECT COUNT(*)
                FROM loan
                WHERE userEmail = ?
                AND loanStatus = ? AND returnDate IS NULL""",
            (email, "loaned"),
        )

        # TODO: fix
        if cant_reserved_loans[0] >= 3 or cant_loaned_books[0] >= 3:
            return False
        else:
            return True