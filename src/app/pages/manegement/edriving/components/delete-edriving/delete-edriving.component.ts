import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EdrivingServices } from 'src/app/shared/services/http/Edriving/Edriving.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-edriving',
  templateUrl: './delete-edriving.component.html',
  styleUrls: ['./delete-edriving.component.scss']
})
export class DeleteEdrivingComponent implements OnInit {

  @Input() id: number;
  isLoading = false;

  constructor(public modal: NgbActiveModal, private edrivingServices: EdrivingServices,
    public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  deleteCustomer() {
    this.edrivingServices.deleteUsuario(this.id).subscribe(
      success => {
        console.log(success);
        this.toastr.success('Usuário Cadastrado');
        return this.modal.close(success)
      },
      error => {
        console.log(error.error.error);
        this.toastr.warning(error.error.error);
      }
    )
    this.modal.close(this.id);
  }

}
