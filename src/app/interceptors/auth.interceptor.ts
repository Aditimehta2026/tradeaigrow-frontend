import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    const isAuthRoute =
      req.url.includes('/auth/login') || req.url.includes('/auth/register');

    // Build request: add Bearer only for protected routes when token exists
    let outgoing = req;
    if (!isAuthRoute && token) {
      outgoing = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(outgoing).pipe(
      catchError((error: HttpErrorResponse) => {
        // Wrong password on login can also be 401 — do not auto-logout there
        if (error.status === 401 && !isAuthRoute) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('dashboardDatas');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}