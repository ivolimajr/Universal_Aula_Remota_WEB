import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {AdministrativePost, AdministrativeUser} from '../../models/administrative.model';


const URL_ADMINISTRATIVE = `${environment.apiUrl}/Administrative`;

@Injectable({
    providedIn: 'root'
})
export class AdministrativeService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Recupera um usuário do Edriving
     *
     * @param id do usuário a ser consultado
     * @return retorna um usuário ou o error
     */
    getOne(id: number): Observable<AdministrativeUser> {
        return this._httpClient.get<AdministrativeUser>(URL_ADMINISTRATIVE + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * @return o array de items contendo todos os usuários do tipo Edriving
     */
    getAll(): Observable<AdministrativeUser[]> {
        return this._httpClient.get<AdministrativeUser[]>(URL_ADMINISTRATIVE).pipe(
            switchMap((response: AdministrativeUser[]) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Cria um novo um usuário do edriving
     *
     * @param data model do usuario
     * @return retorna o usuário ou error
     */
    create(data: AdministrativePost): Observable<AdministrativeUser> {
        return this._httpClient.post(URL_ADMINISTRATIVE, data).pipe(
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
    update(data: AdministrativePost): Observable<AdministrativePost> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }
        return this._httpClient.put(URL_ADMINISTRATIVE, data).pipe(
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

        return this._httpClient.delete(URL_ADMINISTRATIVE + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
