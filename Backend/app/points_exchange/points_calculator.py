from datetime import datetime
from app.points_exchange.points import (
    DEFAULT_POINTS,
    POINTS_PER_EARLY_DAY,
    RESERVATION_CANCELED_POINTS,
)
from app.loan_management.book_loans_dtos import LoanInformationDTO


def calculate_points_for_returned_book(
    loan: LoanInformationDTO, today: datetime = datetime.today()
) -> int:
    if _is_reservation_canceled(loan, today=today):
        return RESERVATION_CANCELED_POINTS
    elif _is_reservation_returned_in_time(loan, today=today):
        return _reservation_returned_in_time_points(loan, today=today)
    else:
        return DEFAULT_POINTS


def _is_reservation_canceled(loan: LoanInformationDTO, today: datetime) -> bool:
    days_before_expiry = (loan.expiration_date - today).days

    return (
        (loan.checkout_date is None and loan.return_date is None)
        and (today < loan.expiration_date)
        and days_before_expiry < 5
    )


def _is_reservation_returned_in_time(loan: LoanInformationDTO, today: datetime) -> bool:
    return (loan.checkout_date is not None and loan.return_date is not None) and (
        today <= loan.expiration_date
    )


def _reservation_returned_in_time_points(
    loan: LoanInformationDTO, today: datetime
) -> bool:
    days_before_expiry = (loan.expiration_date - today).days

    if days_before_expiry > 5:
        return 0

    return days_before_expiry * POINTS_PER_EARLY_DAY
