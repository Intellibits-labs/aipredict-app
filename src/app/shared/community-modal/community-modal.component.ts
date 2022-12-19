import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-community-modal',
  templateUrl: './community-modal.component.html',
  styleUrls: ['./community-modal.component.scss'],
})
export class CommunityModalComponent implements OnInit {
  @Input() predictor: any;
  predictorArray: any = [];
  segmentValue: any = 'active';
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
          this.predictorArray = res;
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
  }
}
