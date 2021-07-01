import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { EdrivingServices } from '../../../shared/services/http/Edriving/Edriving.service';
import { EdrivingGetAll } from 'src/app/shared/models/edriving/edrivingModel.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  services: any;
  usuarios: Observable<EdrivingGetAll[]>;
  usuario: EdrivingGetAll;
  errorMessage: string;
  returnUrl: string;
  location: Location;

  constructor(
    private loc: Location,
    private router: Router,
    private _edrivingServices: EdrivingServices,
    public modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.location = this.loc;
    this.getUsuariosEdriving();
  }

  private getUsuariosEdriving() {
    this._edrivingServices.obterTodos()
      .subscribe(items => {
        this.usuarios = of(items);
      })
  }

  create(id: number) {
    if (!id) {
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
      modalRef.componentInstance.id = 0;
      modalRef.result.then((res: EdrivingGetAll[]) => {
        if (res != null) {
          this.usuarios = of(res);
        }
        this.getUsuariosEdriving();
      }
      ).catch((res) => {
        return console.log("Error: " + res);
      });
    } else {
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
      modalRef.componentInstance.id = id;
    }
  }
}
