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
}
