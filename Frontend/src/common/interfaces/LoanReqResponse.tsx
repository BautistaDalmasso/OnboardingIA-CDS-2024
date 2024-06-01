import { LoanStatusCode } from "../enums/loanStatus";
import { IMarcBook } from "./Book";

export interface ILoanInformation {
  inventory_number: number;
  catalogue_data: IMarcBook;
  expiration_date: Date;
  user_email: string;
  loan_status: LoanStatusCode;
  detail?: string;
}

export interface LoanValid {
  inventory_number: number;
  user_email: string;
}
