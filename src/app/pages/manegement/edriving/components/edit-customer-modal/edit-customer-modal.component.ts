import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EdrivingModel } from '../../../../../shared/models/edriving/edrivingModel.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_CUSTOMER: EdrivingModel = {
  id: undefined,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1, // STATUS ATIVO
  dob: undefined,
  dateOfBbirth: '',
  cargo: '',
  cep: '',
  endereco:'',
  senha:'',
  confirmarSenha:'',
  sobrenome:'',
};


@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrls: ['./edit-customer-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditCustomerModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  customer: EdrivingModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  /**
   * 
   */
  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm(null);
    } else {
      this.customer = EMPTY_CUSTOMER;
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
    this.customer.fullName = formData.fullName;
    this.customer.email = formData.email;
    this.customer.cpf = formData.cpf;
    this.customer.telefone = formData.telefone;
    this.customer.cargo = formData.cargo;
    this.customer.dob = new Date(formData.dob);
    this.customer.dateOfBbirth = formData.dob;
    this.customer.status = formData.status;
    
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
    console.log(this.customer)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.customer);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
          dob: [this.customer.dateOfBbirth, Validators.compose([Validators.nullValidator])],
          telefone: [this.customer.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cargo: [this.customer.cargo, Validators.compose([Validators.nullValidator])],
          status: [this.customer.status, Validators.compose([Validators.nullValidator])],
          cep: [this.customer.cep, Validators.compose([Validators.nullValidator])],
          endereco: [this.customer.endereco, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
        dob: [this.customer.dateOfBbirth, Validators.compose([Validators.nullValidator])],
        telefone: [this.customer.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.customer.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.customer.status, Validators.compose([Validators.nullValidator])],
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
