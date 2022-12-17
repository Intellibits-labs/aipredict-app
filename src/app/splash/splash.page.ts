import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginModalComponent } from '../shared/login-modal/login-modal.component';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    setTimeout(() => {
      let gUser: any = localStorage.getItem('user');
      let tokenExpires = JSON.parse(gUser);
      if (tokenExpires?.refresh?.expires) {
        let expiredate = new Date(tokenExpires?.refresh?.expires);
        console.log(
          '🚀 ~ file: splash.page.ts ~ line 20 ~ SplashPage ~ setTimeout ~ expiredate',
          expiredate
        );
        let now = new Date();

        if (expiredate > now) {
          this.navCtrl.navigateRoot('/pages');
        } else {
          // localStorage.clear();
          this.navCtrl.navigateRoot('/pages');
          // this.loginClick();
        }
      } else {
        localStorage.clear();
        this.navCtrl.navigateRoot('/pages');
        // this.loginClick();
      }
    }, 2000);
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
}
