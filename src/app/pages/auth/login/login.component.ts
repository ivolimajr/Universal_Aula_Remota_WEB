import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {TokenResult} from '../../../shared/models/token.model';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    loginForm: FormGroup;
    private loginSub: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    signIn(): void {
        if (!this.loginForm.valid) {
            this.openSnackBar('Verifique os dados', 'warn');
            return;
        }
        this.loginForm.disable();

        if (!this._authService.tokenFromLocalStorage) {
            this.loginSub =  this._authService.getApiTokenFromApi()
                .subscribe((result: TokenResult) => {
                    this._authService.tokenFromLocalStorage = result;
                    this.login();
                    return;
                });
        } else{
            this.login();
        }
    }

    ngOnDestroy(): void {
        if (this.loginSub) {
            this.loginSub.unsubscribe();
        }
    }

    private prepareForm(): void {
        this.loginForm = this._formBuilder.group({
            email: ['IVO@EDRIVING.COM',
                Validators.compose([
                    Validators.required,
                    Validators.email,
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

    private login(): void{
        this._authService.signIn(this.loginForm.value).subscribe((res) => {
            if (res.error) {
                return this.loginForm.enable();
            }
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            this._router.navigateByUrl(redirectURL);
        });
    }


    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }
}

