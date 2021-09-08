import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseCardModule} from '@fuse/components/card';
import {FuseAlertModule} from '@fuse/components/alert';
import {SharedModule} from 'app/shared/shared.module';
import {LoginComponent} from 'app/modules/auth/login/login.component';
import {loginRoutes} from 'app/modules/auth/login/login.routing';
import {CustomMaterialModule} from '../../../shared/material.module';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(loginRoutes),
        FuseCardModule,
        FuseAlertModule,
        CustomMaterialModule,
        SharedModule
    ]
})
export class LoginModule {
}
