import { LoanStatusCode } from "../enums/loanStatus";
import { IMarcBook } from "./Book";

export interface ILoanInformation {
  inventory_number: number;
  catalogue_data: IMarcBook;
  expiration_date: Date;
  user_email: string;
  loan_status: LoanStatusCode;
  detail?: string;
  id: number;
  reservation_date: Date;
  checkout_date: Date;
  return_date: Date;
}

export interface IBookReturnRequestDTO {
  inventory_number: number;
}

export interface IBookReturnResponseDTO {
  success: boolean;
  detail?: string;
}
