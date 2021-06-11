import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { CfcModel } from 'src/app/shared/models/cfc/cfcModel.model';

const EMPTY_CFC: CfcModel = {
  id: undefined,
  fullName: '',
  email: '',
  telefone: '',
  status: 1, // STATUS ATIVO
  senha: '',
  confirmarSenha: '',
  bairro: '',
  cep: '',
  cidade: '',
  cnpj: '',
  datadaFundacao: new Date,
  enderecoLogradouro: '',
  inscricaoEstadual: '',
  localizacaoLatitude: '',
  longitude: '',
  nomeFantasia: '',
  numero: '',
  razaoSocial: '',
  site: '',
  telefone2: '',
  uf: ''
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponentCfc implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]); // TIRAR

  @Input() id: number;

  isLoading$;
  cfc: CfcModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  modal: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

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
    this.cfc.fullName = formData.fullName;
    this.cfc.email = formData.email;
    this.cfc.telefone = formData.telefone;
    this.cfc.status = formData.status;

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
    console.log(this.cfc)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.cfc);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.cfc.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.cfc.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.cfc.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        cep: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.cfc.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.cfc.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.cfc.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        status: [this.cfc.status, Validators.compose([Validators.nullValidator])],
        cep: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
        senha: [this.cfc.cep, Validators.compose([Validators.nullValidator])],
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
