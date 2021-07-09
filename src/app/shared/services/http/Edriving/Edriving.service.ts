import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take } from "rxjs/operators";
import { EdrivingGetAll, EdrivingPost } from '../../../models/edriving/edrivingModel.model';
import { BaseServices } from "../base.services";

@Injectable({
  providedIn: 'root'
})
export class EdrivingServices extends BaseServices {

  private readonly URL_EDRIVING = this.UrlService + '/Edriving';

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<any> {
    return this.http.get(this.URL_EDRIVING, this.ObterHeaderJson());
  }

  getOne(id: number): Observable<EdrivingGetAll> {
    return this.http.get<EdrivingGetAll>(this.URL_EDRIVING + '/' + id, this.ObterHeaderJson()).pipe(take(1));
  }

  setEdriving(edrivingModel: EdrivingPost): Observable<EdrivingGetAll> {
    let response = this.http
      .post(this.URL_EDRIVING, edrivingModel, this.ObterHeaderJson())
      .pipe(
        map(this.extractData),
        catchError(this.serviceError))

    return response;
  }

  public deleteEdriving(id: number): Observable<any> {
    return this.http.post(this.URL_EDRIVING + '/delete/?id=' + id, this.ObterHeaderJson())
      .pipe(map(data => {
        return data
      }),
        catchError(this.serviceError));
  }
}