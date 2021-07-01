import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { EdrivingPost } from '../../../../../shared/models/edriving/edrivingModel.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgBrazilValidators } from 'ng-brazil';
import { EdrivingCargoServices } from '../../../../../shared/services/http/Edriving/edrivingCargo.service';
import { EdrivingCargoModel } from '../../../../../shared/models/edriving/EdrivingCargo.model';
import { EdrivingServices } from '../../../../../shared/services/http/Edriving/Edriving.service';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';
import { ToastrService } from 'ngx-toastr';

const EMPTY_EDRIVING: EdrivingPost = {
  id: undefined,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1,
  senha: '',
  cargoid: 1
};
@Component({
  selector: 'app-edit-edriving-modal',
  templateUrl: './edit-edriving-modal.component.html',
  styleUrls: ['./edit-edriving-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },

  ]
})
export class EditEdrivingModalComponent extends ManagementBaseComponent implements OnInit, OnDestroy {

  @Input() id: number;

  edriving: EdrivingPost;
  cargos: EdrivingCargoModel[];

  constructor(
    private _edrivingServices: EdrivingServices,
    private _edrivingCargoServices: EdrivingCargoServices,
    public fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ) {
    super();
  }

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
  }

  private prepareEdriving() {
    const formData = this.createForm.value;
    this.edriving.fullName = formData.fullName.toUpperCase();
    this.edriving.email = formData.email.toUpperCase();
    this.edriving.cpf = formData.cpf.replaceAll(".", "").replaceAll("-", "");
    this.edriving.telefone = formData.telefone.replaceAll("(", "").replaceAll(")", "").replaceAll("-", "").replaceAll(" ", "");
    this.edriving.cargoid = formData.cargo;
    this.edriving.status = formData.status;
    this.edriving.senha = "";
    this.create(this.edriving);
  }

  edit() {
    console.log("Edit do modal");
  }

  create(edriving: EdrivingPost) {
    this._edrivingServices.setUsuario(edriving).subscribe(
      success => {
        console.log(success);
        this.loadForm(null);
        this.toastr.success('Usuário Cadastrado');
        return this.modal.close(success)
      },
      error => {
        console.log(error.error.error);
        this.toastr.warning(error.error.error);
      }
    );
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: ["Ivo da Silva Lima Junior", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        email: ["ivo@email.com", Validators.compose([Validators.required, Validators.email])],
        telefone: ['61986618601', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ["03746457106", [Validators.required, NgBrazilValidators.cpf]],
        cargo: ["", Validators.compose([Validators.nullValidator])],
        status: [1, Validators.compose([Validators.nullValidator])],
      });

    } else {
      this.createForm = this.fb.group({
        fullName: [this.edriving.fullName, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
        email: [this.edriving.email, Validators.compose([Validators.required, Validators.email])],
        telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
        cpf: ['', [Validators.required, NgBrazilValidators.cpf]],
        cargo: [this.edriving.cargoid, Validators.compose([Validators.nullValidator])],
        status: [this.edriving.status, Validators.compose([Validators.nullValidator])],
      });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

