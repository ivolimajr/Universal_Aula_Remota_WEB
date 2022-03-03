import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PartnnerPost, PartnnerUser} from '../../models/parceiro.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/level.model';


const URL_PARCEIRO = `${environment.apiUrl}/Partnner`;
const URL_PARCEIRO_CARGO = `${environment.apiUrl}/PartnnerLevel`;

@Injectable({
    providedIn: 'root'
})
export class PartnnerService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Recupera um usuário do Edriving
     *
     * @param id do usuário a ser consultado
     * @return retorna um usuário ou o error
     */
    getOne(id: number): Observable<PartnnerUser> {

        return this._httpClient.get<PartnnerUser>(URL_PARCEIRO + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * @return o array de items contendo todos os usuários do tipo Edriving
     */
    getAll(): Observable<PartnnerUser[]> {
        return this._httpClient.get<PartnnerUser[]>(URL_PARCEIRO).pipe(
            switchMap((response: PartnnerUser[]) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Cria um novo um usuário do edriving
     *
     * @param data model do usuario
     * @return retorna o usuário ou error
     */
    create(data: PartnnerPost): Observable<PartnnerUser> {
        return this._httpClient.post(URL_PARCEIRO, data).pipe(
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
    update(data: PartnnerPost): Observable<PartnnerUser> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }

        return this._httpClient.put(URL_PARCEIRO, data).pipe(
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

        return this._httpClient.delete(URL_PARCEIRO + '/' + id).pipe(
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
        return this._httpClient.get(URL_PARCEIRO_CARGO).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
