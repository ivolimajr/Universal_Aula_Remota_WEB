import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../../../_models/user.model';
import { AuthModel } from '../../../_models/auth.model';
import { UsersTable } from '../../../../../_fake/fake-db/users.table';
import { environment } from '../../../../../../environments/environment';
import { Token } from '../../../../../models/auth/token.model';

const API_USERS_URL = `${environment.apiUrl}/users`;
const API_AUTH_URL = `${environment.url}/auth/v1/signin`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly EXPIRATION = 'REFRESH_TOKEN';
  private token: Token

  constructor(private http: HttpClient) { }


  //get Token
  getToken() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
      "userName": "leandro",
      "password": "admin123"
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: body
    };

    fetch(API_AUTH_URL, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.token = JSON.parse(result),
          this.setJwtToken(this.token.accessToken, this.token.refreshToken, this.token.expiration.toString())
      }
      )
      .catch(error => console.log('error', error));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private setJwtToken(accessToken: string, refreshToken: string, expiration: string) {
    localStorage.setItem(this.JWT_TOKEN, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(this.EXPIRATION, expiration);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        if (result.length <= 0) {
          return notFoundError;
        }

        const user = result.find((u) => {
          return (
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
          );
        });
        if (!user) {
          return notFoundError;
        }

        const auth = new AuthModel();
        auth.authToken = user.authToken;
        auth.refreshToken = user.refreshToken;
        auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
        return auth;
      })
    );
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel> {
    const user = UsersTable.users.find((u) => {
      return u.authToken === token;
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }
}
