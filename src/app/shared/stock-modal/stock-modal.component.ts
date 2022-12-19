import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-stock-modal',
  templateUrl: './stock-modal.component.html',
  styleUrls: ['./stock-modal.component.scss'],
})
export class StockModalComponent implements OnInit {
  symbolIcon: any;
  segmentValue: any = 'active';
  @Input() stockDetail: any;
  predictorArray: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    console.log(this.stockDetail);

    if (
      this.stockDetail?.meta['Global Quote']['10. change percent'].includes('-')
    ) {
      this.symbolIcon = true;
    }
    this.getData();
  }
  getData() {
    this.dataService
      .getMethod(HttpApi.singleStock + this.stockDetail.id)
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
