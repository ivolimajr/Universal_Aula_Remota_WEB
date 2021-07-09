import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { EdrivingGetAll, EdrivingPost } from '../../../../../shared/models/edriving/edrivingModel.model';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../../_metronic/core';
import { NgBrazilValidators } from 'ng-brazil';
import { EdrivingCargoServices } from '../../../../../shared/services/http/Edriving/edrivingCargo.service';
import { EdrivingCargoModel } from '../../../../../shared/models/edriving/EdrivingCargo.model';
import { EdrivingServices } from '../../../../../shared/services/http/Edriving/Edriving.service';
import { ManagementBaseComponent } from 'src/app/pages/management.base.component';
import { ToastrService } from 'ngx-toastr';

const EMPTY_EDRIVING: EdrivingPost = {
  id: null,
  fullName: '',
  email: '',
  cpf: '',
  telefone: '',
  status: 1,
  cargoid: null
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

  edrivingPost: EdrivingPost;
  edrivingGet: EdrivingGetAll;
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
    this.loadEdriving(this.id)
    this.loadForm(this.id);
    this.getCargo();
  }

  private getCargo() {
    this._edrivingCargoServices.getCargos().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    })
  }

  loadEdriving(id: number) {
    if (!this.id) {
      this.edrivingPost = EMPTY_EDRIVING;
      return this.loadForm(this.id);
    }
    this._edrivingServices.getOne(id).subscribe(
      success => {
        console.log(success.fullName);
        this.edrivingPost.id = success.id;
        this.edrivingGet.fullName = success.fullName;
        this.edrivingGet.email = success.email;
        this.edrivingGet.telefone = success.telefone;
        this.edrivingGet.cargo.cargo = success.cargo.cargo;
        this.edrivingGet.usuario.status = success.usuario.status;
        console.log(this.edrivingGet);
      },
      error => {

      }

    );
  }

  save() {
    this.prepareEdriving();
  }

  private prepareEdriving() {

  }

  edit() {
    console.log("Edit do modal");
  }

  create(edriving: EdrivingPost) {
    this._edrivingServices.setEdriving(edriving).subscribe(
      success => {
        console.log(success);
        this.loadForm(this.id);
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
    console.log("Id LoadForm: " + id);

    this.createForm = this.fb.group({
      fullName: ["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      telefone: ['', [Validators.required, NgBrazilValidators.telefone]],
      cpf: ["", [Validators.required, NgBrazilValidators.cpf]],
      cargo: ["", Validators.compose([Validators.nullValidator])],
      status: [1, Validators.compose([Validators.nullValidator])],
    });
    if (id) {
      this.createForm.patchValue({
        fullName: "Ivo",
        email: this.edrivingGet.email
      });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}

