import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import {
  IBook,
  IBookWithLicence,
  IPhysicalCopyData,
} from "../common/interfaces/Book";

export class LibraryService {
  private static booksRoute: string = `${ServerAddress}books`;
  private static loansRoute: string = `${ServerAddress}loans`

  constructor() {}

  static async getBooks(): Promise<IBookWithLicence[]> {
    try {
      const books = await baseFetch<void, IBookWithLicence[]>({
        url: `${this.booksRoute}/show_books`,
        method: "GET",
      });

      return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  static async handleBorrow(book: IBook): Promise<IPhysicalCopyData> {
    try {
      const response = await baseFetch<IBook, IPhysicalCopyData>({
        url: `${this.loansRoute}/borrow`,
        method: "POST",
        data: book,
      });
      console.log("Successful loan application");
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
