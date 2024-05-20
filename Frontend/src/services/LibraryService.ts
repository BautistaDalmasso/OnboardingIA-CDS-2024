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

  static async getFilteredBooks(
    filterCategory: string,
    filterValue: string,
  ): Promise<IBookWithLicence[]> {
    try {
      const books = await baseFetch<void, IBookWithLicence[]>({
        url: `${this.booksRoute}/show_books/filter?filter_category=${filterCategory}&filter_value=${filterValue}`,
        method: "GET",
      });

      return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  static async getBookByISBN(isbn: string): Promise<IBookWithLicence[]> {
    try {
      const books = await baseFetch<void, IBookWithLicence[]>({
        url: `${this.booksRoute}/show_books/isbn?isbn=${isbn}`,
        method: "GET",
      });

      return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
}
