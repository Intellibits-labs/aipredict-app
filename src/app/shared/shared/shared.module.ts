import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { GeneralModule } from 'src/app/core/general/general.module';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { RouterModule } from '@angular/router';
import { AddPredictModalComponent } from '../add-predict-modal/add-predict-modal.component';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { PredictActionModalComponent } from '../predict-action-modal/predict-action-modal.component';
import { StockModalComponent } from '../stock-modal/stock-modal.component';
import { StockCardComponent } from '../stock-card/stock-card.component';
import { LatestModalComponent } from '../latest-modal/latest-modal.component';
import { PredictorModalComponent } from '../predictor-modal/predictor-modal.component';
import { LatestCardComponent } from '../latest-card/latest-card.component';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

// import { GoogleSigninButtonDirective } from 'src/app/core/directives/google-signin-button.directive';

const components = [
  HeaderComponent,
  FooterComponent,
  LogoutModalComponent,
  AddPredictModalComponent,
  ImageUploaderComponent,
  PredictActionModalComponent,
  StockModalComponent,
  StockCardComponent,
  LatestModalComponent,
  PredictorModalComponent,
  LatestCardComponent,
  ProfileEditComponent,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, IonicModule, RouterModule, GeneralModule],
  exports: [...components],
  providers: [GoogleSigninButtonDirective],
})
export class SharedModule {}
