import { Injectable } from "@angular/core";

// token.service.ts
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
