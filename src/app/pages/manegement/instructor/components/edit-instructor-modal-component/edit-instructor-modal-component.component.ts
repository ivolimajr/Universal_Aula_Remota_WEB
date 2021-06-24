import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { InstrutorBaseModel } from 'src/app/shared/models/instructor/instrutorModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators, NgBrazil, MASKS } from 'ng-brazil';
import { ToastrService } from 'ngx-toastr';

const EMPTY_INSTRUTOR: InstrutorBaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  cpf: '',
  identidade: '',
  telefone: '',
  status: 1, // STATUS ATIVO
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
  cursos: [],
  uploadDOC: '',
  nivelAcesso: null
};

@Component({
  selector: 'app-edit-instructor-modal-component',
  templateUrl: './edit-instructor-modal-component.component.html',
  styleUrls: ['./edit-instructor-modal-component.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]

})
export class EditInstructorModalComponentComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  @Input() id: number;

  isLoading$;
  instrutor: InstrutorBaseModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  MASKS = utilsBr.MASKS;


  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) {

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
    this.toastr.success('Usuário adicionado com sucesso', 'Bem vindo!!');
  }

  private prepareCustomer() {
    const formData = this.createForm.value;
    this.instrutor.fullName = formData.fullName.toUpperCase();
    this.instrutor.email = formData.email.toUpperCase();
    this.instrutor.cpf = formData.cpf.replaceAll(".", "").replaceAll("-", "");
    this.instrutor.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.instrutor.cargo = formData.cargo.toUpperCase();
    this.instrutor.dataNascimento = new Date(formData.dob);
    this.instrutor.status = formData.status;
    this.instrutor.senha = formData.senha;
    this.instrutor.confirmarSenha = formData.confirmarSenha;
    this.instrutor.identidade = formData.identidade.replaceAll(".", "").replaceAll("-", "");
    this.instrutor.cep = formData.cep.replaceAll("-", "").replaceAll(".", "");
    this.instrutor.bairro = formData.bairro.toUpperCase();
    this.instrutor.cidade = formData.cidade.toUpperCase();
    this.instrutor.uf = formData.uf.toUpperCase();
    this.instrutor.numero = formData.numero;
    this.instrutor.enderecoLogradouro = formData.enderecoLogradouro.toUpperCase();
    this.instrutor.orgaoExpedidor = formData.orgaoExpedidor.toUpperCase();
    this.instrutor.site = formData.site;
  }

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
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        senha: [this.instrutor.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.instrutor.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.instrutor.cargo, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        senha: [this.instrutor.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.instrutor.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.instrutor.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        bairro: [this.instrutor.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.instrutor.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        uf: [this.instrutor.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.instrutor.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.instrutor.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.instrutor.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        orgaoExpedidor: [this.instrutor.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.instrutor.site, Validators.compose([Validators.nullValidator])],

      });
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

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
