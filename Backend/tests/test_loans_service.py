from datetime import datetime

import pytest
from app.loan_management.manage_loans_service import NoCopiesAvailable
from app.loan_management.book_loans_dtos import ReservationRequestDTO

from tests.common_fixtures import loan_librarian_service

MANAGE = 0
LIBRARIAN = 1
CONSULT = 2

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

    loan_librarian_service[MANAGE].reserve_book(loanDTO)

    loans = loan_librarian_service[CONSULT].consult_book_loans_by_user_email(user_email)

    assert loans[0].catalogue_data.title == "Prólogos con un prólogo de prólogos"


def test_book_is_not_over_loaned(loan_librarian_service):
    isbn = "9500420457"
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplar(isbn)

    loanDTO = ReservationRequestDTO(
        isbn=isbn,
        expiration_date=datetime.fromisoformat("2024-05-15T12:30:00Z"),
        user_email=user_email,
    )

    loan_librarian_service[MANAGE].reserve_book(loanDTO)

    with pytest.raises(NoCopiesAvailable):
        loan_librarian_service[MANAGE].reserve_book(loanDTO)


def test_consult_multiple_loans(loan_librarian_service):
    isbns = ["9500420457", "9879243501"]
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplars(isbns)
    loanDTO = ReservationRequestDTO(
        isbn=isbns[0],
        expiration_date=datetime.fromisoformat("2024-05-15T12:30:00Z"),
        user_email=user_email,
    )

    loan_librarian_service[MANAGE].reserve_book(loanDTO)
    loanDTO.isbn = isbns[1]
    loan_librarian_service[MANAGE].reserve_book(loanDTO)

    loans = loan_librarian_service[CONSULT].consult_book_loans_by_user_email(user_email)

    assert loans[1].catalogue_data.title == "Exámen de residencia"
    assert loans[0].catalogue_data.title == "Prólogos con un prólogo de prólogos"


def test_lend_book_manually (loan_librarian_service):
    isbn = "9500420457"
    nro_inventory= "1"
    user_email = "test@test.com"
    loan_librarian_service[LIBRARIAN].add_exemplar(isbn, nro_inventory )
    valid_loan=loan_librarian_service[MANAGE].check_valid_loan(nro_inventory,user_email)
    loaned_book=loan_librarian_service[MANAGE].lend_book(valid_loan)
    loans = loan_librarian_service[CONSULT].consult_book_loans_by_user_email(user_email)
    
    assert loans[0].user_email==loaned_book.user_email
    assert loans[0].inventory_number==loaned_book.inventory_number
    assert loans[0].loan_status==loaned_book.loan_status
    assert loans[0].reservation_date==loaned_book.reservation_date
    assert loans[0].checkout_date==loaned_book.checkout_date
    
    
    

    
    
