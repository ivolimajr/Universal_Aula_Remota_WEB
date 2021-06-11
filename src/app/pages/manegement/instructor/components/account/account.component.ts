import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { InstrutorBaseModel } from 'src/app/shared/models/cfc/instrutorModel.model';

const EMPTY_INSTRUTOR: InstrutorBaseModel = {
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
export class AccountComponentInstructor implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  instrutor: InstrutorBaseModel;
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
      this.instrutor = EMPTY_INSTRUTOR;
      this.loadForm(null);
    } else {
      this.instrutor = EMPTY_INSTRUTOR;
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
    this.instrutor.fullName = formData.fullName;
    this.instrutor.email = formData.email;
    this.instrutor.cpf = formData.cpf;
    this.instrutor.telefone = formData.telefone;
    this.instrutor.cargo = formData.cargo;
    this.instrutor.dataNascimento = new Date(formData.dob);
    this.instrutor.status = formData.status;
    this.instrutor.senha = formData.senha;
    this.instrutor.confirmarSenha = formData.confirmarSenha;
    this.instrutor.identidade = formData.identidade;
    this.instrutor.telefone2 = formData.telefone2;
    this.instrutor.cep = formData.cep;
    this.instrutor.bairro = formData.bairro;
    this.instrutor.cidade = formData.cidade;
    this.instrutor.uf = formData.uf;
    this.instrutor.numero = formData.numero;
    this.instrutor.enderecoLogradouro = formData.enderecoLogradouro;
    this.instrutor.localizacaoLatitude = formData.localizacaoLatitude;
    this.instrutor.longitude = formData.longitude;
    this.instrutor.orgaoExpedidor = formData.orgaoExpedidor;
    this.instrutor.site = formData.site;
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
    console.log(this.instrutor)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.instrutor);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.instrutor.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.instrutor.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: [this.instrutor.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.instrutor.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.instrutor.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.nullValidator])],
        telefone2: [this.instrutor.telefone2, Validators.compose([Validators.nullValidator])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.instrutor.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.instrutor.longitude, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.instrutor.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.instrutor.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: [this.instrutor.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.instrutor.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.instrutor.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.nullValidator])],
        telefone2: [this.instrutor.telefone2, Validators.compose([Validators.nullValidator])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.instrutor.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.instrutor.longitude, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],
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
