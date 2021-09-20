import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {Cargo} from '../../../../../shared/models/cargo.model';
import {ParceiroPost, ParceiroUsuario} from '../../../../../shared/models/parceiro.model';
import {ParceiroService} from '../../../../../shared/services/http/parceiro.service';
import {Usuario} from '../../../../../shared/models/usuario.model';
import {LocalStorageService} from '../../../../../shared/services/storage/localStorage.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';
import {environment} from '../../../../../../environments/environment';
import {CepService} from '../../../../../shared/services/http/cep.service';

@Component({
    selector: 'app-parceiro-form-modal',
    templateUrl: './parceiro-form-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ParceiroFormModalComponent implements OnInit, OnDestroy {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input() userEdit: ParceiroUsuario; //Se vier um ID, exibir e atualizar o usuário
    accountForm: FormGroup;
    masks = MASKS;
    loading: boolean = true; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    cargos: Cargo[];
    cargoId: number;
    selected: string = null; //Cargo Selecionado
    estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private parceiroUserPost = new ParceiroPost();
    private phoneArray = [];
    private user: Usuario;
    private cargoSub: Subscription;
    private userSub: Subscription;
    private cepSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ParceiroFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: ParceiroService,
        private _authServices: AuthService,
        private _cepService: CepService,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnDestroy(): void {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.cargoSub) {
            this.cargoSub.unsubscribe();
        }
        if (this.cepSub) {
            this.cepSub.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.getCargos();
        //Prepara o formulário
        this.prepareForm();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit(): void {
        const result = this.prepareUser();
        if (result) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this.message = 'Salvando';
            this._changeDetectorRef.markForCheck();

            if (this.userEdit) {
                this.userSub = this._parceiroServices.update(this.parceiroUserPost).subscribe((res: any) => {
                    if (res.error) {
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        return;
                    }
                    //Se o usuário a ser atualizado for o usuário logado, atualiza os dados na storage
                    if (this.userEdit.id === this._authServices.getUserInfoFromStorage().id) {
                        this.user = this._authServices.getUserInfoFromStorage();
                        this.user.nome = res.nome;
                        this.user.email = res.email;
                        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
                    }
                    this.closeAlert();
                    this.dialogRef.close(res);
                    return;
                });
            } else {
                this.userSub = this._parceiroServices.create(this.parceiroUserPost).subscribe((res: any) => {
                    if (res.error) {
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        return;
                    }
                    this.closeAlert();
                    this.dialogRef.close(res);
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

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        const phoneNumbersFormArray = this.accountForm.get('telefones') as FormArray;
        if (phoneNumbersFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
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
    addPhoneNumberField(): void {

        const phoneNumberFormGroup = this._formBuilder.group({
            telefone: ['', Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])]
        });

        // Adiciona o formGroup ao array de telefones
        (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    onSelectCargoChange(id: number): void {
        this.cargoId = id;
    };

    buscaCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cepSub = this._cepService.buscar(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.accountForm.patchValue({
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
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this.cargoSub = this._parceiroServices.getCargos().subscribe((res) => {
            this.cargos = res;
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Prepara o formulário com os validadores
     *Se não for passado um ID para o componente, significa que é um novo usuáro.
     * Caso contrário, será atualizado o usuário
     *
     * @return void
     * @private
     */
    private prepareForm(): void {
        //Cria um formulário para exibição e atualização de um usuário
        if (this.userEdit !== null) {
            this.prepareEditForm();
            return;
        }

        //Cria um formulário para adição de um usuário
        this.accountForm = this._formBuilder.group({
            nome: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: ['@edriving.com',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cnpj: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(14),
                    Validators.maxLength(14)])],
            descricao: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            cep: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(10),
                    NgBrazilValidators.cep])],
            enderecoLogradouro: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            bairro: ['',
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
            cidade: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            numero: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            cargoId: [0,
                Validators.compose([
                    Validators.required])],
            telefones: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator,
            ])),
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
        this.phoneArray.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });

        this.closeAlert();
        this._changeDetectorRef.markForCheck();
        this.phoneArray = [];
    }

    /**
     * Prepara o usuário para envio
     */
    private prepareUser(): boolean {
        const formData = this.accountForm.value;
        let result: boolean = true;

        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        //Verifica se os telefones informados são válidos
        formData.telefones.forEach((item) => {
            if (item.telefone === null || item.telefone === '' || item.telefone.length < 11) {
                this.openSnackBar('Insira um telefone', 'warn');
                result = false;
            }
        });

        if (this.cargoId === undefined || this.cargoId === 0) {
            this.openSnackBar('Selecione um Cargo', 'warn');
            result = false;
        }

        if (this.userEdit) {
            this.parceiroUserPost.id = this.userEdit.id;
        }
        if (!this.userEdit) {
            this.parceiroUserPost.senha = 'Pay@2021';
        }

        this.parceiroUserPost.nome = formData.nome;
        this.parceiroUserPost.email = formData.email;
        this.parceiroUserPost.cnpj = formData.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.parceiroUserPost.descricao = formData.descricao;
        this.parceiroUserPost.cep = formData.cep.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.parceiroUserPost.uf = 'DF';
        this.parceiroUserPost.enderecoLogradouro = formData.enderecoLogradouro;
        this.parceiroUserPost.bairro = formData.bairro;
        this.parceiroUserPost.cidade = formData.cidade;
        this.parceiroUserPost.numero = formData.numero;
        this.parceiroUserPost.cargoId = this.cargoId;
        formData.telefones.forEach((item) => {
            if (item.telefone.length !== 11) {
                item.telefone = item.telefone.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.parceiroUserPost.telefones = formData.telefones;
        return result;
    }

    private prepareEditForm(): void {

        this.loading = true;
        this.message = 'Buscando dados.';
        this._changeDetectorRef.markForCheck();

        this.accountForm = this._formBuilder.group({
            nome: [this.userEdit.nome,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: [this.userEdit.email,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cnpj: [this.userEdit.cnpj,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(14),
                    Validators.maxLength(14)])],
            descricao: [this.userEdit.descricao,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            cep: [this.userEdit.endereco.cep,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    NgBrazilValidators.cep])],
            uf: [this.userEdit.endereco.uf, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            enderecoLogradouro: [this.userEdit.endereco.enderecoLogradouro,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            bairro: [this.userEdit.endereco.bairro,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            cidade: [this.userEdit.endereco.cidade,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            numero: [this.userEdit.endereco.numero,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            cargoId: [this.userEdit.cargoId,
                Validators.compose([
                    Validators.required])],
            telefones: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        this.cargoId = this.userEdit.cargoId;
        this.selected = this.userEdit.cargo.id.toString();

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.userEdit.telefones.length > 0) {
            // Iterate through them
            this.userEdit.telefones.forEach((phoneNumber) => {

                //Cria um formGroup de telefone
                this.phoneArray.push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        telefone: [phoneNumber.telefone, Validators.compose([
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
        this.phoneArray.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });
        this.parceiroUserPost.id = this.userEdit.id;
        this.closeAlert();
        this.phoneArray = [];
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
