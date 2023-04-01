import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('template', { static: true }) phoneTpl: TemplateRef<any>;
  @ViewChild('preTemplate', { static: true }) preTpl: TemplateRef<any>;
  filterData: any = {};
  sortBy = 'recently';

  predictorArray: any = [];
  predictionArray: any = [];
  userData: any;
  loginCard: boolean = false;
  page: number = 0;

  loading = false;
  sorts = [
    {
      prop: 'createdAt',
      dir: 'desc',
    },
  ];

  // private ngUnsubscribe: Subject<void> = new Subject<void>();
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

  public preConfiguration: Config;
  public predictorColumns: Columns[] = [];
  public prePagination = {
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
    private readonly cdr: ChangeDetectorRef,
    private readonly perCdr: ChangeDetectorRef
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
      {
        title: 'Expected ROI',
        key: 'expectedROI',
        cellTemplate: this.phoneTpl,
      },
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

    this.predictorColumns = [
      {
        title: 'No',
        key: '',
        cellTemplate: this.preTpl,
        orderEnabled: false,
      },
      {
        title: 'Image',
        key: 'picture',
        cellTemplate: this.preTpl,
        orderEnabled: false,
      },
      { title: 'Predictor Name', key: 'name' },
      { title: 'Average Annual ROI', key: 'annualROI' },
      { title: 'Created At', key: 'createdAt', cellTemplate: this.preTpl },
    ];
    this.preConfiguration = { ...DefaultConfig };
    this.preConfiguration.serverPagination = true;
    this.preConfiguration.clickEvent = true;

    this.getPredictors();
    this.getPredictions('');
  }
  ngOnDestroy(): void {
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }
  ionViewDidEnter() {
    this.getUserData();
  }

  getPredictors(params: string = '') {
    // sortBy=annualROI:desc
    this.dataService
      .getMethod(HttpApi.userPredictors + '?' + params)
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.predictorArray = res.results;
          this.prePagination.count = res.totalResults;
          this.prePagination.limit = res.limit;
          this.prePagination.offset = res.page;
          this.prePagination = { ...this.prePagination };
          console.log('prePagination ', this.prePagination);

          this.perCdr.markForCheck();
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
    console.log(
      '🚀 ~ file: home.page.ts:225 ~ HomePage ~ getPredictions ~ params:',
      params
    );
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
          '?' +
          params +
          (numofObj > 0 ? '&' + this.serialize(this.filterData) : '')
      )
      .subscribe({
        next: (res) => {
          console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
          this.predictionArray = res.results;
          this.data = res.results;
          this.pagination.count = res.totalResults;
          this.pagination.limit = res.limit;
          this.pagination.offset = res.page;
          this.pagination = { ...this.pagination };
          this.cdr.markForCheck();
        },
        error: (e) => console.error(e),
      });
  }

  eventEmitted(event: { event: string; value: any }): void {
    console.log('event ', event);

    if (event.event !== 'onClick') {
      this.preParseEvent(event);
    } else if (event.event === 'onClick') {
      // this.latestModal(event.value.row);
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

    const pagination = `limit=${this.pagination.limit}&page=${this.pagination.offset}`;
    const sort = `&sortBy=${this.pagination.sort}:${this.pagination.order}`;
    this.getPredictions(pagination + sort);
  }
  predictorEmitted(event: { event: string; value: any }): void {
    console.log(event);
    if (event.event !== 'onClick') {
      this.preParseEvent(event);
    } else if (event.event === 'onClick') {
      this.communityClick(event.value.row);
    }
  }
  private preParseEvent(obj: EventObject): void {
    this.prePagination.limit = obj.value.limit
      ? obj.value.limit
      : this.prePagination.limit;
    this.prePagination.offset = obj.value.page
      ? obj.value.page
      : this.prePagination.offset;
    this.prePagination.sort = !!obj.value.key
      ? obj.value.key
      : this.prePagination.sort;
    this.prePagination.order = !!obj.value.order
      ? obj.value.order
      : this.prePagination.order;
    this.prePagination = { ...this.prePagination };

    const pagination = `limit=${this.prePagination.limit}&page=${this.prePagination.offset}`;
    const sort = `&sortBy=${this.prePagination.sort}:${this.prePagination.order}`;
    this.getPredictors(pagination + sort);
  }
  async communityClick(item: any) {
    console.log(item);

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
        this.getPredictions('');
      }
    });
    await modal.present();
  }
}
