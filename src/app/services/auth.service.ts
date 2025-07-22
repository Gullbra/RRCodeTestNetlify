import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { ITokenPayload } from '../models/user.model';
import { IApiResponse } from '../models/apiResponse.model';
import { BookService } from './book.service';
import { Router } from '@angular/router';
import { TokenService } from './token.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSignal = signal(false);
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  
  constructor(private http: HttpClient, private tokenService: TokenService, public router: Router, private bookService: BookService) {
    this.initializeAuth();
  }


  private initializeAuth() {
    const token = this.tokenService.getToken();
    
    if (token) {
      try {
        const payload = this.tokenService.decodeJWT(token);
            
        // Checking if token is still valid
        if (payload.exp && (payload.exp >= Math.floor(Date.now() / 1000))) {
          const user = this.tokenService.getUserFromTokenPL(payload);
          
          this.currentUserSubject.next(user);
          this.isAuthenticatedSignal.set(true);
          return;
        }

        this.refreshToken()
          .subscribe({
            error: (error) => {
              console.error('Token refresh failed:', error);
            }
          });

      } catch (error) {
        console.error('Invalid token format 1:', error);
        this.logout();
      }
    }
  }


  register(userData: RegisterRequest): Observable<IApiResponse<ITokenPayload>> {
    return this.http.post<IApiResponse<ITokenPayload>>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          return this.setSession(response)
        }),
        catchError(this.handleError)
      );
  }


  login(credentials: LoginRequest): Observable<IApiResponse<ITokenPayload>> {
    return this.http.post<IApiResponse<ITokenPayload>>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => this.setSession(response)),
        catchError(this.handleError)
      );
  }


  refreshToken(): Observable<IApiResponse<ITokenPayload>> {
    return this.http.post<IApiResponse<ITokenPayload>>(`${this.API_URL}/auth/refresh`, {
      refreshToken: localStorage.getItem('refreshToken'),
      accessToken: localStorage.getItem('accessToken')
    })
    .pipe(
      tap(response => {
        this.setSession(response);
        this.currentUserSubject.next(this.tokenService.getUserFromJwT(response.data.accessToken));
        this.isAuthenticatedSignal.set(true);
        //this.router.navigate([this.router.url]);
      }),
      catchError((arg) => {
        console.error('Error refreshing token:', arg);
        this.logout();
        return this.handleError(arg) 
      })
    );
  }

  
  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSignal.set(false);
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


  private setSession(authResponse: IApiResponse<ITokenPayload>): void {
    this.tokenService.setTokens(authResponse.data.accessToken, authResponse.data.refreshToken);
    this.bookService.loadBooks();

    try {
      const user = this.tokenService.getUserFromJwT(authResponse.data.accessToken);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error extracting user session:', error); 
    }

    this.isAuthenticatedSignal.set(true);
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error: ${error.status}`;
    }
    
    return throwError(() => errorMessage);
  }
}
