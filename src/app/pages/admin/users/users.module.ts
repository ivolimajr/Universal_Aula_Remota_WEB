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
import {TextMaskModule} from 'angular2-text-mask';
import { AutoescolaComponent } from './autoescola/autoescola.component';
import { AutoescolaFormModalComponent } from './autoescola/autoescola-form-modal/autoescola-form-modal.component';


@NgModule({
    declarations: [
        EdrivingComponent,
        EdrivingFormModalComponent,
        AlertModalComponent,
        ParceiroComponent,
        ParceiroFormModalComponent,
        AutoescolaComponent,
        AutoescolaFormModalComponent
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
