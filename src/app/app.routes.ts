import { Routes } from "@angular/router";
import { EdrivingComponent } from "./pages/register/edriving/edriving.component";

export const rootRouterConfig: Routes = [
     { path: '', redirectTo: '/home', pathMatch: 'full'},
     { path: 'eRegistro', component: EdrivingComponent},

];