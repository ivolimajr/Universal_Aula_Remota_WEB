import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { EdrivingModel } from '../../../../../shared/models/edriving/edrivingModel.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgBrazilValidators } from 'ng-brazil';
import { utilsBr } from 'js-brasil';
import { ToastrService } from 'ngx-toastr';
import { EdrivingCargoServices } from '../../../../../shared/services/http/Edriving/edrivingCargo.service';
import { EdrivingCargoModel } from '../../../../../shared/models/edriving/EdrivingCargo.model';

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
  nivelAcesso: null
};

@Component({
  selector: 'app-edit-edriving-modal',
  templateUrl: './edit-edriving-modal.component.html',
  styleUrls: ['./edit-edriving-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditEdrivingModalComponent implements OnInit, OnDestroy {

  @Input() id: number;

  isLoading$;
  edriving: EdrivingModel;
  createForm: FormGroup; // AGRUPADOR DE CONTROLES
  private subscriptions: Subscription[] = [];
  MASKS = utilsBr.MASKS;
  cargos: EdrivingCargoModel[];

  constructor(
    private _edrivingCargoServices: EdrivingCargoServices,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getCargo();
    this.loadEdriving()
  }

  private getCargo() {
    this._edrivingCargoServices.getCargos().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    })
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

    this.edriving.fullName = formData.fullName.toUpperCase();
    this.edriving.email = formData.email.toUpperCase();
    this.edriving.cpf = formData.cpf.replaceAll(".", "").replaceAll("-", "");
    this.edriving.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.edriving.cargo = formData.cargo.toUpperCase();
    this.edriving.status = formData.status.toUpperCase();
    this.edriving.senha = "";
    this.edriving.confirmarSenha = "";
  }

  edit() {
    console.log("Edit do modal");
  }

  create() {
    this.loadForm(null);
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.edriving);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: ["", Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ["''", [Validators.required, NgBrazilValidators.cpf]],
        cargo: ["", Validators.compose([Validators.nullValidator])],
        status: [1, Validators.compose([Validators.nullValidator])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargo, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
      });
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

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
