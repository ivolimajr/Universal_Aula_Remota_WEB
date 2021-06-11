import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { AdministrativoModel } from '../../../../../shared/models/cfc/administrativoModel.model';

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
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentAdministrative implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  edriving: AdministrativoModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  modal: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }
  loadCustomer() {
    if (!this.id) {
      this.edriving = EMPTY_ADMINISTRATIVO;
      this.loadForm(null);
    } else {
      this.edriving = EMPTY_ADMINISTRATIVO;
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
    this.edriving.fullName = formData.fullName;
    this.edriving.email = formData.email;
    this.edriving.cpf = formData.cpf;
    this.edriving.telefone = formData.telefone;
    this.edriving.cargo = formData.cargo;
    this.edriving.dataNascimento = new Date(formData.dob);
    this.edriving.status = formData.status;
  }

  /**
   * 
   */
  edit() {
    console.log("Edit do modal");
  }

  cancel() {
    console.log("cancel do modal");
  }

  create() {
    /**
     * 1° validar/tratar os dados
     * 2° insere os dados na API
     * 3° trata o retorno da API
     * 4° continua...
     */
    console.log(this.edriving)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.edriving);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.edriving.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.edriving.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        cep: [this.edriving.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.edriving.cep, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.edriving.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.edriving.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        cep: [this.edriving.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.edriving.cep, Validators.compose([Validators.nullValidator])],
      });
    }

  }

  /**
   * 
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
