import {Injectable, ViewChild} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {PhoneNumberModel} from '../../models/phoneNumber.model';
import {FileModel} from '../../models/file.model';

@Injectable({
    providedIn: 'root'
})
export class HttpBaseServices<T> {
    @ViewChild('fileInput') selectedFileEl;

    public header = new HttpHeaders();
    private endpoint: string;
    private readonly httpClientBackEnd: HttpClient;
    private readonly accessToken: string;

    constructor(
        public _httpClient: HttpClient,
        private url: string,
        private _authServices: AuthService,
        private _httpBackend?: HttpBackend,
    ) {
        this.endpoint = environment.apiUrl + this.url;
        if (this.httpClientBackEnd != null)
            this.httpClientBackEnd = new HttpClient(_httpBackend);
        this.accessToken = this._authServices.tokenFromLocalStorage.accessToken;
    }

    getAll(uf: string = '', drivingSchoolId: number = 0): Observable<T[]> {
        uf = uf ?? '';
        if (this._authServices.isAdmin()) drivingSchoolId = 0;
        return this._httpClient.get<T[]>(this.endpoint + '?uf=' + uf + '&drivingSchoolId=' + drivingSchoolId).pipe(
            switchMap((response: T[]) => of(response)),
            catchError(e => of(e))
        );
    }

    getOne(id: number, uf: string = ''): Observable<T> {
        uf = uf ?? '';
        return this._httpClient.get<T>(this.endpoint + '/' + id + '?uf=' + uf).pipe(
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

    createFormEncoded(data: any, endpoint?: string): Observable<T> {
        const endPointComplement = endpoint ?? '';
        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        this.header = this.header.set('Content-type', 'multipart/form-data');
        const formData = new FormData();
        for (const key in data) {
            if (key !== 'files' && key !== 'phonesNumbers')
                formData.append(key, data[key]);

            if (key === 'phonesNumbers') {
                let i = 0;
                data['phonesNumbers'].forEach((item: PhoneNumberModel) => {
                    const name = 'phonesNumbers[' + i + '][phoneNumber]';
                    formData.append(name, item.phoneNumber);
                    i++;
                });
            }
            if (key === 'files') {
                let i = 0;
                data['files'].forEach((item: FileModel) => {
                    const name = 'files';
                    formData.append(name, item.file);
                    i++;
                });
            }
        }

        return this._httpClient.post(this.endpoint + endPointComplement, formData).pipe(
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
        this.header = this.header.set('Content-type', 'multipart/form-data');
        const formData = new FormData();
        for (const key in data) {
            if (key !== 'files' && key !== 'phonesNumbers')
                formData.append(key, data[key]);

            if (key === 'phonesNumbers') {
                let i = 0;
                data['phonesNumbers'].forEach((item: PhoneNumberModel) => {
                    const id = 'phonesNumbers[' + i + '][id]';
                    const phone = 'phonesNumbers[' + i + '][phoneNumber]';
                    if (item.id != null) {
                        formData.append(id, item.id.toString());
                    }
                    formData.append(phone, item.phoneNumber);
                    i++;
                });
            }
            if (key === 'files') {
                let i = 0;
                data['files'].forEach((item: FileModel) => {
                    const name = 'files';
                    formData.append(name, item.file);
                    i++;
                });
            }
        }
        return this._httpClient.put(this.endpoint, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    delete(id: number): Observable<boolean> {
        if (id === 0 || id == null) return of(null);

        return this._httpClient.delete(this.endpoint + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}