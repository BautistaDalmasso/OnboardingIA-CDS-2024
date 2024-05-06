import { ServerAddress } from "../common/consts/serverAddress";
import { baseFetch } from "./fetch";
import { IBook } from "../common/interfaces/Book";

export class LibraryService {
    private static baseRoute: string = `${ServerAddress}books`;

    constructor() {}

    static async getBooks(): Promise<IBook[]> {
      try {
        const books = await baseFetch<void,IBook[]>({
          url: `${this.baseRoute}/show_books/`,
          method: "GET",
        });

        return books;
      } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
    }
  }
