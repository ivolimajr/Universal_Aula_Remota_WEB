import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgPagination, NgPaginationNext, NgPaginationNumber } from '../_metronic/shared/crud-table/components/paginator/ng-pagination/ng-pagination.component';
import { CursosComponent } from './cursos/cursos.component';
import { HomeComponent } from './home/home.component';
import { AdministrativeComponent } from './manegement/administrative/administrative.component';
import { AccountComponentAdministrative } from './manegement/administrative/components/account/account.component';
import { CfcComponent } from './manegement/cfc/cfc.component';
import { AccountComponentEdriving } from './manegement/edriving/components/account/account.component';
import { EdrivingComponent } from './manegement/edriving/edriving.component';
import { AccountComponentInstructor } from './manegement/instructor/components/account/account.component';
import { InstructorComponent } from './manegement/instructor/instructor.component';
import { AccountComponentPartner } from './manegement/partner/components/account/account.component';
import { PartnerComponent } from './manegement/partner/partner.component';
import { AccountComponentStudent } from './manegement/student/components/account/account.component';
import { StudentComponent } from './manegement/student/student.component';
import { TurmasComponent } from './turmas/turmas.component';
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
        path:'pages',
        component:EdrivingComponent
      },
      {
        
        path: 'edriving',
        component: EdrivingComponent
      },
      {
        path: 'cursos',
        component: CursosComponent
      },
      {        
        path: 'turmas',
        component: TurmasComponent
      },
      {
        path: 'edriving/account',
        component: AccountComponentEdriving
      },
      {
        path: 'partner',
        component: PartnerComponent
      },
      {
        path: 'partner/account',
        component: AccountComponentPartner
      },
      {
        path: 'cfc',
        component: CfcComponent
      },
      {
        path: 'cfc/account',
        component: AccountComponentStudent
      },
      {
        path: 'cfc/administrative',
        component: AdministrativeComponent
      },
      {
        path: 'cfc/administrative/account',
        component: AccountComponentAdministrative
      },
      {
        path: 'cfc/instructor',
        component: InstructorComponent
      },
      {
        path: 'cfc/instructor/account',
        component: AccountComponentInstructor
      },
      {
        path: 'cfc/student',
        component: StudentComponent
      },
      {
        path: 'cfc/student/account',
        component: AccountComponentStudent
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
