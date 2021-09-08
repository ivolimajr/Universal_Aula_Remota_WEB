import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseAlertModule} from '@fuse/components/alert';
import {FuseAutogrowModule} from '@fuse/directives/autogrow';
import {SharedModule} from 'app/shared/shared.module';
import {EdrivingComponent} from './edriving/edriving.component';
import {PerfilComponent} from './perfil.component';
import {perfilRoutes} from './perfil.routing';
import {AlteraSenhaComponent} from './altera-senha/altera-senha.component';
import {EnderecoComponent} from './endereco/endereco.component';
import {CustomMaterialModule} from '../../shared/material.module';
import {TextMaskModule} from 'angular2-text-mask';


@NgModule({
    declarations: [
        EdrivingComponent,
        PerfilComponent,
        AlteraSenhaComponent,
        EnderecoComponent
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
export class PerfilModule {
}
