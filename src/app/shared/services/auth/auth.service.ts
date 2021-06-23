import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { BaseModel } from "../../models/baseModels/base.model";
import { environment } from '../../../../environments/environment';
import { TokenService } from "./token-service.service";
import { AuthHTTPService } from './authHttpService.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  forgotPassword(value: any) {
    throw new Error('Method not implemented.');
  }

  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

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
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<BaseModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  login(email: string, senha: string): Observable<any> {

    this.isLoadingSubject.next(true);
    const url_api = environment.auth.url + '/usuario/login';
    return this.http
      .post<BaseModel>(
        url_api,
        { email, senha },
        { headers: this.headers }
      )
      .pipe(map(data => {
        this.currentUserSubject = new BehaviorSubject<BaseModel>(data);
        return data
      }));
  }
  // private methods
  public setAuthFromLocalStorage(user: BaseModel) {
    localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
  }

  public getAuthFromLocalStorage(): BaseModel {
    return JSON.parse(localStorage.getItem(this.authLocalStorageToken));
  }


  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}