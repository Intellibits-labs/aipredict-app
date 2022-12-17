import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredictionPage } from './prediction.page';

const routes: Routes = [
  {
    path: '',
    component: PredictionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictionPageRoutingModule {}
