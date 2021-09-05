import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ParceiroUsuario} from '../../../../shared/models/parceiro.model';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../@fuse/components/alert';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {ParceiroService} from '../../../../shared/services/http/parceiro.service';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';
import {ParceiroFormModalComponent} from './parceiro-form-modal/parceiro-form-modal.component';


const ELEMENT_DATA: ParceiroUsuario[] = [];

@Component({
  selector: 'app-parceiro',
  templateUrl: './parceiro.component.html',
  styleUrls: ['./parceiro.component.scss'],
    animations: fuseAnimations
})
export class ParceiroComponent implements AfterViewInit, OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    displayedColumns: string[] = ['nome', 'email', 'id'];
    dataSource = new MatTableDataSource<ParceiroUsuario>(ELEMENT_DATA);
    loading: boolean = true;
    showAlert: boolean = false;
    _users$ = this._parceiroServices.getAll();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatTable) table: MatTable<ParceiroUsuario>;

    constructor(
        public dialog: MatDialog,
        private _authServices: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: ParceiroService
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
        const dialogRef = this.dialog.open(ParceiroFormModalComponent);

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

        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirmar Remoção ?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return;
            }
            this.deleteFromApi(id);
        });
    }

    private getUsers(): void {
        this._users$.subscribe((items: ParceiroUsuario[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    private deleteFromApi(id: number): void {
        this._parceiroServices.delete(id).subscribe((res)=>{
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
