export enum LoanStatusCode {
  RESERVED = "reserved",
  LOANED = "loaned",
  RESERVATION_CANCELED = "reservation_canceled",
  LOAN_RETURN_OVERDUE = "loan_return_overdue",
  RETURNED = "returned",
}

export enum LoanCodeToStr {
  RESERVED = "Reservado",
  LOANED = "En Préstamo",
  RESERVATION_CANCELED = "Reserva Cancelada",
  LOAN_RETURN_OVERDUE = "Devolución Retrasada",
  RETURNED = "Devuelto",
}

const convertLoanStatusToString = (loanStatusCode: LoanStatusCode): string => {
  switch (loanStatusCode) {
    case LoanStatusCode.RESERVED:
      return LoanCodeToStr.RESERVED;
    case LoanStatusCode.LOANED:
      return LoanCodeToStr.LOANED;
    case LoanStatusCode.RESERVATION_CANCELED:
      return LoanCodeToStr.RESERVATION_CANCELED;
    case LoanStatusCode.LOAN_RETURN_OVERDUE:
      return LoanCodeToStr.LOAN_RETURN_OVERDUE;
    case LoanStatusCode.RETURNED:
      return LoanCodeToStr.RETURNED;
    default:
      return "Unknown Status";
  }
};

export default convertLoanStatusToString;
