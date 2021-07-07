import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { EdrivingModel, EdrivingPost } from '../../../models/edriving/edrivingModel.model';
import { BaseServices } from "../base.services";

@Injectable({
  providedIn: 'root'
})
export class EdrivingServices extends BaseServices {

  private readonly URL_EDRIVING = this.UrlService + '/Edriving';

  constructor(private http: HttpClient) {
    super();
  }

  public obterTodos(): Observable<any> {
    return this.http.get(this.URL_EDRIVING, this.ObterHeaderJson());
  }

  public setUsuario(edrivingModel: EdrivingPost): Observable<EdrivingModel> {
    let response = this.http
      .post(this.URL_EDRIVING, edrivingModel, this.ObterHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError))

    return response;
  }

  public deleteUsuario(id: number): Observable<any> {
    return this.http.post(this.URL_EDRIVING + '/delete/?id=' + id, this.ObterHeaderJson())
      .pipe(map(data => {
        return data
      }),
        catchError(this.serviceError));
  }
}