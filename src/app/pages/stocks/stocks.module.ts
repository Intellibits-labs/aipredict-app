import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StocksPageRoutingModule } from './stocks-routing.module';

import { StocksPage } from './stocks.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StocksPageRoutingModule,
    SharedModule,
  ],
  declarations: [StocksPage],
})
export class StocksPageModule {}
