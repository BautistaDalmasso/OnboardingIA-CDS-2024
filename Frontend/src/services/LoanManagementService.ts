import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IReservationRequest } from "../common/interfaces/Book";
import { ILoanInformation } from "../common/interfaces/LoanReqResponse";
import { LoanStatusCode } from "../common/enums/loanStatus";

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
  static async setLoanStatusReserved(
    loan_id: number,
    due_date: string,
    token: string,
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number ; due_date : string}, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_reserved?loan_id=${loan_id}&due_date=${due_date}`,
      method: "PATCH",
      data: { loan_id, due_date},
    });
}

  static async setLoanStatusLoaned(
    loan_id: number,
    due_date: string,
    token: string,
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number ; due_date : string}, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_loaned?loan_id=${loan_id}&due_date=${due_date}`,
      method: "PATCH",
      data: { loan_id, due_date},
    });
  }

  static async setLoanStatusReturned(
    loan_id: number,
    token: string,
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number}, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_returned?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id},
    });
  }

  static async setLoanStatusReturnOverdue(
    loan_id: number,
    token: string,
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number}, ILoanInformation>({
      token,
      url:  `${this.baseRoute}/set_status_returned_overdue?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id},
    });
  }
  static async setLoanStatusReservationCanceled(
    loan_id: number,
    token: string,
  ): Promise<ILoanInformation> {
    return baseFetch<{ loan_id: number}, ILoanInformation>({
      token,
      url: `${this.baseRoute}/set_status_reservation_Canceled?loan_id=${loan_id}`,
      method: "PATCH",
      data: { loan_id},
    });
  }
}
