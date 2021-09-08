import {NgModule} from '@angular/core';
import {EdrivingComponent} from './edriving/edriving.component';
import {RouterModule} from '@angular/router';
import {usersRouting} from './usersRouting';
import {SharedModule} from '../../../shared/shared.module';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {EdrivingFormModalComponent} from './edriving/edriving-form-modal/edriving-form-modal.component';
import {FuseAlertModule} from '../../../../@fuse/components/alert';
import { AlertModalComponent } from '../../../layout/common/alert/alert-modal.component';
import { ParceiroComponent } from './parceiro/parceiro.component';
import { ParceiroFormModalComponent } from './parceiro/parceiro-form-modal/parceiro-form-modal.component';
import {CustomMaterialModule} from '../../../shared/material.module';


@NgModule({
    declarations: [
        EdrivingComponent,
        EdrivingFormModalComponent,
        AlertModalComponent,
        ParceiroComponent,
        ParceiroFormModalComponent
    ],
    imports: [
        RouterModule.forChild(usersRouting),
        CustomMaterialModule,
        SharedModule,
        FuseCardModule,
        FuseAlertModule,
    ]
})
export class UsersModule {
}
