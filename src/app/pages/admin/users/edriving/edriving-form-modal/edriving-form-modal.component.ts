import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of, Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EdrivingPost, EdrivingUsuario} from 'app/shared/models/edriving.model';
import {EdrivingService} from '../../../../../shared/services/http/edriving.service';
import {Cargo} from '../../../../../shared/models/cargo.model';
import {LocalStorageService} from '../../../../../shared/services/storage/localStorage.service';
import {Usuario} from '../../../../../shared/models/usuario.model';
import {environment} from '../../../../../../environments/environment';
import {AuthService} from '../../../../../shared/services/auth/auth.service';

@Component({
    selector: 'app-edrivin-form-modal',
    templateUrl: './edriving-form-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class EdrivingFormModalComponent implements OnInit, OnDestroy {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input() userEdit: EdrivingUsuario; //Se vier um ID, exibir e atualizar o usuário
    accountForm: FormGroup;
    masks = MASKS;
    loading: boolean = true; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    cargos: Cargo[]; //Lista com os cargos
    cargoId: number;
    selected: string = null; //Cargo Selecionado
    private edrivingUserPost = new EdrivingPost(); //Objeto para envio dos dados para API
    private phoneArray = [];
    private user: Usuario;
    private userSub: Subscription;
    private cargoSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<EdrivingFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService,
        private _authServices: AuthService,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        //Busca os cargos
        this.getCargos();
        //Prepara o formulário
        this.prepareForm();
    }

    //Fecha o formulário
    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Atualiza ou cria um novo usuário;
     *
     * @return void
     */
    submit(): void {
        //Prepara o usuário
        const result = this.prepareUser();
        if (result) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this.message = 'Salvando';
            this._changeDetectorRef.markForCheck();

            //Atualiza o usuário
            if (this.userEdit) {
                this.userSub = this._edrivingServices.update(this.edrivingUserPost).subscribe((res: any) => {
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
                //Cria um usuário
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                this.userSub = this._edrivingServices.create(this.edrivingUserPost).subscribe((res: any) => {
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
        const phoneNumberFormGroup =  this._formBuilder.group({
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

    ngOnDestroy(): void {
        if(this.userSub){
            this.userSub.unsubscribe();
        }
        if(this.cargoSub){
            this.cargoSub.unsubscribe();
        }
    }

    /**
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this.cargoSub = this._edrivingServices.getCargos().subscribe((res) => {
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
            cpf: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(11),
                    Validators.maxLength(14),
                    NgBrazilValidators.cpf])],
            email: ['',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
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

        if (this.userEdit.id) {
            this.edrivingUserPost.id = this.userEdit.id;
        }
        if (!this.userEdit) {
            this.edrivingUserPost.senha = 'Pay@2021';
        }
        this.edrivingUserPost.nome = formData.nome;
        this.edrivingUserPost.email = formData.email;
        this.edrivingUserPost.cpf = formData.cpf.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.edrivingUserPost.cargoId = this.cargoId;
        formData.telefones.forEach((item) => {
            if (item.telefone.length !== 11) {
                item.telefone = item.telefone.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.edrivingUserPost.telefones = formData.telefones;
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
                cpf: [this.userEdit.cpf,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(11),
                        Validators.maxLength(11)])],
                email: [this.userEdit.email,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
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
            this.phoneArray.forEach((item) => {
                (this.accountForm.get('telefones') as FormArray).push(item);
            });
            this.edrivingUserPost.id = this.userEdit.id;
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
