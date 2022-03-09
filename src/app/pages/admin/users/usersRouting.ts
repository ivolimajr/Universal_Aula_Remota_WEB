import {Route} from '@angular/router';
import {EdrivingComponent} from './edriving/edriving.component';
import {PartnnerComponent} from './partnner/partnner.component';
import {DrivingSchoolComponent} from './drivingSchool/drivingSchool.component';
import {DrivingSchoolFormComponent} from './drivingSchool/drivingSchool-form/drivingSchool-form.component';
import {AdministrativeComponent} from './administrative/administrative.component';
import {EdrivingGuard} from '../../../shared/services/guards/edriving.guard';
import { PartnnerGuard } from 'app/shared/services/guards/partnner.guard';
import {DrivingSchoolGuard} from '../../../shared/services/guards/drivingSchool.guard';


export const usersRouting: Route[] = [
    {
        path: 'edriving',
        canActivate: [EdrivingGuard],
        component: EdrivingComponent
    },
    {
        path: 'parceiro',
        canActivate: [EdrivingGuard],
        component: PartnnerComponent
    },
    {
        path: 'auto-escola',
        canActivate: [PartnnerGuard],
        component: DrivingSchoolComponent
    },
    {
        path: 'auto-escola/inserir',
        canActivate: [PartnnerGuard],
        component: DrivingSchoolFormComponent
    },
    {
        path: 'auto-escola/:id',
        canActivate: [PartnnerGuard],
        component: DrivingSchoolFormComponent
    },
    {
        path: 'administrativo',
        canActivate: [DrivingSchoolGuard],
        component: AdministrativeComponent
    }
];
