import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cargo} from '../../../../../shared/models/cargo.model';
import {ParceiroPost} from '../../../../../shared/models/parceiro.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {ParceiroService} from '../../../../../shared/services/http/parceiro.service';

@Component({
    selector: 'app-parceiro-form-modal',
    templateUrl: './parceiro-form-modal.component.html',
    styleUrls: ['./parceiro-form-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ParceiroFormModalComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    accountForm: FormGroup;
    showAlert: boolean = false;
    cargos: Cargo[];
    private parceiroUserPost = new ParceiroPost();

    constructor(
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ParceiroFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _parceiroServices: ParceiroService
    ) {
    }

    ngOnInit(): void {
        //Prepara o formulário
        this.prepareForm();
        this.getCargos();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit(): void{
        if(!this.prepareUser()) {return;}

        this._parceiroServices.create(this.parceiroUserPost).subscribe((res: any)=>{
            if(res.error){
                this.dialog.open(AlertModalComponent, {
                    width: '280px',
                    data: {title: res.error, oneButton: true}
                });
                return;
            }
            this.dialogRef.close(res);
        }),catchError(res=>of(res));
    }

    closeAlert(): void{
        this.showAlert = false;
    }

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     *
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {

        const phoneNumbersFormArray = this.accountForm.get('telefones') as FormArray;
        if(phoneNumbersFormArray.length === 1){
            this.setAlert('Informe um telefone');
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

        // Marca as alterações
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Busca os cargos dos usuário do tipo edriving
     */
    private getCargos(): void {
        this._parceiroServices.getCargos().subscribe((res) => {
            this.cargos = res;
            this._changeDetectorRef.markForCheck();
        }),
            catchError(res => of(res));
    }

    /**
     * Monta o formulário com os validadores
     *
     * @return void
     * @private
     */
    private prepareForm(): void {
        this.accountForm = this._formBuilder.group({
            nome: ['DETRAN',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            email: ['parceiro@email.com',
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
                    Validators.maxLength(8)])],
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

        // cria um array para montar o formBuilder de telefones
        const phoneNumbersFormGroups = [];
        // Create a phone number form group
        phoneNumbersFormGroups.push(
            this._formBuilder.group({
                telefone: ['61786618603']
            }));

        // Adiciona o array de telefones ao fomrGroup
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });

        this._changeDetectorRef.markForCheck();
    }

    private setAlert(value: string, type: any = 'error'): void {
        this.showAlert = false;
        this.alert.type = type;
        this.alert.message = value;
        this.showAlert = true;
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Prepara o usuário para envio
     */
    private prepareUser(): boolean{
        this.showAlert = false;
        if(this.accountForm.invalid){
            this.setAlert('Dados Inválido');
            return;
        }
        const formData = this.accountForm.value;
        if(formData.cargoId === undefined || formData.cargoId === 0){
            this.dialog.open(AlertModalComponent, {
                width: '280px',
                data: {title: 'Selecione um Cargo', oneButton: true}
            });
            return false;
        }
        this.parceiroUserPost.nome = formData.nome;
        this.parceiroUserPost.email = formData.email;
        this.parceiroUserPost.cnpj = formData.cnpj;
        this.parceiroUserPost.descricao = formData.descricao;
        this.parceiroUserPost.cep = formData.cep;
        this.parceiroUserPost.uf = 'DF';
        this.parceiroUserPost.enderecoLogradouro = formData.enderecoLogradouro;
        this.parceiroUserPost.bairro = formData.bairro;
        this.parceiroUserPost.cidade = formData.cidade;
        this.parceiroUserPost.numero = formData.numero;
        this.parceiroUserPost.cargoId = formData.cargoId;
        this.parceiroUserPost.senha = 'Pay@2021';
        this.parceiroUserPost.telefones = formData.telefones;
        return true;
    }
}
