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
    loading: boolean = false;
    private dataSub: Subscription;
    private userSub: Subscription;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<AdministrativeModel>;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _administrativeServices: AdministrativeService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
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
        } else{
            const dialogRef = this.dialog.open(AdministrativeFormComponent);
            dialogRef.componentInstance.id = null;
        }
    }

    removeUser(id: number, email: string): void {

    }

    ngOnInit(): void {
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
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.dataSub) {
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
        this.dataSub = this._users$.subscribe((items: AdministrativeModel[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
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
