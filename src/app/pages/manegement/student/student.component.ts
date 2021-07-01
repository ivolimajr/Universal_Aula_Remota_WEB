import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditStudentModalComponentComponent } from './components/edit-student-modal-component/edit-student-modal-component.component';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

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
      const modalRef = this.modalService.open(EditStudentModalComponentComponent);
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
      const modalRef = this.modalService.open(EditStudentModalComponentComponent);
      modalRef.componentInstance.id = id;
      console.log("Editar o id: "+ id);
    }   
  }
}

