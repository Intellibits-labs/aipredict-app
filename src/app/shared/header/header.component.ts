import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userData: any;
  constructor(
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getUserData();
  }
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
}
