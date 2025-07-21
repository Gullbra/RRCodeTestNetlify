import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { ITokenPayload } from '../models/user.model';
import { IApiResponse } from '../models/apiResponse.model';
import { IJwt } from '../models/token.model';
import { BookService } from './book.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSignal = signal(false);
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  
  

  constructor(private http: HttpClient, private bookService: BookService) {
    this.initializeAuth();
  }


  private initializeAuth() {
    const token = localStorage.getItem('accessToken');
    
    // Since I'm under time preassure, I will I'm doing my own jwt decoding, since it's fairly straight forward in this case.
    if (token) {
      try {
        const payload = this.decodeJWT(token);
            
        // Checking if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          
          console.log('Token expired, refreshing session');
          this.refreshToken()
            //.subscribe({})

          return;
        }

        const user = this.extractUserFromTokenPayload(payload);
        
        this.currentUserSubject.next(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        console.error('Invalid token format:', error);
        this.logout();
      }
    }
  }


  private extractUserFromTokenPayload(tokenPayload: IJwt): User {
    // Extract user information handling the Microsoft/ASP.NET Core JWT claim format
    const user: User = {
      id: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      //createdAt: new Date(tokenPayload.iat ? tokenPayload.iat * 1000 : Date.now())
    };

    console.log("user from token payload:", user);

    return user
  }


  private decodeJWT(token: string): IJwt {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Invalid JWT format');
    }
  }

  // // Helper method to check token expiration
  // private isTokenExpired(token: string): boolean {
  //   try {
  //     const payload = this.decodeJWT(token);
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     return payload.exp && payload.exp < currentTime;
  //   } catch {
  //     return true; // Treat invalid tokens as expired
  //   }
  // }


  register(userData: RegisterRequest): Observable<IApiResponse<ITokenPayload>> {
    // console.log('Registering user with data:', userData, "to API:", `${this.API_URL}/auth/register`);
    return this.http.post<IApiResponse<ITokenPayload>>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          // console.log('Registration successful, setting session:', response);
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

    console.log('Refreshing token with refreshToken:', localStorage.getItem('refreshToken'), 'and accessToken:', localStorage.getItem('accessToken'));

    return this.http.post<IApiResponse<ITokenPayload>>(`${this.API_URL}/auth/refresh`, {
      refreshToken: localStorage.getItem('refreshToken'),
      accessToken: localStorage.getItem('accessToken')
    })
    .pipe(
      tap(response => {
        console.log('Refreshing token, response:', response);
        this.setSession(response);
      }),
      catchError((arg) => {
        console.error('Error refreshing token:', arg);
        this.logout();
        return this.handleError(arg) 
      })
    );
  }

  
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSignal.set(false);
  }

  



  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  private setSession(authResponse: IApiResponse<ITokenPayload>): void {
    console.log('Setting session with auth response:', authResponse);
    localStorage.setItem('accessToken', authResponse.data.accessToken);
    localStorage.setItem('refreshToken', authResponse.data.refreshToken);

    try {
      const user = this.extractUserFromTokenPayload(this.decodeJWT(authResponse.data.accessToken));
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

