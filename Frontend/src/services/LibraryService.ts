import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IBookWithLicence } from "../common/interfaces/Book";

export class LibraryService {
  private static booksRoute: string = `${ServerAddress}books`;

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
}
