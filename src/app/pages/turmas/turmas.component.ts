import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditTurmasModalComponent } from './edit-turmas-modal/edit-turmas-modal.component';

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.scss']
})
export class TurmasComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
  create(id: number) {
    if (!id) {
      //CRIAR NOVO USUÁRIO
      console.log("Criar o usuário");
      const modalRef = this.modalService.open(EditTurmasModalComponent);
      modalRef.componentInstance.id = 0;
      modalRef.result.then((res) => {
        if (res) {
          return console.log("Salvo na API")
        }
        console.log("Erro na API");
      }
      ).catch((res) => {
        console.log("Error: " + res);
      });
    } else {
      //EDITAR UM USUARIO
      const modalRef = this.modalService.open(EditTurmasModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: " + id);
    }
  }
}
