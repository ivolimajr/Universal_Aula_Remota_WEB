import {Injectable, ViewChild} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/cargo.model';
import {DrivingSchoolPost, DrivingSchool} from '../../models/autoEscola.model';
import {AuthService} from '../auth/auth.service';

const URL_AUTOESCOLA = `${environment.apiUrl}/AutoEscola`;
const URL_AUTOESCOLA_CARGO = `${environment.apiUrl}/AutoescolaCargo`;

@Injectable({
    providedIn: 'root'
})
export class AutoescolaService {
    @ViewChild('fileInput') selectedFileEl;

    header = new HttpHeaders();
    private httpClientBackEnd: HttpClient;
    private accessToken: string;

    constructor(
        private _httpClient: HttpClient,
        private httpBackend: HttpBackend,
        private _authService: AuthService) {
        this.httpClientBackEnd = new HttpClient(httpBackend);
        this.accessToken = this._authService.tokenFromLocalStorage.accessToken;
    }

    /**
     * Recupera um usuário do Edriving
     *
     * @param id do usuário a ser consultado
     * @return retorna um usuário ou o error
     */
    getOne(id: number): Observable<DrivingSchool> {
        return this._httpClient.get<DrivingSchool>(URL_AUTOESCOLA + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * @return o array de items contendo todos os usuários do tipo Edriving
     */
    getAll(): Observable<DrivingSchool[]> {
        return this._httpClient.get<DrivingSchool[]>(URL_AUTOESCOLA).pipe(
            switchMap((response: DrivingSchool[]) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Cria um novo um usuário do edriving
     *
     * @param data model do usuario
     * @return retorna o usuário ou error
     */
    create(data: DrivingSchoolPost): Observable<DrivingSchoolPost> {

        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();

        for (const key in data){
            if(key !== 'files' && key !== 'phonesNumbers'){
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
    update(data: DrivingSchoolPost): Observable<DrivingSchoolPost> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }
        this.header = this.header.set('Authorization', 'Bearer ' + this.accessToken);
        const formData = new FormData();

        for (const key in data){
            if(key !== 'files' && key !== 'phonesNumbers'){
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

        return this._httpClient.put(URL_AUTOESCOLA, formData).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Remove um usuário do tipo edriving
     * Verifica se o id a ser passao é zero, se for, retorna error.
     *
     * @param id do usuário a ser removido
     * @return boolean se true = removido, se false = erro na remoção
     */
    delete(id: number): Observable<boolean> {
        if (id === 0 || id == null) {
            return of(null);
        }

        return this._httpClient.delete(URL_AUTOESCOLA + '/' + id).pipe(
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
