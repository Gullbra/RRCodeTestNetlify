import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../services/token.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  /*
    Circular dependency issue workaround:
    injector.get(SomeService) instead of directly injecting and storing as instance variable.
  */
  constructor(private injector: Injector, private tokenService: TokenService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle token refresh logic. Untested, but looks simple enough.
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && token) {
            return this.injector.get(AuthService).refreshToken().pipe(
              switchMap(() => {
                const newToken = this.tokenService.getToken();
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(newReq);
              }),
              catchError(() => {
                this.injector.get(AuthService).logout();
                return throwError(() => error);
              })
            );
          }
          return throwError(() => error);
        })
      );
  }
}
