import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './containers/landing/landing.component';

const routes: Routes = [
  { path: '', redirectTo: '/drone-simulator', pathMatch: 'full' },
  { path: 'drone-simulator', component: LandingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
