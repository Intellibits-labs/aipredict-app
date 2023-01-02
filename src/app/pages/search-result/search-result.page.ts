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
  stocksArray: any = [];
  usersArray: any = [];
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
      if (this.searchValue) {
        this.getSearch();
      }
    });
  }
  getSearch() {
    this.loader.presentLoading().then(() => {
      this.dataService
        .getMethod(HttpApi.getSearch + this.searchValue)
        .subscribe({
          next: (res) => {
            console.log('🚀 ~ 55 ~ SearchResultPage ~ ~ res', res);
            res.stocks.results.map((x: any) => {
              if (
                x?.['meta']?.['Global Quote']?.['10. change percent'].includes(
                  '-'
                )
              ) {
                x.flag = true;
              } else {
                x.flag = false;
              }
              this.stocksArray.push(x);
            });
            this.usersArray = res.users.results;
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
    if (this.searchValue) {
      this.stocksArray = [];
      this.getSearch();
    }
  }
  searchClick() {
    if (this.searchValue) {
      this.stocksArray = [];
      this.getSearch();
    }
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
  userClick(item: any) {}
}
