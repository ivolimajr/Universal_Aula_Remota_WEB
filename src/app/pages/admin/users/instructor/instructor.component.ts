import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {InstructorModel} from '../../../../shared/models/instructor.model';
import {AuthService} from '../../../../shared/services/auth/auth.service';
import {InstructorService} from '../../../../shared/services/http/instructor.service';
import {AlertModalComponent} from '../../../../layout/common/alert/alert-modal.component';
import {DrivingSchoolModel} from '../../../../shared/models/drivingSchool.model';

const ELEMENT_DATA: InstructorModel[] = [];

@Component({
    selector: 'app-instructor',
    templateUrl: './instructor.component.html',
    styleUrls: ['./instructor.component.scss'],
    animations: fuseAnimations
})
export class InstructorComponent implements AfterViewInit, OnInit, OnDestroy {

    displayedColumns: string[] = ['name', 'email', 'id'];
    dataSource = new MatTableDataSource<InstructorModel>(ELEMENT_DATA);
    loading: boolean = true;
    isDeleting: boolean = false;
    _users$ = this._instructorServices.getAll(this._authServices.getUserInfoFromStorage().address.uf);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort) sort: MatSort;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatTable) table: MatTable<InstructorModel>;
    private data$: Subscription;
    private user$: Subscription;

    constructor(
        public _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _authServices: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _instructorServices: InstructorService
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getUsers();
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    setUser(user: DrivingSchoolModel): void {

        //Atualiza um usuário
        // if (user) {
        //     this._router.navigate(['usuario/auto-escola', user.id]);
        // } else {
        //     this._router.navigateByUrl('usuario/auto-escola/inserir');
        // }
    }
    removeUser(id: number, email: string): void {
        this.isDeleting = true;
        this._changeDetectorRef.markForCheck();
        //Se o id informado for nulo, ou se o usuário for remover ele mesmo, é retornado um erro
        if (email !== this._authServices.getUserInfoFromStorage().email) {
            //Exibe o alerta de confirmação
            const dialogRef = this._dialog.open(AlertModalComponent, {
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
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.data$) {
            this.data$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private getUsers(): void {
        this.data$ = this._users$.subscribe((items: InstructorModel[]) => {
            this.dataSource.data = items;
            this.loading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    private deleteFromApi(id: number): void {
        this.user$ = this._instructorServices.delete(id).subscribe((res: any) => {
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
