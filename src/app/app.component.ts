import {Component} from '@angular/core';
import {AuthService} from './shared/services/auth/auth.service';
import {TokenResult} from './shared/models/token.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private _authService: AuthService) {
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
        if (!this._authService.tokenFromLocalStorage) {
            this._authService.getApiTokenFromApi()
                .subscribe((s: TokenResult) => {
                    this._authService.tokenFromLocalStorage = s.accessToken;
                });
        }
    }
}
