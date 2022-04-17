import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fuseAnimations} from '../../../../@fuse/animations';
import {DrivingSchoolModel} from '../../../shared/models/drivingSchool.model';
import {User} from '../../../shared/models/user.model';
import {UserService} from '../../../shared/services/http/user.service';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {DrivingSchoolService} from '../../../shared/services/http/drivingSchool.service';
import {AlertModalComponent} from '../../../layout/common/alert/alert-modal.component';
import {formatDate} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {PhoneNumberModel} from '../../../shared/models/phoneNumber.model';

@Component({
    selector: 'app-driving-school',
    templateUrl: './driving-school.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class DrivingSchoolComponent implements OnInit, OnDestroy {
    @Input() drivingSchoolUser: DrivingSchoolModel;

    accountForm: FormGroup;
    user: User;
    masks = MASKS;
    loading: boolean;
    private user$: Subscription;
    private phone$: Subscription;

    constructor(
        public _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _userServices: UserService,
        private _authServices: AuthService,
        private _drivingSchoolServices: DrivingSchoolService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _storageServices: LocalStorageService) {
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    submit(): void {
        if (this.setUserData()) {
            this.accountForm.disable();
            this.loading = true;
            this._changeDetectorRef.markForCheck();

            this.user$ = this._drivingSchoolServices.updateFormEncoded(this.drivingSchoolUser).subscribe((res: any) => {
                if (res.error) {
                    return this.closeAlerts();
                }
                this.drivingSchoolUser = res;
                this.updateDataInStorage(res.fantasyName, res.email);
                this.removeLastPhoneUpdated(res.phonesNumbers[res.phonesNumbers.length - 1]);
                //Retorna a mensagem de atualizado
                this.openSnackBar('Atualizado');
                return this.closeAlerts();
            });
        } else {
            this.openSnackBar('Dados Inválidos', 'warn');
            return this.closeAlerts();
        }
    }

    addPhoneNumberField(): void {
        // Adiciona o formGroup ao array de telefones
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

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.phone$) {
            this.phone$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    private prepareForm(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();

        this.accountForm = this._formBuilder.group({
            id: [this.drivingSchoolUser.id],
            corporateName: [this.drivingSchoolUser.corporateName,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            fantasyName: [this.drivingSchoolUser.fantasyName,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            stateRegistration: [this.drivingSchoolUser.stateRegistration,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30)
                ])],
            foundingDate: [formatDate(this.drivingSchoolUser.foundingDate, 'yyyy-MM-dd', 'en'),
                Validators.required,
            ],
            email: [this.drivingSchoolUser.email,
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(70)
                ])],
            description: [this.drivingSchoolUser.description,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            site: [this.drivingSchoolUser.site,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])],
            cnpj: [this.drivingSchoolUser.cnpj,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(18),
                    NgBrazilValidators.cnpj
                ])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.drivingSchoolUser.phonesNumbers.length > 0) {
            // Iterate through them
            this.drivingSchoolUser.phonesNumbers.forEach((phoneNumber) => {
                (this.accountForm.get('phonesNumbers') as FormArray).push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        phoneNumber: [phoneNumber.phoneNumber,
                            Validators.compose([
                                Validators.required,
                                Validators.nullValidator
                            ])
                        ]
                    })
                );
            });
        } else {
            // Create a phone number form group
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
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }

    private setUserData(): boolean {
        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        const accountFormValues = this.accountForm.value;
        accountFormValues.cnpj = accountFormValues.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        accountFormValues.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.drivingSchoolUser = accountFormValues;
        return true;
    }

    private closeAlerts(): void {
        this.accountForm.enable();
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private updateDataInStorage(fantasyName: string, email: string): void {
        this.user = this._authServices.getUserInfoFromStorage();
        this.user.name = fantasyName;
        this.user.email = email;
        this._storageServices.removeFromStorage(environment.authStorage);
        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
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