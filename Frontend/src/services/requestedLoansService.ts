import { ServerAddress } from "../common/consts/serverAddress";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";
import { baseFetch } from "./fetch";

export class RequestedLoansService {
  private static baseRoute = `${ServerAddress}loans`;

  static async getLoans(userEmail: string) {
    const result = await baseFetch<void, ILoanInformationResponse[]>({
      url: `${this.baseRoute}/user_loans?user_email=${userEmail}`,
      method: `GET`,
    });

    return result;
  }
}
