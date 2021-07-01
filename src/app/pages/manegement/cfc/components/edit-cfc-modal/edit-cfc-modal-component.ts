import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CfcModel } from '../../../../../shared/models/cfc/cfcModel.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgBrazilValidators } from 'ng-brazil';
import { ToastrService } from 'ngx-toastr';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';

const EMPTY_CFC: CfcModel = {
  id: undefined,
  fullName: '',
  email: '',
  telefone: '',
  status: 1,
  senha: '',
  confirmarSenha: '',
  bairro: '',
  cep: '',
  cidade: '',
  cnpj: '',
  datadaFundacao: new Date,
  enderecoLogradouro: '',
  inscricaoEstadual: '',
  localizacaoLatitude: '',
  longitude: '',
  nomeFantasia: '',
  numero: '',
  razaoSocial: '',
  site: '',
  uf: '',
  uploadDOC: '',
  nivelAcesso: null,
  senhaAntiga:''

};
@Component({
  selector: 'app-edit-cfc-modal',
  templateUrl: './edit-cfc-modal-component.html',
  styleUrls: ['./edit-cfc-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditCfcModalComponent extends ManagementBaseComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  cfc: CfcModel;

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
      this.cfc = EMPTY_CFC;
      this.loadForm(null);
    } else {
      this.cfc = EMPTY_CFC;
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
    this.cfc.fullName = formData.fullName.toUpperCase();
    this.cfc.email = formData.email.toUpperCase();
    this.cfc.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.cfc.status = formData.status;
    this.cfc.senha = formData.senha;
    this.cfc.confirmarSenha = formData.confirmarSenha;
    this.cfc.bairro = formData.bairro.toUpperCase();
    this.cfc.cep = formData.cep.replaceAll("-", "").replaceAll(".", "");
    this.cfc.cidade = formData.cidade.toUpperCase();
    this.cfc.cnpj = formData.cnpj.replaceAll(".", "").replaceAll("-", "").replaceAll("/", "");
    this.cfc.datadaFundacao = formData.datadaFundacao.toUpperCase()
    this.cfc.enderecoLogradouro = formData.enderecoLogradouro.toUpperCase();
    this.cfc.inscricaoEstadual = formData.inscricaoEstadual.replaceAll(".", "").replaceAll("-", "").replaceAll("/", "");
    this.cfc.localizacaoLatitude = formData.localizacaoLatitude;
    this.cfc.longitude = formData.longitude;
    this.cfc.nomeFantasia = formData.nomeFantasia.toUpperCase();
    this.cfc.numero = formData.numero;
    this.cfc.razaoSocial = formData.razaoSocial.toUpperCase();
    this.cfc.site = formData.site;
    this.cfc.uf = formData.uf.toUpperCase();
    this.cfc.uploadDOC = formData.uploadDOC;
  }

  edit() {
    console.log("Edit do modal");
  }

  create() {
    console.log(this.cfc)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.cfc);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.cfc.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.cfc.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        senha: [this.cfc.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.cfc.confirmarSenha, Validators.compose([Validators.nullValidator])],
        bairro: [this.cfc.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.cfc.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        datadaFundacao: [this.cfc.datadaFundacao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.cfc.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        inscricaoEstadual: [this.cfc.inscricaoEstadual, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        localizacaoLatitude: [this.cfc.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.cfc.longitude, Validators.compose([Validators.nullValidator])],
        nomeFantasia: [this.cfc.nomeFantasia, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.cfc.numero, Validators.compose([Validators.nullValidator])],
        razaoSocial: [this.cfc.razaoSocial, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        uf: [this.cfc.uf, Validators.compose([Validators.nullValidator])],
        uploadDOC: [this.cfc.uploadDOC, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.cfc.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.cfc.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        senha: [this.cfc.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.cfc.confirmarSenha, Validators.compose([Validators.nullValidator])],
        bairro: [this.cfc.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.cfc.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        datadaFundacao: [this.cfc.datadaFundacao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.cfc.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        inscricaoEstadual: [this.cfc.inscricaoEstadual, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        localizacaoLatitude: [this.cfc.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.cfc.longitude, Validators.compose([Validators.nullValidator])],
        nomeFantasia: [this.cfc.nomeFantasia, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.cfc.numero, Validators.compose([Validators.nullValidator])],
        razaoSocial: [this.cfc.razaoSocial, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        uf: [this.cfc.uf, Validators.compose([Validators.nullValidator])],
        uploadDOC: [this.cfc.uploadDOC, Validators.compose([Validators.nullValidator])],
      });
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
