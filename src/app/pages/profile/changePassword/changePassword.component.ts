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

    ngOnInit(): void {
        this.loadForm();
    }

    update(): void {
        if (this.securityForm.invalid) {
            return this.openSnackBar('Dados Inválidos.', 'warn');
        }
        this.securityForm.disable();
        if (this.validatePass()) {
            this.loading = true;
            this._changeDetectorRef.markForCheck();

            this.auth$ = this._userServices.updatePassById(this.securityForm.value).subscribe((res: any) => {
                if (res.error) {
                    return this.closeAlerts();
                }
                this.updateDataInStorage(this.securityForm.value.newPassword);
                this.openSnackBar('Senha Atualizada');
                return this.closeAlerts();
            });
        }
        return this.closeAlerts();
    }

    ngOnDestroy(): void {
        if (this.auth$) {
            this.auth$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private loadForm(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();

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
        this.closeAlerts();
    }

    private validatePass(): boolean {
        const securityFormValues = this.securityForm.value;
        const storagePassword = this._authServices.getLoginFromStorage().password;
        if (securityFormValues.currentPassword !== storagePassword) {
            this.openSnackBar('Senha atual não confere', 'warn');
            this.closeAlerts();
            return;
        }
    }

    private closeAlerts(): void {
        this.loading = false;
        this.securityForm.enable();
        this._changeDetectorRef.markForCheck();
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private updateDataInStorage(newPassword: string): void {
        this.loginUser.email = this._authServices.getUserInfoFromStorage().email;
        this.loginUser.password = newPassword;
        this._storageServices.removeFromStorage(environment.dataStorage);
        this._storageServices.setValueFromLocalStorage(environment.dataStorage, this.loginUser);
    }
}
