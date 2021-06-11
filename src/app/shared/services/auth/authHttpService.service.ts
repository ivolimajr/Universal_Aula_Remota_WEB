import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Token } from '../../models/auth/token.model';
import { BaseModel } from '../../models/baseModels/base.model';

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    let result = this.http.get<BaseModel>(`${environment.auth.url}/api/usuario`);
    return result;
  }
}
