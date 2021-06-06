import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CfcComponent } from './manegement/cfc/cfc.component';
import { EdrivingComponent } from './manegement/edriving/edriving.component';
import { PartnerComponent } from './manegement/partner/partner.component';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: HomeComponent
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'edriving',
        component: EdrivingComponent
      },
      {
        path: 'partner',
        component: PartnerComponent
      },
      {
        path: 'cfc',
        component: CfcComponent
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
      {
        path: '',
        redirectTo: '/logout',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
