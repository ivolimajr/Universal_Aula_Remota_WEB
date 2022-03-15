import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private readonly accessToken: string;

    constructor(private _authService: AuthService,public snackBar: MatSnackBar) {
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
        return next.handle(newReq).pipe(catchError((err) => {
            if(err.error.errors !== undefined) {
                this.openSnackBar('Requisição inválida');
                return throwError(err);
            }
            else if(err.error.UserMessage !== '' || !err.ok){
                this.openSnackBar(err.error.UserMessage ? err.error.UserMessage  : err.error.InnerExceptionMessage);
                return throwError(err);
             } else{
                this.openSnackBar('Serviço indisponível');
                return throwError(err);
            }
        }));
    }
    private openSnackBar(message: string): void {
        this.snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-warn']
        });
    }
}
