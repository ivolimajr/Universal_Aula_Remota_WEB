import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlataformaGuard implements CanActivate, CanActivateChild, CanLoad {

    private nivelAcesso: number = null;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        this.nivelAcesso = this._authService.getUserInfoFromStorage().nivelAcesso;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {

                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the login page
                        this._router.navigate(['login'], {queryParams: {redirectURL}});

                        // Prevent the access
                        return of(false);
                    }

                    // Allow the access
                    if(this.nivelAcesso >= 10 && this.nivelAcesso < 20){
                        return of(true);
                    }

                    this._router.navigate([''], {queryParams: {redirectURL}});

                    // Prevent the access
                    return of(false);
                })
            );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ParceiroGuard implements CanActivate,  CanActivateChild, CanLoad {

    private nivelAcesso: number = null;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        this.nivelAcesso = this._authService.getUserInfoFromStorage().nivelAcesso;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {

                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the login page
                        this._router.navigate(['login'], {queryParams: {redirectURL}});

                        // Prevent the access
                        return of(false);
                    }

                    // Allow the access
                    if((this.nivelAcesso >= 10 && this.nivelAcesso < 20) || (this.nivelAcesso >= 20 && this.nivelAcesso < 30)){
                        return of(true);
                    }

                    this._router.navigate([''], {queryParams: {redirectURL}});

                    // Prevent the access
                    return of(false);
                })
            );
    }
}
