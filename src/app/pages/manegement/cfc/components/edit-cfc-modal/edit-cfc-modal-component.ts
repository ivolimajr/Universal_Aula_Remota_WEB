import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CfcModel } from '../../../../../shared/models/cfc/cfcModel.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';

const EMPTY_CFC: CfcModel = {
  id: undefined,
  fullName: '',
  email: '',
  status: 2,
  dataAbertura: new Date,
  telefone:'',
  cep:'',
  cnpj: '',
  endereco: '',
  RazaoSocial: '',
  NomeFantasia:'',
  InscricaoEstadual:'',
  site:'',
  detran:'',
  cargo:'',
  dob:''
};


@Component({
  selector: 'app-edit-cfc-modal',
  templateUrl: './edit-cfc-modal-component.html',
  styleUrls: ['./edit-cfc-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditCfcModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  isLoading$;
  cfc: CfcModel;
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
      this.cfc = EMPTY_CFC;
      this.loadForm(null);
    } else {
      this.cfc = EMPTY_CFC;
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
    this.cfc.dataAbertura = new Date(formData.dataAbertura);
    this.cfc.email = formData.email;
    this.cfc.fullName = formData.fullName;
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
    console.log(this.cfc)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.cfc);
  }

  /**
   * 
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.cfc.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.cfc.email, Validators.compose([Validators.required, Validators.email])],
        RazaoSocial: [this.cfc.RazaoSocial, Validators.compose([Validators.nullValidator])],
        NomeFantasia: [this.cfc.NomeFantasia, Validators.compose([Validators.nullValidator])],
        InscricaoEstadual: [this.cfc.InscricaoEstadual, Validators.compose([Validators.nullValidator])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        detran: [this.cfc.detran, Validators.compose([Validators.nullValidator])],
        dataAbertura: [this.cfc.dataAbertura, Validators.compose([Validators.nullValidator])],
        cep: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
        cnpj: [this.cfc.cnpj, Validators.compose([Validators.nullValidator])],
        endereco: [this.cfc.endereco, Validators.compose([Validators.nullValidator])],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        telefone: [this.cfc.telefone, Validators.compose([Validators.nullValidator])],
        id: [this.cfc.id, Validators.compose([Validators.nullValidator])],
        dob: [this.cfc.dob, Validators.compose([Validators.nullValidator])],
        cargo: [this.cfc.cargo, Validators.compose([Validators.nullValidator])]

      });
    } else {
      this.createForm = this.fb.group({
        fullName: ["Ivo", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: ["email@universal.com.br", Validators.compose([Validators.required, Validators.email])],
        RazaoSocial: [this.cfc.RazaoSocial, Validators.compose([Validators.nullValidator])],
        NomeFantasia: [this.cfc.NomeFantasia, Validators.compose([Validators.nullValidator])],
        InscricaoEstadual: [this.cfc.InscricaoEstadual, Validators.compose([Validators.nullValidator])],
        site: [this.cfc.site, Validators.compose([Validators.nullValidator])],
        detran: [this.cfc.detran, Validators.compose([Validators.nullValidator])],
        dataAbertura: [this.cfc.dataAbertura, Validators.compose([Validators.nullValidator])],
        cep: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
        cnpj: [this.cfc.cnpj, Validators.compose([Validators.nullValidator])],
        endereco: [this.cfc.endereco, Validators.compose([Validators.nullValidator])],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        telefone: [this.cfc.telefone, Validators.compose([Validators.nullValidator])],
        id: [this.cfc.id, Validators.compose([Validators.nullValidator])]

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
