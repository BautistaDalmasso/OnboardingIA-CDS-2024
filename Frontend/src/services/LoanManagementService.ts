import { baseFetch } from "./fetch";
import { ILoanValid, IReservationRequest } from "../common/interfaces/Book";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";
import { LoanStatusCode } from "../common/enums/loanStatus";
import { ServerAddress } from "../common/consts/serverAddress";

export class LoanService {
  private static baseRoute: string = `${ServerAddress}loans`;

  constructor() {}

  static async requestBookReservation(
    book: IReservationRequest,
    token: string
  ) {
    try {
      const response = await baseFetch<IReservationRequest, ILoanInformation>({
        url: `${this.baseRoute}/reserve`,
        method: "POST",
        data: book,
        token,
      });
      return response;
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      throw new Error("Error al realizar la solicitud");
    }
  }

  static async setLoanStatusReserved(
    loan_id: number,
    due_date: string,
    token: string
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number; due_date: string }, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_reserved?loan_id=${loan_id}&due_date=${due_date}`,
      method: "PATCH",
      data: { loan_id, due_date },
    });
  }

  static async setLoanStatusLoaned(
    loan_id: number,
    due_date: string,
    token: string
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number; due_date: string }, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_loaned?loan_id=${loan_id}&due_date=${due_date}`,
      method: "PATCH",
      data: { loan_id, due_date },
    });
  }

  static async setLoanStatusReturned(
    loan_id: number,
    token: string
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number }, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_returned?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id },
    });
  }

  static async setLoanStatusReturnOverdue(
    loan_id: number,
    token: string
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number }, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_returned_overdue?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id },
    });
  }

  static async setLoanStatusReservationCanceled(
    loan_id: number,
    token: string
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number }, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_reservation_Canceled?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id },
    });
  }

  static async assignLoan(bookLoan: ILoanValid, token: string) {
    try {
      const book = await baseFetch<ILoanValid, ILoanInformation>({
        url: `${this.baseRoute}/assign_loan`,
        method: "POST",
        data: bookLoan,
        token,
      });
      return book;
    } catch (error) {
      console.error("Error en asignar Prestamo:", error);
      throw error;
    }
  }

  static async check_loan_valid(inventory_number: number, user_email: string) {
    try {
      const book = await baseFetch<void, ILoanValid>({
        url: `${this.baseRoute}/check_loan_valid?inventory_number=${inventory_number}&user_email=${user_email}`,
        method: "GET",
      });
      return book;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  static async checkLoanLimitation(token: string): Promise<boolean> {
    const value = await baseFetch<void, boolean>({
      url: `${this.baseRoute}/limitation_loans`,
      method: "GET",
      token,
    });
    return value;
  }
}
