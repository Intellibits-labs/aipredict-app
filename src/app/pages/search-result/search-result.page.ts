import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoaderService } from 'src/app/core/general/service/loader.service';
import { StockModalComponent } from 'src/app/shared/stock-modal/stock-modal.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {
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
  searchValue: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private dataService: DataService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((x: any) => {
      this.searchValue = x.search;
      this.getSearch();
    });
  }
  getSearch() {
    this.loader.presentLoading().then(() => {
      this.dataService
        .getMethod(HttpApi.getSearch + this.searchValue)
        .subscribe({
          next: (res) => {
            console.log(
              '🚀 ~ file: search-result.page.ts:55 ~ SearchResultPage ~ this.dataService.getMethod ~ res',
              res
            );
            res.results.map((x: any) => {
              if (
                x?.['meta']?.['Global Quote']?.['10. change percent'].includes(
                  '-'
                )
              ) {
                x.flag = true;
              } else {
                x.flag = false;
              }
              this.trendingAssets.push(x);
            });
            this.loader.dismiss();
          },
          error: (e) => {
            console.error(e.message);
            this.loader.dismiss();
          },
        });
    });
  }
  searchKey(ev: any) {
    this.getSearch();
  }
  searchClick() {
    this.getSearch();
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
