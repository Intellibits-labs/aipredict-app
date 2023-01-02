import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { AuthService } from 'src/app/core/general/service/auth.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent implements OnInit {
  @Input() userData: any;
  constructor(
    private authService: AuthService,
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    console.log(this.userData);
  }
  logout() {
    this.popoverController.dismiss({}, 'success');
    this.navCtrl.navigateRoot(['splash']);
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
}
