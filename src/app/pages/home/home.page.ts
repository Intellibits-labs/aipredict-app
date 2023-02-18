import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
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
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Subject } from 'rxjs';

interface EventObject {
  event: string;
  value: {
    limit: number;
    page: number;
    key: string;
    order: string;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('template', { static: true }) phoneTpl: TemplateRef<any>;
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
  columnMode = ColumnMode;
  sortType = SortType;
  loading = false;
  sorts = [
    {
      prop: 'createdAt',
      dir: 'desc',
    },
  ];
  collection: any = [];
  config: PaginationInstance = {
    id: 'some_id',
    itemsPerPage: 9,
    currentPage: 1,
  };

  public rows: any[];
  public selected: any = [];
  // public columns: any = [
  //   { name: 'Image', prop: 'user.picture' },
  //   { name: 'User Name', prop: 'user.name' },
  //   { name: 'Stock', prop: 'stock.name' },
  //   { name: 'Created At', prop: 'createdAt' },
  //   { name: 'Trade Date', prop: 'tradeDate' },
  //   { name: 'Expected ROI', prop: 'status' },
  //   { name: 'Actual ROI', prop: 'status' },
  //   { name: 'Buy Price', prop: 'buyPrice' },
  //   { name: 'Sell Price', prop: 'sellPrice' },
  //   { name: 'Stop Loss', prop: 'stopLoss' },
  //   { name: 'Status', prop: 'status' },
  // ];
  public count = 100;
  public pageSize = 3;
  public limit = 10;
  public offset = 0;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public data: any = [];
  public configuration: Config;
  public columns: Columns[] = [];
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private navCtrl: NavController,
    private authService: AuthService,
    private cookieService: CookieService,
    private readonly _authService: SocialAuthService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.loginCard = this.authService.isLogged();
  }

  ngOnInit() {
    this.columns = [
      {
        title: 'Image',
        key: 'user.picture',
        cellTemplate: this.phoneTpl,
        orderEnabled: false,
      },
      { title: 'Predictor Name', key: 'user.name' },
      { title: 'Stock', key: 'stock.name' },
      { title: 'Created At', key: 'createdAt', cellTemplate: this.phoneTpl },
      { title: 'Trade Date', key: 'tradeDate', cellTemplate: this.phoneTpl },
      { title: 'Expected ROI', key: 'ROI', cellTemplate: this.phoneTpl },
      { title: 'Actual ROI', key: 'ROI', cellTemplate: this.phoneTpl },
      { title: 'Buy Price', key: 'buyPrice', cellTemplate: this.phoneTpl },
      {
        title: 'Sell Price',
        key: 'sellPrice',
        cellTemplate: this.phoneTpl,
        orderEnabled: false,
      },
      {
        title: 'Stop Loss',
        key: 'stopLoss',
        cellTemplate: this.phoneTpl,
        orderEnabled: false,
      },
      {
        title: 'Status',
        key: 'status',
        cellTemplate: this.phoneTpl,
      },
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.serverPagination = true;
    this.configuration.threeWaySort = true;
    this.configuration.horizontalScroll = true;
    this.configuration.clickEvent = true;
    // this.getStock();
    this.getPredictors();
    this.getPredictions('');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
  getPredictions(params: string) {
    // let sortByVar;
    // if (this.sortBy == 'recently') {
    //   sortByVar = 'createdAt:desc';
    // } else if (this.sortBy == 'oldest') {
    //   sortByVar = 'createdAt:asc';
    // }
    let numofObj = Object.keys(this.filterData).length;
    this.dataService
      .getMethod(
        HttpApi.getPrediction +
          params +
          (numofObj > 0 ? this.serialize(this.filterData) : '')
      )
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.predictionArray = res.results;
          // this.page = res.page;
          // this.config.totalItems = res.totalResults;
          // this.pageSize = res.totalPages;
          // this.limit = res.limit;
          // this.offset = res.page - 1;
          // this.count = res.totalResults;
          // this.rows = res.results;

          this.data = res.results;
          this.pagination.count = res.totalResults;
          this.pagination.limit = res.limit;
          this.pagination.offset = res.page;
          this.pagination = { ...this.pagination };
          this.cdr.markForCheck();
          // this.pagination.order = ;
          // this.pagination.sort = ;
        },
        error: (e) => console.error(e),
      });
  }

  setPage(event: any) {
    const page = JSON.stringify(event.offset + 1);

    this.getPredictions(page);
  }
  eventEmitted(event: { event: string; value: any }): void {
    if (event.event !== 'onClick') {
      this.parseEvent(event);
    }
  }
  private parseEvent(obj: EventObject): void {
    this.pagination.limit = obj.value.limit
      ? obj.value.limit
      : this.pagination.limit;
    this.pagination.offset = obj.value.page
      ? obj.value.page
      : this.pagination.offset;
    this.pagination.sort = !!obj.value.key
      ? obj.value.key
      : this.pagination.sort;
    this.pagination.order = !!obj.value.order
      ? obj.value.order
      : this.pagination.order;
    this.pagination = { ...this.pagination };

    const pagination = `?limit=${this.pagination.limit}&page=${this.pagination.offset}`;
    const sort = `&sortBy=${this.pagination.sort}:${this.pagination.order}`;
    this.getPredictions(pagination + sort);
  }

  onSort(ev: any) {
    setTimeout(() => {
      const rows = [...this.rows];

      const sort = ev.sorts[0];
      console.log(sort);

      // rows.sort((a, b) => {
      //   return (
      //     a[sort.prop].localeCompare(b[sort.prop]) *
      //     (sort.dir === 'desc' ? -1 : 1)
      //   );
      // });

      this.rows = rows;
      this.loading = false;
    }, 1000);
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
