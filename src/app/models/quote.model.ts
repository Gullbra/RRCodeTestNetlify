export interface IQuote {
  id: number;
  text: string;
  author: string;
  source?: string;
}

export interface IQuoteHttpObj {
  id?: number;
  text: string;
  author: string;
  source: string;
  userId: string;
}
