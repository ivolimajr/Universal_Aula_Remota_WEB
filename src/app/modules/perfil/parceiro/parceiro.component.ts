import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Usuario} from '../../../shared/models/usuario.model';
import {MASKS, NgBrazilValidators} from 'ng-brazil';
import {ParceiroPost, ParceiroUsuario} from '../../../shared/models/parceiro.model';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../shared/services/http/user.service';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {EdrivingService} from '../../../shared/services/http/edriving.service';
import {LocalStorageService} from '../../../shared/services/storage/localStorage.service';
import {ParceiroService} from '../../../shared/services/http/parceiro.service';
import {AlertModalComponent} from '../../../layout/common/alert/alert-modal.component';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-parceiro',
    templateUrl: './parceiro.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ParceiroComponent implements OnInit {
    @Input() parceiroUser: ParceiroUsuario;

    accountForm: FormGroup;
    user: Usuario;
    masks = MASKS;
    private parceiroUserPost = new ParceiroPost();

    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _authServices: AuthService,
        private _parceiroServices: ParceiroService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userServices: UserService,
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

        this._parceiroServices.update(this.parceiroUserPost).subscribe((res: any) => {
            //Set o edrivingUser com os dados atualizados
            if (res.error) {
                this.openSnackBar(res.error.detail, 'warn');
                this._changeDetectorRef.markForCheck();
                return;
            }
            this.parceiroUser = res;

            //Atualiza os dados do localStorage
            this.user = this._authServices.getUserInfoFromStorage();
            this.user.nome = res.nome;
            this.user.email = res.email;
            this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);

            //Atualiza o útlimo registro do formulário de contato com o ID do telefone atualizado

            //Pega o último registro de telefone que veio do usuario atualizado
            const lastPhoneIdFromUser = res.telefones[res.telefones.length - 1];

            //Pega o último registro de telefone que contem no array de telefones
            const lastPhoneFromPhoneArray = this.accountForm.get('telefones') as FormArray;

            //Se os IDS forem diferentes, incluir no array
            if (lastPhoneIdFromUser.id !== lastPhoneFromPhoneArray.value[lastPhoneFromPhoneArray.length - 1].id) {

                const lastFromArray = lastPhoneFromPhoneArray[lastPhoneFromPhoneArray.length - 1];
                // Remove the phone number field
                lastPhoneFromPhoneArray.removeAt(lastFromArray);

                const phoneNumberFormGroup = this._formBuilder.group({
                    id: [lastPhoneIdFromUser.id],
                    telefone: [lastPhoneIdFromUser.telefone]
                });

                // Adiciona o formGroup ao array de telefones
                (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);
            }

            //Retorna a mensagem de atualizado
            this.openSnackBar('Atualizado');
            this._changeDetectorRef.markForCheck();
        });

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

        // Marca as alterações
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        if (this.parceiroUser.telefones.length === 1) {
            this.dialog.open(AlertModalComponent, {
                width: '280px',
                data: {content: 'Usuário não pode ficar sem contato.', oneButton: true}
            });
            return;
        }
        this._userServices.removePhonenumber(id)
            .subscribe((res) => {
                if (!res) {
                    this.openSnackBar('Telefone já em uso', 'warn');
                }
                const phoneNumbersFormArray = this.accountForm.get('telefones') as FormArray;
                // Remove the phone number field
                phoneNumbersFormArray.removeAt(index);
                this._changeDetectorRef.markForCheck();
            });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Valida os dados vindo do formulário antes de enviar para API
     *
     * @private
     * @return um boleano
     */
    private checkFormToSend(): boolean {
        const formData = this.accountForm.value;

        if (this.accountForm.invalid) {
            this.openSnackBar('Dados Inválidos', 'warn');
            return false;
        }
        //Se todos os dados forem válidos, monta o objeto para atualizar
        this.parceiroUserPost.nome = formData.nome;
        this.parceiroUserPost.email = formData.email;
        this.parceiroUserPost.descricao = formData.descricao;
        this.parceiroUserPost.cnpj = formData.cnpj.replace(/[^0-9,]*/g, '').replace(',', '.');
        formData.telefones.forEach((item) => {
            if (item.telefone.length !== 11) {
                item.telefone = item.telefone.replace(/[^0-9,]*/g, '').replace(',', '.');
            }
        });
        this.parceiroUserPost.telefones = formData.telefones;
        return true;
    }

    /**
     * monta o formulário com os validadores
     *
     * @return void
     * @private
     */
    private prepareForm(): void {
        this.accountForm = this._formBuilder.group({
            nome: [this.parceiroUser.nome,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: [this.parceiroUser.email,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cnpj: [this.parceiroUser.cnpj,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(14),
                    Validators.maxLength(14)])],
            descricao: [this.parceiroUser.descricao,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)])],
            cargoId: [this.parceiroUser.cargoId,
                Validators.compose([
                    Validators.required])],
            telefones: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        // cria um array para montar o formBuilder de telefones
        const phoneNumbersFormGroups = [];

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.parceiroUser.telefones.length > 0) {
            // Iterate through them
            this.parceiroUser.telefones.forEach((phoneNumber) => {

                //Cria um formGroup de telefone
                phoneNumbersFormGroups.push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        telefone: [phoneNumber.telefone,
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
                    telefone: ['', Validators.compose([
                        Validators.required,
                        Validators.nullValidator
                    ])]
                })
            );
        }

        // Adiciona o array de telefones ao fomrGroup
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });

        //Define o ID do usuário Edriving a ser atualizado
        this.parceiroUserPost.id = this.parceiroUser.id;
        this._changeDetectorRef.markForCheck();
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
