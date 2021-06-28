import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NgBrazilValidators } from 'ng-brazil';
import { CustomValidators } from 'ng2-validation';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../../../../shared/validators/generic-form-validation';
import { EdrivingModel } from '../../../../../shared/models/edriving/edrivingModel.model';
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
  nivelAcesso: null,
  senhaAntiga:''
};
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentEdriving implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  edriving: EdrivingModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  modal: any;
  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;
  MASKS = utilsBr.MASKS;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,

    ) { }

  ngOnInit(): void {
    let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    let confirmarSenha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);

    this.createForm = this.fb.group({
      cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
      email: ['', [Validators.required, Validators.email]],
      senha: senha,
      confirmarSenha: confirmarSenha
    });

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
    this.edriving.senhaAntiga = formData.senhaAntiga;
  }

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
    console.log(this.edriving)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.edriving);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
      });

    } else {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
        senha: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        senhaAntiga: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
        confirmarSenha: ['', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo()]],
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
