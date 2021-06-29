import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseModel } from '../../../shared/models/baseModels/base.model'
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { StorageServices } from '../../../shared/services/storage/localStorage.service';
import { environment } from 'src/environments/environment';

const EMPTY_USER: BaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  status: 0,
  telefone: '',
  nivelAcesso: null,
  senhaAntiga: ''
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: BaseModel;
  hasError: boolean;
  returnUrl: string;
  private unsubscribe: Subscription[] = [];

  private authLocalStorageAuth = `${environment.appVersion}-${environment.AuthStorage}`;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private localStorage: StorageServices,
    private toastr: ToastrService,
  ) {
    if (this.localStorage.getAuthFromLocalStorage(this.authLocalStorageAuth)) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loadUser();
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  loadUser() {
    this.user = EMPTY_USER;
    this.loadForm();
  }
  
  loadForm() {
    this.user.email = "edrivingyuri@edriving.com";
    this.user.senha = "universalPay";
    this.loginForm = this.fb.group({
      email: [
        this.user.email,
          Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      senha: [
        this.user.senha,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    const loginSbscr = this.authService.login(this.loginForm.value.email, this.loginForm.value.senha)
      .subscribe(
        sucesso => {
          console.log(sucesso)
          this.processarSucesso(sucesso);         
        },
        error => {
          this.toastr.warning(error.error.error);
          console.log(error);

        }
      );
    this.unsubscribe.push(loginSbscr);
  }

  processarSucesso(response: BaseModel) {
    this.localStorage.setAuthFromLocalStorage(this.authLocalStorageAuth, response);
    this.router.navigate([this.returnUrl]);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
