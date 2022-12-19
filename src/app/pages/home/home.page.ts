import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { CommunityModalComponent } from 'src/app/shared/community-modal/community-modal.component';
import { StockModalComponent } from 'src/app/shared/stock-modal/stock-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  assetsSlideOpts = {
    initialSlide: 3,
    speed: 400,
    // slidesPerView: 3,
    direction: 'horizontal',
    fill: 'column',
    spaceBetween: 15,
    effect: 'cards',
    breakpoints: {
      576: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      769: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  };
  trendingAssets: any = [];
  predictorArray: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getStock();
    this.getPredictors();
  }

  getStock() {
    this.dataService.getMethod(HttpApi.getStocks).subscribe({
      next: (res) => {
        console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
        this.trendingAssets = res.results;
      },
      error: (e) => console.error(e),
    });
  }
  getPredictors() {
    this.dataService.getMethod(HttpApi.userPredictors).subscribe({
      next: (res) => {
        console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
        this.predictorArray = res.results;
      },
      error: (e) => console.error(e),
    });
  }
  async communityClick(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: CommunityModalComponent,
      mode: 'md',
      componentProps: { predictor: item },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }

  async stockModal(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: StockModalComponent,
      mode: 'md',
      componentProps: { stockDetail: item },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }
}
