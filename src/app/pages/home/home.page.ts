import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommunityModalComponent } from 'src/app/shared/community-modal/community-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  AssetsSlideOpts = {
    initialSlide: 3,
    speed: 400,
    slidesPerView: 3,
    direction: 'horizontal',
    fill: 'column',
    spaceBetween: 15,
    effect: 'cards',
  };

  CommunitiesSlideOpts = {
    initialSlide: 5,
    speed: 400,
    slidesPerView: 5,
    direction: 'horizontal',
    fill: 'column',
    spaceBetween: 20,
    effect: 'cards',
  };
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async communityClick(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: CommunityModalComponent,
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
