import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpBaseServices<T> {

    private endpoint: string;

    constructor(
        public _httpClient: HttpClient,
        private url: string,
        ) {
        this.endpoint = environment.apiUrl + this.url;
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
            switchMap((response: T) => of(response)),
            catchError(e => of(e))
        );
    }
    update(data: T): Observable<T> {
        return this._httpClient.put(this.endpoint, data).pipe(
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
