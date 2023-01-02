import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { StockModalComponent } from 'src/app/shared/stock-modal/stock-modal.component';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.page.html',
  styleUrls: ['./stocks.page.scss'],
})
export class StocksPage implements OnInit {
  trendingAssets: any = [];
  page = 1;

  totalPages = 0;
  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getStock();
  }

  getStock(page = '1', ev: any = null) {
    this.dataService
      .getMethod(
        HttpApi.getStocks + '?sortBy=createdAt:desc&limit=15&page=' + page
      )
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.totalPages = res.totalPages;
          this.page = res.page;
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
          if (ev) {
            ev.target.complete();
            if (res.totalPages == res.page) {
              ev.target.disabled = true;
            }
          }
        },
        error: (e) => console.error(e),
      });
  }

  async stockModal(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'predictor_stock_modal',
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
  searchKey(ev: any) {
    console.log(ev.target.value);
    let searchV = ev.target.value;
    if (searchV) {
      this.navCtrl.navigateForward(['pages/search-result/' + searchV]);
    }
  }
  searchClick(value: any) {
    console.log(value);
    if (value) {
      this.navCtrl.navigateForward(['pages/search-result/' + value]);
    }
  }

  loadData(ev: any) {
    console.log(ev);
    this.page++;
    this.getStock(this.page.toString(), ev);
  }
  doRefresh(event: any) {
    this.trendingAssets = [];
    console.log('Begin async operation');
    this.getStock('1', event);
  }
}
