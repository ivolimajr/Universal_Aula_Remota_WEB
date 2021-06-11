import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { PartnerModel } from '../../../../../shared/models/partner/partnerModel.model';

const EMPTY_PARTNER: PartnerModel = {
  id: undefined,
  fullName: '',
  email: '',
  status: 2,
  telefone: '',
  cep: '',
  cnpj: '',
  cargo: '',
  bairro: '',
  cidade: '',
  confirmarSenha: '',
  descricao: '',
  enderecoLogradouro: '',
  numero: '',
  senha: '',
  uf: '',
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentPartner implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  partner: PartnerModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  modal: any;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadCustomer() {
    if (!this.id) {
      this.partner = EMPTY_PARTNER;
      this.loadForm(null);
    } else {
      this.partner = EMPTY_PARTNER;
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
    this.partner.fullName = formData.fullName;
    this.partner.email = formData.email;
    this.partner.telefone = formData.telefone;
    this.partner.cargo = formData.cargo;
    this.partner.status = formData.status;
    this.partner.cep = formData.cep;
    this.partner.cnpj = formData.cnpj;
    this.partner.bairro = formData.bairro;
    this.partner.cidade = formData.cidade;
    this.partner.confirmarSenha = formData.confirmarSenha;
    this.partner.descricao = formData.descricao;
    this.partner.enderecoLogradouro = formData.enderecoLogradouro;
    this.partner.numero = formData.numero;
    this.partner.senha = formData.senha;
    this.partner.uf = formData.uf;

    //TODO: ADICIONAR OS OUTROS ATRIBUTOS
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
    console.log(this.partner)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.partner);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.partner.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: [this.partner.cep, Validators.compose([Validators.nullValidator])],
        cnpj: [this.partner.cnpj, Validators.compose([Validators.nullValidator])],
        bairro: [this.partner.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.partner.cidade, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.partner.confirmarSenha, Validators.compose([Validators.nullValidator])],
        descricao: [this.partner.descricao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.partner.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        numero: [this.partner.numero, Validators.compose([Validators.nullValidator])],
        senha: [this.partner.senha, Validators.compose([Validators.nullValidator])],
        uf: [this.partner.uf, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.partner.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: [this.partner.cep, Validators.compose([Validators.nullValidator])],
        cnpj: [this.partner.cnpj, Validators.compose([Validators.nullValidator])],
        bairro: [this.partner.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.partner.cidade, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.partner.confirmarSenha, Validators.compose([Validators.nullValidator])],
        descricao: [this.partner.descricao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.partner.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        numero: [this.partner.numero, Validators.compose([Validators.nullValidator])],
        senha: [this.partner.senha, Validators.compose([Validators.nullValidator])],
        uf: [this.partner.uf, Validators.compose([Validators.nullValidator])],
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
