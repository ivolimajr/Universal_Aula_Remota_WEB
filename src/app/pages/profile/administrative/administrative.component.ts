import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {Observable, Subscription} from 'rxjs';
import {fuseAnimations} from '../../../../@fuse/animations';
import {AdministrativeModel} from '../../../shared/models/administrative.model';
import {UserService} from '../../../shared/services/http/user.service';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {User, UserLogin} from '../../../shared/models/user.model';
import {AlertModalComponent} from '../../../layout/common/alert/alert-modal.component';
import {environment} from '../../../../environments/environment';
import {PhoneNumberModel} from '../../../shared/models/phoneNumber.model';
import {AdministrativeService} from "../../../shared/services/http/administrative.service";

@Component({
    selector: 'app-administrative',
    templateUrl: './administrative.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class AdministrativeComponent implements OnInit, OnDestroy {
    @Input() administrativeUser: AdministrativeModel;

    public accountForm: FormGroup;
    public user: User;
    public userLogin: UserLogin;
    public masks = MASKS;
    public loading: boolean;
    private user$: Subscription;
    private phone$: Subscription;

    constructor(
        public _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _userServices: UserService,
        private _authServices: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _storageServices: LocalStorageService,
        private _administrativeServices: AdministrativeService
    ) {
    }

    ngOnInit(): void {
        console.log(this.administrativeUser);
        this.prepareForm();
    }

    update(): void {
        this.loading = true;
        this.accountForm.disable();
        if (this.setUserData() === false) {
            return this.closeAlerts();
        }
        this.user$ = this._administrativeServices.update(this.administrativeUser).subscribe((res: any) => {
            if (res.error) {
                return this.closeAlerts();
            }
            this.administrativeUser = res;
            this.updateDataInStorage(res.name, res.email);
            this.removeLastPhoneUpdated(res.phonesNumbers[res.phonesNumbers.length - 1]);

            this.openSnackBar('Atualizado');
            return this.closeAlerts();
        });
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.phone$) {
            this.phone$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    addPhoneNumberField(): void {
        (this.accountForm.get('phonesNumbers') as FormArray).push(
            this._formBuilder.group({
                phoneNumber: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            }));
        this._changeDetectorRef.markForCheck();
    }

    removePhoneNumber(id: number, index: number): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        const phonesFormArray = this.accountForm.get('phonesNumbers') as FormArray;
        if (id === 0 && phonesFormArray.length > 1) {
            phonesFormArray.removeAt(index);
            return this.closeAlerts();
        }
        if (phonesFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlerts();
        }
        const dialogRef = this._dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do telefone?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return this.closeAlerts();
            }
            this.removePhoneFromApi(id).subscribe((res: any) => {
                if (res) {
                    this.openSnackBar('Removido');
                    phonesFormArray.removeAt(index);
                    return this.closeAlerts();
                }
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlerts();
            });
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private prepareForm(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this.accountForm = this._formBuilder.group({
            id: [this.administrativeUser.id],
            name: [this.administrativeUser.name,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            email: [this.administrativeUser.email,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            cpf: [this.administrativeUser.cpf,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100),
                    NgBrazilValidators.cpf])],
            identity: [this.administrativeUser.identity,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            origin: [this.administrativeUser.origin,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ]))
        });

        if (this.administrativeUser.phonesNumbers.length > 0) {
            this.administrativeUser.phonesNumbers.forEach((phoneNumber) => {
                (this.accountForm.get('phonesNumbers') as FormArray).push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        phoneNumber: [phoneNumber.phoneNumber, Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ])]
                    })
                );
            });
        } else {
            (this.accountForm.get('phonesNumbers') as FormArray).push(
                this._formBuilder.group({
                    id: [0],
                    phoneNumber: ['', Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ])]
                })
            );
        }
    }

    private setUserData(): boolean {
        const formData = this.accountForm.value;
        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        formData.cpf = formData.cpf.replace(/[^0-9,]*/g, '').replace(',', '.');
        formData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.administrativeUser = formData;
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private closeAlerts(): void {
        this.accountForm.enable();
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
    }

    private updateDataInStorage(name: string, email: string): void {
        this.user = this._authServices.getUserInfoFromStorage();
        this.userLogin = this._storageServices.getValueFromLocalStorage(environment.dataStorage);
        this.user.name = name;
        this.user.email = email;
        this.userLogin.email = email;

        this._storageServices.removeFromStorage(environment.authStorage);
        this._storageServices.removeFromStorage(environment.dataStorage);

        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
        this._storageServices.setValueFromLocalStorage(environment.dataStorage, this.userLogin);
    }

    private removeLastPhoneUpdated(lastPhone: PhoneNumberModel): void {
        //Pega o último registro de telefone que contem no array de telefones
        const phoneArray = this.accountForm.get('phonesNumbers') as FormArray;

        //Se os IDS forem diferentes, incluir no array
        if (lastPhone.id !== phoneArray.value[phoneArray.length - 1].id) {

            const lastFromArray = phoneArray[phoneArray.length - 1];
            // Remove the phone number field
            phoneArray.removeAt(lastFromArray);

            (this.accountForm.get('phonesNumbers') as FormArray).push(
                this._formBuilder.group({
                    id: [lastPhone.id],
                    phoneNumber: [lastPhone.phoneNumber]
                }));
        }
    }
}
