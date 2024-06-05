from enum import auto
from pathlib import Path
from typing import Any
from app.catalogue.browse_catalogue_service import BrowseCatalogueService
from app.database.database_user import DatabaseUser
from app.loan_management.book_loans_dtos import LOAN_STATUS, LoanInformationDTO
from app.models import auto_index


class ConsultLoansService(DatabaseUser):
    def __init__(self, db_path: Path, catalogue_path: Path) -> None:
        super().__init__(db_path)
        self._catalogue_service = BrowseCatalogueService(catalogue_path)

    def consult_all_book_loans(self) -> list[LoanInformationDTO]:
        loans = self.query_multiple_rows(
            """SELECT loan.*, bookInventory.isbn
            FROM loan
            INNER JOIN bookInventory ON loan.inventoryNumber = bookInventory.inventoryNumber""",
            tuple(),
        )
        return [self.create_loan_data(entry) for entry in loans]

    def consult_book_loans_by_id(self, id: int) -> LoanInformationDTO:
        loan = self.query_database(
            """SELECT loan.*, bookInventory.isbn
            FROM loan
            INNER JOIN bookInventory ON loan.inventoryNumber = bookInventory.inventoryNumber
            WHERE loan.id = ?""",
            (id,),
        )
        return self.create_loan_data(loan)

    def consult_book_loans_by_user_email(self, email: str) -> list[LoanInformationDTO]:
        loans = self.query_multiple_rows(
            """SELECT loan.*, bookInventory.isbn
            FROM loan
            INNER JOIN bookInventory ON loan.inventoryNumber = bookInventory.inventoryNumber
            WHERE loan.userEmail = ?""",
            (email,),
        )
        return [self.create_loan_data(entry) for entry in loans]

    def get_loan_by_inventory_number_and_status(
        self, inventory_number: int, status: LOAN_STATUS
    ) -> LoanInformationDTO | None:

        loan = self.query_database(
            """SELECT loan.*, bookInventory.isbn
               FROM loan
               INNER JOIN bookInventory ON loan.inventoryNumber = bookInventory.inventoryNumber
               WHERE loan.inventoryNumber = ? AND loanStatus = ?
            """,
            (inventory_number, status),
        )

        if loan:
            return self.create_loan_data(loan)
        else:
            return None

    def create_loan_data(self, db_entry: list[Any]) -> LoanInformationDTO:
        catalogue_data = self._catalogue_service.browse_by_isbn(
            db_entry[CLBEI.isbn.value]
        )
        return LoanInformationDTO(
            id=db_entry[CLBEI.id.value],
            catalogue_data=catalogue_data,
            inventory_number=db_entry[CLBEI.inventory_number.value],
            expiration_date=db_entry[CLBEI.expiration_date.value],
            user_email=db_entry[CLBEI.user_email.value],
            loan_status=db_entry[CLBEI.loan_status.value],
            reservation_date=db_entry[CLBEI.reservation_date.value],
            checkout_date=db_entry[CLBEI.checkout_date.value],
            return_date=db_entry[CLBEI.return_date.value],
        )


class CLBEI(auto_index):
    """Consult Loans By Email Indexes"""

    id = auto()
    inventory_number = auto()
    expiration_date = auto()
    user_email = auto()
    loan_status = auto()
    reservation_date = auto()
    checkout_date = auto()
    return_date = auto()
    isbn = auto()
