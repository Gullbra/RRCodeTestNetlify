import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../services/token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    // private authService: AuthService,
    private tokenService: TokenService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req)
    // .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401 && token) {
    //       return this.authService.refreshToken().pipe(
    //         switchMap(() => {
    //           const newToken = this.authService.getToken();
    //           const newReq = req.clone({
    //             setHeaders: {
    //               Authorization: `Bearer ${newToken}`
    //             }
    //           });
    //           return next.handle(newReq);
    //         }),
    //         catchError(() => {
    //           this.authService.logout();
    //           return throwError(() => error);
    //         })
    //       );
    //     }
    //     return throwError(() => error);
    //   })
    // );
  }
}
