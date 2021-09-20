import {Route} from '@angular/router';
import {EdrivingComponent} from './edriving/edriving.component';
import {ParceiroComponent} from './parceiro/parceiro.component';
import {ParceiroGuard, PlataformaGuard} from '../../../shared/services/guards/user.guard';
import {AutoescolaComponent} from './autoescola/autoescola.component';
import {AutoescolaFormComponent} from './autoescola/autoescola-form/autoescola-form.component';


export const usersRouting: Route[] = [
    {
        path: 'edriving',
        canActivate: [PlataformaGuard],
        component: EdrivingComponent
    },
    {
        path: 'parceiro',
        canActivate: [PlataformaGuard],
        component: ParceiroComponent
    },
    {
        path: 'auto-escola',
        canActivate: [ParceiroGuard],
        component: AutoescolaComponent
    },
    {
        path: 'auto-escola/inserir',
        canActivate: [ParceiroGuard],
        component: AutoescolaFormComponent
    },
    {
        path: 'auto-escola/:id',
        canActivate: [ParceiroGuard],
        component: AutoescolaFormComponent
    }
];
