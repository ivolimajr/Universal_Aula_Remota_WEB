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

  // form actions
  create() {
    const modalRef = this.modalService.open(EditCustomerModalComponent);
    //modalRef.componentInstance.id = 200;
    modalRef.result.then((res) =>
      console.log(res)
    ).catch((res)=>{
      console.log("Error: "+res);
      
      
    });

  }
}
