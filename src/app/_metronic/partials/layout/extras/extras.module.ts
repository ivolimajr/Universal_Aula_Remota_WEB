import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserDropdownInnerComponent } from './dropdown-inner/user-dropdown-inner/user-dropdown-inner.component';
import { CoreModule } from '../../../core';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    UserDropdownInnerComponent,
  ],
  imports: [CommonModule, InlineSVGModule, PerfectScrollbarModule, CoreModule, RouterModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: [
    UserDropdownInnerComponent,
  ],
})
export class ExtrasModule { }
