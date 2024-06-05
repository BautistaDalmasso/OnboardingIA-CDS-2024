from datetime import datetime, timedelta
import sqlite3
import pytest

from app.loan_management.consult_loans_service import ConsultLoansService
from app.points_exchange.points import (
    LOAN_OVERDUE_PER_DAY_PENALITY,
    RESERVATION_OVERDUE_PENALITY,
)
from app.user.user_dtos import CreateUserDTO
from app.user.user_service import UserService
from app.database.initialize_db import initialize_database
from app.file_paths import CATALOGUE_PATH, TEST_DB_PATH
from app.librarian.librarian_service import LibrarianService
from app.loan_management.book_loans_dtos import ReservationRequestDTO
from app.loan_management.manage_loans_service import LoanService
from app.loan_management.loan_parser import LoanParser

# TODO: DeprecationWarning: The default datetime adapter is deprecated as of Python 3.12; see the sqlite3 documentation for suggested replacement recipes
pytestmark = pytest.mark.filterwarnings("ignore")

PARSER = 0
MANAGE = 1
CONSULT = 2


def test_reservation_is_canceled(parser_service):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=1)
    parser_service[MANAGE].reserve_book(
        ReservationRequestDTO(
            isbn="9789875662445",
            expiration_date=current_date - delta,
            user_email="user@email.com",
        )
    )

    parser_service[PARSER].parse_non_historic_loans(today=current_date)

    all_loans = parser_service[CONSULT].consult_all_book_loans()

    assert all_loans[0].loan_status == "reservation_canceled"
    assert UserService(TEST_DB_PATH).get_user_by_email(
        "user@email.com"
    ).points == RESERVATION_OVERDUE_PENALITY * (-1)
    # Ensure copy is marked as available.
    parser_service[MANAGE].reserve_book(
        ReservationRequestDTO(
            isbn="9789875662445",
            expiration_date=current_date,
            user_email="user@email.com",
        )
    )


def test_reservation_is_not_canceled(parser_service):
    current_date = datetime(2024, 12, 31)
    parser_service[MANAGE].reserve_book(
        ReservationRequestDTO(
            isbn="9789875662445",
            expiration_date=current_date,
            user_email="user@email.com",
        )
    )

    parser_service[PARSER].parse_non_historic_loans(today=current_date)

    all_loans = parser_service[CONSULT].consult_all_book_loans()

    assert all_loans[0].loan_status == "reserved"


def test_loan_is_marked_as_overdue(parser_service):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=1)
    # TODO: change when borrowed status changing is implemented
    make_loaned_book(current_date - delta)

    parser_service[PARSER].parse_non_historic_loans(today=current_date)

    all_loans = parser_service[CONSULT].consult_all_book_loans()

    assert all_loans[0].loan_status == "loan_return_overdue"
    assert UserService(TEST_DB_PATH).get_user_by_email(
        "user@email.com"
    ).points == LOAN_OVERDUE_PER_DAY_PENALITY * (-1)


def test_loan_is_not_marked_as_overdue(parser_service):
    current_date = datetime(2024, 12, 31)
    # TODO: change when borrowed status changing is implemented
    make_loaned_book(current_date)

    parser_service[PARSER].parse_non_historic_loans(today=current_date)

    all_loans = parser_service[CONSULT].consult_all_book_loans()

    assert all_loans[0].loan_status == "loaned"


def test_overdue_loan_is_penalized(parser_service):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=1)
    # TODO: change when borrowed status changing is implemented
    make_loaned_book(current_date - delta)

    parser_service[PARSER].parse_non_historic_loans(today=current_date)
    parser_service[PARSER].parse_non_historic_loans(today=current_date)

    all_loans = parser_service[CONSULT].consult_all_book_loans()

    assert all_loans[0].loan_status == "loan_return_overdue"
    assert UserService(TEST_DB_PATH).get_user_by_email(
        "user@email.com"
    ).points == LOAN_OVERDUE_PER_DAY_PENALITY * 2 * (-1)


def make_loaned_book(expiration_date: datetime):
    connection = sqlite3.connect(TEST_DB_PATH)
    cursor = connection.cursor()

    cursor.execute(
        """INSERT INTO loan (inventoryNumber, expirationDate, userEmail, loanStatus)
                        VALUES (?, ?, ?, ?)""",
        (1, expiration_date, "user@email.com", "loaned"),
    )

    cursor.execute("COMMIT")
    cursor.close()
    connection.close()


@pytest.fixture
def parser_service():
    initialize_database(TEST_DB_PATH)

    add_books()
    create_user()

    try:
        yield (
            LoanParser(TEST_DB_PATH, CATALOGUE_PATH),
            LoanService(TEST_DB_PATH, CATALOGUE_PATH),
            ConsultLoansService(TEST_DB_PATH, CATALOGUE_PATH),
        )
    finally:
        TEST_DB_PATH.unlink()


def add_books():
    isbns = ["9789875662445", "9789501303445"]
    LibrarianService(TEST_DB_PATH).add_exemplars(isbns)


def create_user():
    UserService(TEST_DB_PATH).create_user(
        CreateUserDTO(
            firstName="User",
            lastName="User",
            email="user@email.com",
            password="123456",
        )
    )
