import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { EdrivingServices } from '../../../shared/services/http/Edriving/Edriving.service';
import { EdrivingGetAll } from 'src/app/shared/models/edriving/edrivingModel.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit, OnDestroy {

  email = new FormControl('', [Validators.required, Validators.email]);
  services: any;
  usuarioSub: BehaviorSubject<EdrivingGetAll> = new BehaviorSubject<EdrivingGetAll>(new EdrivingGetAll());
  usuario: EdrivingGetAll;
  errorMessage: string;
  returnUrl: string;
  location: Location;
  lista: EdrivingGetAll[] = [];

  _unsubscribAll: Subject<any> = new Subject<any>();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private loc: Location,
    private router: Router,
    private _edrivingServices: EdrivingServices,
    private modalService: NgbModal,
  ) {

  }
  ngOnDestroy(): void {
    this._unsubscribAll.next();
    this._unsubscribAll.complete();
  }

  ngOnInit(): void {
    this.location = this.loc;

    this.usuarioSub
      .pipe(takeUntil(this._unsubscribAll))
      .subscribe((item: EdrivingGetAll) => {
        this.lista.push(item)
        this._cdRef.detectChanges();
        console.log(this.lista);

      });

    this.getUsuariosEdriving();
  }

  private getUsuariosEdriving() {
    this._edrivingServices.obterTodos()
      .subscribe((items: EdrivingGetAll[]) => {
        this.lista = items;
        console.log(this.lista);
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
      modalRef.result.then((res: EdrivingGetAll) => {
        if (res != null) {
          this.usuarioSub.next(res);
          this._cdRef.detectChanges();
        }
        //this.getUsuariosEdriving();
      }
      ).catch((res) => {
        return console.log("Error: " + res);
      });
    } else {
      //EDITAR UM USUARIO
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
      modalRef.componentInstance.id = id;
    }
  }
}
