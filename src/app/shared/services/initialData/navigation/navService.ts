import {Injectable, OnDestroy} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {
    defaultNavigation,
    parceiroNavigation,
    plataformaNavigation
} from 'app/shared/services/initialData/navigation/data';
import {AuthService} from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NavServices {
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _plataformaNavigation: FuseNavigationItem[] = plataformaNavigation;
    private readonly _parceiroNavigation: FuseNavigationItem[] = parceiroNavigation;
    private nivelAcesso: number = 0;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _authServices: AuthService
    ) {
        // Register Mock API handlers
        if (this._authServices.getUserInfoFromStorage()) {
            this.nivelAcesso = this._authServices.getUserInfoFromStorage().nivelAcesso;
            console.log(this._authServices.getUserInfoFromStorage().nivelAcesso);
        }
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    private registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                if(this._defaultNavigation.length === 1){
                    //Montagem do menu para os usuário da plataforma do tipo Edriving
                    if (this.nivelAcesso >= 10 && this.nivelAcesso < 20) {
                        this._defaultNavigation.push(...this._plataformaNavigation);
                        this._defaultNavigation.push(...this._parceiroNavigation);
                        // Return the response
                        return [
                            200,
                            {
                                compact: cloneDeep(this._defaultNavigation),
                                default: cloneDeep(this._defaultNavigation),
                                futuristic: cloneDeep(this._defaultNavigation),
                                horizontal: cloneDeep(this._defaultNavigation)
                            }
                        ];
                    }

                    //Montagem do menu para os usuários do tipo parceiro
                    if (this.nivelAcesso >= 20 && this.nivelAcesso < 30) {
                        this._defaultNavigation.push(...this._parceiroNavigation);
                        // Return the response
                        return [
                            200,
                            {
                                compact: cloneDeep(this._defaultNavigation),
                                default: cloneDeep(this._defaultNavigation),
                                futuristic: cloneDeep(this._defaultNavigation),
                                horizontal: cloneDeep(this._defaultNavigation)
                            }
                        ];
                    }


                }

                return [
                    200,
                    {
                        compact: cloneDeep(this._defaultNavigation),
                        default: cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._defaultNavigation),
                        horizontal: cloneDeep(this._defaultNavigation)
                    }
                ];
            });
    }
}
