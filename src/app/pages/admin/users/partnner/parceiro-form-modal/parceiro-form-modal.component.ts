import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {Level} from '../../../../../shared/models/level.model';
import {PartnnerPost, PartnnerUser} from '../../../../../shared/models/parceiro.model';
import {ParceiroService} from '../../../../../shared/services/http/parceiro.service';
import {User} from '../../../../../shared/models/user.model';
import {LocalStorageService} from '../../../../../shared/services/storage/localStorage.service';
import {AuthService} from '../../../../../shared/services/auth/auth.service';
import {environment} from '../../../../../../environments/environment';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {UserService} from '../../../../../shared/services/http/user.service';

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
    @Input() userEdit: PartnnerUser; //Se vier um ID, exibir e atualizar o usuário
    accountForm: FormGroup;
    masks = MASKS;
    loading: boolean = true; //Inicia o componente com um lading
    message: string = null; //Mensagem quando estiver salvando ou editando um usuário
    levels: Level[];
    levelId: number;
    selectedLevel: string = null; //Cargo Selecionado
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private partnnerPost = new PartnnerPost();
    private phoneArray = [];
    private user: User;
    private levelSub: Subscription;
    private userSub: Subscription;
    private cepSub: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ParceiroFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: ParceiroService,
        private _userServices: UserService,
        private _authServices: AuthService,
        private _cepService: CepService,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnDestroy(): void {
        if (this.userSub) {
            this.userSub.unsubscribe();
        }
        if (this.levelSub) {
            this.levelSub.unsubscribe();
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
        this.accountForm.disable();
        const result = this.prepareUser();
        if (result) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this._changeDetectorRef.markForCheck();

            if (this.userEdit) {
                this.userSub = this._parceiroServices.update(this.partnnerPost).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        this.openSnackBar(res.error, 'warn');
                        this.closeAlert();
                        return;
                    }
                    //Se o usuário a ser atualizado for o usuário logado, atualiza os dados na storage
                    if (this.userEdit.id === this._authServices.getUserInfoFromStorage().id) {
                        this.user = this._authServices.getUserInfoFromStorage();
                        this.user.name = res.nome;
                        this.user.email = res.email;
                        this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);
                    }
                    this.accountForm.enable();
                    this.closeAlert();
                    this.dialogRef.close(res);
                    return;
                });
            } else {
                this.userSub = this._parceiroServices.create(this.partnnerPost).subscribe((res: any) => {
                    if (res.error) {
                        this.accountForm.enable();
                        this.openSnackBar(res.error, 'warn');
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
        this.loading = true;
        this._changeDetectorRef.markForCheck();
        const phonesFormArray = this.accountForm.get('phonesNumbers') as FormArray;
        if(id === 0  && phonesFormArray.length > 1){
            phonesFormArray.removeAt(index);
            return this.closeAlert();
        }
        if (phonesFormArray.length === 1) {
            this.openSnackBar('Remoção Inválida', 'warn');
            return this.closeAlert();
        }
        this._userServices.removePhonenumber(id).subscribe((res) => {
            if (res === true) {
                this.openSnackBar('Removido');
                phonesFormArray.removeAt(index);
                return this.closeAlert();
            }
            if (res === false) {
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlert();
            }

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

    buscaCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cepSub = this._cepService.buscar(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
            this.accountForm.patchValue({
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
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this.levelSub = this._parceiroServices.getCargos().subscribe((res) => {
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
            name: ['',
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
                    Validators.minLength(18),
                    Validators.maxLength(18),
                NgBrazilValidators.cnpj])],
            description: ['',
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
            number: ['',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            levelId: [0,
                Validators.compose([
                    Validators.required])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator,
            ])),
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

        // Adiciona o array de telefones ao fomrGroup
        this.phoneArray.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('phonesNumbers') as FormArray).push(phoneNumbersFormGroup);
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
            if (item.phoneNumber === null || item.phoneNumber === '' || item.phoneNumber.length < 11) {
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
            this.partnnerPost.id = this.userEdit.id;
        }
        if (!this.userEdit) {
            this.partnnerPost.password = 'Pay@2021';
        }

        this.partnnerPost.name = formData.name;
        this.partnnerPost.email = formData.email;
        this.partnnerPost.cnpj = formData.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.partnnerPost.description = formData.description;
        this.partnnerPost.cep = formData.cep.replace(/[^0-9,]*/g, '').replace(',', '.');
        this.partnnerPost.uf = formData.uf;
        this.partnnerPost.address = formData.address;
        this.partnnerPost.district = formData.district;
        this.partnnerPost.city = formData.city;
        this.partnnerPost.number = formData.number;
        this.partnnerPost.levelId = this.levelId;
        formData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.partnnerPost.phonesNumbers = formData.phonesNumbers;
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
            description: [this.userEdit.description,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            cep: [this.userEdit.address.cep,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    NgBrazilValidators.cep])],
            uf: [this.userEdit.address.uf, Validators.compose([
                Validators.required,
                Validators.nullValidator,
                Validators.minLength(2),
                Validators.maxLength(2)
            ])],
            address: [this.userEdit.address.address,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            district: [this.userEdit.address.district,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            city: [this.userEdit.address.city,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(3),
                    Validators.maxLength(150)])],
            number: [this.userEdit.address.number,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            levelId: [this.userEdit.levelId,
                Validators.compose([
                    Validators.required])],
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
        this.phoneArray.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('phonesNumbers') as FormArray).push(phoneNumbersFormGroup);
        });
        this.partnnerPost.id = this.userEdit.id;
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

}
