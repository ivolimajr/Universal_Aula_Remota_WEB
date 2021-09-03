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
        //Verifica se a senha atual confere
        const formData = this.securityForm.value;
        if (formData.senhaAtual !== this._authServices.getLoginFromStorage().password) {
            this.setAlert('Senha atual não confere');
            return;
        }
        //atualiza a senha na API
        this._userServices.updatePassById(this.securityForm.value).subscribe((val) => {
            this.setAlert('Senha Atualizada', 'success');
            //Atualiza a senha no localStorage
            this.loginUser.email = this._authServices.getUserInfoFromStorage().email;
            this.loginUser.password = formData.currentPassword;
            this.localStorage.setValueFromLocalStorage(environment.dataStorage, this.loginUser);
            //Atualiza o formulário
            this._changeDetectorRef.markForCheck();
            return;
        });
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

    private setAlert(message: string, type: any = 'error'): void {
        this.showAlert = false;
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
    }
}
