import {Component} from '@angular/core';
import {AuthService} from './shared/services/auth/auth.service';
import {TokenResult} from './shared/models/token.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private token: TokenResult;
    private now = new Date();
    constructor(private _authService: AuthService) {
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
        //Se não houver um token no localStorage, é buscado um token na API
        if (!this._authService.tokenFromLocalStorage) {
            this._authService.getApiTokenFromApi()
                .subscribe((result: TokenResult) => {
                    this._authService.tokenFromLocalStorage = result;
                    return;
                });
        }
        //Verifica se o token está expirado
        const expiration = new Date(this.token.expiration);
        if(expiration < this.now){
            return console.log('Token Vencido');
        }
        console.log('Token em dia');
    }
}
