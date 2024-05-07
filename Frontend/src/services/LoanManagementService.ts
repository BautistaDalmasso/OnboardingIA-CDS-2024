import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IRequestedBook, ILoan } from "../common/interfaces/Book";
import { ILoanRequestResponse } from "../common/interfaces/LoanReqResponse";

export class LoanService {
    private static baseRoute: string = `${ServerAddress}loans`;

    constructor() {}
    /*To fix: it throws and error when you try to make more than one request.
    //The origin of the problem is uncertain.*/
    static async createRequestedBook(book: IRequestedBook, token: string) {
        try {
            const response = await baseFetch<IRequestedBook, ILoanRequestResponse>({
                url: `${this.baseRoute}/requested_book/`,
                method: 'POST',
                data: book,
                token,
            });

            return response;
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            throw new Error('Error al realizar la solicitud');
        }
    }

    static async addConfirmedLoan(book: ILoan) {
        try {
            const response = await baseFetch<ILoan, any>({
                url: `${this.baseRoute}/loan/`,
                method: 'POST',
                data: book,
            });
            console.log(response);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
