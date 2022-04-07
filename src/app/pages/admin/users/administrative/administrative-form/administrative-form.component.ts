import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AdministrativeService} from '../../../../../shared/services/http/administrative.service';
import {AdministrativeModel} from '../../../../../shared/models/administrative.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {UserService} from '../../../../../shared/services/http/user.service';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {DrivingSchoolModel} from '../../../../../shared/models/drivingSchool.model';
import {DrivingSchoolService} from '../../../../../shared/services/http/drivingSchool.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';

@Component({
    selector: 'app-administrative-form',
    templateUrl: './administrative-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class AdministrativeFormComponent implements OnInit, OnDestroy {

    @Input() id: number;
    masks = MASKS;
    loading: boolean = false;
    accountForm: FormGroup;
    addressForm: FormGroup;
    ufOrigin = new FormControl();
    ufList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB',
        'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    drivingSchoolList: DrivingSchoolModel[];
    selectedDrivingSchool: DrivingSchoolModel;
    isAdmin: boolean;
    private administrativeModel = new AdministrativeModel(); //Objeto para envio dos dados para API
    private user$: Subscription;
    private cep$: Subscription;
    private drivingSchool$: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _userServices: UserService,
        public dialogRef: MatDialogRef<AdministrativeFormComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _authServices: AuthService,
        private _cepService: CepService,
        private _administrativeServices: AdministrativeService,
        private _drivingSchoolServices: DrivingSchoolService
    ) {
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.cep$) {
            this.cep$.unsubscribe();
        }
    }
    ngOnInit(): void {
        this.isAdmin = this._authServices.isAdmin();
        this.prepareForm();
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    submit(): void {
        if (this.setUserData()) {
            this.accountForm.disable();
            if (!this.id) {
                this.user$ = this._administrativeServices.create(this.administrativeModel).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        return;
                    }
                    this.accountForm.enable();
                    this.dialogRef.close(res);
                });
            } else {
                this.user$ = this._administrativeServices.update(this.administrativeModel).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        return;
                    }
                    this.accountForm.enable();
                    this.dialogRef.close(res);
                });
            }
        }
    }
    removePhoneNumber(id: number, index: number): void {
        const phonesFormArray = this.accountForm.get('phonesNumbers') as FormArray;
        if (id === 0 && phonesFormArray.length > 1) {
            phonesFormArray.removeAt(index);
            return this.closeAlerts();
        }
        if (phonesFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlerts();
        }
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do telefone?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return this.closeAlerts();
            }
            this.removePhoneFromApi(id).subscribe((res: boolean) => {
                if (res) {
                    this.openSnackBar('Removido');
                    phonesFormArray.removeAt(index);
                } else {
                    this.openSnackBar('Remoção Inválida', 'warn');
                }
                return this.closeAlerts();
            });
        });
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
    getCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep não encontrado.');
            return;
        }
        this.cep$ = this._cepService.getCep(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.addressForm.patchValue({
                district: res.bairro,
                address: res.logradouro,
                city: res.localidade,
                cep: res.cep,
                uf: res.uf,
                complement: res.complemento
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
    }
    private prepareForm(): void {
        if (this.id != null) {
            this.prepareEditForm();
            return;
        }
        this.loadDrivingSchools();
        this.accountForm = this._formBuilder.group({
            name: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            email: ['@edriving.com',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            cpf: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            identity: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            origin: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.min(5),
                    Validators.maxLength(100)
                ])],
            phonesNumbers: this._formBuilder.array([
                this._formBuilder.group({
                    phoneNumber: ['', Validators.compose([Validators.required])]
                })
            ], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
            password: ['Pay@2021'],
            drivingSchoolId: [this._authServices.getUserInfoFromStorage().id]
        });
        this.addressForm = this._formBuilder.group({
            cep: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(10),
                    NgBrazilValidators.cep])],
            address: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            district: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            uf: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            city: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            addressNumber: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            complement: ['',
                Validators.compose([
                    Validators.maxLength(100)])],
        });

        this._changeDetectorRef.markForCheck();
    }
    private prepareEditForm(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this.user$ = this._administrativeServices.getOne(this.id)
            .subscribe((res) => {
                if (!res.id) {
                    return this.closeAlerts();
                }
                this.accountForm = this._formBuilder.group({
                    id:[this.id],
                    name: [res.name,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    email: [res.email,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    cpf: [res.cpf,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    identity: [res.identity,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.min(5),
                            Validators.maxLength(100)
                        ])],
                    origin: [res.origin,
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

                if (res.phonesNumbers.length > 0) {
                    res.phonesNumbers.forEach((phoneNumber) => {
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

                this.addressForm = this._formBuilder.group({
                    cep: [res.address.cep,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(8),
                            Validators.maxLength(10),
                            NgBrazilValidators.cep])],
                    address: [res.address.address,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    district: [res.address.district,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    uf: [res.address.uf,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(2),
                            Validators.maxLength(2)
                        ])],
                    city: [res.address.city,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    addressNumber: [res.address.addressNumber,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(1),
                            Validators.maxLength(50)])],
                    complement: [res.address.complement ?? '',
                        Validators.compose([
                            Validators.maxLength(100)])],
                });

                //Pega os dois últimos caracteres da expedição do documento e define como valor padrão no select de UF
                const uf = res.origin.substr(res.origin.length - 2, res.origin.length - 1);
                if (this.ufList.indexOf(uf) > 0) {
                    this.ufOrigin.setValue(res.origin.substr(res.origin.length - 2, res.origin.length - 1));
                }
                if (this.isAdmin) {
                    this.loadDrivingSchools(res.drivingSchoolId);
                } else {
                    this.closeAlerts();
                }
            });
    }
    private setUserData(): boolean {
        if (this.selectedDrivingSchool === null) {
            this.openSnackBar('Informe a auto escola', 'warn');
            return false;
        }
        const accountFormValues = this.accountForm.value;
        const addressFormValues = this.addressForm.value;

        accountFormValues.phonesNumbers.forEach((item) => {
            if (item.phoneNumber === null || item.phoneNumber === '' || item.phoneNumber.length < 10) {
                this.openSnackBar('Insira um telefone', 'warn');
                return this.accountForm.enable();
            } else {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        accountFormValues.cpf = accountFormValues.cpf.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.administrativeModel = accountFormValues;

        addressFormValues.cep = addressFormValues.cep.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.administrativeModel.address = addressFormValues;

        this.administrativeModel.phonesNumbers = accountFormValues.phonesNumbers;

        if (!this.id) {
            this.accountForm.value.origin = this.accountForm.value.origin + '-' + this.ufOrigin.value;
        }
        if (this.isAdmin) {
            this.administrativeModel.drivingSchoolId = this.selectedDrivingSchool.id;
        }
        return true;
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
        this.loading = false;
        this._changeDetectorRef.markForCheck();
    }
    private loadDrivingSchools(id: number = 0): void {
        if (this.isAdmin) {
            if (!this.loading) {
                this.loading = true;
                this._changeDetectorRef.markForCheck();
            }
            this.drivingSchool$ = this._drivingSchoolServices.getAll().subscribe((res) => {
                this.drivingSchoolList = res;
                this.selectedDrivingSchool = this.drivingSchoolList.find(e => e.id === id);
                this.closeAlerts();
            });
        }
    }
}
