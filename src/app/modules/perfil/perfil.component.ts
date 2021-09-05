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
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {EdrivingService} from '../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../shared/models/edriving.model';
import {AuthService} from '../../shared/services/auth/auth.service';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'dadosPessoais';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    edrivingUser$: Observable<EdrivingUsuario>;
    idUser: number;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _authService: AuthService,
        private _edrivingServices: EdrivingService
    ) {
    }

    ngOnInit(): void {
        this.loadUser();
        this.mediaChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._changeDetectorRef.markForCheck();
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
        this._authService.user$.subscribe((res) => {
            //verifica se o usuário tem perfil de edriving - perfil que gerencia a plataforma
            if (res.nivelAcesso >= 10 && res.nivelAcesso < 20) {
                //busca o usuário na API
                this.edrivingUser$ = this._edrivingServices.getOne(res.id);
                //carrega o painel A
                this.loadPanelA();
                //Set o id do usuário para alterar a senha
                this.edrivingUser$.subscribe((res) => this.idUser = res.usuarioId);
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Comportamento do painel
    // -----------------------------------------------------------------------------------------------------

    //Carrega os dados do painel para usuários do Edriving
    loadPanelA(): void {
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

    //Carrega os dados do painel com Endereço, para Auto Escola
    loadPanelB(): void {
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
            },
            {
                id: 'endereco',
                icon: 'heroicons_outline:home',
                title: 'Endereço',
                description: 'Mantenha seu endereço sempre atualizado'
            },
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
}
