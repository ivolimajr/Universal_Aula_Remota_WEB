import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {formatDate} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {Subscription} from 'rxjs';
import {AutoEscolaPost} from '../../../../../shared/models/autoEscola.model';
import {AutoescolaService} from '../../../../../shared/services/http/autoescola.service';

@Component({
    selector: 'app-autoescola-form',
    templateUrl: './autoescola-form.component.html'
})
export class AutoescolaFormComponent implements OnInit, OnDestroy {

    verticalStepperForm: FormGroup;
    masks = MASKS;
    loading: boolean = false; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    public id: number = parseInt(this.routeAcitve.snapshot.paramMap.get('id'), 10);
    private phoneArray = [];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    files: Set<File>;
    private userPost = new AutoEscolaPost();
    private cepSub: Subscription;
    private userSub: Subscription;
    private fileArray = [];

    constructor(
        private routeAcitve: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cepService: CepService,
        private _autoEscolaService: AutoescolaService,
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

        const phoneNumberFormGroup = this._formBuilder.group({
            telefone: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.verticalStepperForm.get('step3').get('telefones') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        const phoneNumbersFormArray = this.verticalStepperForm.get('step3').get('telefones') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addFileField(): void {

        const phoneNumberFormGroup = this._formBuilder.group({
            arquivo: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileField(id: number, index: number): void {
        const phoneNumbersFormArray = this.verticalStepperForm.get('step4').get('arquivos') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    submit(id: number): void {
        this.verticalStepperForm.disable();
        const result = this.prepareUser();
        if (result) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this.message = 'Salvando';
            this._changeDetectorRef.markForCheck();

            if (!id) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                this.userSub = this._autoEscolaService.create(this.userPost, this.files).subscribe((res: any) => {
                    console.log(res);
                    if (res.error) {
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        this.verticalStepperForm.enable();
                        return;
                    }
                    this.closeAlert();
                    this.openSnackBar('Salvo');
                    this._router.navigate(['usuario/auto-escola']);
                });
            }
        }
    }

    //Fecha o alerta na tela
    closeAlert(): void {
        this.loading = false;
        this.message = null;
        this._changeDetectorRef.markForCheck();
    }

    buscaCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cepSub = this._cepService.buscar(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.verticalStepperForm.get('step2').patchValue({
                bairro: res.bairro,
                enderecoLogradouro: res.logradouro,
                cidade: res.localidade,
                cep: res.cep,
                uf: res.uf
            });
            this._changeDetectorRef.markForCheck();
        });
    }

    onChange(event): void {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const selectedFiles = <FileList>event.srcElement.files;
        const fileNames = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < selectedFiles.length; i++) {
            fileNames.push(selectedFiles[i].name);
            this.files.add(selectedFiles[i]);
        }
    }

    ngOnDestroy(): void {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.cepSub) {
            this.cepSub.unsubscribe();
        }
    }

    private loadForm(): void {

        if (this.id) {
            this.prepareEditUser();
            return;
        }
        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                razaoSocial: ['Dora e Ricardo Telecomunicações Ltda',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                nomeFantasia: ['Antonio Filmagens Ltda',
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(150)
                    ])],
                inscricaoEstadual: ['669.503.958.773',
                    Validators.compose([
                        Validators.required,
                        Validators.minLength(15),
                        Validators.maxLength(30)
                    ])],
                dataFundacao: ['2021-01-30',
                    Validators.required,
                ],
                email: ['autoescola2@edriving.com',
                    Validators.compose([
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(70)
                    ])],
                descricao: ['Auto Escola Brasil',
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
            }),
            step2: this._formBuilder.group({
                cep: ['14786-006',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(8),
                        Validators.maxLength(10),
                        NgBrazilValidators.cep])],
                enderecoLogradouro: ['Travessa SF-2',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(3),
                        Validators.maxLength(150)])],
                bairro: ['São Francisco',
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
                cidade: ['Barretos',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(3),
                        Validators.maxLength(150)])],
                numero: ['240',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(1),
                        Validators.maxLength(50)])],
            }),
            step3: this._formBuilder.group({
                telefones: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            }),
            step4: this._formBuilder.group({
                arquivos: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            })
        });

        // Create a phone number form group
        this.phoneArray.push(
            this._formBuilder.group({
                telefone: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao fomrGroup
        this.phoneArray.forEach((item) => {
            (this.verticalStepperForm.get('step3').get('telefones') as FormArray).push(item);
        });

        // Create a phone number form group
        this.fileArray.push(
            this._formBuilder.group({
                arquivo: [null, Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao fomrGroup
        this.fileArray.forEach((item) => {
            (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(item);
        });

        this._changeDetectorRef.markForCheck();
        this.phoneArray = [];
        this.fileArray = [];
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private prepareUser(): boolean {
        let result = true;

        if (this.verticalStepperForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            result = false;
        }

        const formDataStepOne = this.verticalStepperForm.value.step1;
        const formDataStepTwo = this.verticalStepperForm.value.step2;
        const formDataStepThree = this.verticalStepperForm.value.step3;
        const formDataStepFour = this.verticalStepperForm.value.step4;

        //Verifica se os telefones informados são válidos
        formDataStepThree.telefones.forEach((item) => {
            if (item.telefone === null || item.telefone === '' || item.telefone.length < 11) {
                this.openSnackBar('Insira um telefone', 'warn');
                result = false;
            }
        });

        //Step1
        this.userPost.razaoSocial = formDataStepOne.razaoSocial;
        this.userPost.nomeFantasia = formDataStepOne.nomeFantasia;
        this.userPost.inscricaoEstadual = formDataStepOne.inscricaoEstadual.replace(/[^0-9,]*/g, '').replace('-', '').replace('/', '');
        this.userPost.dataFundacao = formDataStepOne.dataFundacao;
        this.userPost.email = formDataStepOne.email;
        this.userPost.descricao = formDataStepOne.descricao;
        this.userPost.site = formDataStepOne.site;
        this.userPost.cnpj = formDataStepOne.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
        //Step2
        this.userPost.uf = formDataStepTwo.uf;
        this.userPost.cep = formDataStepTwo.cep.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
        this.userPost.enderecoLogradouro = formDataStepTwo.enderecoLogradouro;
        this.userPost.bairro = formDataStepTwo.bairro;
        this.userPost.cidade = formDataStepTwo.cidade;
        this.userPost.numero = formDataStepTwo.numero;
        this.userPost.senha = 'Pay@2021';
        //Step3
        formDataStepThree.telefones.forEach((item) => {
            if (item.telefone.length !== 11) {
                item.telefone = item.telefone.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.userPost.telefones = formDataStepThree.telefones;
        //Step4
        this.userPost.arquivos = formDataStepFour.arquivos;

        return result;
    }

    private prepareEditUser(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this._autoEscolaService.getOne(this.id).subscribe((res: any) => {
            console.log(res);
            if (res.error) {
                this.openSnackBar(res.error, 'warn');
                return;
            }
            this.verticalStepperForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    razaoSocial: [res.razaoSocial,
                        Validators.compose([
                            Validators.required,
                            Validators.maxLength(150)
                        ])],
                    nomeFantasia: [res.nomeFantasia,
                        Validators.compose([
                            Validators.required,
                            Validators.maxLength(150)
                        ])],
                    inscricaoEstadual: [res.inscricaoEstadual,
                        Validators.compose([
                            Validators.required,
                            Validators.minLength(15),
                            Validators.maxLength(30)
                        ])],
                    dataFundacao: [formatDate(res.dataFundacao, 'yyyy-MM-dd', 'en'),
                        Validators.required,
                    ],
                    email: [res.email,
                        Validators.compose([
                            Validators.required,
                            Validators.email,
                            Validators.maxLength(70)
                        ])],
                    descricao: [res.descricao,
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
                }),
                step2: this._formBuilder.group({
                    cep: [res.endereco.cep,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(8),
                            Validators.maxLength(10),
                            NgBrazilValidators.cep])],
                    enderecoLogradouro: [res.endereco.enderecoLogradouro,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    bairro: [res.endereco.bairro,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    uf: [res.endereco.uf, Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(2),
                        Validators.maxLength(2)
                    ])],
                    cidade: [res.endereco.cidade,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(3),
                            Validators.maxLength(150)])],
                    numero: [res.endereco.numero,
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator,
                            Validators.minLength(1),
                            Validators.maxLength(50)])],
                }),
                step3: this._formBuilder.group({
                    telefones: this._formBuilder.array([],
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ]))
                }),
                step4: this._formBuilder.group({
                    arquivos: this._formBuilder.array([],
                        Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ]))
                })
            });

            if (res.telefones.length > 0) {
                res.telefones.forEach((item) => {
                    //Cria um formGroup de telefone
                    this.phoneArray.push(
                        this._formBuilder.group({
                            id: [item.id],
                            telefone: [item.telefone, Validators.compose([
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
                        telefone: ['', Validators.compose([
                            Validators.required,
                            Validators.nullValidator
                        ])]
                    })
                );
            }
            // Adiciona o array de telefones ao fomrGroup
            this.phoneArray.forEach((item) => {
                (this.verticalStepperForm.get('step3').get('telefones') as FormArray).push(item);
            });
            // Create a phone number form group
            this.fileArray.push(
                this._formBuilder.group({
                    arquivo: [null, Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ])]
                })
            );

            // Adiciona o array de telefones ao fomrGroup
            this.fileArray.forEach((item) => {
                (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(item);
            });

            this.fileArray = res.arquivos;
            console.log(this.fileArray);

            /*

                        if (res.arquivos.length > 0) {
                            res.arquivos.forEach((item) => {
                                //Cria um formGroup de telefone
                                this.fileArray.push(
                                    this._formBuilder.group({
                                        id: [item.id],
                                        telefone: [item.arquivo,Validators.compose([
                                            Validators.required,
                                            Validators.nullValidator
                                        ])]
                                    }));
                            });
                        } else {
                            // Create a phone number form group
                            this.fileArray.push(
                                this._formBuilder.group({
                                    id: [0],
                                    arquivo: ['', Validators.compose([
                                        Validators.required,
                                        Validators.nullValidator
                                    ])]
                                })
                            );
                        }
                        // Adiciona o array de telefones ao fomrGroup
                        this.fileArray.forEach((item) => {
                            (this.verticalStepperForm.get('step4').get('arquivos') as FormArray).push(item);
                        });
            */


            this.loading = false;
            this._changeDetectorRef.markForCheck();
            this.phoneArray = [];
        });


    }
}
