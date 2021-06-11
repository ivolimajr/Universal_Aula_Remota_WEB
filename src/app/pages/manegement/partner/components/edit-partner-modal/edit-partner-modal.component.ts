import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { PartnerModel } from '../../../../../shared/models/partner/partnerModel.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_PARTNER: PartnerModel = {
  id: undefined,
  fullName: '',
  email: '',
  status: 2,
  telefone: '',
  cep: '',
  cnpj: '',
  cargo: '',
  bairro: '',
  cidade: '',
  confirmarSenha: '',
  descricao: '',
  enderecoLogradouro: '',
  numero: '',
  senha: '',
  uf: '',
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
  partner: PartnerModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
  }

  /**
   * 
   */
  loadCustomer() {
    if (!this.id) {
      this.partner = EMPTY_PARTNER;
      this.loadForm(null);
    } else {
      this.partner = EMPTY_PARTNER;
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
    this.partner.fullName = formData.fullName;
    this.partner.email = formData.email;
    this.partner.telefone = formData.telefone;
    this.partner.cargo = formData.cargo;
    this.partner.status = formData.status;
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
    console.log(this.partner)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.partner);
  }

  /**
   * 
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.partner.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: [this.partner.cep, Validators.compose([Validators.nullValidator])],
        //TODO: ADICIONAR TODOS OS ATRIBUTOS DO MODAL
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.partner.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.partner.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.partner.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargo: [this.partner.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.partner.status, Validators.compose([Validators.nullValidator])],
        cep: [this.partner.cep, Validators.compose([Validators.nullValidator])],
        //TODO: ADICIONAR TODOS OS ATRIBUTOS DO MODAL
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
