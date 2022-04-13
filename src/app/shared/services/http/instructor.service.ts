import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {HttpBaseServices} from './httpBaseServices';
import {InstructorModel} from '../../models/instructor.model';

const URL_AUTOESCOLA = '/instructor';

@Injectable({
    providedIn: 'root'
})
export class InstructorService extends HttpBaseServices<InstructorModel> {

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
}
