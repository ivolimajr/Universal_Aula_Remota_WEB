import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgBrazilValidators } from 'ng-brazil';
import { of } from 'rxjs';
import { PartnerModel } from '../../../../../shared/models/partner/partnerModel.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { ToastrService } from 'ngx-toastr';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';

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
  nivelAcesso: null,
  senhaAntiga:''
};
@Component({
  selector: 'app-edit-partner-modal',
  templateUrl: './edit-partner-modal.component.html',
  styleUrls: ['./edit-partner-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditPartnerModalComponent extends ManagementBaseComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  partner: PartnerModel;

  constructor(
    public fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadCustomer();
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

  save() {
    this.prepareCustomer();
    this.create();
    this.toastr.success('Usuário adicionado com sucesso', 'Bem vindo!!');
  }

  private prepareCustomer() {
    const formData = this.createForm.value;
    this.partner.fullName = formData.fullName.toUpperCase();
    this.partner.email = formData.email.toUpperCase();
    this.partner.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.partner.cargo = formData.cargo.toUpperCase();
    this.partner.status = formData.status;
    this.partner.cep = formData.cep;
    this.partner.cnpj = formData.cnpj.replaceAll(".", "").replaceAll("-", "").replaceAll("/", "");
    this.partner.bairro = formData.bairro.toUpperCase();
    this.partner.cidade = formData.cidade.toUpperCase();
    this.partner.confirmarSenha = formData.confirmarSenha;
    this.partner.descricao = formData.descricao.replaceAll("-", "")
    this.partner.enderecoLogradouro = formData.enderecoLogradouro.toUpperCase();
    this.partner.numero = formData.numero;
    this.partner.senha = formData.senha;
    this.partner.uf = formData.uf.toUpperCase();
  }

  edit() {
    console.log("Edit do modal");
  }

  create() {
    console.log(this.partner)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.partner);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        bairro: [this.partner.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.partner.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        confirmarSenha: [this.partner.confirmarSenha, Validators.compose([Validators.nullValidator])],
        descricao: [this.partner.descricao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.partner.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.partner.numero, Validators.compose([Validators.nullValidator])],
        senha: [this.partner.senha, Validators.compose([Validators.nullValidator])],
        uf: [this.partner.uf, Validators.compose([Validators.nullValidator])],

      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        bairro: [this.partner.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.partner.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        confirmarSenha: [this.partner.confirmarSenha, Validators.compose([Validators.nullValidator])],
        descricao: [this.partner.descricao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.partner.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.partner.numero, Validators.compose([Validators.nullValidator])],
        senha: [this.partner.senha, Validators.compose([Validators.nullValidator])],
        uf: [this.partner.uf, Validators.compose([Validators.nullValidator])],

      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
