import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EdrivingCargoServices {

  private readonly URL_EDRIVING_CARGO = '/EdrivingCargo';

  constructor(private http: HttpClient) {
  }

  public getCargos(): Observable<any> {
    return this.http.get(environment.apiUrl + this.URL_EDRIVING_CARGO);
  }
}