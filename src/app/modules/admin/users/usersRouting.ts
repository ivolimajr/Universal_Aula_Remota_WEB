import {Route} from '@angular/router';
import {EdrivingComponent} from './edriving/edriving.component';
import {ParceiroComponent} from './parceiro/parceiro.component';
import {ParceiroGuard, PlataformaGuard} from '../../../shared/services/guards/user.guard';


export const usersRouting: Route[] = [
    {
        path: 'edriving',
        canActivate: [PlataformaGuard],
        component: EdrivingComponent
    },
    {
        path: 'parceiro',
        canActivate: [ParceiroGuard],
        component: ParceiroComponent
    }
];
