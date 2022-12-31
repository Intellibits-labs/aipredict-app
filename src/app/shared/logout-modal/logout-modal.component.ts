import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/core/general/service/auth.service';

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
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    console.log(this.userData);
  }
  logout() {
    this.popoverController.dismiss({}, 'success');
    this.navCtrl.navigateRoot(['splash']);
  }
}
