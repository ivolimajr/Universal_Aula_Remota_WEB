import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCfcModalComponent } from './components/edit-cfc-modal/edit-cfc-modal-component';

@Component({
  selector: 'app-cfc',
  templateUrl: './cfc.component.html',
  styleUrls: ['./cfc.component.scss']
})
export class CfcComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
    ) {
   }

  ngOnInit(): void {
  }

  create(id: number) {    
    if(!id){
      console.log("Criar o usuário");      
      const modalRef = this.modalService.open(EditCfcModalComponent);
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
      const modalRef = this.modalService.open(EditCfcModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: "+ id);
    }
    
  }
}
