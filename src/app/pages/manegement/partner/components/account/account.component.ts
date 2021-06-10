import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { PartnerModel } from '../../../../../shared/models/partner/partnerModel.model';

const EMPTY_PARTNER: PartnerModel = {
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
  cpf:''
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})   
export class AccountComponentPartner implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  @Input() id: number; // ID QUE VAMOS RECEBER PELA ROTA PARA PODER EDITAR

  isLoading$;
  customer: PartnerModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  modal: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }
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
    this.customer.fullName = formData.fullName;
    this.customer.email = formData.email;
    this.customer.cpf = formData.cpf;
    this.customer.telefone = formData.telefone;
    this.customer.cargo = formData.cargo;
    this.customer.status = formData.status;
    
    //TODO: ADICIONAR OS OUTROS ATRIBUTOS
  }

  /**
   * 
   */
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
          telefone: [this.customer.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cargo: [this.customer.cargo, Validators.compose([Validators.nullValidator])],
          status: [this.customer.status, Validators.compose([Validators.nullValidator])],
          cep: [this.customer.cep, Validators.compose([Validators.nullValidator])],
          endereco: [this.customer.endereco, Validators.compose([Validators.nullValidator])],
          cnpj: [this.customer.endereco, Validators.compose([Validators.nullValidator])],
          site: [this.customer.site, Validators.compose([Validators.nullValidator])],
          //TODO: ADICIONAR TODOS OS ATRIBUTOS DO MODAL
      });
    } else {
      this.createForm = this.fb.group({
          fullName: [this.customer.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          email: [this.customer.email, Validators.compose([Validators.required, Validators.email])],
          telefone: [this.customer.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cpf: [this.customer.cpf, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cargo: [this.customer.cargo, Validators.compose([Validators.nullValidator])],
          status: [this.customer.status, Validators.compose([Validators.nullValidator])],
          cep: [this.customer.cep, Validators.compose([Validators.nullValidator])],
          endereco: [this.customer.endereco, Validators.compose([Validators.nullValidator])],
          cnpj: [this.customer.endereco, Validators.compose([Validators.nullValidator])],
          site: [this.customer.site, Validators.compose([Validators.nullValidator])],
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
