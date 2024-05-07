import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IRequestedBook, ILoan } from "../common/interfaces/Book";
import { ILoanRequestResponse } from "../common/interfaces/LoanReqResponse";

export class LoanService {
  private static baseRoute: string = `${ServerAddress}loans`;

  constructor() {}
  static async createRequestedBook(book: ILoan, token: string) {
    try {
      const response = await baseFetch<ILoan, ILoanRequestResponse>({
        url: `${this.baseRoute}/borrow`,
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
