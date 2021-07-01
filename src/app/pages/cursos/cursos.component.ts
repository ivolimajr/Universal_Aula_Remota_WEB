import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCursoModalComponent } from './edit-curso-modal/edit-curso-modal.component';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  constructor(
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
  create(id: number) {
    if (!id) {
      console.log("Criar o usuário");
      const modalRef = this.modalService.open(EditCursoModalComponent);
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
      const modalRef = this.modalService.open(EditCursoModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: " + id);
    }

  }
}

