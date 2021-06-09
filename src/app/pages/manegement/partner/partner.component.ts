import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPartnerModalComponent } from './components/edit-partner-modal/edit-partner-modal.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
  
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
 }

  ngOnInit(): void {

  }

  create(id: number) {    
    if(!id){
      //CRIAR NOVO USUÁRIO
      console.log("Criar o usuário");      
      const modalRef = this.modalService.open(EditPartnerModalComponent);
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
      const modalRef = this.modalService.open(EditPartnerModalComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: "+ id);
    }
    
    
  }
}
