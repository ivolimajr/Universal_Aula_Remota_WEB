import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AdministrativeModel} from '../../../../shared/models/administrative.model';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {AdministrativeService} from '../../../../shared/services/http/administrative.service';
import {Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {AdministrativeFormComponent} from './administrative-form/administrative-form.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';
import {AuthService} from '../../../../shared/services/auth/auth.service';

const ELEMENT_DATA: AdministrativeModel[] = [];

@Component({
    selector: 'app-administrative',
    templateUrl: './administrative.component.html',
    styleUrls: ['./administrative.component.scss']
})
export class AdministrativeComponent implements AfterViewInit, OnInit, OnDestroy {

    displayedColumns: string[] = ['name', 'email', 'id']; //Exibe as colunas da tabela
    dataSource = new MatTableDataSource<AdministrativeModel>(ELEMENT_DATA); //Dados da tabela
    isDeleting: boolean = false;
    _users$ = this._administrativeServices.getAll();
    loading: boolean = true;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<AdministrativeModel>;
    private data$: Subscription;
    private user$: Subscription;

    constructor(
        public dialog: MatDialog,
        private _authServices: AuthService,
        private _snackBar: MatSnackBar,
        private _administrativeServices: AdministrativeService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.getUsers();
    }

    addUser(user: AdministrativeModel): void {
        if (user) {
            const dialogRef = this.dialog.open(AdministrativeFormComponent);
            dialogRef.componentInstance.id = user.id;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.openSnackBar('Atualizado');
                    this.getUsers();
                }
            });
        } else {
            const dialogRef = this.dialog.open(AdministrativeFormComponent);
            dialogRef.componentInstance.id = null;
            dialogRef.afterClosed().subscribe((res) => {
                if (res) {
                    this.dataSource.data = [...this.dataSource.data, res];
                    this.openSnackBar('Inserido');
                    this._changeDetectorRef.detectChanges();
                }
            });
        }
    }

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

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getUsers();
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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.data$) {
            this.data$.unsubscribe();
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
        this.data$ = this._users$.subscribe((items: AdministrativeModel[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    private deleteFromApi(id: number): void {
        this.user$ = this._administrativeServices.delete(id).subscribe((res: any) => {
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
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

}
