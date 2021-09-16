import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InitialData} from 'app/app.types';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitialData> {
        return forkJoin([
            this._httpClient.get<any>('api/common/navigation'),
        ]).pipe(
            map(([navigation]) => ({
                    navigation: {
                        compact: navigation.compact,
                        default: navigation.default,
                        futuristic: navigation.futuristic,
                        horizontal: navigation.horizontal
                    },
                })
            )
        );
    }
}
