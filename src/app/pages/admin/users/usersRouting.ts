import {Route} from '@angular/router';
import {EdrivingComponent} from './edriving/edriving.component';
import {PartnnerComponent} from './partnner/partnner.component';
import {ParceiroGuard, PlataformaGuard} from '../../../shared/services/guards/user.guard';
import {DrivingSchoolComponent} from './drivingSchool/drivingSchool.component';
import {DrivingSchoolFormComponent} from './drivingSchool/drivingSchool-form/drivingSchool-form.component';


export const usersRouting: Route[] = [
    {
        path: 'edriving',
        canActivate: [PlataformaGuard],
        component: EdrivingComponent
    },
    {
        path: 'parceiro',
        canActivate: [PlataformaGuard],
        component: PartnnerComponent
    },
    {
        path: 'auto-escola',
        canActivate: [ParceiroGuard],
        component: DrivingSchoolComponent
    },
    {
        path: 'auto-escola/inserir',
        canActivate: [ParceiroGuard],
        component: DrivingSchoolFormComponent
    },
    {
        path: 'auto-escola/:id',
        canActivate: [ParceiroGuard],
        component: DrivingSchoolFormComponent
    }
];
