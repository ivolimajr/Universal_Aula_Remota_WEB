import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseNavigationItem} from '@fuse/components/navigation';
import {FuseMockApiService} from '@fuse/lib/mock-api';
import {
    autoEscolaNavigation,
    defaultNavigation,
    parceiroNavigation,
    plataformaNavigation
} from 'app/shared/services/initialData/navigation/data';
import {AuthService} from '../../auth/auth.service';
import {RoleModel} from '../../../models/role.model';
import {RolesConstants} from '../../../constants';

@Injectable({
    providedIn: 'root'
})
export class NavServices {
    private _dataNavigation: FuseNavigationItem[] = [];
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _plataformaNavigation: FuseNavigationItem[] = plataformaNavigation;
    private readonly _parceiroNavigation: FuseNavigationItem[] = parceiroNavigation;
    private readonly _autoEscolaNavigation: FuseNavigationItem[] = autoEscolaNavigation;
    private roles: Array<RoleModel> = null;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _authServices: AuthService
    ) {
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
                this._dataNavigation = [];

                if (this._authServices.getUserInfoFromStorage()) {
                    this.roles = this._authServices.getUserInfoFromStorage().roles;
                } else {
                    this._dataNavigation.push(...this._defaultNavigation);
                    return [
                        200,
                        {
                            compact: cloneDeep(this._dataNavigation),
                            default: cloneDeep(this._dataNavigation),
                            futuristic: cloneDeep(this._dataNavigation),
                            horizontal: cloneDeep(this._dataNavigation)
                        }
                    ];
                }

                //Montagem do menu para os usuário da plataforma do tipo Edriving
                if (this.roles.find(r => r.role === RolesConstants.EDRIVING)) {
                    this._dataNavigation.push(...this._defaultNavigation);
                    this._dataNavigation.push(...this._plataformaNavigation);
                    this._dataNavigation.push(...this._parceiroNavigation);
                    this._dataNavigation.push(...this._autoEscolaNavigation);
                }
                //Montagem do menu para os usuários do tipo parceiro
                else if (this.roles.find(r => r.role === RolesConstants.EDRIVING) || this.roles.find(r => r.role === RolesConstants.PARCEIRO)) {
                    this._dataNavigation.push(...this._defaultNavigation);
                    this._dataNavigation.push(...this._parceiroNavigation);
                }
                //Montagem do menu para os usuários do tipo autoEscola
                else if (this.roles.find(r => r.role === RolesConstants.EDRIVING) || this.roles.find(r => r.role === RolesConstants.AUTOESCOLA)) {
                    this._dataNavigation.push(...this._defaultNavigation);
                    this._dataNavigation.push(...this._autoEscolaNavigation);
                }
                // Return the response
                return [
                    200,
                    {
                        compact: cloneDeep(this._dataNavigation),
                        default: cloneDeep(this._dataNavigation),
                        futuristic: cloneDeep(this._dataNavigation),
                        horizontal: cloneDeep(this._dataNavigation)
                    }
                ];
            });
    }
}
