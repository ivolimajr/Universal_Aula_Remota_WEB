import {Injectable, ViewChild} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class HttpBaseServices<T> {
    @ViewChild('fileInput') selectedFileEl;

    public header = new HttpHeaders();
    private endpoint: string;
    private httpClientBackEnd: HttpClient;
    private accessToken: string;

    constructor(
        public _httpClient: HttpClient,
        private url: string,
        private _authServices?: AuthService,
        private _httpBackend?: HttpBackend,
        ) {
        this.endpoint = environment.apiUrl + this.url;
        if(this.httpClientBackEnd != null){
            this.httpClientBackEnd = new HttpClient(_httpBackend);
        }
        if(this._authServices != null){
            this.accessToken = this._authServices.tokenFromLocalStorage.accessToken;
        }
    }

    getAll(): Observable<T[]> {
        return this._httpClient.get<T[]>(this.endpoint).pipe(
            switchMap((response: T[]) => of(response)),
            catchError(e => of(e))
        );
    }

    getOne(id: number): Observable<T> {
        return this._httpClient.get<T>(this.endpoint + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    create(data: T): Observable<T> {
        return this._httpClient.post(this.endpoint, data).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    createFormEncoded(data: any): Observable<T> {
        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();

        for (const key in data) {
            formData.append(key, data[key]);
        }

        return this._httpClient.post(this.endpoint, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    update(data: T): Observable<T> {
        return this._httpClient.put(this.endpoint, data).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    updateFormEncoded(data: any): Observable<T> {

        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();
        for (const key in data)
            formData.append(key, data[key]);

        return this._httpClient.put(this.endpoint, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    delete(id: number): Observable<boolean> {
        if (id === 0 || id == null) {
            return of(null);
        }
        return this._httpClient.delete(this.endpoint + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
