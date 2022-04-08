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
import {DrivingSchoolService} from '../../shared/services/http/drivingSchool.service';
import {AdministrativeService} from '../../shared/services/http/administrative.service';
import {AdministrativeModel} from '../../shared/models/administrative.model';

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
    administrativeUser: AdministrativeModel = null;
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
        private _drivingSchoolServices: DrivingSchoolService,
        private _administrativeServices: AdministrativeService
    ) {
    }

    ngOnInit(): void {
        this.loadUser();
        this.mediaChanges();
    }

    ngOnDestroy(): void {
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
                this._changeDetectorRef.markForCheck();
            });
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over')
            this.drawer.close().then(r => console.log(r));
        this._changeDetectorRef.markForCheck();
    }

    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private loadUser(): void {
        //pega os dados do usuário que estão no localstorage
        this.auth$ = this._authService.user$.subscribe((res) => {
            if (res.roles.find(r => r.role === RolesConstants.EDRIVING))
                this.loadEdrivingPanel(res.id);
            if (res.roles.find(r => r.role === RolesConstants.PARCEIRO))
                this.loadPartnnerPanel(res.id);
            if (res.roles.find(r => r.role === RolesConstants.AUTOESCOLA))
                this.loadDrivingSchoolPanel(res.id);
            if (res.roles.find(r => r.role === RolesConstants.ADMINISTRATIVO))
                this.loadAdministrativePanel(res.id);
        });
    }

    private loadEdrivingPanel(id: number): void {
        this.user$ = this._edrivingServices.getOne(id).subscribe((result) => {
            this.edrivingUser = result;
            this.idUser = result.userId;
            this.loadPanel();
        });
    }

    private loadPartnnerPanel(id: number): void {
        this.user$ = this._partnnerServices.getOne(id).subscribe((result) => {
            this.partnnerUser = result;
            this.addressModel = result.address;
            this.idUser = result.id;
            this.loadAddressPanel();
            this.loadPanel();
        });
    }

    private loadDrivingSchoolPanel(id: number): void {
        this.user$ = this._drivingSchoolServices.getOne(id).subscribe((result) => {
            this.drivingSchoolUser = result;
            this.addressModel = result.address;
            this.idUser = result.id;
            this.loadAddressPanel();
            this.loadFilesPanel();
            this.loadPanel();
        });
    }

    private loadAdministrativePanel(id: number): void {
        this.user$ = this._administrativeServices.getOne(id).subscribe((result) => {
            if (!result) {
                return null;
            }
            this.administrativeUser = result;
            this.addressModel = result.address;
            this.idUser = result.userId;
            this.loadAddressPanel();
            this.loadPanel();
        });
    }

    private loadPanel(): void {
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
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }

    private loadAddressPanel(): void {
        this.panels.push(
            {
                id: 'endereco',
                icon: 'heroicons_outline:home',
                title: 'Endereço',
                description: 'Mantenha seu endereço atualizado.'
            }
        );
    }

    private loadFilesPanel(): void {
        this.panels.push(
            {
                id: 'files',
                icon: 'heroicons_outline:folder',
                title: 'Arquivos',
                description: 'Seus arquivos estão aqui'
            }
        );
    }
}
