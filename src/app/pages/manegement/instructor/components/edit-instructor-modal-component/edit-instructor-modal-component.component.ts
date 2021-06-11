import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { InstrutorBaseModel } from 'src/app/shared/models/cfc/instrutorModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

const EMPTY_INSTRUTOR: InstrutorBaseModel = {
  id: undefined,
  fullName: '',
  email: '',
  telefone: '',
  status: 1, // STATUS ATIVO
  senha: '',
  confirmarSenha: ''
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


  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
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
    this.instrutor.fullName = formData.fullName;
    this.instrutor.email = formData.email;
    this.instrutor.telefone = formData.telefone;
    this.instrutor.status = formData.status;
  }

  /**
   * 
   */
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
        telefone: [this.instrutor.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.instrutor.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.instrutor.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.instrutor.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.instrutor.status, Validators.compose([Validators.nullValidator])],
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
