import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AddressModel} from '../../models/address.model';
import {HttpBaseServices} from './httpBaseServices';
import {AuthService} from '../auth/auth.service';

const URL_USER = '/User';
const URL_USER_API = `${environment.apiUrl}/User`;

@Injectable({
    providedIn: 'root'
})
export class UserService extends HttpBaseServices<any> {

    constructor(
        _httpClient: HttpClient,
        _httpBackend: HttpBackend,
        _authService: AuthService,
    ) {
        super(
            _httpClient,
            URL_USER,
            _authService,
            _httpBackend
        );
    }

    removePhonenumber(id: number): Observable<boolean> {
        if (id === 0 || id == null) return of(false);

        return this._httpClient.delete(URL_USER_API + '/phone/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e.error))
        );
    }

    removeFile(id: number): Observable<boolean> {
        if (id === 0 || id == null) return of(false);

        return this._httpClient.delete(URL_USER_API + '/file/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e.error))
        );
    }

    updatePassById(credentials: { id: number; senhaAtual: string; novaSenha: string }): Observable<boolean> {
        if (credentials.id === 0 || credentials.id == null) return of(false);

        return this._httpClient.put(URL_USER_API + '/password', credentials).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    updateAddress(endereco: AddressModel): Observable<AddressModel> {
        if (!endereco.id) return of(null);

        return this._httpClient.put(URL_USER_API + '/address', endereco).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
