from datetime import datetime

import pytest
from app.loan_management.book_loans_service import NoCopiesAvailable
from app.loan_management.book_loans_dtos import ReservationRequestDTO

from tests.common_fixtures import loan_librarian_service

LOAN = 0
LIBRARIAN = 1

# TODO: DeprecationWarning: The default datetime adapter is deprecated as of Python 3.12; see the sqlite3 documentation for suggested replacement recipes
pytestmark = pytest.mark.filterwarnings("ignore")


def test_book_is_loaned(loan_librarian_service):
    isbn = "9500420457"
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplar(isbn)
    loanDTO = ReservationRequestDTO(
        isbn=isbn,
        expiration_date=datetime.fromisoformat("2024-05-15T12:30:00Z"),
        user_email=user_email,
    )

    loan_librarian_service[LOAN].reserve_book(loanDTO)

    loans = loan_librarian_service[LOAN].consult_book_loans_by_user_email(user_email)

    assert loans[0].title == "Prólogos con un prólogo de prólogos"


def test_book_is_not_over_loaned(loan_librarian_service):
    isbn = "9500420457"
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplar(isbn)

    loanDTO = ReservationRequestDTO(
        isbn=isbn,
        expiration_date=datetime.fromisoformat("2024-05-15T12:30:00Z"),
        user_email=user_email,
    )

    loan_librarian_service[LOAN].reserve_book(loanDTO)

    with pytest.raises(NoCopiesAvailable):
        loan_librarian_service[LOAN].reserve_book(loanDTO)


def test_consult_multiple_loans(loan_librarian_service):
    isbns = ["9500420457", "9879243501"]
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplars(isbns)
    loanDTO = ReservationRequestDTO(
        isbn=isbns[0],
        expiration_date=datetime.fromisoformat("2024-05-15T12:30:00Z"),
        user_email=user_email,
    )

    loan_librarian_service[LOAN].reserve_book(loanDTO)
    loanDTO.isbn = isbns[1]
    loan_librarian_service[LOAN].reserve_book(loanDTO)

    loans = loan_librarian_service[LOAN].consult_book_loans_by_user_email(user_email)

    assert loans[1].title == "Exámen de residencia"
    assert loans[0].title == "Prólogos con un prólogo de prólogos"
