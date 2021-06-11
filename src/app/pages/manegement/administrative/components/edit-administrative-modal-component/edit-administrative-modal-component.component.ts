import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { AdministrativoModel } from '../../../../../shared/models/cfc/administrativoModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

const EMPTY_ADMINISTRATIVO: AdministrativoModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  cpf: '',
  identidade: '',
  telefone: '',
  telefone2: '',
  status: 1, // STATUS ATIVO
  cargo: '',
  cep: '',
  bairro: '',
  cidade: '',
  uf: '',
  numero: '',
  dataNascimento: new Date,
  enderecoLogradouro: '',
  localizacaoLatitude: '',
  longitude: '',
  orgaoExpedidor: '',
  site: '',
};

@Component({
  selector: 'app-edit-administrative-modal-component',
  templateUrl: './edit-administrative-modal-component.component.html',
  styleUrls: ['./edit-administrative-modal-component.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class EditAdministrativeModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  isLoading$;
  administrativo: AdministrativoModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadCustomer() {
    if (!this.id) {
      this.administrativo = EMPTY_ADMINISTRATIVO;
      this.loadForm(null);
    } else {
      this.administrativo = EMPTY_ADMINISTRATIVO;
      this.loadForm(this.id);
    }
  }
  /**
  * 
  */
  save() {
    this.prepareCustomer();
    this.create();
  }


  /**
   * 
   */
  private prepareCustomer() {
    const formData = this.createForm.value;
    this.administrativo.fullName = formData.fullName;
    this.administrativo.email = formData.email;
    this.administrativo.cpf = formData.cpf;
    this.administrativo.telefone = formData.telefone;
    this.administrativo.cargo = formData.cargo;
    this.administrativo.status = formData.status;
  }

  /**
   * 
   */
  edit() {
    console.log("Edit do modal");
  }

  create() {
    /**
     * 1° validar/tratar os dados
     * 2° insere os dados na API
     * 3° trata o retorno da API
     * 4° continua...
     */
    console.log(this.administrativo)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.administrativo);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.administrativo.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.administrativo.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.administrativo.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.administrativo.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.administrativo.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.administrativo.status, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.administrativo.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.administrativo.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.administrativo.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.administrativo.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.administrativo.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.administrativo.status, Validators.compose([Validators.nullValidator])],
      });
    }

  }



  //VALIDADORES
  isControlValid(controlName: string): boolean {
    const control = this.createForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.createForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.createForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.createForm.controls[controlName];
    return control.dirty || control.touched;
  }
}