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
import {EdrivingUser} from '../../shared/models/edriving.model';
import {AuthService} from '../../shared/services/auth/auth.service';
import {PartnnerUser} from '../../shared/models/parceiro.model';
import {PartnnerService} from '../../shared/services/http/partnner.service';
import {AddressModel} from '../../shared/models/address.model';
import {RolesConstants} from '../../shared/constants';

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

    edrivingUser: EdrivingUser = null;
    parceiroUser: PartnnerUser = null;
    enderecoUser: AddressModel = null;
    loading: boolean = true;
    idUser: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private userSub: Subscription;
    private authSub: Subscription;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _authService: AuthService,
        private _edrivingServices: EdrivingService,
        private _parceiroServices: PartnnerService
    ) {
    }

    ngOnInit(): void {
        this.loadUser();
        this.mediaChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if(this.userSub){
            this.userSub.unsubscribe();
        }
        if(this.authSub){
            this.authSub.unsubscribe();
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
        this.authSub = this._authService.user$.subscribe((res) => {
            //verifica se o usuário tem perfil de edriving - perfil que gerencia a plataforma
            if (res.roles.find(r => r.role === RolesConstants.EDRIVING) ) {
                //busca o usuário na API
                this.userSub = this._edrivingServices.getOne(res.id).subscribe((result) => {
                    this.edrivingUser = result;
                    //Set o id do usuário para alterar a senha
                    this.idUser = result.id;
                    //carrega o painel A
                    this.loadPanel();
                    this.loading = false;
                    this._changeDetectorRef.markForCheck();
                });
            }
            //verifica se o usuário tem perfil de edriving - perfil que gerencia a plataforma
            if (res.roles.find(r => r.role === RolesConstants.PARCEIRO) ) {
                //busca o usuário na API
                this.userSub = this._parceiroServices.getOne(res.id).subscribe((result) => {
                    this.parceiroUser = result;
                    this.enderecoUser = result.address;
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
