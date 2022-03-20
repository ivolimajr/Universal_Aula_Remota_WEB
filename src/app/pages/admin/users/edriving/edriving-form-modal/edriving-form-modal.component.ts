import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, of, Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EdrivingModel} from 'app/shared/models/edriving.model';
import {EdrivingService} from '../../../../../shared/services/http/edriving.service';
import {Level} from '../../../../../shared/models/level.model';
import {LocalStorageService} from '../../../../../shared/services/storage/localStorage.service';
import {User} from '../../../../../shared/models/user.model';
import {environment} from '../../../../../../environments/environment';
import {AuthService} from '../../../../../shared/services/auth/auth.service';
import {UserService} from '../../../../../shared/services/http/user.service';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';

@Component({
    selector: 'app-edrivin-form-modal',
    templateUrl: './edriving-form-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class EdrivingFormModalComponent implements OnInit, OnDestroy {

    @Input() userEdit: EdrivingModel; //Se vier um ID, exibir e atualizar o usuário
    accountForm: FormGroup;
    masks = MASKS;
    loading: boolean = true; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    levels: Level[]; //Lista com os cargos
    levelId: number;
    selectedLevel: string = null; //Cargo Selecionado
    private edrivingModel = new EdrivingModel(); //Objeto para envio dos dados para API
    private phoneArray = [];
    private user: User;
    private userSub: Subscription;
    private levelSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<EdrivingFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService,
        private _userServices: UserService,
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
        this.accountForm.disable();
        //Prepara o usuário
        const result = this.prepareUser();
        if (result) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this._changeDetectorRef.markForCheck();

            //Atualiza o usuário
            if (this.userEdit) {
                this.userSub = this._edrivingServices.update(this.edrivingModel).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        this.closeAlert();
                        return;
                    }
                    //Se o usuário a ser atualizado for o usuário logado, atualiza os dados na storage
                    if (this.userEdit.id === this._authServices.getUserInfoFromStorage().id) {
                        this.user = this._authServices.getUserInfoFromStorage();
                        this.user.name = res.name;
                        this.user.email = res.email;
                        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
                    }
                    this.accountForm.enable();
                    this.closeAlert();
                    this.dialogRef.close(res);
                    return;
                });
            } else {
                //Cria um usuário
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                this.userSub = this._edrivingServices.create(this.edrivingModel).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        this.closeAlert();
                        return;
                    }
                    this.accountForm.enable();
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
        const phonesFormArray = this.accountForm.get('phonesNumbers') as FormArray;
        if (id === 0 && phonesFormArray.length > 1) {
            phonesFormArray.removeAt(index);
            return this.closeAlert();
        }
        if (phonesFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlert();
        }
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        const dialogRef = this.dialog.open(AlertModalComponent, {
            width: '280px',
            data: {title: 'Confirma remoção do telefone?'}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
                return;
            }
            this.removePhoneFromApi(id).subscribe((res: any)=>{
                if(res){
                    this.openSnackBar('Removido');
                    phonesFormArray.removeAt(index);
                    return this.closeAlert();
                }
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlert();
            });
        });
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
        (this.accountForm.get('phonesNumbers') as FormArray).push(phonesFormArray);
        this._changeDetectorRef.markForCheck();
    }

    onSelectCargoChange(id: number): void {
        this.levelId = id;
    };

    ngOnDestroy(): void {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.levelSub) {
            this.levelSub.unsubscribe();
        }
    }

    /**
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this.levelSub = this._edrivingServices.getCargos().subscribe((res) => {
            this.levels = res;
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
            name: ['Nome Apagar',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            cpf: ['424.185.420-68',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(11),
                    Validators.maxLength(14),
                    NgBrazilValidators.cpf])],
            email: ['apagar22@email.com',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        // Create a phone number form group
        this.phoneArray.push(
            this._formBuilder.group({
                phoneNumber: ['61986618601', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            })
        );

        // Adiciona o array de telefones ao fomrGroup
        this.phoneArray.forEach((item) => {
            (this.accountForm.get('phonesNumbers') as FormArray).push(item);
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
            this.accountForm.enable();
            return false;
        }

        //Verifica se os telefones informados são válidos
        formData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber === null || item.phoneNumber === '' || item.phoneNumber.length < 10) {
                this.openSnackBar('Insira um telefone', 'warn');
                this.accountForm.enable();
                result = false;
            }
        });

        if (this.levelId === undefined || this.levelId === 0) {
            this.openSnackBar('Selecione um Cargo', 'warn');
            this.accountForm.enable();
            result = false;
        }

        if (this.userEdit) {
            this.edrivingModel.id = this.userEdit.id;
        }
        if (!this.userEdit) {
            this.edrivingModel.password = 'Pay@2021';
        }
        this.edrivingModel.name = formData.name;
        this.edrivingModel.email = formData.email;
        this.edrivingModel.cpf = formData.cpf.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.edrivingModel.levelId = this.levelId;
        formData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.edrivingModel.phonesNumbers = formData.phonesNumbers;
        return result;
    }

    private prepareEditForm(): void {

        this.loading = true;
        this.message = 'Buscando dados.';
        this._changeDetectorRef.markForCheck();

        this.accountForm = this._formBuilder.group({
            name: [this.userEdit.name,
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
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });
        this.levelId = this.userEdit.levelId;
        this.selectedLevel = this.userEdit.level.id.toString();

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.userEdit.phonesNumbers.length > 0) {
            // Iterate through them
            this.userEdit.phonesNumbers.forEach((phoneNumber) => {

                //Cria um formGroup de telefone
                this.phoneArray.push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        phoneNumber: [phoneNumber.phoneNumber, Validators.compose([
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
        // Adiciona o array de telefones ao fomrGroup
        this.phoneArray.forEach((item) => {
            (this.accountForm.get('phonesNumbers') as FormArray).push(item);
        });
        this.edrivingModel.id = this.userEdit.id;
        this.closeAlert();
        this.phoneArray = [];
    }

    private openSnackBar(message: string, type: string = 'accent'): void {
        this._snackBar.open(message, '', {
            duration: 5 * 1000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['mat-toolbar', 'mat-' + type]
        });
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
       return this._userServices.removePhonenumber(id);
    }
}
