import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  public isShown: boolean = true;
  public showButton = false;
  public contentData = [];
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

  logScrolling(event: any) {
    if (event.detail.deltaY > 0) {
      this.isShown = true;
    } else {
      this.isShown = false;
    }
  }
}
