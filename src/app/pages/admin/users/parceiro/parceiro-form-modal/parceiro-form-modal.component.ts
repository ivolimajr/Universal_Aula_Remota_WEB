import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cargo} from '../../../../../shared/models/cargo.model';
import {ParceiroPost} from '../../../../../shared/models/parceiro.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {catchError} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';
import {ParceiroService} from '../../../../../shared/services/http/parceiro.service';
import {Usuario} from '../../../../../shared/models/usuario.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LocalStorageService} from '../../../../../shared/services/storage/localStorage.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';
import {environment} from '../../../../../../environments/environment';
import {MASKS, NgBrazilValidators} from 'ng-brazil';

@Component({
    selector: 'app-parceiro-form-modal',
    templateUrl: './parceiro-form-modal.component.html',
    styleUrls: ['./parceiro-form-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ParceiroFormModalComponent implements OnInit, OnDestroy {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input() id: number; //Se vier um ID, exibir e atualizar o usuário
    accountForm: FormGroup;
    masks = MASKS;
    loading: boolean = true; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    cargos: Cargo[];
    cargoId: number;
    selected: string = null; //Cargo Selecionado
    private parceiroUserPost = new ParceiroPost();
    private phoneArray = [];
    private user: Usuario;
    private cargoSub: Subscription;
    private userSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ParceiroFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: ParceiroService,
        private _authServices: AuthService,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
        this.cargoSub.unsubscribe();
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

            if (this.id) {
                this.userSub = this._parceiroServices.update(this.parceiroUserPost).subscribe((res: any) => {
                    if (res.error) {
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        return;
                    }
                    //Se o usuário a ser atualizado for o usuário logado, atualiza os dados na storage
                    if (this.id === this._authServices.getUserInfoFromStorage().id) {
                        this.user = this._authServices.getUserInfoFromStorage();
                        this.user.nome = res.nome;
                        this.user.email = res.email;
                        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
                    }
                    this.closeAlert();
                    this.dialogRef.close(res);
                    return;
                }), catchError(res => of(res));
            } else {
                this.userSub = this._parceiroServices.create(this.parceiroUserPost).subscribe((res: any) => {
                    if (res.error) {
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        return;
                    }
                    this.closeAlert();
                    this.dialogRef.close(res);
                }), catchError(res => of(res));
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
        // Cria um novo formGroup vazio
        const phoneNumberFormGroup = this._formBuilder.group({
            id: [0],
            telefone: ['']
        });
        // Adiciona o formGroup ao array de telefones
        (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);
        this._changeDetectorRef.markForCheck();
    }

    onSelectCargoChange(id: number): void {
        this.cargoId = id;
    };

    /**
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this.cargoSub = this._parceiroServices.getCargos().subscribe((res) => {
            this.cargos = res;
            console.log(this.cargos);
            this._changeDetectorRef.markForCheck();
        }),
            catchError(res => of(res));
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
        if (this.id !== null) {
            this.prepareEditForm();
            return;
        }

        //Cria um formulário para adição de um usuário
        this.accountForm = this._formBuilder.group({
            nome: ['DETRAN',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: ['parceiro@edriving.com',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cnpj: ['00000000002000',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(14),
                    Validators.maxLength(14)])],
            descricao: ['Descrição qualquer',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            cep: ['72235621',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    NgBrazilValidators.cep])],
            enderecoLogradouro: ['Logradouro',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            bairro: ['Bairro',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            cidade: ['Cidade',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            numero: ['01',
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
                Validators.nullValidator
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

        if (this.id) {
            this.parceiroUserPost.id = this.id;
        }
        if (!this.id) {
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

        this._parceiroServices.getOne(this.id).subscribe((res) => {
            this.accountForm = this._formBuilder.group({
                nome: [res.nome,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(100)]
                    )],
                email: [res.email,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
                cnpj: [res.cnpj,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(14),
                        Validators.maxLength(14)])],
                descricao: [res.descricao,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(100)])],
                cep: [res.endereco.cep,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(8),
                        Validators.maxLength(8),
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
                cargoId: [res.cargoId,
                    Validators.compose([
                        Validators.required])],
                telefones: this._formBuilder.array([], Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])),
            });

            this.cargoId = res.cargoId;
            this.selected = res.cargo.id.toString();

            //Só monta o array de telefones se houver telefones de contato cadastrado
            if (res.telefones.length > 0) {
                // Iterate through them
                res.telefones.forEach((phoneNumber) => {

                    //Cria um formGroup de telefone
                    this.phoneArray.push(
                        this._formBuilder.group({
                            id: [phoneNumber.id],
                            telefone: [phoneNumber.telefone,Validators.compose([
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
            this.parceiroUserPost.id = res.id;
            this.closeAlert();
            this.phoneArray = [];
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
