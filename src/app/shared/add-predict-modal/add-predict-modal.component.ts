import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  IonSearchbar,
  IonSlides,
  ModalController,
} from '@ionic/angular';
import * as moment from 'moment';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { CompareSellingPriceService } from 'src/app/core/general/service/compare-selling-price.service';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoaderService } from 'src/app/core/general/service/loader.service';
import { ToastService } from 'src/app/core/general/service/toast.service';

@Component({
  selector: 'app-add-predict-modal',
  templateUrl: './add-predict-modal.component.html',
  styleUrls: ['./add-predict-modal.component.scss'],
})
export class AddPredictModalComponent implements OnInit {
  @ViewChild('slider') slider!: IonSlides;
  @ViewChild('searchbar', { static: false, read: IonSearchbar })
  searchbar: IonSearchbar;

  @Input() isData: any;
  @Input() isEdit: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false,
    slidesPerView: 1,
    spaceBetween: 0,
  };
  predictForm!: FormGroup;
  imageUrl: any;
  imageData: any;

  slideIndex: number = 0;
  autoCompleteArray: any = [];
  getStockDetail: any;
  selectedName: any = {};
  symbolIcon: boolean = false;

  selectedType: any = 'INTRADAY';
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toast: ToastService,
    private loader: LoaderService,
    private comparePriceService: CompareSellingPriceService,
    private alertController: AlertController
  ) {
    this.predictForm = this.formBuilder.group({
      stock: ['', [Validators.required]],
      tradeDate: [
        '',
        [Validators.required, Validators.minLength(10), this.dateValidator],
      ],
      buyPrice: ['', [Validators.required]],
      sellPrice: [
        '',
        [Validators.required, this.comparePriceService.greaterThan('buyPrice')],
      ],
      stopLoss: ['', [Validators.required]],
      currentPrice: ['', [Validators.required]],
      type: ['INTRADAY', [Validators.required]],
      note: '',
    });
  }
  dateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const date = moment(control.value);
      const today = moment();
      if (date.isBefore(today)) {
        return { invalidDate: true };
      }
    }
    return null;
  }
  ngOnInit() {}
  ionViewDidEnter() {
    this.searchbar?.setFocus();
    if (this.isData && this.isEdit) {
      console.log(this.isData);
      let data = {
        stock: this.isData?.stock?.id,
        tradeDate: moment(this.isData?.tradeDate).format('DD-MMM-YYYY'),
        buyPrice: this.isData?.buyPrice,
        sellPrice: this.isData?.sellPrice,
        currentPrice: this.isData?.currentPrice,
        type: this.isData?.type,
        note: this.isData?.note,
      };
      this.selectStock(this.isData?.stock?.symbol);
      this.selectedName = this.isData?.stock?.name;
      this.predictForm.patchValue(data);
      this.slider.lockSwipes(false);
      this.slider.slideNext();
      this.slider.lockSwipes(true);

      console.log(this.predictForm.value);
    }
  }
  dismiss() {
    this.modalController.dismiss();
  }

  slideChange(ev: any) {
    this.slider.getActiveIndex().then((x) => {
      console.log(x);
      this.slideIndex = x;
    });
  }
  next() {
    this.slider.lockSwipes(false);
    this.slider.slideNext();
    this.slider.lockSwipes(true);
  }
  search(ev: any) {
    let searchValue = ev.target.value;
    if (searchValue) {
      this.loader.presentLoading().then(() => {
        this.dataService
          .getMethod(HttpApi.searchStock + searchValue)
          .subscribe({
            next: (res) => {
              console.log('🚀 46 ~ AddPredictModalComponent ~ ~ res', res);
              // this.autoCompleteArray = res?.bestMatches;
              res?.bestMatches.forEach((element: any) => {
                if (element['8. currency'] == 'INR') {
                  this.autoCompleteArray.push(element);
                }
              });
              this.loader.dismiss();
              console.log('INR ', this.autoCompleteArray);
            },
            error: (e) => {
              console.error(e);
              this.loader.dismiss();
            },
          });
      });
    }
  }
  selectStock(item: any) {
    console.log('first working');
    this.selectedName = item?.['2. name'];
    this.loader.presentLoading().then(() => {
      let url;
      if (item['1. symbol']) {
        url = item['1. symbol'];
      } else {
        url = item;
      }
      this.dataService.getMethod(HttpApi.getStock + url).subscribe({
        next: (res) => {
          console.log('🚀 46 ~ AddPredictModalComponent ~ ~ res', res);
          this.getStockDetail = res['Global Quote'];
          if (this.getStockDetail['10. change percent'].includes('-')) {
            this.symbolIcon = true;
          }
          if (!this.isEdit) {
            this.predictForm.patchValue({
              stock: item['1. symbol'],
              buyPrice: this.getStockDetail['05. price'],
              currentPrice: this.getStockDetail['05. price'],
              stopLoss: this.getStockDetail['05. price'] / 2,
            });
          }
          this.typeChange();
          this.autoCompleteArray = [];
          this.slider.lockSwipes(false);
          this.slider.slideNext();
          this.slider.lockSwipes(true);
          this.loader.dismiss();
        },
        error: (e) => {
          console.error(e);
          this.loader.dismiss();
          this.toast.presentToast(e.message);
        },
      });
    });
  }
  onSaveClick() {
    this.dataService
      .postMethod(HttpApi.predictionNew, this.predictForm.value)
      .subscribe({
        next: (res) => {
          console.log('🚀 :46 ~ AddPredictModalComponent ~ res', res);
          this.toast.presentToast('Prediction Created Successfully');
          this.modalController.dismiss({}, 'success');
        },
        error: (e) => {
          console.log(e);
          console.log(e.message);
          this.toast.presentToast(e.message);
        },
      });
  }
  updateClick() {
    this.dataService
      .postMethod(
        HttpApi.updatePredction + this.isData.id,
        this.predictForm.value
      )
      .subscribe({
        next: (res) => {
          console.log('🚀 :46 ~ AddPredictModalComponent ~ res', res);
          this.toast.presentToast('Prediction Created Successfully');
          this.modalController.dismiss({}, 'success');
        },
        error: (e) => {
          console.log(e);
          console.log(e.message);
          this.toast.presentToast(e.message);
        },
      });
  }
  OriginalPriceChange(ev: any) {
    console.log(ev);
    this.predictForm.patchValue({ sellPrice: +ev.detail.target.value });
  }
  async saveClick() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Are you sure you want to post this prediction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'YES',
          role: 'confirm',
          handler: () => {
            this.onSaveClick();
          },
        },
      ],
    });

    await alert.present();
  }

  typeChange(ev: any = {}) {
    console.log(this.selectedType);
    if (ev?.detail?.value) {
      this.selectedType = ev?.detail?.value;
    }
    if (this.selectedType == 'INTRADAY') {
      if (moment().isBefore(moment().set({ hour: 15, minutes: 45 }))) {
        this.predictForm.patchValue({
          tradeDate: moment().format('dd-MMM-YYYY'),
        });
      } else {
        this.predictForm.patchValue({
          tradeDate: moment().add(1, 'day').format('dd-MMM-YYYY'),
        });
      }
      console.log(this.predictForm.value.tradeDate);
    } else if (this.selectedType == 'DELIVERY') {
      let now = moment().add(1, 'months').format('dd-MMM-YYYY');
      console.log(now);
      this.predictForm.patchValue({ tradeDate: now });
    }
  }
}
