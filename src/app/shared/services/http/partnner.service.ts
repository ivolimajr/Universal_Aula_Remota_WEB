import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PartnnerModel} from '../../models/partnner.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/level.model';
import {HttpBaseServices} from './httpBaseServices';

const URL_PARCEIRO = '/Partnner';
const URL_PARCEIRO_CARGO = `${environment.apiUrl}/PartnnerLevel`;

@Injectable({
    providedIn: 'root'
})
export class PartnnerService extends HttpBaseServices<PartnnerModel> {

    constructor(_httpClient: HttpClient) {
        super(
            _httpClient,
            URL_PARCEIRO
        );
    }

    getCargos(): Observable<Level[]> {
        return this._httpClient.get(URL_PARCEIRO_CARGO).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
