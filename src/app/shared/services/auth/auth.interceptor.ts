import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from 'app/shared/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private accessToken: string;
    constructor(private _authService: AuthService) {
        this.accessToken = this._authService.tokenFromLocalStorage.accessToken;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();
        if (this._authService.tokenFromLocalStorage) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.accessToken)
            });
        }

        // Response
        return next.handle(newReq).pipe(
            catchError(error => throwError(error))
        );
    }
}
