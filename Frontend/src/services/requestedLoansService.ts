import { ServerAddress } from "../common/consts/serverAddress";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";
import { baseFetch } from "./fetch";

export class RequestedLoansService {
  private static loansRoute = `${ServerAddress}loans`;

  static async getLoansByEmail(email: string, token: string) {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
        token: token,
        url: `${this.loansRoute}/loan_by_email?user_email=${email}`,
        method: "GET",
      });

      return loans;
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  }

  static async getLoansByTitle(title: string, token: string) {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
        token: token,
        url: `${this.loansRoute}/loans_by_title?title=${title}`,
        method: "GET",
      });

      return loans;
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  }

  static async getAllLoans(token: string) {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
        token: token,
        url: `${this.loansRoute}/all_loans`,
        method: "GET",
      });

      return loans;
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  }
}
