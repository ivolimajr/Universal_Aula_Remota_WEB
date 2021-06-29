import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  take,
  tap
} from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Token } from '../../models/auth/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token: Token

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  anyTokenCookie(): boolean {
    return !!this.cookieService.get(environment.auth.cookieNameClientCredentials);
  }

  getTokenCookie(): string {
    return this.cookieService.get(environment.auth.cookieNameClientCredentials);
  }

  removeTokenCookie() {
    this.cookieService.deleteAll(environment.auth.cookieNameClientCredentials);
  }

  generateToken() {
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

    return fetch(environment.apiUrl, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.token = JSON.parse(result),
          console.log(this.token.accessToken);
        this.cookieService.set(environment.auth.cookieNameClientCredentials, this.token.accessToken);
      }
      )
      .catch(error => console.log(error)
      );
  }

}
