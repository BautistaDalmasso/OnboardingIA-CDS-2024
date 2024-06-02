import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IReservationRequest, ILoanValid } from "../common/interfaces/Book";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";

export class LoanService {
  private static baseRoute: string = `${ServerAddress}loans`;

  constructor() {}
  static async requestBookReservation(
    book: IReservationRequest,
    token: string,
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
}
