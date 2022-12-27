import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
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
    private toast: ToastService
  ) {
    this.predictForm = this.formBuilder.group({
      stock: ['', [Validators.required]],
      tradeDate: ['', [Validators.required]],
      buyPrice: ['', [Validators.required]],
      sellPrice: ['', [Validators.required]],
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
          this.autoCompleteArray = res?.bestMatches;
        },
        error: (e) => console.error(e),
      });
    }
  }
  selectStock(item: any) {
    this.selectedName = item['2. name'];
    this.dataService.getMethod(HttpApi.getStock + item['1. symbol']).subscribe({
      next: (res) => {
        console.log('🚀 46 ~ AddPredictModalComponent ~ ~ res', res);
        this.getStockDetail = res['Global Quote'];
        if (this.getStockDetail['10. change percent'].includes('-')) {
          this.symbolIcon = true;
        }
        this.predictForm.patchValue({ stock: item['1. symbol'] });
        this.autoCompleteArray = [];
        this.slider.lockSwipes(false);
        this.slider.slideNext();
        this.slider.lockSwipes(true);
      },
      error: (e) => console.error(e),
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
        error: (e) => console.error(e),
      });
  }
}
