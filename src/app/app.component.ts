import {Component} from '@angular/core';
import {AuthService} from './shared/services/auth/auth.service';
import {TokenResult} from './shared/models/token.model';
import {environment} from '../environments/environment';
import {LocalStorageService} from './shared/services/storage/localStorage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private token: TokenResult;
    private now = new Date();

    constructor(
        private storageServices: LocalStorageService,
        private _authService: AuthService
    ) {
        this.token = this._authService.tokenFromLocalStorage;
        this.getToken();
    }

    /**
     * Busca um token para autenticar à API
     * Se não tiver um token no STORAGE, o método busca um token na API
     *
     * @private
     * return: void
     */
    private getToken(): void {

        //Se não tiver um token no storage, busca um token
        if (!this._authService.tokenFromLocalStorage) {
            this._authService.getApiTokenFromApi()
                .subscribe((result: TokenResult) => {
                    this._authService.tokenFromLocalStorage = result;
                    window.location.reload();
                    return;
                });
        }

        const expiration = new Date(this.token.expiration);

        //Se tiver um token no storage e a data de expiração for superior a data atual significa que o token é valido
        if (this.token.accessToken && expiration > this.now) {
            return;
        }

        //Se tiver um token no storage e a data de expiração for inferior a data atual, significa que o token está vencido
        if (this.token.accessToken && expiration < this.now) {
            //Busca um novo token a partir od refreshToken
            this._authService.refreshToken(this.token.accessToken, this.token.refreshToken)
                .subscribe((result: TokenResult) => {
                    //Remove o token atual do storage
                    this.storageServices.removeFromStorage(environment.tokenStorage);
                    //Define um novo token no storage
                    this._authService.tokenFromLocalStorage = result;
                    // window.location.reload();
                    return;
                });
            this.storageServices.removeFromStorage(environment.tokenStorage);
            window.location.reload();
            return;
        }
    }
}
