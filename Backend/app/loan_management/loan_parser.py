from datetime import datetime
from pathlib import Path
from app.points_exchange.point_addition_service import apply_minus_points_in_transaction
from app.points_exchange.points import (
    LOAN_OVERDUE_PER_DAY_PENALITY,
    RESERVATION_OVERDUE_PENALITY,
)
from app.database.database_user import DatabaseUser
from app.loan_management.book_loans_dtos import LoanInformationDTO
from app.loan_management.book_loans_service import LoanService
from app.user.user_service import UserService


class LoanParser(DatabaseUser):
    def __init__(self, db_path: Path, catalogue_path: Path) -> None:
        super().__init__(db_path)
        self._loans_service = LoanService(db_path, catalogue_path)
        self._user_service = UserService(db_path)

    def parse_non_historic_loans(self, today=datetime.now()):
        non_historic_loans = self._get_all_loans()

        for loan in non_historic_loans:
            match loan.loan_status:
                case "reserved":
                    self._ensure_reservation_not_overdue(loan, today)
                case "loaned":
                    self._ensure_loan_not_overdue(loan, today)
                case "loan_return_overdue":
                    self._apply_overdue_point_penalty(loan)

    def _get_all_loans(self) -> list[LoanInformationDTO]:

        loans = self.query_multiple_rows(
            """SELECT loan.*, bookInventory.isbn
            FROM loan
            INNER JOIN bookInventory ON loan.inventoryNumber = bookInventory.inventoryNumber
            WHERE loan.loanStatus in ('reserved', 'loaned', 'loan_return_overdue')""",
            tuple(),
        )
        return [self._loans_service.create_loan_data(entry) for entry in loans]

    def _ensure_reservation_not_overdue(
        self, loan: LoanInformationDTO, today: datetime
    ):
        if loan.expiration_date >= today:
            return

        self._cancel_reservation(loan)

    def _cancel_reservation(self, loan: LoanInformationDTO):
        with self.transaction() as cursor:
            apply_minus_points_in_transaction(
                loan.user_email, RESERVATION_OVERDUE_PENALITY, cursor
            )

            cursor.execute(
                """UPDATE loan SET loanStatus=?
                           WHERE id=?""",
                ("reservation_canceled", loan.id),
            )

            cursor.execute(
                """UPDATE bookInventory SET status=?
                           WHERE inventoryNumber=?""",
                ("available", loan.inventory_number),
            )

    def _ensure_loan_not_overdue(self, loan: LoanInformationDTO, today: datetime):
        if loan.expiration_date >= today:
            return

        self._mark_loan_as_overdue(loan)

    def _mark_loan_as_overdue(self, loan: LoanInformationDTO):
        with self.transaction() as cursor:
            apply_minus_points_in_transaction(
                loan.user_email, LOAN_OVERDUE_PER_DAY_PENALITY, cursor
            )

            cursor.execute(
                """UPDATE loan SET loanStatus=?
                           WHERE id=?""",
                ("loan_return_overdue", loan.id),
            )

    def _apply_overdue_point_penalty(self, loan: LoanInformationDTO):
        with self.transaction() as cursor:
            apply_minus_points_in_transaction(
                loan.user_email, LOAN_OVERDUE_PER_DAY_PENALITY, cursor
            )
