import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private menuCtrl: MenuController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  // toggleMenu() {
  //   this.menuCtrl.toggle();
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
}
