import { Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBrazilValidators } from 'ng-brazil';
import { CustomValidators } from 'ng2-validation';
import { of } from 'rxjs';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';
import { InstrutorBaseModel } from 'src/app/shared/models/instructor/instrutorModel.model';

const EMPTY_INSTRUTOR: InstrutorBaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  cpf: '',
  identidade: '',
  telefone: '',
  status: 1,
  cargo: '',
  cep: '',
  bairro: '',
  cidade: '',
  uf: '',
  numero: '',
  dataNascimento: new Date,
  enderecoLogradouro: '',
  orgaoExpedidor: '',
  site: '',
  uploadDOC: '',
  cursos: [],
  nivelAcesso: null,
  senhaAntiga:''
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentInstructor extends ManagementBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  email = new FormControl('', [Validators.required, Validators.email]);

  @Input() id: number;

  instrutor: InstrutorBaseModel;
  modal: any;

  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
  ) {
    super();
  }

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

  save() {
    this.prepareCustomer();
    this.create();
  }

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
    this.instrutor.senhaAntiga = formData.senhaAntiga;
    this.instrutor.confirmarSenha = formData.confirmarSenha;
    this.instrutor.identidade = formData.identidade;
    this.instrutor.cep = formData.cep;
    this.instrutor.bairro = formData.bairro;
    this.instrutor.cidade = formData.cidade;
    this.instrutor.uf = formData.uf;
    this.instrutor.numero = formData.numero;
    this.instrutor.enderecoLogradouro = formData.enderecoLogradouro;
    this.instrutor.orgaoExpedidor = formData.orgaoExpedidor;
    this.instrutor.site = formData.site;
  }

  edit() {
    console.log("Edit do modal");
  }

  cancel() {
    console.log("cancel do modal");
  }

  create() {
    console.log(this.instrutor)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.instrutor);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: [this.instrutor.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: [this.instrutor.cep, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.nullValidator])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: [this.instrutor.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: [this.instrutor.cep, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.nullValidator])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.nullValidator])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.nullValidator])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
