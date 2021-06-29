import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { EdrivingServices } from '../../../shared/services/http/Edriving/Edriving.service';
import { EdrivingModel } from 'src/app/shared/models/edriving/edrivingModel.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  services: any;
  usuarios: EdrivingModel[];
  returnUrl: string;
  location: Location;

  constructor(
    private loc: Location,
    private router: Router,
    private route: ActivatedRoute,
    private _edrivingServices: EdrivingServices,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.location = this.loc;
    this.getUsuariosEdriving();
  }
  private getUsuariosEdriving() {
    this._edrivingServices.getUsuarios().subscribe(data => {
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
        if (res != null) {
          return this.router.navigate(['/edriving']);
        }
        console.log("2");
        console.log("Erro na API");
      }
      ).catch((res) => {
        console.log("3");
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
