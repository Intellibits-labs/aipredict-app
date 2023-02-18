import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesclaimerPage } from './desclaimer.page';

const routes: Routes = [
  {
    path: '',
    component: DesclaimerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesclaimerPageRoutingModule {}
