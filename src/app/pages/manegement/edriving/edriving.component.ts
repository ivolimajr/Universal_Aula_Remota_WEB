import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { EdrivingServices } from '../../../shared/services/http/Edriving/Edriving.service';
import { EdrivingGetAll } from 'src/app/shared/models/edriving/edrivingModel.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeleteEdrivingComponent } from './components/delete-edriving/delete-edriving.component';
@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit, OnDestroy {

  services: any;
  usuarioSub: BehaviorSubject<EdrivingGetAll> = new BehaviorSubject<EdrivingGetAll>(new EdrivingGetAll());
  errorMessage: string;
  returnUrl: string;
  lista: EdrivingGetAll[] = [];

  _unsubscribAll: Subject<any> = new Subject<any>();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private edrivingServices: EdrivingServices,
    private modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {

    this.usuarioSub
      .pipe(takeUntil(this._unsubscribAll))
      .subscribe((item: EdrivingGetAll) => {
        this.lista.push(item)
        this._cdRef.detectChanges();

      });

    this.getUsuariosEdriving();
  }

  private getUsuariosEdriving() {
    this.edrivingServices.obterTodos()
      .subscribe((items: EdrivingGetAll[]) => {
        this.lista = items;
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
      }
      ).catch((res) => {
        return console.log("Error: " + res);
      });
    } else {
      const modalRef = this.modalService.open(EditEdrivingModalComponent);
      modalRef.componentInstance.id = id;
    }
  }
  deleteSelected(id) {
    const modalRef = this.modalService.open(DeleteEdrivingComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then((res: any) => {
      if (res != null) {
        console.log(res);

        // this.usuarioSub.next(res);
        // this._cdRef.detectChanges();
      }
    }
    ).catch((res) => {
      return console.log("Error: " + res);
    });
  }
  ngOnDestroy(): void {
    this._unsubscribAll.next();
    this._unsubscribAll.complete();
  }
}
