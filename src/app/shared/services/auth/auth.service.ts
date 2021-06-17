import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
export class AuthService {

  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private user: BaseModel;

  currentUser$: Observable<BaseModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<BaseModel>;
  isLoadingSubject: BehaviorSubject<boolean>;

  /**
   *
   */
  constructor(private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private authHttpService: AuthHTTPService,
    private htttp: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<BaseModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  loginuser(email: string, senha: string): Observable<any> {
    const url_api = environment.auth.url + '/usuario';
    return this.htttp
      .post<BaseModel>(
        url_api,
        { email, senha },
        { headers: this.headers }
      )
      .pipe(map(data => data));
  }

  get currentUserValue(): BaseModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: BaseModel) {
    this.currentUserSubject.next(user);
  }

  // private methods
  private setAuthFromLocalStorage(user: BaseModel): boolean {
    if (user && user.email) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): BaseModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}