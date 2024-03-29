import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {User} from 'app/shared/models/user.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    loginForm: FormGroup;
    private userStorage: User;
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

    /**
     * Fazer Login na plataforma
     *
     * @return void
     */
    signIn(): void {
        if (!this.loginForm.valid) return;
        this.loginForm.disable();

        //Faz Login
        this.loginSub = this._authService.signIn(this.loginForm.value).subscribe((res) => {
            if (res.error) return this.loginForm.enable();

            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            this._router.navigateByUrl(redirectURL);
        });
    }

    ngOnDestroy(): void {
        if (this.loginSub) {
            this.loginSub.unsubscribe();
        }
    }

    /**
     * Prepara o formulário de login com validadores básicos
     *
     * @private
     * @return void
     */
    private prepareForm(): void {
        this.userStorage = this._authService.getLoginFromStorage();
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

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }
}

function then(arg0: any) {
    throw new Error('Function not implemented.');
}

