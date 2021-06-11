import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from "@angular/router";

import { BaseModel } from "../../models/baseModels/base.model";
import { environment } from '../../../../environments/environment';
import { TokenService } from "./token-service.service";
import { Token } from "../../models/auth/token.model";
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
    private authHttpService: AuthHTTPService,) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<BaseModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  get currentUserValue(): BaseModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: BaseModel) {
    this.currentUserSubject.next(user);
  }

  // public methods
  login(email: string, password: string): Observable<BaseModel> {

    if (environment.auth.apiAtiva) {
      console.log(this.tokenService.getTokenCookie());
      if (this.tokenService.anyTokenCookie()) {
        this.isLoadingSubject.next(true);
        return this.authHttpService.login(email, password).pipe(
          map((user: BaseModel) => {
            console.log("AQUII");
            console.log(user.fullName);
            const result = this.setAuthFromLocalStorage(user);
            return result;
          }),
          catchError((err) => {
            console.error('err', err);
            return of(undefined);
          }),
          finalize(() => this.isLoadingSubject.next(false))
        );
      }
      else {
        this.tokenService.generateToken().then(() => this.login(email, password));
      }
    }
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((result: BaseModel[]) => {
        console.log("Result");
        console.log(result);

        if (result.length <= 0) {
          return null;
        }
        result.forEach(element => {
          if (element.email == email && element.senha == password) {
            console.log(result);

            this.user.email = JSON.parse(element.email);
            this.user.fullName = JSON.parse(element.fullName);
          }
        });

        const user = result.find((u) => {
          u.email.toLowerCase() === email.toLowerCase() &&
            u.senha === password
          console.log(user);

          const res = this.setAuthFromLocalStorage(user);
          return res;
        })
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
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