import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  MenuController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { HttpApi } from '../core/general/http/http-api';
import { AuthService } from '../core/general/service/auth.service';
import { CookieService } from '../core/general/service/cookie.service';
import { DataService } from '../core/general/service/data.service';
import { LoginModalComponent } from '../shared/login-modal/login-modal.component';
import { LogoutModalComponent } from '../shared/logout-modal/logout-modal.component';
import { ProfileEditComponent } from '../shared/profile-edit/profile-edit.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  userData: any;
  constructor(
    private readonly _authService: SocialAuthService,
    private cookieService: CookieService,
    public modalController: ModalController,
    private dataService: DataService,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    if (this.authService.isLogged()) {
      console.log('true');

      this.getUserData();
    }
    this.authService.getUser().subscribe({
      next: (res) => {
        this.userData = res;
        console.log('🚀 ~:48 ~  ~ ~ userData', this.userData);
      },
    });
  }
  menuOpen() {
    this.menuCtrl.toggle();
  }
  getUserData() {
    this.dataService.getMethod(HttpApi.me).subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res;
        console.log(this.userData.picture);
        this.authService.setUser(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  // async logout(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: LogoutModalComponent,
  //     cssClass: 'my-custom-class',
  //     componentProps: { userData: this.userData },
  //     translucent: true,
  //     event: ev,
  //   });
  //   await popover.present();
  //   const { role } = await popover.onDidDismiss();
  //   if (role == 'success') {
  //     this.authService.logoutUser();
  //   }
  //   console.log('onDidDismiss resolved with role', role);
  // }
  async loginClick() {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: LoginModalComponent,
      mode: 'md',
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }

  async profileModal() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
      component: ProfileEditComponent,
      cssClass: '',
      mode: 'md',
      componentProps: { userData: this.userData },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }
  logout() {
    this.authService.logoutUser();
  }
}
