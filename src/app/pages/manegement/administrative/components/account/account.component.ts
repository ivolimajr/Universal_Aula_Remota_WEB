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
  administrativo: AdministrativoModel;
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
    this.administrativo.dataNascimento = new Date(formData.dob);
    this.administrativo.status = formData.status;
    this.administrativo.senha = formData.senha;
    this.administrativo.confirmarSenha = formData.confirmarSenha;
    this.administrativo.identidade = formData.identidade;
    this.administrativo.telefone2 = formData.telefone2;
    this.administrativo.cep = formData.cep;
    this.administrativo.bairro = formData.bairro;
    this.administrativo.cidade = formData.cidade;
    this.administrativo.uf = formData.uf;
    this.administrativo.numero = formData.numero;
    this.administrativo.enderecoLogradouro = formData.enderecoLogradouro;
    this.administrativo.localizacaoLatitude = formData.localizacaoLatitude;
    this.administrativo.longitude = formData.longitude;
    this.administrativo.orgaoExpedidor = formData.orgaoExpedidor;
    this.administrativo.site = formData.site;
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
    console.log(this.administrativo)
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
        cep: [this.administrativo.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.administrativo.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.administrativo.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.administrativo.identidade, Validators.compose([Validators.nullValidator])],
        telefone2: [this.administrativo.telefone2, Validators.compose([Validators.nullValidator])],
        bairro: [this.administrativo.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.administrativo.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.administrativo.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.administrativo.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.administrativo.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.administrativo.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.administrativo.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.administrativo.longitude, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.administrativo.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.administrativo.site, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.administrativo.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.administrativo.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.administrativo.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.administrativo.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.administrativo.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.administrativo.status, Validators.compose([Validators.nullValidator])],
        cep: [this.administrativo.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.administrativo.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.administrativo.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.administrativo.identidade, Validators.compose([Validators.nullValidator])],
        telefone2: [this.administrativo.telefone2, Validators.compose([Validators.nullValidator])],
        bairro: [this.administrativo.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.administrativo.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.administrativo.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.administrativo.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.administrativo.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.administrativo.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.administrativo.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.administrativo.longitude, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.administrativo.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.administrativo.site, Validators.compose([Validators.nullValidator])],
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
