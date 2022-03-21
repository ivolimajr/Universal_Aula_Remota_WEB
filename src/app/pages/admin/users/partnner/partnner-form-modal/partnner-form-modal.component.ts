import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {Level} from '../../../../../shared/models/level.model';
import {PartnnerModel} from '../../../../../shared/models/partnner.model';
import {PartnnerService} from '../../../../../shared/services/http/partnner.service';
import {User} from '../../../../../shared/models/user.model';
import {CepService} from '../../../../../shared/services/http/cep.service';
import {UserService} from '../../../../../shared/services/http/user.service';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';

@Component({
    selector: 'app-partnner-form-modal',
    templateUrl: './partnner-form-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PartnnerFormModalComponent implements OnInit, OnDestroy {

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input() userEdit: PartnnerModel;
    accountForm: FormGroup;
    addressForm: FormGroup;
    masks = MASKS;
    loading: boolean = true;
    levels: Level[];
    states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MS', 'MT', 'MG', 'PA', 'PB', 'PR', 'PE',
        'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    private partnnerModel = new PartnnerModel();
    private phoneArray = [];
    private user: User;
    private level$: Subscription;
    private user$: Subscription;
    private cep$: Subscription;

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<PartnnerFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: PartnnerService,
        private _userServices: UserService,
        private _cepService: CepService
    ) {
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.level$) {
            this.level$.unsubscribe();
        }
        if (this.cep$) {
            this.cep$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    ngOnInit(): void {
        this.getCargos();
        this.prepareForm();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit(): void {
        this.accountForm.disable();
        const formIsValid = this.prepareUser();
        if (formIsValid) {
            //Exibe o alerta de salvando dados
            this.loading = true;
            this._changeDetectorRef.markForCheck();

            if (this.userEdit) {
                this.user$ = this._parceiroServices.update(this.partnnerModel).subscribe((res: any) => {
                    if (res.error) {
                        return this.closeAlerts();
                    }
                    this.closeAlerts();
                    return this.dialogRef.close(res);
                });
            } else {
                this.user$ = this._parceiroServices.create(this.partnnerModel).subscribe((res: any) => {
                    if (res.error) {
                        return this.closeAlerts();
                    }
                    this.closeAlerts();
                    return this.dialogRef.close(res);
                });
            }
        } else {
            this.closeAlerts();
        }
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        this.loading = true;
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
                this.loading = false;
                this._changeDetectorRef.markForCheck();
                return;
            }
            this.removePhoneFromApi(id).subscribe((res: any)=>{
                if(res){
                    this.openSnackBar('Removido');
                    phonesFormArray.removeAt(index);
                    return this.closeAlerts();
                }
                this.openSnackBar('Remoção Inválida', 'warn');
                return this.closeAlerts();
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

    buscaCep(event): void {
        if (event.value.replace(/[^0-9,]*/g, '').length < 8) {
            this.openSnackBar('Cep inválido');
            return;
        }
        this.cep$ = this._cepService.getCep(event.value.replace(/[^0-9,]*/g, '')).subscribe((res) => {
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
        this.level$ = this._parceiroServices.getCargos().subscribe((res) => {
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
            levelId: ['',
                Validators.compose([
                    Validators.required])],
            password:['Pay@2021'],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator,
            ])),
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

        this.closeAlerts();
        this.phoneArray = [];
    }

    /**
     * Prepara o usuário para envio
     */
    private prepareUser(): boolean {
        const userFormData = this.accountForm.value;
        const addressFormData = this.addressForm.value;
        let result: boolean = true;

        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        //Verifica se os telefones informados são válidos
        userFormData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber === null || item.phoneNumber === '' || item.phoneNumber.length < 11) {
                this.openSnackBar('Insira um telefone', 'warn');
                result = false;
            }
        });
        userFormData.cnpj = userFormData.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        addressFormData.cep = addressFormData.cep.replace(/[^0-9,]*/g, '').replace(',', '.');

        userFormData.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.partnnerModel = userFormData;
        this.partnnerModel.address = addressFormData;
        return result;
    }

    private prepareEditForm(): void {

        this.loading = true;
        this._changeDetectorRef.markForCheck();

        this.accountForm = this._formBuilder.group({
            id: [this.userEdit.id],
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
            levelId: [this.userEdit.levelId,
                Validators.compose([
                    Validators.required])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });
        this.addressForm = this._formBuilder.group({
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
            addressNumber: [this.userEdit.address.addressNumber,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(1),
                    Validators.maxLength(50)])],
            complement: [this.userEdit.address.complement,
                Validators.compose([
                    Validators.maxLength(100)])],
        });

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
        this.closeAlerts();
        this.phoneArray = [];
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
    }

    //Fecha o alerta na tela
    private closeAlerts(): void {
        this.accountForm.enable();
        this.loading = false;
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
}
