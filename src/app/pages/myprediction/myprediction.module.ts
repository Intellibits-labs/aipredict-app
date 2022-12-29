import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypredictionPageRoutingModule } from './myprediction-routing.module';

import { MypredictionPage } from './myprediction.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypredictionPageRoutingModule,
    SharedModule,
  ],
  declarations: [MypredictionPage],
})
export class MypredictionPageModule {}
