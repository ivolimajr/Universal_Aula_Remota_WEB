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
import {RoleModel} from '../../models/role.model';
import {RolesConstants} from '../../constants';

@Injectable({
    providedIn: 'root'
})
export class AdministrativeGuard implements CanActivate, CanActivateChild, CanLoad {

    private roles: Array<RoleModel> = null;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        this.roles = this._authService.getUserInfoFromStorage().roles;
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
                    if (this.roles.find(r => r.role === RolesConstants.ADMINISTRATIVO || r.role === RolesConstants.EDRIVING)) {
                        return of(true);
                    }

                    this._router.navigate([''], {queryParams: {redirectURL}});
                    // Prevent the access
                    return of(false);
                })
            );
    }
}
