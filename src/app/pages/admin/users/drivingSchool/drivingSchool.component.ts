import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {DrivingSchoolService} from '../../../../shared/services/http/drivingSchool.service';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';
import {DrivingSchool} from '../../../../shared/models/drivingSchool.model';
import {Router} from '@angular/router';

const ELEMENT_DATA: DrivingSchool[] = [];

@Component({
  selector: 'app-drivingSchool',
  templateUrl: './drivingSchool.component.html',
  styleUrls: ['./drivingSchool.component.scss'],
    animations: fuseAnimations
})
export class DrivingSchoolComponent implements AfterViewInit, OnInit,OnDestroy {

    displayedColumns: string[] = ['corporateName', 'email', 'id'];
    dataSource = new MatTableDataSource<DrivingSchool>(ELEMENT_DATA);
    loading: boolean = true;
    isDeleting: boolean = false;
    showAlert: boolean = false;
    _users$ = this._autoEscolaServices.getAll(this._authServices.getUserInfoFromStorage().address.uf);
    private data$: Subscription;
    private user$: Subscription;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<DrivingSchool>;

  constructor(
      public dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private _authServices: AuthService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private _autoEscolaServices: DrivingSchoolService
      ) {
      console.log(this._authServices.getUserInfoFromStorage().address.uf);
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
    setUser(user: DrivingSchool): void {

        //Atualiza um usuário
        if (user) {
            this._router.navigate(['usuario/auto-escola', user.id]);
        } else {
            this._router.navigateByUrl('usuario/auto-escola/inserir');
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
        if(this.user$){
            this.user$.unsubscribe();
        }
        if(this.data$){
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
        this.data$ = this._users$.subscribe((items: DrivingSchool[]) => {
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
        this.user$ = this._autoEscolaServices.delete(id).subscribe((res: any)=>{
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
