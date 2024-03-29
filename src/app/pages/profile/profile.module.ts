import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseAlertModule} from '@fuse/components/alert';
import {FuseAutogrowModule} from '@fuse/directives/autogrow';
import {SharedModule} from 'app/shared/shared.module';
import {EdrivingComponent} from './edriving/edriving.component';
import {ProfileComponent} from './profile.component';
import {perfilRoutes} from './profile.routing';
import {ChangePasswordComponent} from './changePassword/changePassword.component';
import {AddressComponent} from './address/address.component';
import {CustomMaterialModule} from '../../shared/material.module';
import {TextMaskModule} from 'angular2-text-mask';
import { PartnnerComponent } from './partnner/partnner.component';


@NgModule({
    declarations: [
        EdrivingComponent,
        PartnnerComponent,
        ChangePasswordComponent,
        AddressComponent,
        PartnnerComponent,
        ProfileComponent
    ],
    imports: [
        RouterModule.forChild(perfilRoutes),
        SharedModule,
        CustomMaterialModule,
        FuseAlertModule,
        FuseAutogrowModule,
        TextMaskModule,
    ]
})
export class ProfileModule {
}
