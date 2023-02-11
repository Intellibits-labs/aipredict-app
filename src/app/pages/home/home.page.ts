import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PaginationInstance } from 'ngx-pagination';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { AuthService } from 'src/app/core/general/service/auth.service';
import { CookieService } from 'src/app/core/general/service/cookie.service';
import { DataService } from 'src/app/core/general/service/data.service';
import { ContactModalComponent } from 'src/app/shared/contact-modal/contact-modal.component';
import { FilterModalComponent } from 'src/app/shared/filter-modal/filter-modal.component';
import { LatestModalComponent } from 'src/app/shared/latest-modal/latest-modal.component';
import { LoginModalComponent } from 'src/app/shared/login-modal/login-modal.component';
import { PredictorModalComponent } from 'src/app/shared/predictor-modal/predictor-modal.component';
import { StockModalComponent } from 'src/app/shared/stock-modal/stock-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  filterData: any = {};
  sortBy = 'recently';
  assetsSlideOpts = {
    initialSlide: 3,
    speed: 400,
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
  predictionArray: any = [];
  userData: any;
  loginCard: boolean = false;
  page: number = 0;
  collection: any = [];
  config: PaginationInstance = {
    id: 'some_id',
    itemsPerPage: 9,
    currentPage: 1,
  };

  public rows: any[];
  public selected: any = [];
  public columns = [
    { name: 'Image', prop: 'user.picture' },
    { name: 'User Name', prop: 'user.name' },
    { name: 'Stock', prop: 'stock.name' },
    { name: 'Created At', prop: 'createdAt' },
    { name: 'Trade Date', prop: 'tradeDate' },
    { name: 'Expected ROI', prop: 'status' },
    { name: 'Actual ROI', prop: 'status' },
    { name: 'Buy Price', prop: 'buyPrice' },
    { name: 'Sell Price', prop: 'sellPrice' },
    { name: 'Stop Loss', prop: 'stopLoss' },
    { name: 'Status', prop: 'status' },
  ];
  public count = 100;
  public pageSize = 3;
  public limit = 10;
  public offset = 0;
  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private navCtrl: NavController,
    private authService: AuthService,
    private cookieService: CookieService,
    private readonly _authService: SocialAuthService
  ) {
    this.loginCard = this.authService.isLogged();
  }

  ngOnInit() {
    // this.getStock();
    this.getPredictors();
    this.getPredictions();
  }
  ionViewDidEnter() {
    this.getUserData();
  }
  getStock() {
    this.dataService
      .getMethod(HttpApi.getStocks + '?sortBy=createdAt:desc')
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
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
        },
        error: (e) => console.error(e),
      });
  }
  getPredictors() {
    this.dataService
      .getMethod(HttpApi.userPredictors + '?sortBy=annualROI:desc')
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.predictorArray = res.results;
          this.page = res.page - 1;
        },
        error: (e) => console.error(e),
      });
  }
  serialize = (obj: { [key: string]: any }): string =>
    Object.entries(obj)
      .filter(([key]) => obj.hasOwnProperty(key))
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  getPredictions(page = '1') {
    let sortByVar;
    if (this.sortBy == 'recently') {
      sortByVar = 'createdAt:desc';
    } else if (this.sortBy == 'oldest') {
      sortByVar = 'createdAt:asc';
    }
    let numofObj = Object.keys(this.filterData).length;
    this.dataService
      .getMethod(
        HttpApi.getPrediction +
          `?limit=9&sortBy=${sortByVar}&page=` +
          page +
          '&' +
          (numofObj > 0 ? this.serialize(this.filterData) : '')
      )
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.page = res.page;
          this.predictionArray = res.results;
          this.config.totalItems = res.totalResults;
          this.pageSize = res.totalPages;
          this.limit = res.limit;
          this.offset = res.page - 1;
          this.count = res.totalResults;
          this.rows = res.results;
        },
        error: (e) => console.error(e),
      });
  }

  setPage(event: any) {
    const page = JSON.stringify(event.offset + 1);

    this.getPredictions(page);
  }

  onSort(ev: any) {
    console.log(ev);
  }
  async communityClick(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'predictor_stock_modal',
      component: PredictorModalComponent,
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
  sortByChange() {
    this.getPredictions(this.page + '');
  }
  async latestModal(item: any) {
    const modal = await this.modalController.create({
      cssClass: '',
      component: LatestModalComponent,
      mode: 'md',
      componentProps: { latestItem: item },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }

  async loginClick() {
    const modal = await this.modalController.create({
      component: LoginModalComponent,
      cssClass: 'loginModal-class',
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
    this.authService.getUser().subscribe({
      next: (res) => {
        this.userData = res;
        console.log(
          '🚀 ~ file: header.component.ts:48 ~  ~ userData',
          this.userData
        );
        if (!this.userData) {
          this.cookieService.deleteCookie('idToken');
          this._authService.authState.subscribe((user: any) => {
            this.userData = user;
            console.log('🚀 ~ 37 ~ LoginModalComponent  ~ user', user);
            if (user) {
              this.cookieService.setCookie({
                name: 'idToken',
                value: user.idToken,
              });
              localStorage.setItem('googleUser', JSON.stringify(user));
              this.dataService
                .postMethod(HttpApi.googleLogin, { idToken: user.idToken })
                .subscribe({
                  next: (res) => {
                    console.log(res);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    localStorage.setItem('session', JSON.stringify(res.tokens));
                    this.authService.setUser(res.user);
                  },
                  error: (e) => console.log(e.message),
                  complete: () => console.log('complete'),
                });
              // this.modalController.dismiss();
            }
          });
        }
      },
    });
  }

  async contactClick() {
    const modal = await this.modalController.create({
      component: ContactModalComponent,
      cssClass: 'contactModal',
      mode: 'md',
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }

  pageChanged(ev: any) {
    console.log('ev', ev);
    this.config.currentPage = ev;
    this.getPredictions(ev);
  }

  async filterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: '',
      mode: 'md',
      componentProps: { filterData: this.filterData },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
        this.filterData = data.data;
        this.page = 1;
        this.getPredictions('1');
      }
    });
    await modal.present();
  }
}
