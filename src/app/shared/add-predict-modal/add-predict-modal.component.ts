import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
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
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toast: ToastService,
    private loader: LoaderService,
    private comparePriceService: CompareSellingPriceService
  ) {
    this.predictForm = this.formBuilder.group({
      stock: ['', [Validators.required]],
      tradeDate: ['', [Validators.required]],
      buyPrice: ['', [Validators.required]],
      sellPrice: [
        '',
        [Validators.required, this.comparePriceService.greaterThan('buyPrice')],
      ],
      currentPrice: ['', [Validators.required]],
      type: ['', [Validators.required]],
      note: '',
    });
  }

  ngOnInit() {}
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
      this.dataService.getMethod(HttpApi.searchStock + searchValue).subscribe({
        next: (res) => {
          console.log('🚀 46 ~ AddPredictModalComponent ~ ~ res', res);
          // this.autoCompleteArray = res?.bestMatches;
          res?.bestMatches.forEach((element: any) => {
            if (element['8. currency'] == 'INR') {
              this.autoCompleteArray.push(element);
            }
          });
          console.log('INR ', this.autoCompleteArray);
        },
        error: (e) => console.error(e),
      });
    }
  }
  selectStock(item: any) {
    this.selectedName = item['2. name'];
    this.loader.presentLoading().then(() => {
      this.dataService
        .getMethod(HttpApi.getStock + item['1. symbol'])
        .subscribe({
          next: (res) => {
            console.log('🚀 46 ~ AddPredictModalComponent ~ ~ res', res);
            this.getStockDetail = res['Global Quote'];
            if (this.getStockDetail['10. change percent'].includes('-')) {
              this.symbolIcon = true;
            }
            this.predictForm.patchValue({
              stock: item['1. symbol'],
              buyPrice: this.getStockDetail['05. price'],
              currentPrice: this.getStockDetail['05. price'],
            });
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
  saveClick() {
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

  OriginalPriceChange(ev: any) {
    console.log(ev);
    this.predictForm.patchValue({ sellPrice: +ev.detail.target.value });
  }
}
