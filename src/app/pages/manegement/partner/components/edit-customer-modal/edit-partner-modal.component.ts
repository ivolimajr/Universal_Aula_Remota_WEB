import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { PartnerModel } from '../../../../../models/partner/partnerModel.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_PARTNER: PartnerModel = {
  id: undefined,
  fullName: '',
  email: '',
  status: 2,
  dataAbertura: new Date,
  telefone:'',
  cpf:'',
  cep:'',
  dateOfBbirth:'',

};


@Component({
  selector: 'app-edit-partner-modal',
  templateUrl: './edit-partner-modal.component.html',
  styleUrls: ['./edit-partner-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditPartnerModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  isLoading$;
  customer: PartnerModel;
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
      this.customer = EMPTY_PARTNER;
      this.loadForm(null);
    } else {
      this.customer = EMPTY_PARTNER;
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
    this.customer.dataAbertura = new Date(formData.dataAbertura);
    this.customer.email = formData.email;
    this.customer.fullName = formData.fullName;
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
   * 
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
        dob: [this.customer.dataAbertura, Validators.compose([Validators.nullValidator])]
      });
    } else {
      this.createForm = this.fb.group({
        fullName: ["Ivo", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: ["email@universal.com.br", Validators.compose([Validators.required, Validators.email])],
        dob: [this.customer.dataAbertura, Validators.compose([Validators.nullValidator])]
      });
    }

  }

  /**
   * 
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
