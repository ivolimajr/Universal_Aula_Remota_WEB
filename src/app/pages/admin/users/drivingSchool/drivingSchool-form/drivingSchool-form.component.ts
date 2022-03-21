import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {formatDate} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {Observable, Subscription} from 'rxjs';
import {DrivingSchool} from '../../../../../shared/models/drivingSchool.model';
import {DrivingSchoolService} from '../../../../../shared/services/http/drivingSchool.service';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {FileModel, FileModelUpdate} from '../../../../../shared/models/file.model';
import {UserService} from '../../../../../shared/services/http/user.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';

@Component({
    selector: 'app-drivingSchool-form',
    templateUrl: './drivingSchool-form.component.html'
})
export class DrivingSchoolFormComponent implements OnInit, OnDestroy {

    accountForm: FormGroup;
    addressForm: FormGroup;
    contactForm: FormGroup;
    filesForm: FormGroup;

    masks = MASKS;
    loading: boolean = false; //Inicia o componente com um lading
    loadingForm: boolean = false; //Inicia o componente com um lading
    saving: boolean = false;
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    public id: number = parseInt(this.routeAcitve.snapshot.paramMap.get('id'), 10);
    files: Set<File>;
    private phoneArray = [];
    private drivinSchoolModel = new DrivingSchool();
    private cep$: Subscription;
    private user$: Subscription;
    private fileArray = [];
    private fileModel: Array<FileModel> = [];
    private filesUpdate: Array<FileModelUpdate> = [];

    constructor(
        public dialog: MatDialog,
        private routeAcitve: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _autoEscolaService: DrivingSchoolService,
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

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addPhoneNumberField(): void {

        const phonesFormArray = this._formBuilder.group({
            phoneNumber: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.contactForm.get('phonesNumbers') as FormArray).push(phonesFormArray);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        const phonesFormArray = this.contactForm.get('phonesNumbers') as FormArray;
        if (id === 0 && phonesFormArray.length > 1) {
            phonesFormArray.removeAt(index);
            return this.closeAlerts();
        }
        if (phonesFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlerts();
        }
        this._userServices.removePhonenumber(id).subscribe((res) => {
            if (res === true) {
                this.openSnackBar('Removido');
                phonesFormArray.removeAt(index);
                return this.closeAlerts();
            }
            if (res === false) {
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlerts();
            }

        });
    }

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addFileField(): void {

        const filesFormArray = this._formBuilder.group({
            file: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.filesForm.get('files') as FormArray).push(filesFormArray);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileFieldFromApi(id: number, index): void {
        this.loadingForm = true;
        this.filesForm.disable();
        this._changeDetectorRef.markForCheck();
        //Exibe o alerta de confirmação
        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do documento?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                this.loadingForm = false;
                this._changeDetectorRef.markForCheck();
                return;
            }

            // Se a confirmação do alerta for um OK, remove o usuário
            this.deleteFileFromApi(id).subscribe((res: any) => {
                if (res === true) {
                    if (index > -1) {
                        this.fileArray.splice(index, 1);
                    }
                    this.loadingForm = false;
                    this._changeDetectorRef.markForCheck();
                    this.openSnackBar('Removido');
                    return this.closeAlerts();
                }
                this.openSnackBar(res.detail, 'warn');
                this.loadingForm = false;
                this._changeDetectorRef.markForCheck();
                return this.closeAlerts();
            });
        });
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileField(id: number, index: number): void {
        const phoneNumbersFormArray = this.filesForm.get('files') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Atualiza ou cria um novo usuário do tipo AutoEscola
     */
    submit(): void {
        //Exibe o alerta de salvando dados
        this.loading = true;
        this.saving = true;
        this.message = 'Salvando';
        this._changeDetectorRef.markForCheck();

        //Se não tiver um ID, significa que está criando um novo usuário
        if (!this.id) {
            this.user$ = this._autoEscolaService.createFormEncoded(this.drivinSchoolModel).subscribe((res: any) => {
                if (res.error) {return this.closeAlerts();}
                this.closeAlerts();
                this.openSnackBar('Salvo');
                this._router.navigate(['usuario/auto-escola']);
            });
        } else {
            this.user$ = this._autoEscolaService.updateFormEncoded(this.drivinSchoolModel).subscribe((res: any) => {
                if (res.error) {return this.closeAlerts();}
                this.closeAlerts();
                this.openSnackBar('Atualizado');
                this._router.navigate(['usuario/auto-escola']);
            });
        }
    }

    /**
     * Fecha todos os alertas e loadings da tela
     */
    closeAlerts(): void {
        this.saving = false;
        this.loading = false;
        this.message = null;
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Consulta o cep pela API dos correios
     *
     * @param event
     */
    buscaCep(event): void {
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
        const fileNames = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < selectedFiles.length; i++) {
            if (selectedFiles[i].name.length < 50) {
                fileNames.push(selectedFiles[i].name);
                this.files.add(selectedFiles[i]);
            } else {
                return this.openSnackBar('Nome do arquivo muito gande', 'warn');
            }
        }
    }

    /**
     * Define os dados pessoais no objeto para envio
     *
     * @userPost: é o objeto do tipo usuario AutoEscola que será enviado para o BackEnd
     */
    setPersonalData(): void {
        //Dados da instituição
        if (this.accountForm.valid) {
            const data = this.accountForm.value;

            if (this.id) {
                this.drivinSchoolModel.id = this.id;
            }

            this.drivinSchoolModel.corporateName = data.corporateName;
            this.drivinSchoolModel.fantasyName = data.fantasyName;
            this.drivinSchoolModel.stateRegistration = data.stateRegistration.replace(/[^0-9,]*/g, '').replace('-', '').replace('/', '');
            this.drivinSchoolModel.foundingDate = data.foundingDate;
            this.drivinSchoolModel.email = data.email;
            this.drivinSchoolModel.description = data.description;
            this.drivinSchoolModel.site = data.site;
            this.drivinSchoolModel.cnpj = data.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
            if (!this.id) {
                this.drivinSchoolModel.password = 'Pay@2021';
            }
        }
        // Dados de endereço
        if (this.addressForm.valid) {
            const data = this.addressForm.value;

            this.drivinSchoolModel.cep = data.cep.replace(/[^0-9,]*/g, '').replace(',', '.');
            this.drivinSchoolModel.uf = data.uf;
            this.drivinSchoolModel.district = data.district;
            this.drivinSchoolModel.city = data.city;
            this.drivinSchoolModel.addressNumber = data.addressNumber;
            this.drivinSchoolModel.fullAddress = data.address;
            this.drivinSchoolModel.complement = data.complement;
        }
        // dados de contato
        if (this.contactForm.valid) {
            const data = this.contactForm.value;
            //Verifica se os telefones informados são válidos
            data.phonesNumbers.forEach((item) => {
                if (item.phoneNumber === null || item.phoneNumber === '' || item.phoneNumber.length < 11) {
                    this.openSnackBar('Insira um telefone', 'warn');
                    return;
                }
            });
            data.phonesNumbers.forEach((item) => {
                if (item.phoneNumber.length !== 11) {
                    item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
                }
            });
            this.drivinSchoolModel.phonesNumbers = data.phonesNumbers;
        }

        //Dados de arquivos de upload
        if (this.filesForm.valid) {
            this.files.forEach((item) => {
                if (!this.fileModel.find(f => f.file.name === item.name)) {
                    const file = new FileModel();
                    file.file = item;
                    file.fileName = item.name;
                    this.fileModel.push(file);
                }
            });
            this.drivinSchoolModel.files = this.fileModel;
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

    /**
     * Monta todos os formulários
     *
     * @private
     */
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

        // Create a phone number form group
        this.phoneArray.push(
            this._formBuilder.group({
                phoneNumber: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao formGroup
        this.phoneArray.forEach((item) => {
            (this.contactForm.get('phonesNumbers') as FormArray).push(item);
        });

        // Create a phone number form group
        this.fileArray.push(
            this._formBuilder.group({
                file: [null, Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de arquivos ao fomrGroup
        this.fileArray.forEach((item) => {
            (this.filesForm.get('files') as FormArray).push(item);
        });

        this._changeDetectorRef.markForCheck();
        this.phoneArray = [];
        this.fileArray = [];
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    /**
     * Monta todos os formulário para edição do usuário
     *
     * @private
     */
    private prepareEditUser(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this._autoEscolaService.getOne(this.id,this._authServices.getUserInfoFromStorage().address.uf).subscribe((res: any) => {
            if (res.error) {return;}
            this.accountForm = this._formBuilder.group({
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
                files: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            });

            if (res.phonesNumbers.length > 0) {
                res.phonesNumbers.forEach((item) => {
                    //Cria um formGroup de telefone
                    this.phoneArray.push(
                        this._formBuilder.group({
                            id: [item.id],
                            phoneNumber: [item.phoneNumber, Validators.compose([
                                Validators.required,
                                Validators.nullValidator
                            ])]
                        }));
                });
            } else {
                // Create a phone number form group
                this.phoneArray.push(
                    this._formBuilder.group({
                        id: [0],
                        phoneNumber: ['', Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ])]
                    })
                );
            }
            // Adiciona o array de telefones ao formGroup
            this.phoneArray.forEach((item) => {
                (this.contactForm.get('phonesNumbers') as FormArray).push(item);
            });

            // Create a files form group
            if (res.files.length > 0) {

                this.filesUpdate = res.files;

                // Create a files form group
                this.fileArray.push(
                    this._formBuilder.group({
                        id: [0],
                        file: ['']
                    })
                );
            } else {
                // Create a phone number form group
                this.fileArray.push(
                    this._formBuilder.group({
                        id: [0],
                        file: ['', Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ])]
                    })
                );

            }

            // Adiciona o array de telefones ao formGroup
            this.fileArray.forEach((item) => {
                (this.filesForm.get('files') as FormArray).push(item);
            });

            this.fileArray = [];
            this.fileArray = res.files;

            this.loading = false;
            this._changeDetectorRef.markForCheck();
            this.phoneArray = [];
        });
    }

    /**
     * Remove um arquivo da API
     *
     * @param id
     * @private
     */
    private deleteFileFromApi(id: number): Observable<boolean> {
        return this._userServices.removeFile(id);
    }
}
