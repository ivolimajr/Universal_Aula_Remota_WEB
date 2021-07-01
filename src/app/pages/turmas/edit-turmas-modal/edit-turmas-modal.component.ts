import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TurmasModel } from 'src/app/shared/models/turmas/turmasModel.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { ToastrService } from 'ngx-toastr';
import { ManagementBaseComponent } from '../../management.base.component';

const EMPTY_TURMAS: TurmasModel = {
  id:undefined,
  cursoId:undefined,
  instrutorId:undefined,
  turma:'',
  alunos:[],
  link:'',
  dataInicio: new Date,
  dataFim: new Date,
  matricula:undefined

};
@Component({
  selector: 'app-edit-turmas-modal',
  templateUrl: './edit-turmas-modal.component.html',
  styleUrls: ['./edit-turmas-modal.component.scss'],

  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditTurmasModalComponent extends ManagementBaseComponent implements OnInit, OnDestroy {
  
  @Input() id: number;

  turmas: TurmasModel;

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
      this.turmas = EMPTY_TURMAS;
      this.loadForm(null);
    } else {
      this.turmas = EMPTY_TURMAS;
      this.loadForm(this.id);
    }
  }
  save() {
    this.prepareCustomer();
    this.create();
    this.toastr.success('Turma criada com sucesso', 'Concluído!!');
  }
  private prepareCustomer() {
    const formData = this.createForm.value;
    this.turmas.id = formData.fullName;
    this.turmas.cursoId = formData.cursoId;
    this.turmas.instrutorId = formData.instrutorId;
    this.turmas.turma = formData.turma;
    this.turmas.alunos = formData.alunos;
    this.turmas.link = formData.link;
    this.turmas.dataInicio = formData.dataInicio;
    this.turmas.dataFim = formData.dataFim;
    this.turmas.matricula = formData.matricula;
  }
  edit() {
    console.log("Edit do modal");
  }
  create() {
    console.log(this.turmas)
    this.modal.close(true)
    this.modal.dismiss("false");
    return of(this.turmas);
  }

  loadForm(id: number) {
    if (!id) {
      this.createForm = this.fb.group({
        id: [this.turmas.id, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cursoId: [this.turmas.cursoId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        instrutorId: [this.turmas.instrutorId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        turma: [this.turmas.turma, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        alunos: [this.turmas.alunos, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        link: [this.turmas.link, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        dataInicio: [this.turmas.dataInicio, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        dataFim: [this.turmas.dataFim, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        matricula: [this.turmas.matricula, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      });
    } else {
      this.createForm = this.fb.group({
        id: [this.turmas.id, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        cursoId: [this.turmas.cursoId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        instrutorId: [this.turmas.instrutorId, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        turma: [this.turmas.turma, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        alunos: [this.turmas.alunos, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        link: [this.turmas.link, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        dataInicio: [this.turmas.dataInicio, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        dataFim: [this.turmas.dataFim, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        matricula: [this.turmas.matricula, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      });    
    }   
  }
}
