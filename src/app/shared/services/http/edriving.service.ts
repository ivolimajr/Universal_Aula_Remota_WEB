import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EdrivingModel} from '../../models/edriving.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/level.model';
import {HttpBaseServices} from './httpBaseServices';
import {AuthService} from '../auth/auth.service';

const URL_EDRIVING = '/edriving';
const URL_EDRIVING_CARGO = `${environment.apiUrl}/EdrivingLevel`;

@Injectable({
    providedIn: 'root'
})
export class EdrivingService extends HttpBaseServices<EdrivingModel> {

    constructor(
        public _httpClient: HttpClient,
        public _authService: AuthService
    ) {
        super(
            _httpClient,
            URL_EDRIVING,
            _authService,
        );
    }

    getCargos(): Observable<Level[]> {
        return this._httpClient.get(URL_EDRIVING_CARGO).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
