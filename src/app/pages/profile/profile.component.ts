import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {EdrivingService} from '../../shared/services/http/edriving.service';
import {EdrivingModel} from '../../shared/models/edriving.model';
import {AuthService} from '../../shared/services/auth/auth.service';
import {PartnnerModel} from '../../shared/models/partnner.model';
import {PartnnerService} from '../../shared/services/http/partnner.service';
import {AddressModel} from '../../shared/models/address.model';
import {RolesConstants} from '../../shared/constants';
import {DrivingSchoolModel} from '../../shared/models/drivingSchool.model';
import {DrivingSchoolService} from "../../shared/services/http/drivingSchool.service";

@Component({
    selector: 'app-perfil',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'dadosPessoais';

    edrivingUser: EdrivingModel = null;
    drivingSchoolUser: DrivingSchoolModel = null;
    partnnerUser: PartnnerModel = null;
    addressModel: AddressModel = null;
    loading: boolean = true;
    idUser: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private user$: Subscription;
    private auth$: Subscription;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _authService: AuthService,
        private _edrivingServices: EdrivingService,
        private _partnnerServices: PartnnerService,
        private _drivingSchoolServices: DrivingSchoolService
    ) {
    }

    ngOnInit(): void {
        this.loadUser();
        this.mediaChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.auth$) {
            this.auth$.unsubscribe();
        }
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._changeDetectorRef.markForCheck();
    }


    // -----------------------------------------------------------------------------------------------------
    // Comportamento do painel
    // -----------------------------------------------------------------------------------------------------

    //Carrega os dados do painel para usuários do Edriving
    loadPanel(): void {
        this.panels = [
            {
                id: 'dadosPessoais',
                icon: 'heroicons_outline:user-circle',
                title: 'Dados Pessoais',
                description: 'Gerencie seus dados pessoais'
            },
            {
                id: 'seguranca',
                icon: 'heroicons_outline:lock-closed',
                title: 'Segurança',
                description: 'Mantenha sua conta protegida.'
            }
        ];
        this._changeDetectorRef.markForCheck();
    }


    //Altera entre a sobreposição do painel esquerdo com direito, sobrepoe ou escurece.
    mediaChanges(): void {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Navega entre os paineis
     *
     * @param id do painel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Busca as informações do Painel
     *
     * @param id do painel
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // Usuario
    // -----------------------------------------------------------------------------------------------------

    /**
     * Carrega o usuário para edição dos dados
     * É um condicional para exibir o formulário, dependendo do nível de acesso é renderizado um componente.
     *
     * @private
     */
    private loadUser(): void {
        //pega os dados do usuário que estão no localstorage
        this.auth$ = this._authService.user$.subscribe((res) => {
            //verifica se o usuário tem perfil de edriving - perfil que gerencia a plataforma
            if (res.roles.find(r => r.role === RolesConstants.EDRIVING)) {
                //busca o usuário na API
                this.user$ = this._edrivingServices.getOne(res.id).subscribe((result) => {
                    this.edrivingUser = result;
                    //Set o id do usuário para alterar a senha
                    this.idUser = result.userId;
                    //carrega o painel A
                    this.loadPanel();
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                });
            }
            //verifica se o usuário tem perfil de edriving - perfil que gerencia a plataforma
            if (res.roles.find(r => r.role === RolesConstants.PARCEIRO)) {
                //busca o usuário na API
                this.user$ = this._partnnerServices.getOne(res.id).subscribe((result) => {
                    this.partnnerUser = result;
                    this.addressModel = result.address;
                    //Set o id do usuário para alterar a senha
                    this.idUser = result.id;
                    //carrega o painel A
                    this.loadPanel();
                    this.panels.push(
                        {
                            id: 'endereco',
                            icon: 'heroicons_outline:lock-closed',
                            title: 'Endereço',
                            description: 'Mantenha seu endereço atualizado.'
                        }
                    );
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                });
            }
            if (res.roles.find(r => r.role === RolesConstants.AUTOESCOLA)) {
                //busca o usuário na API
                this.user$ = this._drivingSchoolServices.getOne(res.id).subscribe((result) => {
                    this.drivingSchoolUser = result;
                    this.addressModel = result.address;
                    //Set o id do usuário para alterar a senha
                    this.idUser = result.id;
                    //carrega o painel A
                    this.loadPanel();
                    this.panels.push(
                        {
                            id: 'endereco',
                            icon: 'heroicons_outline:lock-closed',
                            title: 'Endereço',
                            description: 'Mantenha seu endereço atualizado.'
                        }
                    );
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                });
            }
            this._changeDetectorRef.markForCheck();
        });
    }
}
