import { ServerAddress } from "../common/consts/serverAddress";
import { ILoanInformationResponse } from "../common/interfaces/LoanReqResponse";
import { baseFetch } from "./fetch";

export class RequestedLoansService {
  private static loansRoute = `${ServerAddress}loans`;

  static async getLoans(userEmail: string) {
    const result = await baseFetch<void, ILoanInformationResponse[]>({
      url: `${this.loansRoute}/user_loans?user_email=${userEmail}`,
      method: `GET`,
    });
    return result;
  }

// esta planteado arriba pero este nombre es mas apropiado dejar momentaneamente para no romper otros componentes
  static async getLoansByEmail(email: string) {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
        url: `${this.loansRoute}/loan_by_email?user_email=${email}`,
        method: "GET",
      });

      return loans;
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  }

  static async getLoansByTitle(title: string) {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
        url: `${this.loansRoute}/loans_by_title?title=${title}`,
        method: "GET",
      });

      return loans;
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  }

  static async getAllLoans(): Promise<ILoanInformationResponse[]> {
    try {
      const loans = await baseFetch<void, ILoanInformationResponse[]>({
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
