import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchResultPageRoutingModule } from './search-result-routing.module';

import { SearchResultPage } from './search-result.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { StockperPipe } from 'src/app/core/general/pipes/stockper.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultPageRoutingModule,
    SharedModule,
  ],
  declarations: [SearchResultPage, StockperPipe],
})
export class SearchResultPageModule {}
