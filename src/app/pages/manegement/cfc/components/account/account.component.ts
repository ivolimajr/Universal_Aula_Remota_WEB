import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CfcModel } from 'src/app/shared/models/cfc/cfcModel.model';
import { ToastrService } from 'ngx-toastr';
import { NgBrazilValidators } from 'ng-brazil';
import { CustomValidators } from 'ng2-validation';
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
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentCfc extends ManagementBaseComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]); // TIRAR

  @Input() id: number;

  cfc: CfcModel;
  modal: any;

  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
    public toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
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
    this.toastr.success('Alterações concluídas');
  }

  private prepareCustomer() {
    const formData = this.createForm.value;
    this.cfc.fullName = formData.fullName;
    this.cfc.email = formData.email;
    this.cfc.telefone = formData.telefone;
    this.cfc.status = formData.status;
    this.cfc.senha = formData.senha;
    this.cfc.confirmarSenha = formData.confirmarSenha;
    this.cfc.bairro = formData.bairro;
    this.cfc.cep = formData.cep;
    this.cfc.cidade = formData.cidade;
    this.cfc.cnpj = formData.cnpj;
    this.cfc.datadaFundacao = formData.datadaFundacao;
    this.cfc.enderecoLogradouro = formData.enderecoLogradouro;
    this.cfc.inscricaoEstadual = formData.inscricaoEstadual;
    this.cfc.localizacaoLatitude = formData.localizacaoLatitude;
    this.cfc.longitude = formData.longitude;
    this.cfc.nomeFantasia = formData.nomeFantasia;
    this.cfc.numero = formData.numero;
    this.cfc.razaoSocial = formData.razaoSocial;
    this.cfc.site = formData.site;
    this.cfc.telefone = formData.telefone2;
    this.cfc.uf = formData.uf;
    this.cfc.uploadDOC = formData.uploadDOC;
    this.cfc.senhaAntiga = formData.senhaAntiga;
  }

  edit() {
    console.log("Edit do modal");
  }

  cancel() {
    console.log("cancel do modal");
  }

  create() {
    console.log(this.cfc)
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
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
        bairro: [this.cfc.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.cfc.cidade, Validators.compose([Validators.nullValidator])],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        datadaFundacao: [this.cfc.datadaFundacao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.cfc.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        inscricaoEstadual: [this.cfc.inscricaoEstadual, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.cfc.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.cfc.longitude, Validators.compose([Validators.nullValidator])],
        nomeFantasia: [this.cfc.nomeFantasia, Validators.compose([Validators.nullValidator])],
        numero: [this.cfc.numero, Validators.compose([Validators.nullValidator])],
        razaoSocial: [this.cfc.razaoSocial, Validators.compose([Validators.nullValidator])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        telefone2: [this.cfc.telefone, Validators.compose([Validators.nullValidator])],
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
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
        bairro: [this.cfc.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.cfc.cidade, Validators.compose([Validators.nullValidator])],
        cnpj: ['', [Validators.required, NgBrazilValidators.cnpj]],
        datadaFundacao: [this.cfc.datadaFundacao, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.cfc.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        inscricaoEstadual: [this.cfc.inscricaoEstadual, Validators.compose([Validators.nullValidator])],
        localizacaoLatitude: [this.cfc.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.cfc.longitude, Validators.compose([Validators.nullValidator])],
        nomeFantasia: [this.cfc.nomeFantasia, Validators.compose([Validators.nullValidator])],
        numero: [this.cfc.numero, Validators.compose([Validators.nullValidator])],
        razaoSocial: [this.cfc.razaoSocial, Validators.compose([Validators.nullValidator])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        telefone2: [this.cfc.telefone, Validators.compose([Validators.nullValidator])],
        uf: [this.cfc.uf, Validators.compose([Validators.nullValidator])],
        uploadDOC: [this.cfc.uploadDOC, Validators.compose([Validators.nullValidator])],

      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
