import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { EditCustomerModalComponent } from './components/edit-customer-modal/edit-customer-modal.component';

@Component({
  selector: 'app-edriving',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * PARAMS = Id do usuário para ser editado
   * SE o parametro for nulo significa que está criando um novo usuário
   */
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
