import {Injectable, ViewChild} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/level.model';
import {DrivingSchool} from '../../models/drivingSchool.model';
import {AuthService} from '../auth/auth.service';
import {HttpBaseServices} from './httpBaseServices';

const URL_AUTOESCOLA = `${environment.apiUrl}/DrivingSchool`;
const URL_AUTOESCOLA_CARGO = `${environment.apiUrl}/DrivingSchoolLevel`;

@Injectable({
    providedIn: 'root'
})
export class DrivingSchoolService extends HttpBaseServices<DrivingSchool> {
    @ViewChild('fileInput') selectedFileEl;

    header = new HttpHeaders();
    private httpClientBackEnd: HttpClient;
    private accessToken: string;

    constructor(
        public _httpClient: HttpClient,
            private httpBackend: HttpBackend,
            private _authService: AuthService
    ) {
        super(
            _httpClient,
            '/DrivingSchool'
        );
        this.httpClientBackEnd = new HttpClient(httpBackend);
        this.accessToken = this._authService.tokenFromLocalStorage.accessToken;
    }

    /**
     * Cria um novo um usuário do edriving
     *
     * @param data model do usuario
     * @return retorna o usuário ou error
     */
    createFormEncoded(data: DrivingSchool): Observable<DrivingSchool> {
        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();

        for (const key in data) {
            if (key !== 'files' && key !== 'phonesNumbers') {
                formData.append(key, data[key]);
            }
        }

        let i = 0;
        data.phonesNumbers.forEach((item) => {
            const name = 'phonesNumbers[' + i + '][phoneNumber]';
            formData.append(name, item.phoneNumber);
            i++;
        });
        data.files.forEach((item) => {
            const name = 'files';
            formData.append(name, item.file);
        });

        return this._httpClient.post(URL_AUTOESCOLA, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Atualiza um usuário do edriving
     * Verifica se o id a ser passao é zero, se for, retorna error.
     *
     * @param data model do usuario
     * @return retorna o usuário atualizado ou error
     */
    updateFormEncoded(data: DrivingSchool): Observable<DrivingSchool> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }
        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();

        for (const key in data) {
            if (key !== 'files' && key !== 'phonesNumbers') {
                formData.append(key, data[key]);
            }
        }

        let i = 0;
        data.phonesNumbers.forEach((item) => {
            const id = 'phonesNumbers[' + i + '][id]';
            const phone = 'phonesNumbers[' + i + '][phoneNumber]';
            formData.append(id, item.id.toString());
            formData.append(phone, item.phoneNumber);
            i++;
        });
        data.files.forEach((item) => {
            const name = 'files';
            formData.append(name, item.file);
        });

        return this._httpClient.put(URL_AUTOESCOLA, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Busca todos os cargos referente ao usuário do tipo Edriving
     *
     * @return retorna uma lista de cargos
     */
    getCargos(): Observable<Level[]> {
        return this._httpClient.get(URL_AUTOESCOLA_CARGO).pipe(
            switchMap((response: any) => of(response['items'])),
            catchError(e => of(e))
        );
    }
}
