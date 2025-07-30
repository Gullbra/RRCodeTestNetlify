import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { IQuote, IQuoteHttpObj } from '../models/quote.model';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../models/apiResponse.model';


@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly API_URL = environment.apiUrl;

  private quotesSignal = signal<IQuote[]>([]); // Private writable signal for quotes
  public readonly quotes = this.quotesSignal.asReadonly(); // Public readonly signal for components to read

  // Loading state signal
  private loadingSignal = signal<boolean>(false);
  public readonly loading = this.loadingSignal.asReadonly();

  private hasLoadedSignal = signal<boolean>(false);
  public readonly hasLoaded = this.hasLoadedSignal.asReadonly();

  // Error state signal
  private errorSignal = signal<string | null>(null);
  public readonly error = this.errorSignal.asReadonly();


  constructor(private http: HttpClient) {}


  loadQuotes(): void {
    if (!this.hasLoaded()) {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
  
      this.getQuotes().subscribe({
        next: (response: IApiResponse<IQuoteHttpObj[]>) => {
          this.quotesSignal.set(response.data.map(this.httpQuoteToModel) || []);
          this.loadingSignal.set(false);
          this.hasLoadedSignal.set(true);
        },
        error: (error) => {
          this.errorSignal.set('Failed to load quotes');
          this.loadingSignal.set(false);
        }
      });
    }
  }


  private store = {
    getById: (id: number): IQuote | undefined => {
      return this.quotes().find(quote => quote.id === id);
    },
    add: (quote: IQuote): void => {this.quotesSignal.update(quotes => [...quotes, quote]);},
    update: (updatedQuote: IQuote): void => {
      this.quotesSignal.update(quotes =>
        quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
      );
    },
    remove: (quoteId: number): boolean => {
      const startLength = this.quotes().length;
      this.quotesSignal.update(quotes =>
        quotes.filter(quote => quote.id !== quoteId)
      );
      return this.quotes().length < startLength; // Return true if a quote was removed
    },
  }


  private getQuotes(): Observable<IApiResponse<IQuoteHttpObj[]>> {
    return this.http.get<IApiResponse<IQuoteHttpObj[]>>(`${this.API_URL}/quotes`)
  }


  getQuoteById(id: number): IQuote | undefined {
    return this.store.getById(id);
  }


  createQuote(quote: IQuote): Observable<{success: boolean, message: string}> {
    return this.http.post<IApiResponse<IQuoteHttpObj>>(`${this.API_URL}/quotes`, this.quoteModelToHttpObj(quote)).pipe(
      map(res => {
        if(res.success) {
          this.store.add(this.httpQuoteToModel(res.data));
          return { success: true, message: 'Quote created successfully' };
        }
        console.error('Failed to create quote:', res.errors);
        return { success: false, message: 'Failed to create quote:' };
      }),
      catchError(error => {
        console.error('Error creating quote:', error);
        return [{ success: false, message: 'Error creating quote: ' + error }];
      })
    )
  }


  updateQuote(id: string, quote: IQuote): Observable<{success: boolean, message: string}> {
    return this.http.put<IApiResponse<IQuoteHttpObj>>(`${this.API_URL}/quotes/${id}`, this.quoteModelToHttpObj(quote)).pipe(
      map(res => {
        if(res.success) {
          this.store.update(this.httpQuoteToModel(res.data));
          return { success: true, message: 'Quote updated successfully' };
        }
        console.error('Failed to update quote:', res.errors);
        return { success: false, message: 'Failed to update quote:' };
      }),
      catchError(error => {
        console.error('Error updating quote:', error);
        return [{ success: false, message: 'Error updating quote: ' + error }];
      })
    );
  }


  deleteQuote(id: number): Observable<{success: boolean, message: string}> {
    return this.http.delete<IApiResponse<IQuoteHttpObj>>(`${this.API_URL}/quotes/${id}`).pipe(
      map(res => {
        if(res.success) {
          const removed = this.store.remove(id);
          if(removed) {
            return { success: true, message: 'Quote deleted successfully' };
          } else {
            console.error('Failed to delete quote:', res.errors);
            return { success: false, message: 'Failed to delete quote:' };
          }
        }
        console.error('Failed to delete quote:', res.errors);
        return { success: false, message: 'Failed to delete quote:' };
      }),
      catchError(error => {
        console.error('Error deleting quote:', error);
        return [{ success: false, message: 'Error deleting quote: ' + error }];
      })
    );
  }


  private httpQuoteToModel(quote: IQuoteHttpObj): IQuote {
    return quote.source 
      ? {
          id: quote.id || -1,
          text: quote.text,
          author: quote.author,
          source: quote.source
        }
      : {
          id: quote.id || -1,
          text: quote.text,
          author: quote.author,
        }
  }

  
  private quoteModelToHttpObj(quote: IQuote): IQuoteHttpObj {
    return quote as IQuoteHttpObj; // Assuming the model and HTTP object are compatible
  }
}
