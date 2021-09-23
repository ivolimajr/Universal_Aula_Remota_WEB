import {Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Cargo} from '../../models/cargo.model';
import {AutoEscolaPost, AutoEscolaUsuario} from '../../models/autoEscola.model';


const URL_AUTOESCOLA = `${environment.apiUrl}/AutoEscola`;
const URL_AUTOESCOLA_CARGO = `${environment.apiUrl}/AutoescolaCargo`;

@Injectable({
    providedIn: 'root'
})
export class AutoescolaService {
    @ViewChild('fileInput') selectedFileEl;

    header = new HttpHeaders();

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Recupera um usuário do Edriving
     *
     * @param id do usuário a ser consultado
     * @return retorna um usuário ou o error
     */
    getOne(id: number): Observable<AutoEscolaUsuario> {
        return this._httpClient.get<AutoEscolaUsuario>(URL_AUTOESCOLA + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError((e) => {
                console.log(e);
                return of(e);
            })
        );
    }

    /**
     * @return o array de items contendo todos os usuários do tipo Edriving
     */
    getAll(): Observable<AutoEscolaUsuario[]> {
        return this._httpClient.get<AutoEscolaUsuario[]>(URL_AUTOESCOLA).pipe(
            switchMap((response: AutoEscolaUsuario[]) => of(response['items'])),
            catchError(e => of(e))
        );
    }

    /**
     * Cria um novo um usuário do edriving
     *
     * @param data model do usuario
     * @return retorna o usuário ou error
     */
    create(data: AutoEscolaPost): Observable<AutoEscolaPost> {

        this.header = this.header.set('Content-Type', 'multipart/form-data');
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
        /*
        data.arquivos.forEach((item) =>{
            const file: File = item.arquivo;
            formData.append('arquivos', file);
        });
        */
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
    update(data: AutoEscolaPost): Observable<AutoEscolaPost> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }
        return this._httpClient.put(URL_AUTOESCOLA, data).pipe(
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
    getCargos(): Observable<Cargo[]> {
        return this._httpClient.get(URL_AUTOESCOLA_CARGO).pipe(
            switchMap((response: any) => of(response['items'])),
            catchError(e => of(e))
        );
    }
}
