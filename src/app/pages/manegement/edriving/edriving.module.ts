import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBrazil } from 'ng-brazil';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { EdrivingComponent } from './edriving.component';
import { AccountComponentEdriving } from './components/account/account.component';
import { EditEdrivingModalComponent } from './components/edit-edriving-modal/edit-edriving-modal.component';
import { DeleteEdrivingComponent } from './components/delete-edriving/delete-edriving.component';



@NgModule({
  declarations: [
    EdrivingComponent,
    EditEdrivingModalComponent,
    AccountComponentEdriving,
    DeleteEdrivingComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbModalModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgBrazil,
    TextMaskModule,
    CustomFormsModule,
  ],
  exports: [
    EdrivingComponent
  ]
})
export class EdrivingModule { }
