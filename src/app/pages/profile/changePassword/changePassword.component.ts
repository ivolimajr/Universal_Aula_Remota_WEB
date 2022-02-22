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
import {UsuarioLogin} from '../../../shared/models/user.model';
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

    securityForm: FormGroup;
    showAlert: boolean = false;
    private loginUser = new UsuarioLogin();
    private authSub: Subscription;

    constructor(
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _authServices: AuthService,
        private _userServices: UserService,
        private localStorage: LocalStorageService
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
            this.setAlert('Dados Inválidos.');
            return;
        }

        this.securityForm.disable();
        //Verifica se a senha atual confere
        const formData = this.securityForm.value;
        if (formData.currentPassword !== this._authServices.getLoginFromStorage().password) {
            this.openSnackBar('Senha atual não confere', 'warn');
            this.setAlert('Senha atual não confere');
            this.securityForm.enable();
            return;
        }
        //atualiza a senha na API
        this.authSub = this._userServices.updatePassById(this.securityForm.value).subscribe((res: any) => {
            if (res.error) {
                this.securityForm.enable();
                this.openSnackBar(res.error.detail, 'warn');
                return;
            }
            this.openSnackBar('Senha Atualizada');
            this.securityForm.enable();
            //Atualiza a senha no localStorage
            this.loginUser.email = this._authServices.getUserInfoFromStorage().email;
            this.loginUser.password = formData.currentPassword;
            this.localStorage.setValueFromLocalStorage(environment.dataStorage, this.loginUser);
            //Atualiza o formulário
            this._changeDetectorRef.markForCheck();
            return;
        });
    }

    ngOnDestroy(): void {
        if(this.authSub){
            this.authSub.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     *Carrega o formulário
     *
     * @private
     * @return void
     */
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

    private setAlert(message: string, type: any = 'error'): void {
        this.showAlert = false;
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;
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
