import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { GeneralModule } from 'src/app/core/general/general.module';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { CommunityModalComponent } from '../community-modal/community-modal.component';
// import { GoogleSigninButtonDirective } from 'src/app/core/directives/google-signin-button.directive';

const component = [HeaderComponent, FooterComponent, CommunityModalComponent];

@NgModule({
  declarations: [...component],
  imports: [CommonModule, IonicModule, GeneralModule],
  exports: [...component],
  providers: [GoogleSigninButtonDirective],
})
export class SharedModule {}
