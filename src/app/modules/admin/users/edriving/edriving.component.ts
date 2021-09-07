import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {EdrivingFormModalComponent} from './edriving-form-modal/edriving-form-modal.component';
import {EdrivingService} from '../../../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../../../shared/models/edriving.model';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../@fuse/components/alert';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';

const ELEMENT_DATA: EdrivingUsuario[] = [];

@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    styleUrls: ['./edriving.component.scss'],
    animations: fuseAnimations
})

export class EdrivingComponent implements AfterViewInit, OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    displayedColumns: string[] = ['nome', 'email', 'id']; //Exibe as colunas da tabela
    dataSource = new MatTableDataSource<EdrivingUsuario>(ELEMENT_DATA); //Dados da tabela
    loading: boolean = true;
    showAlert: boolean = false;
    _users$ = this._edrivingServices.getAll(); //Observable dos usuário

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<EdrivingUsuario>;

    constructor(
        public dialog: MatDialog,
        private _authServices: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getUsers();
    }

    /**
     * Atualiza ou adiciona um novo usuário do tipo Edriving
     *
     * @param id -> se tiver ID exibe e atualiza, caso contrário, adiciona
     * @return void
     */
    setUser(id: number): void {

        //Atualiza um usuário
        if (id) {
            const dialogRef = this.dialog.open(EdrivingFormModalComponent);
            dialogRef.componentInstance.id = id;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.setAlert('Atualizado', 'success');
                    this.getUsers();
                }
            });
        } else {
            //Cria um usuário
            this.showAlert = false;
            const dialogRef = this.dialog.open(EdrivingFormModalComponent);
            dialogRef.componentInstance.id = id;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.dataSource.data = [...this.dataSource.data, result];
                    this.setAlert('Inserido', 'success');
                }
            });
        }
    }

    /**
     * Aplica os filtros de busca
     *
     * @param event
     */
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Remove um usuário caso o alert de confirmação dê OK
     *
     * @param id
     * @return void
     */
    removeUser(id: number): void {
        //Se o id informado for nulo, ou se o usuário for remover ele mesmo, é retornado um erro
        if (id === 0 || id === null || id === this._authServices.getUserInfoFromStorage().id) {
            this.setAlert('Remoção Inválida');
            return;
        }
        //Exibe o alerta de confirmação
        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirmar Remoção ?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return;
            }
            //Se a confirmação do alerta for um OK, remove o usuário
            this.deleteFromApi(id);
        });
    }

    closeAlert(): void {
        this.showAlert = false;
    }

    /**
     * Lista os usuários
     *
     * @private
     * @return void
     */
    private getUsers(): void {
        this._users$.subscribe((items: EdrivingUsuario[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Remove o usuário
     *
     * @param id do usuário a ser removido
     * @private
     * @return void
     */
    private deleteFromApi(id: number): void {
        this._edrivingServices.delete(id).subscribe((res) => {
            if (!res) {
                this.setAlert('Problemas na Remoção');
            }
            this.setAlert('Removido', 'success');
            this.getUsers();
            return;
        });
    }

    private setAlert(value: string, type: any = 'error'): void {
        this.showAlert = false;
        this.alert.type = type;
        this.alert.message = value;
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
    }
}
