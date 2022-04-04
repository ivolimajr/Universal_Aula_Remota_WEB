import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Level} from '../../models/level.model';
import {DrivingSchoolModel} from '../../models/drivingSchool.model';
import {AuthService} from '../auth/auth.service';
import {HttpBaseServices} from './httpBaseServices';

const URL_AUTOESCOLA = '/DrivingSchool';
const URL_AUTOESCOLA_CARGO = `${environment.apiUrl}/DrivingSchoolLevel`;

@Injectable({
    providedIn: 'root'
})
export class DrivingSchoolService extends HttpBaseServices<DrivingSchoolModel> {

    constructor(
         _httpClient: HttpClient,
         _httpBackend: HttpBackend,
         _authService: AuthService
    ) {
        super(
            _httpClient,
            URL_AUTOESCOLA,
            _authService,
            _httpBackend
        );
    }

    getCargos(): Observable<Level[]> {
        return this._httpClient.get(URL_AUTOESCOLA_CARGO).pipe(
            switchMap((response: any) => of(response['items'])),
            catchError(e => of(e))
        );
    }
}
