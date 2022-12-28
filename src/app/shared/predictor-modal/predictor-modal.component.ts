import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-predictor-modal',
  templateUrl: './predictor-modal.component.html',
  styleUrls: ['./predictor-modal.component.scss'],
})
export class PredictorModalComponent implements OnInit {
  @Input() predictor: any;
  predictorArray: any = [];
  segmentValue: any = 'active';
  responseArray: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    console.log(this.predictor);
    this.getData();
  }
  getData() {
    this.dataService
      .getMethod(HttpApi.singlePredictor + this.predictor?.id)
      .subscribe({
        next: (res) => {
          console.log('🚀 ~35 ~ StockModalComponent ~ ~ res', res);
          this.responseArray = res;
        },
        error: (e) => console.error(e),
      });
  }
  dismiss() {
    this.modalController.dismiss();
  }
  segmentChanged(ev: any) {
    console.log(ev);
    this.segmentValue = ev.detail.value;
    if (this.segmentValue == 'active') {
      this.predictorArray = this.responseArray.filter(
        (x: any) => x.status == 'PENDING'
      );
    } else if (this.segmentValue == 'past') {
      this.predictorArray = this.responseArray.filter(
        (x: any) => x.status == 'COMPLETED' || x.status == 'FAILED'
      );
    }
  }
}
