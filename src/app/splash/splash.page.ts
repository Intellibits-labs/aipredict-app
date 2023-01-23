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
      this.navCtrl.navigateRoot('/pages');
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
