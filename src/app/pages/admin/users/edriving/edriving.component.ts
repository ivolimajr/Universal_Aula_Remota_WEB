import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {EdrivingFormModalComponent} from './edriving-form-modal/edriving-form-modal.component';
import {EdrivingService} from '../../../../shared/services/http/edriving.service';
import {EdrivingUser} from '../../../../shared/models/edriving.model';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';

const ELEMENT_DATA: EdrivingUser[] = [];

@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    styleUrls: ['./edriving.component.scss'],
    animations: fuseAnimations
})

export class EdrivingComponent implements AfterViewInit, OnInit, OnDestroy {

    displayedColumns: string[] = ['name', 'email', 'id']; //Exibe as colunas da tabela
    dataSource = new MatTableDataSource<EdrivingUser>(ELEMENT_DATA); //Dados da tabela
    loading: boolean = true;
    isDeleting: boolean = false;
    _users$ = this._edrivingServices.getAll(); //Observable dos usuário
    private dataSub: Subscription;
    private userSub: Subscription;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<EdrivingUser>;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
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
    addUser(user: EdrivingUser): void {

        //Atualiza um usuário
        if (user) {
            const dialogRef = this.dialog.open(EdrivingFormModalComponent);
            dialogRef.componentInstance.userEdit = user;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.openSnackBar('Atualizado');
                    this.getUsers();
                }
            });
        } else {
            //Cria um usuário
            const dialogRef = this.dialog.open(EdrivingFormModalComponent);
            dialogRef.componentInstance.userEdit = user;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.dataSource.data = [...this.dataSource.data, result];
                    this.openSnackBar('Inserido');
                    this._changeDetectorRef.detectChanges();
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
    removeUser(id: number, email: string): void {
        this.isDeleting = true;
        this._changeDetectorRef.markForCheck();
        //Se o id informado for nulo, ou se o usuário for remover ele mesmo, é retornado um erro
        if (email !== this._authServices.getUserInfoFromStorage().email) {
            //Exibe o alerta de confirmação
            const dialogRef = this.dialog.open(AlertModalComponent, {
                width: '280px',
                data: {title: 'Confirmar Remoção ?'}
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (!result) {
                    this.isDeleting = false;
                    this._changeDetectorRef.markForCheck();
                    return;
                }
                //Se a confirmação do alerta for um OK, remove o usuário
                this.deleteFromApi(id);
            });
            return;
        }
        this.isDeleting = false;
        this._changeDetectorRef.markForCheck();
        this.openSnackBar('Remoção Inválida');
        return;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if(this.userSub){
            this.userSub.unsubscribe();
        }
        if(this.dataSub){
            this.dataSub.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Lista os usuários
     *
     * @private
     * @return void
     */
    private getUsers(): void {
        this.dataSub = this._users$.subscribe((items: EdrivingUser[]) => {
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
        this.userSub = this._edrivingServices.delete(id).subscribe((res: any)=>{
            if (res.error) {
                this.isDeleting = false;
                this._changeDetectorRef.markForCheck();
                return;
            }
            this.isDeleting = false;
            this._changeDetectorRef.markForCheck();
            this.openSnackBar('Removido');
            this.getUsers();
            return;
        });
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message,'',{
            duration: 5*1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-'+type]
        });
    }
}
