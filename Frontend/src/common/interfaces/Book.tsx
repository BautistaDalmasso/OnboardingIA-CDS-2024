export interface IBookWithLicence {
    isbn: string;
    title: string;
    available_copies: number;
    licence_required: number;
  }

  export interface IBook {
    isbn: string;
    title: string;
    available_copies: number;
  }

  export interface IRequestedBook{
    isbn: string;
    copy_id: string;
    user_email: string;
  }

  export interface ILoan {
    isbn: string;
    copy_id: string;
    expiration_date: Date;
    user_email: string;
  }

  export interface IPhysicalCopyData {
    isbn: string
    copy_id: string
    status: "available" | "borrowed";
  }
