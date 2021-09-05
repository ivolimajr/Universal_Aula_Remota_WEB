import {EdrivingComponent} from './edriving/edriving.component';
import {Route} from '@angular/router';
import {ParceiroComponent} from './parceiro/parceiro.component';


export const usersRouting: Route[] = [
    {
        path: 'edriving',
        component: EdrivingComponent
    },
    {
        path: 'parceiro',
        component: ParceiroComponent
    }
];
