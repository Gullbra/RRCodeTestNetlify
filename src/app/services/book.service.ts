import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, IBookHttpObj } from '../models/book.model';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly API_URL = environment.apiUrl; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  getBooks(): Observable<IApiResponse<IBookHttpObj[]>> {
    return this.http.get<IApiResponse<IBookHttpObj[]>>(`${this.API_URL}/books`);
  }

  getBook(id: string): Observable<IApiResponse<IBookHttpObj>> {
    return this.http.get<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books/${id}`);
  }

  createBook(book: IBookHttpObj): Observable<IApiResponse<IBookHttpObj>> {
    return this.http.post<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books`, book);
  }

  updateBook(id: string, book: Partial<IBookHttpObj>): Observable<IApiResponse<IBookHttpObj>> {
    return this.http.put<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<IApiResponse<IBookHttpObj>> {
    return this.http.delete<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books/${id}`);
  }
}
