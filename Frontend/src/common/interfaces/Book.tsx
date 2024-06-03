export interface IMarcBook {
  isbn: string;
  title: string;
  place: string;
  publisher: string;
  date_issued: string;
  edition: string | null;
  abstract: string | null;
  description: string;
  ddc_class: string;
  authors: IAuthor[];
  topics: string[];
}

export interface IAuthor {
  name: string;
  role: string | null;
}

export interface IBookWithLicence {
  book_data: IMarcBook;
  licence_required: number;
}

export interface IBook {
  isbn: string;
  title: string;
  available_copies: number;
}

export interface IRequestedBook {
  isbn: string;
  user_email: string;
  title: string;
}

export interface IReservationRequest {
  isbn: string;
  expiration_date: Date;
  user_email: string;
}

export interface ITotalBooks {
  total_books: number;
}

export interface IPhysicalCopyData {
  isbn: string;
  copy_id: string;
  status: "available" | "borrowed";
}

export interface ILoanValid {
  inventory_number: number;
  isbn: string;
  expiration_date: Date;
  user_email: string;
  licence_level: number;
}
