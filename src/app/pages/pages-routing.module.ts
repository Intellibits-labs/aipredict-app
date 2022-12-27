import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'prediction',
        loadChildren: () =>
          import('./prediction/prediction.module').then(
            (m) => m.PredictionPageModule
          ),
      },
      {
        path: 'search-result',
        loadChildren: () =>
          import('./search-result/search-result.module').then(
            (m) => m.SearchResultPageModule
          ),
      },
      {
        path: 'search-result/:search',
        loadChildren: () =>
          import('./search-result/search-result.module').then(
            (m) => m.SearchResultPageModule
          ),
      },
      {
        path: 'stocks',
        loadChildren: () =>
          import('./stocks/stocks.module').then((m) => m.StocksPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
