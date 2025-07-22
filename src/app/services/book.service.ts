import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { IBook, IBookHttpObj } from '../models/book.model';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../models/apiResponse.model';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly API_URL = environment.apiUrl;

  private booksSignal = signal<IBook[]>([]); // Private writable signal for books
  public readonly books = this.booksSignal.asReadonly(); // Public readonly signal for components to read

    // Loading state signal
  private loadingSignal = signal<boolean>(false);
  public readonly loading = this.loadingSignal.asReadonly();

  // Error state signal
  private errorSignal = signal<string | null>(null);
  public readonly error = this.errorSignal.asReadonly();


  constructor(private http: HttpClient) {}


  loadBooks(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.getBooks().subscribe({
      next: (response: IApiResponse<IBookHttpObj[]>) => {
        this.booksSignal.set(response.data.map(this.httpBookToModel) || []);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set('Failed to load books');
        this.loadingSignal.set(false);
      }
    });
  }


  private store = {
    getById: (id: number): IBook | undefined => {
      return this.books().find(book => book.id === id);
    },
    add: (book: IBook): void => {this.booksSignal.update(books => [...books, book]);},
    update: (updatedBook: IBook): void => {
      this.booksSignal.update(books =>
        books.map(book => book.id === updatedBook.id ? updatedBook : book)
      );
    },
    remove: (bookId: number): boolean => {
      const startLength = this.books().length;
      this.booksSignal.update(books =>
        books.filter(book => book.id !== bookId)
      );
      return this.books().length < startLength; // Return true if a book was removed
    },
  }


  private getBooks(): Observable<IApiResponse<IBookHttpObj[]>> {
    return this.http.get<IApiResponse<IBookHttpObj[]>>(`${this.API_URL}/books`)
  }


  getBookById(id: number): IBook | undefined {
    return this.store.getById(id);
  }


  createBook(book: IBook): Observable<{success: boolean, message: string}> {
    return this.http.post<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books`, this.bookModelToHttpObj(book)).pipe(
      map(res => {
        if(res.success) {
          this.store.add(this.httpBookToModel(res.data));
          return { success: true, message: 'Book created successfully' };
        }
        console.error('Failed to create book:', res.errors);
        return { success: false, message: 'Failed to create book:' };
      }),
      catchError(error => {
        console.error('Error creating book:', error);
        return [{ success: false, message: 'Error creating book: ' + error }];
      })
    )
  }


  updateBook(id: string, book: IBook): Observable<{success: boolean, message: string}> {
    return this.http.put<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books/${id}`, book).pipe(
      map(res => {
        if(res.success) {
          this.store.update(this.httpBookToModel(res.data));
          return { success: true, message: 'Book updated successfully' };
        }
        console.error('Failed to update book:', res.errors);
        return { success: false, message: 'Failed to update book:' };
      }),
      catchError(error => {
        console.error('Error updating book:', error);
        return [{ success: false, message: 'Error updating book: ' + error }];
      })
    );
  }


  deleteBook(id: number): Observable<{success: boolean, message: string}> {
    return this.http.delete<IApiResponse<IBookHttpObj>>(`${this.API_URL}/books/${id}`).pipe(
      map(res => {
        if(res.success) {
          const removed = this.store.remove(id);
          if(removed) {
            return { success: true, message: 'Book deleted successfully' };
          } else {
            console.error('Failed to delete book:', res.errors);
            return { success: false, message: 'Failed to delete book:' };
          }
        }
        console.error('Failed to delete book:', res.errors);
        return { success: false, message: 'Failed to delete book:' };
      }),
      catchError(error => {
        console.error('Error deleting book:', error);
        return [{ success: false, message: 'Error deleting book: ' + error }];
      })
    );
  }


  private httpBookToModel(book: IBookHttpObj): IBook {
    return {
      ...book,
      id: book.id || -1,
      dateOfPublication: new Date(book.dateOfPublication),
      // dateOfPublication: book.dateOfPublication.toISOString().split('T')[0], // converting to string without time

    }
  }

  
  private bookModelToHttpObj(book: IBook): IBookHttpObj {
    return {
      ...book,
      dateOfPublication: book.dateOfPublication.toDateString(),
      //       dateOfPublication: book.dateOfPublication.toISOString().split('T')[0], // converting to string without time
    }
  }
}
