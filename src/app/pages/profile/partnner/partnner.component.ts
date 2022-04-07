import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {MASKS} from 'ng-brazil';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {fuseAnimations} from '../../../../@fuse/animations';
import {User} from '../../../shared/models/user.model';
import {PartnnerModel} from '../../../shared/models/partnner.model';
import {UserService} from '../../../shared/services/http/user.service';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {PartnnerService} from '../../../shared/services/http/partnner.service';
import {AlertModalComponent} from '../../../layout/common/alert/alert-modal.component';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-partnner',
    templateUrl: './partnner.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PartnnerComponent implements OnInit, OnDestroy {
    @Input() partnnerUser: PartnnerModel;

    accountForm: FormGroup;
    user: User;
    masks = MASKS;
    loading: boolean;
    private user$: Subscription;
    private phone$: Subscription;

    constructor(
        public _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _userServices: UserService,
        private _authServices: AuthService,
        private _partnnerServices: PartnnerService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        //Prepara o formulário
        this.prepareForm();
    }

    /**
     * Atualiza o usuário do tipo Edriving
     *
     * @return void
     */
    update(): void {

        //Verifica se o formulário é valido
        if (this.checkFormToSend() === false) {
            return null;
        }
        this.accountForm.disable();
        this.user$ = this._partnnerServices.update(this.partnnerUser).subscribe((res: any) => {
            //Set o edrivingUser com os dados atualizados
            if (res.error) {
                return this.closeAlerts();
            }
            this.partnnerUser = res;

            //Atualiza os dados do localStorage
            this.user = this._authServices.getUserInfoFromStorage();
            this.user.name = res.name;
            this.user.email = res.email;
            this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);

            //Pega o último registro de telefone que veio do usuario atualizado
            const lastPhoneIdFromUser = res.phonesNumbers[res.phonesNumbers.length - 1];

            //Pega o último registro de telefone que contem no array de telefones
            const lastPhoneFromPhoneArray = this.accountForm.get('phonesNumbers') as FormArray;

            //Se os IDS forem diferentes, incluir no array
            if (lastPhoneIdFromUser.id !== lastPhoneFromPhoneArray.value[lastPhoneFromPhoneArray.length - 1].id) {

                const lastFromArray = lastPhoneFromPhoneArray[lastPhoneFromPhoneArray.length - 1];
                // Remove the phone number field
                lastPhoneFromPhoneArray.removeAt(lastFromArray);

                const phoneNumberFormGroup = this._formBuilder.group({
                    id: [lastPhoneIdFromUser.id],
                    phoneNumber: [lastPhoneIdFromUser.phoneNumber]
                });

                // Adiciona o formGroup ao array de telefones
                (this.accountForm.get('phonesNumbers') as FormArray).push(phoneNumberFormGroup);
            }

            //Retorna a mensagem de atualizado
            this.openSnackBar('Atualizado');
            return this.closeAlerts();
        });
    }

    /**
     * Adiciona mais um campo no formulário de contato
     *
     * @return void
     */
    addPhoneNumberField(): void {
        // Adiciona o formGroup ao array de telefones
        (this.accountForm.get('phonesNumbers') as FormArray).push(
            this._formBuilder.group({
                phoneNumber: ['', Validators.compose([
                    Validators.required,
                    Validators.nullValidator
                ])]
            }));
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

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngOnDestroy(): void {
        if (this.user$) {
            this.user$.unsubscribe();
        }
        if (this.phone$) {
            this.phone$.unsubscribe();
        }
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Valida os dados vindo do formulário antes de enviar para API
     *
     * @private
     * @return um boleano
     */
    private checkFormToSend(): boolean {
        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        const formDataValues = this.accountForm.value;
        formDataValues.cnpj = formDataValues.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        formDataValues.phonesNumbers.forEach((item) => {
            if (item.phoneNumber.length !== 11) {
                item.phoneNumber = item.phoneNumber.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.partnnerUser = formDataValues;
        return true;
    }

    private prepareForm(): void {
        this.accountForm = this._formBuilder.group({
            id:[this.partnnerUser.id],
            name: [this.partnnerUser.name,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: [this.partnnerUser.email,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cnpj: [this.partnnerUser.cnpj,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(14),
                    Validators.maxLength(14)])],
            description: [this.partnnerUser.description,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            levelId: [this.partnnerUser.levelId,
                Validators.compose([
                    Validators.required])],
            phonesNumbers: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        // cria um array para montar o formBuilder de telefones
        const phoneNumbersFormGroups = [];

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.partnnerUser.phonesNumbers.length > 0) {
            // Iterate through them
            this.partnnerUser.phonesNumbers.forEach((phoneNumber) => {

                //Cria um formGroup de telefone
                phoneNumbersFormGroups.push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        phoneNumber: [phoneNumber.phoneNumber,
                            Validators.compose([
                                Validators.required,
                                Validators.nullValidator
                            ])
                        ]
                    })
                );
            });
        } else {
            // Create a phone number form group
            phoneNumbersFormGroups.push(
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
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('phonesNumbers') as FormArray).push(phoneNumbersFormGroup);
        });
        this._changeDetectorRef.markForCheck();
    }

    private closeAlerts(): void {
        this.accountForm.enable();
        this._changeDetectorRef.markForCheck();
    }

    private removePhoneFromApi(id: number): Observable<boolean> {
        return this._userServices.removePhonenumber(id);
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
