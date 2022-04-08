import {Route} from '@angular/router';
import {AuthGuard} from 'app/shared/services/guards/auth.guard';
import {NoAuthGuard} from 'app/shared/services/guards/noAuth.guard';
import {LayoutComponent} from 'app/layout/layout.component';
import {InitialDataResolver} from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    {path: '', pathMatch: 'full', redirectTo: 'inicio'},
    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'inicio'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'forgot-password',
                loadChildren: () => import('app/pages/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/pages/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
            },
            {
                path: 'login',
                loadChildren: () => import('app/pages/auth/login/login.module').then(m => m.LoginModule)
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () => import('app/pages/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)
            },
            {
                path: 'unlock-session',
                loadChildren: () => import('app/pages/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)
            }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'enterprise',
            theme: 'amber'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'inicio', loadChildren: () => import('app/pages/admin/home/home.module').then(m => m.HomeModule)},
            {path: 'perfil', loadChildren: () => import('app/pages/profile/profile.module').then(m => m.ProfileModule)},
            {
                path: 'usuario',
                loadChildren: () => import('app/pages/admin/users/users.module').then(m => m.UsersModule)
            },
        ]
    },
];
