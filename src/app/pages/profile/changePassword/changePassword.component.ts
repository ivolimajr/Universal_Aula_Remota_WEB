import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {UserLogin} from '../../../shared/models/user.model';
import {FuseAlertType} from '../../../../@fuse/components/alert';
import {fuseAnimations} from '../../../../@fuse/animations';
import {UserService} from '../../../shared/services/http/user.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {environment} from '../../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-changePassword',
    templateUrl: './changePassword.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})


export class ChangePasswordComponent implements OnInit, OnDestroy {
    @Input() idUser: number;
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    public securityForm: FormGroup;
    public loading: boolean;
    private loginUser = new UserLogin();
    private auth$: Subscription;

    constructor(
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _authServices: AuthService,
        private _userServices: UserService,
        private _storageServices: LocalStorageService
    ) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadForm();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Atualiza a senha de acesso do usuário
     *
     * @return void
     */
    update(): void {
        //Verifica se o formulário é válido
        if (this.securityForm.invalid) {
            return this.openSnackBar('Dados Inválidos.', 'warn');
        }
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this.securityForm.disable();

        const formData = this.securityForm.value;
        const storagePassword = this._authServices.getLoginFromStorage().password;
        if (formData.currentPassword !== storagePassword) {
            console.log(storagePassword);
            this.openSnackBar('Senha atual não confere', 'warn');
            this.closeAlert();
            return;
        }
        //atualiza a senha na API
        this.auth$ = this._userServices.updatePassById(this.securityForm.value).subscribe((res: any) => {
            if (res.error) {
                return this.closeAlert();
            }
            this.openSnackBar('Senha Atualizada');

            //Atualiza a senha no localStorage
            this.loginUser.email = this._authServices.getUserInfoFromStorage().email;
            this._storageServices.removeFromStorage(environment.dataStorage);
            this.loginUser.password = formData.newPassword;
            this._storageServices.setValueFromLocalStorage(environment.dataStorage, this.loginUser);

            this.closeAlert();
            return;
        });
    }

    ngOnDestroy(): void {
        if(this.auth$){
            this.auth$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private loadForm(): void {
        this.securityForm = this._formBuilder.group({
            id: [this.idUser],
            currentPassword: ['', Validators.compose([
                Validators.nullValidator,
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(70)])],
            newPassword: ['', Validators.compose([
                Validators.nullValidator,
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(70)])]
        });
        this._changeDetectorRef.markForCheck();
    }

    private closeAlert(): void {
        this.loading = false;
        this.securityForm.enable();
        this._changeDetectorRef.markForCheck();
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
