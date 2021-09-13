import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {CustomMaterialModule} from '../../../shared/material.module';

const exampleRoutes: Route[] = [
    {
        path: '',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        RouterModule.forChild(exampleRoutes),
        CustomMaterialModule
    ]
})
export class HomeModule {
}
