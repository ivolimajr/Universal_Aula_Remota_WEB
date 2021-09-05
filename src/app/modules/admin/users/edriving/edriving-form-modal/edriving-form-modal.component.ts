import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EdrivingPost} from 'app/shared/models/edriving.module';
import {EdrivingService} from '../../../../../shared/services/http/edriving.service';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {Cargo} from '../../../../../shared/models/cargo.model';
import {AlertModalComponent} from '../../../../../layout/common/alert/alert-modal.component';

@Component({
    selector: 'app-edrivin-form-modal',
    templateUrl: './edriving-form-modal.component.html',
    styleUrls: ['./edriving-form-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class EdrivingFormModalComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    accountForm: FormGroup;
    showAlert: boolean = false;
    cargos: Cargo[];
    private edrivingUserPost = new EdrivingPost();

    constructor(
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<EdrivingFormModalComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService
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

        this._edrivingServices.create(this.edrivingUserPost).subscribe((res: any)=>{
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
        this._edrivingServices.getCargos().subscribe((res) => {
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
            nome: ['Nome Apagar',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            cpf: ['00000000002',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(11),
                    Validators.maxLength(11)])],
            email: ['claudio3@email.com',
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            cargo: [0,
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
                telefone: ['61986618603']
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
        if(formData.cargo === undefined || formData.cargo === 0){
            this.dialog.open(AlertModalComponent, {
                width: '280px',
                data: {title: 'Selecione um Cargo', oneButton: true}
            });
            return false;
        }
        this.edrivingUserPost.nome = formData.nome;
        this.edrivingUserPost.email = formData.email;
        this.edrivingUserPost.cpf = formData.cpf;
        this.edrivingUserPost.cargoId = formData.cargo;
        this.edrivingUserPost.senha = 'Pay@2021';
        this.edrivingUserPost.telefones = formData.telefones;
        return true;
    }
}
