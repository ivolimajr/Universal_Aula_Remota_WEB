import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { Customer } from '../../../../../models/edriving/user.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_CUSTOMER: Customer = {
  id: undefined,
  fullName: '',
  email: '',
  status: 2,
  dob: undefined,
  dateOfBbirth: ''
};

@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrls: ['./edit-customer-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
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
  @Input() id: number;

  isLoading$;
  customer: Customer;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      //Busca do banco 
    }
  }

  save() {
    this.prepareCustomer();
    this.create();
  }
  private prepareCustomer() {
    const formData = this.createForm.value;
    this.customer.dob = new Date(formData.dob);
    this.customer.email = formData.email;
    this.customer.fullName = formData.fullName;
  }

  edit() {
    console.log("Edit do modal");
  }

  create() {
    this.modal.close(this.createForm.value.fullName)
    this.modal.dismiss("false");
    return of(this.customer);
  }

  loadForm() {
    this.createForm = this.fb.group({
      fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
      dob: [this.customer.dateOfBbirth, Validators.compose([Validators.nullValidator])]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
