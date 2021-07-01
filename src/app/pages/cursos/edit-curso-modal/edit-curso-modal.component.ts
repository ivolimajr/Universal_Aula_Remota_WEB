import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CursosModel } from 'src/app/shared/models/cursos/cursosModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { ToastrService } from 'ngx-toastr';
import { ManagementBaseComponent } from '../../management.base.component';

const EMPTY_CURSOS: CursosModel = {
  id: null,
  fullName:'',
  code:'',
  cargaHoraria:null,
  descricao:''
};
@Component({
  selector: 'app-edit-curso-modal',
  templateUrl: './edit-curso-modal.component.html',
  styleUrls: ['./edit-curso-modal.component.scss'],
  
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditCursoModalComponent extends ManagementBaseComponent implements OnInit, OnDestroy {

  @Input() id: number;

  cursos: CursosModel;

  constructor(
    public fb: FormBuilder,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.loadCustomer();
    console.log("ATRIBUTO ID NO MODAL: " + this.id);
  }
  loadCustomer() {
    if (!this.id) {
      this.cursos = EMPTY_CURSOS;
      this.loadForm(null);
    } else {
      this.cursos = EMPTY_CURSOS;
      this.loadForm(this.id);
    }
        
  }
  save() {
    this.prepareCustomer();
    this.create();
    this.toastr.success('Curso adicionado com sucesso', 'Concluído!!');
  }
  private prepareCustomer() {
    const formData = this.createForm.value;
    this.cursos.fullName = formData.fullName;
    this.cursos.code = formData.code;
    this.cursos.cargaHoraria = formData.cargaHoraria;
    this.cursos.descricao = formData.descricao;
  }

  edit() {
    console.log("Edit do modal");
  }

  create() {
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.cursos);
  }
  
  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        fullName: [this.cursos.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        code: [this.cursos.code, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargaHoraria: [this.cursos.cargaHoraria, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        descricao: [this.cursos.descricao, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      });
    } else {
      this.createForm = this.fb.group({
        fullName: [this.cursos.fullName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        code: [this.cursos.code, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cargaHoraria: [this.cursos.cargaHoraria, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        descricao: [this.cursos.descricao, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      });    
    }   
  }
}
