export interface ILoanRequestResponse {
  message: string;
  detail?: string;
}

export interface ILoanInformationResponse {
    id: number
    inventory_number: number
    title: string
    expiration_date: Date
    user_email: string
}
