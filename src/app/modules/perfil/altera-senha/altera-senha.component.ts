import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {UsuarioLogin} from '../../../shared/models/usuario.model';
import {FuseAlertType} from '../../../../@fuse/components/alert';
import {fuseAnimations} from '../../../../@fuse/animations';
import {UserService} from '../../../shared/services/http/user.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'altera-senha',
    templateUrl: './altera-senha.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})


export class AlteraSenhaComponent implements OnInit {
    @Input() idUser: number;
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    securityForm: FormGroup;
    showAlert: boolean = false;
    private loginUser = new UsuarioLogin();

    constructor(
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

    private loadForm(): void {
        this.securityForm = this._formBuilder.group({
            id: [this.idUser],
            senhaAtual: ['', Validators.compose([
                Validators.nullValidator,
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(70)])],
            novaSenha: ['', Validators.compose([
                Validators.nullValidator,
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(70)])]
        });
        this._changeDetectorRef.markForCheck();
    }

    update(): void {
        if (this.securityForm.invalid) {
            this.alert.type = 'error';
            this.alert.message = 'Dados Inválidos.';
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
            return;
        }
        const formData = this.securityForm.value;
        if (formData.senhaAtual !== this._authServices.getLoginFromStorage().password) {
            this.alert.type = 'error';
            this.alert.message = 'Senha atual não confere';
            this.showAlert = true;
            console.log(formData.senhaAtual);
            console.log(this._authServices.getLoginFromStorage().password);
            this._changeDetectorRef.markForCheck();
            return;
        }

        this._userServices.updatePassById(this.securityForm.value).subscribe((val) => {
            this.alert.type = 'success';
            this.alert.message = 'Senha Atualizada';
            this.showAlert = true;

            this.loginUser.email = this._authServices.getUserInfoFromStorage().email;
            this.loginUser.password = formData.currentPassword;
            this.localStorage.setValueFromLocalStorage(environment.dataStorage, this.loginUser);

            this._changeDetectorRef.markForCheck();
            return;
        });

    }
}
