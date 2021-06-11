import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


import { BaseModel } from '../../../shared/models/baseModels/base.model'
import { AuthService } from 'src/app/shared/services/auth/auth.service';

const EMPTY_USER: BaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  status: 0,
  telefone: ''
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  defaultAuth: any = {
    email: 'admin@edriving.com',
    senha: 'universalPay',
  };

  loginForm: FormGroup;
  user: BaseModel;
  hasError: boolean;
  returnUrl: string;
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    if (this.authService.currentUserValue) {
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
    this.user.fullName = "E-Driving"
    this.user.email = "admin@edriving.com";
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
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.loginForm.value.email, this.loginForm.value.senha)
      .pipe(first())
      .subscribe((user: BaseModel) => {
        if (user) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }
}
