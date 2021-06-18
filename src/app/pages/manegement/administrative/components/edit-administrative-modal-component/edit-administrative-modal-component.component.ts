import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { AdministrativoModel } from '../../../../../shared/models/administrative/administrativoModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { NgBrazilValidators, NgBrazil, MASKS } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { ToastrService } from 'ngx-toastr';

const EMPTY_ADMINISTRATIVO: AdministrativoModel = {
  id: undefined,
  fullName: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  cpf: '',
  identidade: '',
  telefone: '',
  status: 1, // STATUS ATIVO
  cargo: '',
  cep: '',
  bairro: '',
  cidade: '',
  uf: '',
  numero: '',
  dataNascimento: new Date,
  enderecoLogradouro: '',
  localizacaoLatitude: '',
  longitude: '',
  orgaoExpedidor: '',
  site: '',
  uploadDOC:'',
};

@Component({
  selector: 'app-edit-administrative-modal-component',
  templateUrl: './edit-administrative-modal-component.component.html',
  styleUrls: ['./edit-administrative-modal-component.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class EditAdministrativeModalComponent implements OnInit, OnDestroy {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  @Input() id: number;

  isLoading$;
  administrativo: AdministrativoModel;
  createForm: FormGroup;
  private subscriptions: Subscription[] = [];
  MASKS = utilsBr.MASKS;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,

  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }

  loadCustomer() {
    if (!this.id) {
      this.administrativo = EMPTY_ADMINISTRATIVO;
      this.loadForm(null);
    } else {
      this.administrativo = EMPTY_ADMINISTRATIVO;
      this.loadForm(this.id);
    }
  }
  /**
  * 
  */
  save() {
    this.prepareCustomer();
    this.create();
    this.toastr.success('Usuário adicionado com sucesso', 'Bem vindo!!');
  }


  /**
   * 
   */
  private prepareCustomer() {
    const formData = this.createForm.value;
    this.administrativo.fullName = formData.fullName;
    this.administrativo.email = formData.email;
    this.administrativo.cpf = formData.cpf;
    this.administrativo.telefone = formData.telefone;
    this.administrativo.cargo = formData.cargo;
    this.administrativo.dataNascimento = new Date(formData.dob);
    this.administrativo.status = formData.status;
    this.administrativo.senha = formData.senha;
    this.administrativo.confirmarSenha = formData.confirmarSenha;
    this.administrativo.identidade = formData.identidade;
    this.administrativo.telefone = formData.telefone2;
    this.administrativo.cep = formData.cep;
    this.administrativo.bairro = formData.bairro;
    this.administrativo.cidade = formData.cidade;
    this.administrativo.uf = formData.uf;
    this.administrativo.numero = formData.numero;
    this.administrativo.enderecoLogradouro = formData.enderecoLogradouro;
    this.administrativo.localizacaoLatitude = formData.localizacaoLatitude;
    this.administrativo.longitude = formData.longitude;
    this.administrativo.orgaoExpedidor = formData.orgaoExpedidor;
    this.administrativo.site = formData.site;
    this.administrativo.uploadDOC = formData.uploadDOC;
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
    console.log(this.administrativo)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.administrativo);
  }

  /**
   *  MÉTODO PARA CARREGAR ( INICIAR ) O FORMULÁRIO
   */
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
          fullName: [this.administrativo.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          email: [this.administrativo.email, Validators.compose([Validators.required, Validators.email])],
          telefone: [this.administrativo.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cpf: ['',[Validators.required, NgBrazilValidators.cpf]],
          cargo: [this.administrativo.cargo, Validators.compose([Validators.nullValidator])],
          status: [this.administrativo.status, Validators.compose([Validators.nullValidator])],
          cep: ['',[Validators.required, NgBrazilValidators.cep]],
          senha: [this.administrativo.senha, Validators.compose([Validators.nullValidator])],
          confirmarSenha: [this.administrativo.confirmarSenha, Validators.compose([Validators.nullValidator])],
          identidade: [this.administrativo.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          telefone2: [this.administrativo.telefone, Validators.compose([Validators.nullValidator])],
          bairro: [this.administrativo.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          cidade: [this.administrativo.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          uf: [this.administrativo.uf, Validators.compose([Validators.nullValidator])],
          numero: [this.administrativo.numero, Validators.compose([Validators.nullValidator])],
          dataNascimento: [this.administrativo.dataNascimento, Validators.compose([Validators.nullValidator])],
          enderecoLogradouro: [this.administrativo.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
          localizacaoLatitude: [this.administrativo.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
          longitude: [this.administrativo.longitude, Validators.compose([Validators.nullValidator])],
          orgaoExpedidor: [this.administrativo.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
          site: [this.administrativo.site, Validators.compose([Validators.nullValidator])],
          uploadDOC: [this.administrativo.uploadDOC, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.administrativo.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: [this.administrativo.email, Validators.compose([Validators.required, Validators.email])],
        telefone: [this.administrativo.telefone, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cpf: ['',[Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.administrativo.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.administrativo.status, Validators.compose([Validators.nullValidator])],
        cep: ['',[Validators.required, NgBrazilValidators.cep]],
        senha: [this.administrativo.senha, Validators.compose([Validators.nullValidator])],
        confirmarSenha: [this.administrativo.confirmarSenha, Validators.compose([Validators.nullValidator])],
        identidade: [this.administrativo.identidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        telefone2: [this.administrativo.telefone, Validators.compose([Validators.nullValidator])],
        bairro: [this.administrativo.bairro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cidade: [this.administrativo.cidade, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        uf: [this.administrativo.uf, Validators.compose([Validators.nullValidator])],
        numero: [this.administrativo.numero, Validators.compose([Validators.nullValidator])],
        dataNascimento: [this.administrativo.dataNascimento, Validators.compose([Validators.nullValidator])],
        enderecoLogradouro: [this.administrativo.enderecoLogradouro, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        localizacaoLatitude: [this.administrativo.localizacaoLatitude, Validators.compose([Validators.nullValidator])],
        longitude: [this.administrativo.longitude, Validators.compose([Validators.nullValidator])],
        orgaoExpedidor: [this.administrativo.orgaoExpedidor, Validators.compose([Validators.nullValidator])],
        site: [this.administrativo.site, Validators.compose([Validators.nullValidator])],
        uploadDOC: [this.administrativo.uploadDOC, Validators.compose([Validators.nullValidator])],

      });

    }

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

