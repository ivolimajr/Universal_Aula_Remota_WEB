import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditAdministrativeModalComponent } from './components/edit-administrative-modal-component/edit-administrative-modal-component.component';

@Component({
  selector: 'app-administrative',
  templateUrl: './administrative.component.html',
  styleUrls: ['./administrative.component.scss']
})
export class AdministrativeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
  create(id: number) {    
    if(!id){
      //CRIAR NOVO USUÁRIO
      console.log("Criar o usuário");      
      const modalRef = this.modalService.open(EditAdministrativeModalComponent);
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
      const modalRef = this.modalService.open(EditAdministrativeModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: "+ id);
    }
  }

}
