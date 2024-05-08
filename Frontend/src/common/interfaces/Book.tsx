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

export interface IRequestedBook {
  isbn: string;
  user_email: string;
  title: string;

}

export interface ILoan {
  isbn: string;
  expiration_date: Date;
  user_email: string;
}

export interface IPhysicalCopyData {
  isbn: string;
  copy_id: string;
  status: "available" | "borrowed";
}

export interface ILoanWithTitle {
  isbn:string;
  title: string;
  expiration_date: Date;
  user_email: string;
}
