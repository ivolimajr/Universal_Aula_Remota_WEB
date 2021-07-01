import { Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBrazilValidators } from 'ng-brazil';
import { CustomValidators } from 'ng2-validation';
import { of } from 'rxjs';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';
import { StudentBaseModel } from 'src/app/shared/models/student/studentModel.model';

const EMPTY_CUSTOMER: StudentBaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1,
  senha: '',
  confirmarSenha: '',
  cep: '',
  cidade: '',
  bairro: '',
  uf: '',
  enderecoLogradouro: '',
  numero: '',
  curso: [],
  dataNascimento: new Date,
  identidade: '',
  orgaoExpedidor: '',
  turno: '',
  turma: '',
  nivelAcesso: null,
  senhaAntiga:''
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentStudent extends ManagementBaseComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  email = new FormControl('', [Validators.required, Validators.email]);

  @Input() id: number;

  customer: StudentBaseModel;
  modal: any;
  
  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit(): void {
    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let confirmarSenha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);

    this.createForm = this.fb.group({
      cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
      email: ['', [Validators.required, Validators.email]],
      senha: senha,
      confirmarSenha: confirmarSenha
    });

    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm(null);
    } else {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm(this.id);
    }
  }

  save() {
    this.prepareCustomer();
    this.create();
  }

  private prepareCustomer() {
    const formData = this.createForm.value;
    this.customer.fullName = formData.fullName;
    this.customer.email = formData.email;
    this.customer.cpf = formData.cpf;
    this.customer.telefone = formData.telefone;
    this.customer.status = formData.status;
    this.customer.senha = formData.senha;
    this.customer.senhaAntiga = formData.senhaAntiga;
    this.customer.confirmarSenha = formData.confirmarSenha;
  }

  edit() {
    console.log("Edit do modal");
  }

  cancel() {
    console.log("cancel do modal");
  }

  create() {
    console.log(this.customer)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.customer);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.customer.status, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.customer.status, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
