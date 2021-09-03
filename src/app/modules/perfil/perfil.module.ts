import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FuseAlertModule} from '@fuse/components/alert';
import {FuseAutogrowModule} from '@fuse/directives/autogrow';
import {SharedModule} from 'app/shared/shared.module';
import {EdrivingComponent} from './edriving/edriving.component';
import {PerfilComponent} from './perfil.component';
import {perfilRoutes} from './perfil.routing';
import {AlteraSenhaComponent} from './altera-senha/altera-senha.component';
import {EnderecoComponent} from './endereco/endereco.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';


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
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSidenavModule,
        FuseAlertModule,
        FuseAutogrowModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
    ]
})
export class PerfilModule {
}
