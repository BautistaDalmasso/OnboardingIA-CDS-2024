export interface ILoanInformation {
  id: number;
  inventory_number: number;
  isbn: string;
  title: string;
  expiration_date: Date;
  user_email: string;
  loan_status: string;
  detail?: string;
}
