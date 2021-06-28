import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EdrivingServices {

  private readonly URL_EDRIVING = '/Edriving';

  constructor(private http: HttpClient) {
  }

  public getUsuariosEdriving(): Observable<any> {
    return this.http.get(environment.auth.url + this.URL_EDRIVING);
  }

}