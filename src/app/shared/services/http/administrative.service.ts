import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdministrativeModel} from '../../models/administrative.model';
import {HttpBaseServices} from './httpBaseServices';
import {AuthService} from '../auth/auth.service';

const URL_ADMINISTRATIVE = '/Administrative';

@Injectable({
    providedIn: 'root'
})
export class AdministrativeService extends HttpBaseServices<AdministrativeModel> {

    constructor(
        public _httpClient: HttpClient,
        public _authService: AuthService
    ) {
        super(
            _httpClient,
            URL_ADMINISTRATIVE,
            _authService
        );
    }
}
