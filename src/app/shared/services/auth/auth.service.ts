import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";

import { BaseModel } from "../../models/baseModels/base.model";
import { environment } from '../../../../environments/environment';
import { StorageServices } from '../storage/localStorage.service';
import { BaseServices } from "../http/base.services";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseServices {

  private readonly URL_USUARIO = this.UrlService + '/Usuario';

  forgotPassword(value: any) {
    throw new Error('Method not implemented.');
  }

  private authLocalStorageToken = `${environment.appVersion}-${environment.AuthStorage}`;

  currentUser$: Observable<BaseModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<BaseModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): BaseModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: BaseModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private localStorage: StorageServices,
    private http: HttpClient,
    private router: Router
  ) {
    super();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<BaseModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  login(email: string, senha: string): Observable<any> {

    this.isLoadingSubject.next(true);
    return this.http
      .post<BaseModel>(
        this.URL_USUARIO + '/login?email=' + email + '&senha=' + senha,
        { email, senha },
        this.ObterHeaderJson()
      )
      .pipe(map(data => {
        this.currentUserSubject = new BehaviorSubject<BaseModel>(data);
        return data
      }),
        catchError(this.serviceError));
  }

  logout() {
    this.localStorage.removeFromStorage(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }
}