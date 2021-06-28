import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { EdrivingServices } from '../../../shared/services/http/Edriving/Edriving.service';
import { EdrivingModel } from 'src/app/shared/models/edriving/edrivingModel.model';
@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  services: any;
  usuarios: EdrivingModel[];

  constructor(
    private _edrivingServices: EdrivingServices,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.getUsuariosEdriving();
  }
  private getUsuariosEdriving() {
    this._edrivingServices.getUsuariosEdriving().subscribe(data => {
      this.usuarios = data;
    }, error => {
      console.log(error);
    })
  }
  /**
   * PARAMS = Id do usuário para ser editado
   * SE o parametro for nulo significa que está criando um novo usuário
   */
  create(id: number) {
    if (!id) {
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
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
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: " + id);
    }
  }
}
