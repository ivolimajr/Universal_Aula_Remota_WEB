import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {EdrivingFormModalComponent} from './edriving-form-modal/edriving-form-modal.component';
import {EdrivingService} from '../../../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../../../shared/models/edriving.module';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../@fuse/components/alert';
import {DeleteModalComponent} from './delete-modal/delete-modal.component';

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

    displayedColumns: string[] = ['nome', 'email', 'id'];
    dataSource = new MatTableDataSource<EdrivingUsuario>(ELEMENT_DATA);
    loading: boolean = true;
    showAlert: boolean = false;
    _users$ = this._edrivingServices.getAll();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
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

    creteUser(): void {
        this.showAlert = false;
        const dialogRef = this.dialog.open(EdrivingFormModalComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if(result){
                this.dataSource.data = [...this.dataSource.data,result];
                this.setAlert('Inserido','success');
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    removeUser(id: number): void {
        if (id === 0 || id === null || id === this._authServices.getUserInfoFromStorage().id) {
            this.setAlert('Remoção Inválida');
            return;
        }

        const dialogRef = this.dialog.open(DeleteModalComponent, {});
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return;
            }
            this.deleteFromApi(id);
        });
    }

    private getUsers(): void {
        this._users$.subscribe((items: EdrivingUsuario[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    private deleteFromApi(id: number): void {
        this._edrivingServices.delete(id).subscribe((res)=>{
            if(res){
                this.setAlert('Removido', 'success');
                this.getUsers();
                this._changeDetectorRef.markForCheck();
                return;
            }
            this.setAlert('Problemas na Remoção');
        });
    }

    private setAlert(value: string, type: any = 'error'): void {
        this.showAlert = false;
        this.alert.type = type;
        this.alert.message = value;
        this.showAlert = true;
    }
}
