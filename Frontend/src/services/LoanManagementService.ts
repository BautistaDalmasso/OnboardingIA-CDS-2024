import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IReservationRequest } from "../common/interfaces/Book";
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

  static async assignLoan(
      inventory_number: number,
      user_email: string,
      token: string,
    ) {
      try {
        const book = await baseFetch<void,ILoanInformation>({
          token,
          url: `${this.baseRoute}/assign_loan?inventory_number=${inventory_number}&user_email=${user_email}`,
          method: "POST",
        });
        return book;
      } catch (error) {
        console.error("Error en asignar Prestamo:", error);
        throw error;
      }
    }
}
