import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {formatDate} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {Observable, Subscription} from 'rxjs';
import {DrivingSchoolModel} from '../../../../../shared/models/drivingSchool.model';
import {DrivingSchoolService} from '../../../../../shared/services/http/drivingSchool.service';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {FileModel} from '../../../../../shared/models/file.model';
import {UserService} from '../../../../../shared/services/http/user.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';

@Component({
    selector: 'app-drivingSchool-form',
    templateUrl: './drivingSchool-form.component.html'
})
export class DrivingSchoolFormComponent implements OnInit, OnDestroy {

    public id: number = parseInt(this._routeAcitve.snapshot.paramMap.get('id'), 10);

    accountForm: FormGroup;
    addressForm: FormGroup;
    contactForm: FormGroup;
    filesForm: FormGroup;

    masks = MASKS;
    files: Set<File>;
    loading: boolean = false; //Inicia o componente com um lading
    loadingForm: boolean = false; //Inicia o componente com um lading
    saving: boolean = false;
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private drivinSchoolModel = new DrivingSchoolModel();
    private filesUpdate: Array<FileModel> = [];
    private cep$: Subscription;
    private user$: Subscription;

    constructor(
        public _dialog: MatDialog,
        private _routeAcitve: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _drivingSchoolServices: DrivingSchoolService,
        private _userServices: UserService,
        private _authServices: AuthService,
        private _formBuilder: FormBuilder,
    ) {
        this.files = new Set();
    }

    ngOnInit(): void {
        this.loadForm();
    }

    goBack(): void {
        window.history.back();
    }

    addPhoneNumberField(): void {
        // Adiciona o formGroup ao array de telefones
        (this.contactForm.get('phonesNumbers') as FormArray).push(
            this._formBuilder.group({
                phoneNumber: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            }));
        this._changeDetectorRef.markForCheck();
    }

    removePhoneNumber(id: number, index: number): void {
        // this.loading = true;
        // this._changeDetectorRef.markForCheck();
        const phonesFormArray = this.contactForm.get('phonesNumbers') as FormArray;
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

    addFileField(): void {
        // Adiciona o formGroup ao array de telefones
        (this.filesForm.get('files') as FormArray).push(
            this._formBuilder.group({
                file: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            }));

        this._changeDetectorRef.markForCheck();
    }

    removeFileFieldFromApi(id: number, index): void {
        this.loadingForm = true;
        this.filesForm.disable();
        this._changeDetectorRef.markForCheck();
        //Exibe o alerta de confirmação
        const dialogRef = this._dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do documento?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return this.closeAlerts();
            }

            this.deleteFileFromApi(id).subscribe((res: any) => {
                if (res === true) {
                    if (index > -1) {
                        this.filesUpdate.splice(index, 1);
                    }
                    this.openSnackBar('Removido');
                    return this.closeAlerts();
                }
                this.openSnackBar(res.detail, 'warn');
                return this.closeAlerts();
            });
        });
    }

    removeFileField(id: number, index: number): void {
        const phoneNumbersFormArray = this.filesForm.get('files') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    submit(): void {
        this.saving = true;
        this._changeDetectorRef.markForCheck();

        //Se não tiver um ID, significa que está criando um novo usuário
        if (!this.id) {
            this.user$ = this._drivingSchoolServices.createFormEncoded(this.drivinSchoolModel).subscribe((res: any) => {
                if (res.error) {
                    return this.closeAlerts();
                }
                this.closeAlerts();
                this.openSnackBar('Salvo');
                this._router.navigate(['usuario/auto-escola']);
            });
        } else {
            this.user$ = this._drivingSchoolServices.updateFormEncoded(this.drivinSchoolModel).subscribe((res: any) => {
                if (res.error) {
                    return this.closeAlerts();
                }
                this.closeAlerts();
                this.openSnackBar('Atualizado');
                this._router.navigate(['usuario/auto-escola']);
            });
        }
    }

    getCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cep$ = this._cepService.getCep(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.addressForm.patchValue({
                district: res.bairro,
                address: res.logradouro,
                city: res.localidade,
                cep: res.cep,
                uf: res.uf
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Evento de captura de upload de arquivo
     * Popula o array de arquivos this.files com arquivo e nome do arquivo
     *
     * @param event
     */
    onPutFile(event): void {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const selectedFiles = <FileList>event.srcElement.files;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < selectedFiles.length; i++) {
            if (selectedFiles[i].name.length <= 50) {
                this.files.add(selectedFiles[i]);
            } else {
                return this.openSnackBar('Nome do arquivo muito gande', 'warn');
            }
        }
    }

    setUserData(): void {
        //Dados da instituição
        if (this.accountForm.valid) {
            const accountFormValues = this.accountForm.value;
            accountFormValues.stateRegistration = accountFormValues.stateRegistration.replace(/[^0-9,]*/g, '').replace('-', '').replace('/', '');
            accountFormValues.cnpj = accountFormValues.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
            this.drivinSchoolModel = accountFormValues;
        }
        // Dados de endereço
        if (this.addressForm.valid) {
            const addressFormValues = this.addressForm.value;
            addressFormValues.cep = addressFormValues.cep.replace(/[^0-9,]*/g, '').replace(',', '.');
            this.drivinSchoolModel.address = addressFormValues;
        }
        // dados de contato
        if (this.contactForm.valid) {
            const contactFormValues = this.contactForm.value;
            //Verifica se os telefones informados são válidos
            contactFormValues.phonesNumbers.forEach((item) => {
                if (!item.phoneNumber || item.phoneNumber.length < 11) {
                    return this.openSnackBar('Insira um telefone', 'warn');
                }
            });
            contactFormValues.phonesNumbers.forEach((item) => {
                if (item.phoneNumber.length !== 11) {
                    item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
                }
            });
            this.drivinSchoolModel.phonesNumbers = contactFormValues.phonesNumbers;
        }

        //Dados de arquivos de upload
        if (this.filesForm.valid) {
            this.files.forEach((item) => {
                if (!this.drivinSchoolModel.files.find(f => f.file.name === item.name)) {
                    const file = new FileModel();
                    file.file = item;
                    file.fileName = item.name;
                    this.drivinSchoolModel.files.push(file);
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.cep$) {
            this.cep$.unsubscribe();
        }
    }

    private loadForm(): void {

        if (this.id) {
            this.prepareEditUser();
            return;
        }
        this.accountForm = this._formBuilder.group({
            corporateName: ['Dora e Ricardo Telecomunicações Ltda',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            fantasyName: ['Antonio Filmagens Ltda',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            stateRegistration: ['669.503.958.773',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30)
                ])],
            foundingDate: ['2021-01-30',
                Validators.required,
            ],
            email: ['autoescola2@edriving.com',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(70)
                ])],
            description: ['Auto Escola Brasil',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])],
            site: ['cacoesltda.com.br',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])],
            cnpj: ['51862639000117',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(18),
                    NgBrazilValidators.cnpj
                ])],
            password: ['Pay@2021']
        });
        this.addressForm = this._formBuilder.group({
            cep: ['70702-406',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(10),
                    NgBrazilValidators.cep])],
            address: ['Travessa SF-2',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            district: ['São Francisco',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            uf: ['DF', Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            city: ['Barretos',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            addressNumber: ['240',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            complement: ['a'],
        });
        this.contactForm = this._formBuilder.group({
            phonesNumbers: this._formBuilder.array([],
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ]))
        });
        this.filesForm = this._formBuilder.group({
            files: this._formBuilder.array([],
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ]))
        });
        (this.contactForm.get('phonesNumbers') as FormArray).push(
            this._formBuilder.group({
                phoneNumber: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );
        (this.filesForm.get('files') as FormArray).push(
            this._formBuilder.group({
                file: [null, Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );
        this._changeDetectorRef.markForCheck();
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private prepareEditUser(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this._drivingSchoolServices.getOne(this.id, this._authServices.getUserInfoFromStorage().address.uf).subscribe((res: any) => {
            if (res.error) {
                return this.closeAlerts();
            }
            this.accountForm = this._formBuilder.group({
                id: [res.id],
                corporateName: [res.corporateName,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                fantasyName: [res.fantasyName,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                stateRegistration: [res.stateRegistration,
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(30)
                    ])],
                foundingDate: [formatDate(res.foundingDate, 'yyyy-MM-dd', 'en'),
                    Validators.required,
                ],
                email: [res.email,
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(70)
                    ])],
                description: [res.description,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                site: [res.site,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(100)
                    ])],
                cnpj: [res.cnpj,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(18),
                        NgBrazilValidators.cnpj
                    ])],
            });
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
                complement: [res.address.complement],
            });
            this.contactForm = this._formBuilder.group({
                phonesNumbers: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            });
            this.filesForm = this._formBuilder.group({
                files: this._formBuilder.array([
                        this._formBuilder.group({
                            id: [0],
                            file: ['']
                        })
                    ],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            });

            if (res.phonesNumbers.length > 0) {
                res.phonesNumbers.forEach((item) => {
                    (this.contactForm.get('phonesNumbers') as FormArray).push(
                        this._formBuilder.group({
                            id: [item.id],
                            phoneNumber: [item.phoneNumber, Validators.compose([
                                Validators.required,
                                Validators.nullValidator
                            ])]
                        })
                    );
                });
            } else {
                (this.contactForm.get('phonesNumbers') as FormArray).push(
                    this._formBuilder.group({
                        id: [0],
                        phoneNumber: ['', Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ])]
                    })
                );
            }
            if (res.files.length > 0) {
                this.filesUpdate = res.files;
            }
            this.closeAlerts();
        });
    }

    private closeAlerts(): void {
        this.saving = false;
        this.loading = false;
        this.loadingForm = false;
        this.filesForm.enable();
        this.accountForm.enable();
        this.addressForm.enable();
        this.contactForm.enable();
        this._changeDetectorRef.markForCheck();
    }

    private deleteFileFromApi(id: number): Observable<boolean> {
        return this._userServices.removeFile(id);
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
    }
}
