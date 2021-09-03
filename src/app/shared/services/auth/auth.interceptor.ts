import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {AuthUtils} from 'app/shared/services/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();

        if (this._authService.tokenFromLocalStorage && !AuthUtils.isTokenExpired(this._authService.tokenFromLocalStorage)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.tokenFromLocalStorage)
            });
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
