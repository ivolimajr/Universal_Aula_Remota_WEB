import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { StudentBaseModel } from 'src/app/shared/models/student/studentModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgBrazilValidators, NgBrazil, MASKS } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { ToastrService } from 'ngx-toastr';

const EMPTY_STUDENT: StudentBaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1, // STATUS ATIVO
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
  selector: 'app-edit-student-modal-component',
  templateUrl: './edit-student-modal-component.component.html',
  styleUrls: ['./edit-student-modal-component.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditStudentModalComponentComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  @Input() id: number;

  isLoading$;
  student: StudentBaseModel;
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
    this.loadstudent();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadstudent() {
    if (!this.id) {
      this.student = EMPTY_STUDENT;
      this.loadForm(null);
    } else {
      this.student = EMPTY_STUDENT;
      this.loadForm(this.id);
    }
  }

  save() {
    this.preparestudent();
    this.create();
    this.toastr.success('Usuário adicionado com sucesso', 'Bem vindo!!');
  }

  private preparestudent() {
    const formData = this.createForm.value;
    this.student.fullName = formData.fullName.toUpperCase();
    this.student.email = formData.email.toUpperCase();
    this.student.cpf = formData.cpf.replaceAll(".", "").replaceAll("-", "")
    this.student.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.student.status = formData.status;
    this.student.senha = formData.senha;
    this.student.confirmarSenha = formData.confirmarSenha;
    this.student.cep = formData.cep.replaceAll("-", "").replaceAll(".", "");
    this.student.cidade = formData.cidade.toUpperCase();
    this.student.bairro = formData.bairro.toUpperCase();
    this.student.enderecoLogradouro = formData.enderecoLogradouro.toUpperCase();
    this.student.uf = formData.uf.toUpperCase();
    this.student.numero = formData.numero;
    this.student.curso = formData.curso.toUpperCase();
    this.student.dataNascimento = formData.dataNascimento;
    this.student.identidade = formData.identidade.replaceAll("-", "").replaceAll(".", "");
    this.student.orgaoExpedidor = formData.orgaoExpedidor.toUpperCase();
    this.student.turno = formData.turno.toUpperCase();
    this.student.turma = formData.turma.toUpperCase();

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
    console.log(this.student)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.student);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.student.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.student.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        senha: [this.student.senha, Validators.compose([Validators.nullValidator])],
        status: [this.student.status, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.student.confirmarSenha, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cidade: [this.student.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        bairro: [this.student.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        uf: [this.student.uf, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.student.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.student.numero, Validators.compose([Validators.nullValidator])],
        curso: [this.student.curso, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.student.dataNascimento, Validators.compose([Validators.nullValidator])],
        identidade: [this.student.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        orgaoExpedidor: [this.student.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        turno: [this.student.turno, Validators.compose([Validators.nullValidator])],
        turma: [this.student.turma, Validators.compose([Validators.nullValidator])],

      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.student.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.student.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        senha: [this.student.senha, Validators.compose([Validators.nullValidator])],
        status: [this.student.status, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.student.confirmarSenha, Validators.compose([Validators.nullValidator])],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cidade: [this.student.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        bairro: [this.student.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        uf: [this.student.uf, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.student.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        numero: [this.student.numero, Validators.compose([Validators.nullValidator])],
        curso: [this.student.curso, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.student.dataNascimento, Validators.compose([Validators.nullValidator])],
        identidade: [this.student.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        orgaoExpedidor: [this.student.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        turno: [this.student.turno, Validators.compose([Validators.nullValidator])],
        turma: [this.student.turma, Validators.compose([Validators.nullValidator])],
      });
    }

  }

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
