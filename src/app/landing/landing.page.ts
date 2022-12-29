import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {}

  goToApp() {
    this.navCtrl.navigateForward(['/splash']);
  }
  menuOpen() {
    this.menuCtrl.toggle();
  }
  scrollToTop() {
    this.content.scrollToTop(500);
  }
}
