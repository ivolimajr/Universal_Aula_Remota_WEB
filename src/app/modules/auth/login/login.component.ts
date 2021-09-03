import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {Usuario} from 'app/shared/models/usuario.model';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    loginForm: FormGroup;
    showAlert: boolean = false;
    private userStorage: Usuario;

    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    /**
     * Prepara o formulário de login com validadores básicos
     *
     * @private
     * @return void
     */
    private prepareForm(): void {
        this.userStorage = this._authService.getLoginFromStorage();
        //Se tiver um usuário no storage já é setado o email
        if (this.userStorage) {
            this.loginForm = this._formBuilder.group({
                email: [this.userStorage.email,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)]
                    )],
                password: ['Pay@2021',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
                rememberMe: ['']
            });
        } else {
            this.loginForm = this._formBuilder.group({
                email: ['ivo@edriving.com',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)]
                    )],
                password: ['Pay@2021',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
                rememberMe: ['']
            });
        }
    }

    /**
     *Valida os dados novamente antes de enviar para API
     *
     * @private
     * @return boolean
     */
    private prepareCustomer(): boolean {
        const formData = this.loginForm.value;
        //Se o email estiver vazio retorna error
        if (formData.email === '') {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos';
            this.showAlert = true;
            return false;
        }
        //Se a senha estiver vazia retorna error
        if (formData.password === '') {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos';
            this.showAlert = true;
            return false;
        }
        //Se a senha estiver preenchia e for menor que 5 retorna error
        if (formData.password !== '' && formData.password.length < 5) {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos';
            this.showAlert = true;
            return false;
        }

        return true;
    }

    /**
     * Fazer Login na plataforma
     *
     * @return void
     */
    signIn(): void {
        //Não faz a requisição se os dados forem inválidos
        if (!this.prepareCustomer()) {
            return;
        }

        //Desabilita o form
        this.loginForm.disable();
        //Remove o alerta
        this.showAlert = false;

        //Faz Login
        this._authService.signIn(this.loginForm.value).subscribe((val) => {
            if (val.ok != null && !val.ok) {
                this.alert.type = 'error';
                this.alert.message = val.error;
                this.showAlert = true;
                this.loginForm.enable();
                return;
            }
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            this._router.navigateByUrl(redirectURL);
        });
    }
}
