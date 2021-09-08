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
import {MatSnackBar} from '@angular/material/snack-bar';


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

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<ParceiroUsuario>;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
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
    /**
     * Atualiza ou adiciona um novo usuário do tipo Edriving
     *
     * @param id -> se tiver ID exibe e atualiza, caso contrário, adiciona
     * @return void
     */
    setUser(id: number): void {

        //Atualiza um usuário
        if (id) {
            const dialogRef = this.dialog.open(ParceiroFormModalComponent);
            dialogRef.componentInstance.id = id;
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.openSnackBar('Atualizado');
                    this.getUsers();
                }
            });
        } else {
            //Cria um usuário
            this.showAlert = false;
            const dialogRef = this.dialog.open(ParceiroFormModalComponent);
            dialogRef.componentInstance.id = id;
            dialogRef.afterClosed().subscribe((result) => {
                if(result){
                    this.dataSource.data = [...this.dataSource.data,result];
                    this.openSnackBar('Inserido');
                    this._changeDetectorRef.detectChanges();
                }
            });
        }
    }

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
        if (id === 0 || id === null || id === this._authServices.getUserInfoFromStorage().id) {
            this.openSnackBar('Remoção Inválida');
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

    /**
     * Lista os usuários
     *
     * @private
     * @return void
     */
    private getUsers(): void {
        this._users$.subscribe((items: ParceiroUsuario[]) => {
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
        this._parceiroServices.delete(id).subscribe((res)=>{
            if (!res) {
                this.openSnackBar('Problemas na Remoção');
            }
            this.openSnackBar('removido');
            this.getUsers();
            return;
        });
    }

    private openSnackBar(message: string): void {
        this._snackBar.open(message,'',{
            duration: 5*1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-accent']
        });
    }
}
