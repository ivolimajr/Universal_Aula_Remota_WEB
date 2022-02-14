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
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Arquivo} from '../../../../../shared/models/arquivo.model';

@Component({
    selector: 'app-autoescola-form',
    templateUrl: './autoescola-form.component.html'
})
export class AutoescolaFormComponent implements OnInit, OnDestroy {

    verticalStepperForm: FormGroup;
    accountForm: FormGroup;
    addressForm: FormGroup;
    contactForm: FormGroup;
    filesForm: FormGroup;

    masks = MASKS;
    loading: boolean = false; //Inicia o componente com um lading
    saving: boolean = false;
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    public id: number = parseInt(this.routeAcitve.snapshot.paramMap.get('id'), 10);
    files: Set<File>;
    private phoneArray = [];
    private userPost = new AutoEscolaPost();
    private cepSub: Subscription;
    private userSub: Subscription;
    private fileArray = [];
    private fileModel: Array<Arquivo> = [];

    constructor(
        public dialog: MatDialog,
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
        (this.contactForm.get('telefones') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        const phoneNumbersFormArray = this.contactForm.get('telefones') as FormArray;
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
        (this.filesForm.get('arquivos') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileFieldFromApi(id: number, index: number): void {
        //Exibe o alerta de confirmação
        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Documento será removido, confirma ?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                return;
            }
            //Se a confirmação do alerta for um OK, remove o usuário
            this.deleteFileFromApi(id);
        });
        const phoneNumbersFormArray = this.filesForm.get('arquivos') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            return;
        }
        phoneNumbersFormArray.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removeFileField(id: number, index: number): void {
        const phoneNumbersFormArray = this.filesForm.get('arquivos') as FormArray;
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
            this.userSub = this._autoEscolaService.create(this.userPost, this.files).subscribe((res: any) => {
                if (res.error) {
                    this.saving = false;
                    this.openSnackBar(res.error, 'warn');
                    this.closeAlert();
                    return;
                }
                this.saving = false;
                this.closeAlert();
                this.openSnackBar('Salvo');
                this._router.navigate(['usuario/auto-escola']);
            });
        } else {
            this.userSub = this._autoEscolaService.update(this.userPost).subscribe((res: any) => {
                console.log(res);
                if (res.error) {
                    this.saving = false;
                    this.openSnackBar(res.error, 'warn');
                    this.closeAlert();
                    return;
                }
                this.saving = false;
                this.closeAlert();
                this.openSnackBar('Atualizado');
                this._router.navigate(['usuario/auto-escola']);
            });
        }
    }

    /**
     * Fecha todos os alertas e loadings da tela
     */
    closeAlert(): void {
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
        this.cepSub = this._cepService.buscar(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.addressForm.patchValue({
                bairro: res.bairro,
                enderecoLogradouro: res.logradouro,
                cidade: res.localidade,
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
            fileNames.push(selectedFiles[i].name);
            this.files.add(selectedFiles[i]);
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
                this.userPost.id = this.id;
            }

            this.userPost.razaoSocial = data.razaoSocial;
            this.userPost.nomeFantasia = data.nomeFantasia;
            this.userPost.inscricaoEstadual = data.inscricaoEstadual.replace(/[^0-9,]*/g, '').replace('-', '').replace('/', '');
            this.userPost.dataFundacao = data.dataFundacao;
            this.userPost.email = data.email;
            this.userPost.descricao = data.descricao;
            this.userPost.site = data.site;
            this.userPost.cnpj = data.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
            if (!this.id) {
                this.userPost.senha = 'Pay@2021';
            }
        }
        // Dados de endereço
        if (this.addressForm.valid) {
            const data = this.addressForm.value;

            this.userPost.uf = data.uf;
            this.userPost.cep = data.cep.replace(/[^0-9,]*/g, '').replace(',', '.').replace('-', '');
            this.userPost.enderecoLogradouro = data.enderecoLogradouro;
            this.userPost.bairro = data.bairro;
            this.userPost.cidade = data.cidade;
            this.userPost.numero = data.numero;
        }
        // dados de contato
        if (this.contactForm.valid) {

            const data = this.contactForm.value;

            //Verifica se os telefones informados são válidos
            data.telefones.forEach((item) => {
                if (item.telefone === null || item.telefone === '' || item.telefone.length < 11) {
                    this.openSnackBar('Insira um telefone', 'warn');
                    return;
                }
            });

            data.telefones.forEach((item) => {
                if (item.telefone.length !== 11) {
                    item.telefone = item.telefone.replace(/[^0-9,]*/g, '').replace(',', '.');
                }
            });
            this.userPost.telefones = data.telefones;
        }

        //Dados de arquivos de upload
        if (this.filesForm.valid) {
            this.files.forEach((item) => {
                if (!this.fileModel.find(f => f.arquivo.name === item.name)) {
                    const file = new Arquivo();
                    file.arquivo = item;
                    file.name = item.name;
                    this.fileModel.push(file);
                }
            });
            this.userPost.arquivos = this.fileModel;
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
                    Validators.minLength(8),
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
        });
        this.addressForm = this._formBuilder.group({
            cep: ['70702-406',
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
        });
        this.contactForm = this._formBuilder.group({
            telefones: this._formBuilder.array([],
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ]))
        });
        this.filesForm = this._formBuilder.group({
            arquivos: this._formBuilder.array([],
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ]))
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
            (this.contactForm.get('telefones') as FormArray).push(item);
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
            (this.filesForm.get('arquivos') as FormArray).push(item);
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

    /**
     * Monta todos os formulário para edição do usuário
     *
     * @private
     */
    private prepareEditUser(): void {
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        this._autoEscolaService.getOne(this.id).subscribe((res: any) => {
            if (res.error) {
                this.openSnackBar(res.error, 'warn');
                return;
            }
            this.accountForm = this._formBuilder.group({
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
                        Validators.minLength(8),
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
            });
            this.addressForm = this._formBuilder.group({
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
                uf: [res.endereco.uf,
                    Validators.compose([
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
            });
            this.contactForm = this._formBuilder.group({
                telefones: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
            });
            this.filesForm = this._formBuilder.group({
                arquivos: this._formBuilder.array([],
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ]))
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
                (this.contactForm.get('telefones') as FormArray).push(item);
            });

            // Create a files form group
            if (res.arquivos.length > 0) {
                res.arquivos.forEach((item)=>{
                   const file = new Arquivo();
                   file.id = item.id;
                   file.name = item.nome;
                   this.fileModel.push(file);
                });

                // Create a files form group
                this.fileArray.push(
                    this._formBuilder.group({
                        id: [0],
                        arquivo: ['']
                    })
                );
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
                (this.filesForm.get('arquivos') as FormArray).push(item);
            });

            this.fileArray = [];
            this.fileArray = res.arquivos;

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
    private deleteFileFromApi(id: number): void {

    }
}
