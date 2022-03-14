import {NgModule} from '@angular/core';
import {EdrivingComponent} from './edriving/edriving.component';
import {RouterModule} from '@angular/router';
import {usersRouting} from './usersRouting';
import {SharedModule} from '../../../shared/shared.module';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {EdrivingFormModalComponent} from './edriving/edriving-form-modal/edriving-form-modal.component';
import {FuseAlertModule} from '../../../../@fuse/components/alert';
import { AlertModalComponent } from '../../../layout/common/alert/alert-modal.component';
import { PartnnerComponent } from './partnner/partnner.component';
import { PartnnerFormModalComponent } from './partnner/partnner-form-modal/partnner-form-modal.component';
import {CustomMaterialModule} from '../../../shared/material.module';
import {TextMaskModule} from 'angular2-text-mask';
import { DrivingSchoolComponent } from './drivingSchool/drivingSchool.component';
import { DrivingSchoolFormComponent } from './drivingSchool/drivingSchool-form/drivingSchool-form.component';
import { AdministrativeComponent } from './administrative/administrative.component';
import { AdministrativeFormComponent } from './administrative/administrative-form/administrative-form.component';


@NgModule({
    declarations: [
        EdrivingComponent,
        EdrivingFormModalComponent,
        AlertModalComponent,
        PartnnerComponent,
        PartnnerFormModalComponent,
        DrivingSchoolComponent,
        DrivingSchoolFormComponent,
        AdministrativeComponent,
        AdministrativeFormComponent
    ],
    exports: [
        PartnnerComponent
    ],
    imports: [
        RouterModule.forChild(usersRouting),
        CustomMaterialModule,
        SharedModule,
        FuseCardModule,
        FuseAlertModule,
        TextMaskModule,
    ]
})
export class UsersModule {
}
