from datetime import datetime, timedelta
import pytest
from app.catalogue.book_models import MarcBookData
from app.loan_management.book_loans_dtos import LoanInformationDTO
from app.loan_management.points_calculator import (
    DEFAULT_POINTS,
    POINTS_PER_EARLY_DAY,
    RESERVATION_CANCELED_POINTS,
    calculate_points_for_returned_book,
)


def test_calc_points_canceled_reservation_too_soon(generic_loan):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=6)
    generic_loan.expiration_date = current_date + delta

    points = calculate_points_for_returned_book(generic_loan, today=current_date)
    assert points == DEFAULT_POINTS


def test_calc_points_canceled_reservation(generic_loan):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=4)
    generic_loan.expiration_date = current_date + delta

    points = calculate_points_for_returned_book(generic_loan, today=current_date)
    assert points == RESERVATION_CANCELED_POINTS


def test_calc_points_loan_returned_too_soon(generic_loan):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=6)
    generic_loan.expiration_date = current_date + delta

    generic_loan.checkout_date = current_date
    generic_loan.return_date = current_date
    generic_loan.loan_status = "returned"

    points = calculate_points_for_returned_book(generic_loan, current_date)

    assert points == 0


def test_calc_points_loan_returned_before_expiry(generic_loan):
    current_date = datetime(2024, 12, 31)
    delta = timedelta(days=5)
    generic_loan.expiration_date = current_date + delta

    generic_loan.checkout_date = current_date
    generic_loan.return_date = current_date
    generic_loan.loan_status = "returned"

    points = calculate_points_for_returned_book(generic_loan, current_date)

    assert points == POINTS_PER_EARLY_DAY * 5


@pytest.fixture
def generic_loan():
    return LoanInformationDTO(
        inventory_number=1,
        user_email="user@email.com",
        catalogue_data=MarcBookData(
            isbn="1",
            title="Book",
            place="Argentina",
            publisher="Skynet",
            date_issued="2024",
            edition=None,
            abstract=None,
            description="0 p.",
            ddc_class="000",
            authors=[],
            topics=[],
        ),
        loan_status="reserved",
        expiration_date=datetime.today(),
        reservation_date=None,
        checkout_date=None,
        return_date=None,
    )
