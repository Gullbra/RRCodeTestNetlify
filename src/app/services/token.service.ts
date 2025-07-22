import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { IJwt } from "../models/token.model";


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


  public getUserFromTokenPL(tokenPayload: IJwt): User {
    // Extract user information handling the Microsoft/ASP.NET Core JWT claim format
    const user: User = {
      id: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      //createdAt: new Date(tokenPayload.iat ? tokenPayload.iat * 1000 : Date.now())
    };

    return user
  }


  public decodeJWT(token: string): IJwt {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Invalid JWT format');
    }
  }


  public getUserFromJwT(token: string): User {
    return this.getUserFromTokenPL(this.decodeJWT(token));
  }
}
