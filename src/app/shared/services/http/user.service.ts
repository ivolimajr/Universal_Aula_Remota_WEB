import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AddressModel} from '../../models/endereco.model';


const URL_USER_API = `${environment.apiUrl}/Usuario`;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Remove um telefone de qualquer usuário
     *
     * @param id do telefone a ser removido
     * @return retorna um booleano ou error
     */
    removePhonenumber(id: number): Observable<boolean> {
        if (id === 0 || id == null) {
            return of(false);
        }
        return this._httpClient.delete(URL_USER_API + '/telefone/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e.error))
        );
    }
    /**
     * Remove um arquivo de um usuário
     *
     * @param id do arquivo a ser removido
     * @return retorna um booleano ou error
     */
    removeFile(id: number): Observable<boolean> {
        if (id === 0 || id == null) {
            return of(false);
        }
        return this._httpClient.delete(URL_USER_API + '/RemoveArquivo/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e.error))
        );
    }

    /**
     * Atualiza a senha de qualquer usuário
     *
     * @param id do telefone a ser removido
     * @return retorna um booleano ou error
     */
    updatePassById(credentials: { id: number; senhaAtual: string; novaSenha: string }): Observable<boolean> {
        if (credentials.id === 0 || credentials.id == null) {
            return of(false);
        }

        return this._httpClient.post(URL_USER_API + '/alterar-senha/', credentials).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Atualiza a endereco de qualquer usuário
     *
     * @param endereco do usuário a ser atualizado
     * @return retorna um endereco ou error
     */
    updateAddress(endereco: AddressModel): Observable<AddressModel> {
        if (endereco.id === 0 || endereco.id == null) {
            return of(null);
        }

        return this._httpClient.put(URL_USER_API + '/atualizar-endereco/', endereco).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
