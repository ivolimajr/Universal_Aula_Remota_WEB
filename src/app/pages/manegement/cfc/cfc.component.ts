import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCustomerModalComponent } from '../edriving/components/edit-customer-modal/edit-customer-modal.component';

@Component({
  selector: 'app-cfc',
  templateUrl: './cfc.component.html',
  styleUrls: ['./cfc.component.scss']
})
export class CfcComponent implements OnInit {

  constructor(
    private modalService: NgbModal,) {

   }

  ngOnInit(): void {
  }

  create(id: number) {    
    if(!id){
      //CRIAR NOVO USUÁRIO
      console.log("Criar o usuário");      
      const modalRef = this.modalService.open(EditCustomerModalComponent);
      modalRef.componentInstance.id = 0;
      modalRef.result.then((res) => {
        if(res){
          return console.log("Salvo na API")
        } 
        console.log("Erro na API");
      }    
      ).catch((res)=>{
        console.log("Error: "+res);
      });
    } else{
      //EDITAR UM USUARIO
      const modalRef = this.modalService.open(EditCustomerModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: "+ id);
    }
    
  }
}
