import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutComponent } from './_layout/layout.component';
import { ScriptsInitComponent } from './_layout/init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './_layout/components/header-mobile/header-mobile.component';
import { AsideComponent } from './_layout/components/aside/aside.component';
import { FooterComponent } from './_layout/components/footer/footer.component';
import { HeaderComponent } from './_layout/components/header/header.component';
import { HeaderMenuComponent } from './_layout/components/header/header-menu/header-menu.component';
import { TopbarComponent } from './_layout/components/topbar/topbar.component';
import { ExtrasModule } from '../_metronic/partials/layout/extras/extras.module';
import { CoreModule } from '../_metronic/core';
import { AsideDynamicComponent } from './_layout/components/aside-dynamic/aside-dynamic.component';
import { HeaderMenuDynamicComponent } from './_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import { HomeComponent } from './home/home.component';
import { EdrivingComponent } from './manegement/edriving/edriving.component';
import { PartnerComponent } from './manegement/partner/partner.component';
import { CfcComponent } from './manegement/cfc/cfc.component';
import { EditCustomerModalComponent } from './manegement/edriving/components/edit-customer-modal/edit-customer-modal.component';
import { EditPartnerModalComponent } from './manegement/partner/components/edit-partner-modal/edit-partner-modal.component';
import { EditCfcModalComponent } from './manegement/cfc/components/edit-cfc-modal/edit-cfc-modal-component';
import { StudentComponent } from './manegement/student/student.component';
import { InstructorComponent } from './manegement/instructor/instructor.component';
import { AdministrativeComponent } from './manegement/administrative/administrative.component';
import { EditStudentModalComponentComponent } from './manegement/student/components/edit-student-modal-component/edit-student-modal-component.component';
import { EditInstructorModalComponentComponent } from './manegement/instructor/components/edit-instructor-modal-component/edit-instructor-modal-component.component';
import { EditAdministrativeModalComponent,} from './manegement/administrative/components/edit-administrative-modal-component/edit-administrative-modal-component.component';
import { AccountComponentCfc } from './manegement/cfc/components/account/account.component';
import { AccountComponentAdministrative } from './manegement/administrative/components/account/account.component';
import { AccountComponentEdriving } from './manegement/edriving/components/account/account.component';
import { AccountComponentInstructor } from './manegement/instructor/components/account/account.component';
import { AccountComponentPartner } from './manegement/partner/components/account/account.component';
import { AccountComponentStudent } from './manegement/student/components/account/account.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
    HomeComponent,
    EdrivingComponent,
    PartnerComponent,
    CfcComponent,
    EditCustomerModalComponent,
    EditPartnerModalComponent,
    EditCfcModalComponent,
    StudentComponent,
    InstructorComponent,
    AdministrativeComponent,
    EditStudentModalComponentComponent,
    EditInstructorModalComponentComponent,
    EditAdministrativeModalComponent,
    AccountComponentCfc,
    AccountComponentAdministrative,
    AccountComponentEdriving,
    AccountComponentInstructor,
    AccountComponentPartner,
    AccountComponentStudent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    CoreModule,
    NgbModalModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
  ],
  providers: [NgbAlertConfig]
})
export class LayoutModule { }
