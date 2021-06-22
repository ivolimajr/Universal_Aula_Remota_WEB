import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EdrivingModel } from '../../../../../shared/models/edriving/edrivingModel.model';
import { CustomAdapter, CustomDateParserFormatter} from '../../../../../_metronic/core';
import { NgBrazil, MASKS, NgBrazilValidators } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { ToastrService } from 'ngx-toastr';

const EMPTY_EDRIVING: EdrivingModel = {
  id: undefined,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1, // STATUS ATIVO
  cargo: '',
  senha: '',
  confirmarSenha: '',
  nivelAcesso: null
};

@Component({
  selector: 'app-edit-edriving-modal',
  templateUrl: './edit-edriving-modal.component.html',
  styleUrls: ['./edit-edriving-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditEdrivingModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  isLoading$;
  edriving: EdrivingModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  MASKS = utilsBr.MASKS;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadEdriving();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadEdriving() {
    if (!this.id) {
      this.edriving = EMPTY_EDRIVING;
      this.loadForm(null);
    } else {
      this.edriving = EMPTY_EDRIVING;
      this.loadForm(this.id);
    }
  }

  save() {
    this.prepareEdriving();
    this.create();
    this.toastr.success('Usuário adicionado com sucesso', 'Bem vindo!!');
  }

  private prepareEdriving() {
    const formData = this.createForm.value;

    this.edriving.fullName = formData.fullName;
    this.edriving.email = formData.email;
    this.edriving.cpf = formData.cpf;
    this.edriving.telefone = formData.telefone;
    this.edriving.cargo = formData.cargo;
    this.edriving.status = formData.status;
    this.edriving.senha = formData.senha;
    this.edriving.confirmarSenha = formData.confirmarSenha;

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
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.edriving);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        senha: [this.edriving.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.edriving.confirmarSenha, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        senha: [this.edriving.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.edriving.confirmarSenha, Validators.compose([Validators.nullValidator])],
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
