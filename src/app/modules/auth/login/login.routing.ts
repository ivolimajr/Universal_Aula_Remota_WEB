import {Route} from '@angular/router';
import {LoginComponent} from 'app/modules/auth/login/login.component';

export const loginRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent
    }
];
