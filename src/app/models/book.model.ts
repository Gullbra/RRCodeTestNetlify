export interface IBook {
  id: number;
  title: string;
  author: string;
  dateOfPublication: Date;
  userId: string;
}

export interface IBookHttpObj {
  id?: number;
  title: string;
  author: string;
  dateOfPublication: string;
  userId: string;
}
