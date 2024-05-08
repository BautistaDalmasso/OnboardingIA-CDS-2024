export interface ILoanRequestResponse {
  message: string;
  detail?: string;
}

export interface ILoanInformationResponse {
  isbn: string;
  copy_id: string;
  title: string;
  expiration_date: Date;
  user_email: string;
}
