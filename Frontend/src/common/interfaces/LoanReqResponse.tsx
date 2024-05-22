import { LoanStatusCode } from "../enums/loanStatus";
import { IMarcBook } from "./Book";

export interface ILoanInformation {
  id: number;
  inventory_number: number;
  catalogue_data: IMarcBook;
  expiration_date: Date;
  user_email: string;
  loan_status: LoanStatusCode;
  detail?: string;
}
