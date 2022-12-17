import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { AuthService } from 'src/app/core/general/service/auth.service';
import { CookieService } from 'src/app/core/general/service/cookie.service';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userData: any;

  appArray: any = [
    {
      title: 'Home',
      url: '/pages/home',
    },
    {
      title: 'Predictions',
      url: '/pages/prediction',
    },
  ];
  urlChanges: any;
  isMenu: boolean = false;
  constructor(
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private dataService: DataService,
    private authService: AuthService,
    private cookieService: CookieService,
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private readonly _authService: SocialAuthService
  ) {
    this.authService.getUser().subscribe({
      next: (res) => {
        this.userData = res;
        console.log(
          '🚀 ~ file: header.component.ts:48 ~  ~ userData',
          this.userData
        );
        if (!this.userData) {
          this.cookieService.deleteCookie('idToken');
          this._authService.authState.subscribe((user: any) => {
            this.userData = user;
            console.log('🚀 ~ 37 ~ LoginModalComponent  ~ user', user);
            if (user) {
              this.cookieService.setCookie({
                name: 'idToken',
                value: user.idToken,
              });
              localStorage.setItem('googleUser', JSON.stringify(user));
              this.dataService
                .postMethod(HttpApi.googleLogin, { idToken: user.idToken })
                .subscribe({
                  next: (res) => {
                    console.log(res);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    localStorage.setItem('session', JSON.stringify(res.tokens));
                    this.authService.setUser(res.user);
                  },
                  error: (e) => console.log(e.message),
                  complete: () => console.log('complete'),
                });
              // this.modalController.dismiss();
            }
          });
        }
      },
    });
  }

  ngOnInit() {
    // this.getUserData();
  }
  // toggleMenu() {
  //   this.menuCtrl.toggle();
  // }
  pageClick(item: any) {
    this.urlChanges = item.url;
    console.log(this.urlChanges);

    this.navCtrl.navigateRoot([item.url]);
  }
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

  getUserData() {
    this.dataService.getMethod(HttpApi.me).subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  async logout(ev: any) {
    // this.authService.logoutUser();
    const popover = await this.popoverController.create({
      component: LogoutModalComponent,
      cssClass: 'my-custom-class',
      componentProps: { userData: this.userData },
      translucent: true,
      event: ev,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    if (role == 'success') {
      this.authService.logoutUser();
    }
    console.log('onDidDismiss resolved with role', role);
  }
  menuOpen() {
    this.menuCtrl.toggle();
  }
  menuClose() {
    this.isMenu = false;
  }
}
