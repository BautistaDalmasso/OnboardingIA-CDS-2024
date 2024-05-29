import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IBookWithLicence } from "../common/interfaces/Book";
import { BookPage } from "../common/enums/Page";

export class LibraryService {
  private static booksRoute: string = `${ServerAddress}books`;

  constructor() {}

  static async getBooks(page_number: number): Promise<IBookWithLicence[]> {
    try {
      const books = await baseFetch<void, IBookWithLicence[]>({
        url: `${this.booksRoute}/show_books?page_number=${page_number}&page_size=${BookPage.PAGE_SIZE}`,
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
