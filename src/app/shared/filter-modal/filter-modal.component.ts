import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() filterData: any;
  status: any;
  selectedItem = 'status';
  trendingAssets: any = [];
  selectedStock: any;
  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    console.log(this.filterData);
    if (this.filterData?.status) {
      this.status = this.filterData?.status;
      this.selectedStock = this.filterData?.stock;
    }
    this.getStock();
  }
  dismiss() {
    this.modalController.dismiss();
  }
  onClick(ev: string) {
    this.selectedItem = ev;
  }
  clearClick() {
    this.status = null;
    this.modalController.dismiss({}, 'success');
  }
  getStock() {
    this.dataService.getMethod(HttpApi.allStock).subscribe({
      next: (res) => {
        console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);

        res.map((x: any) => {
          if (
            x?.['meta']?.['Global Quote']?.['10. change percent'].includes('-')
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
  submit() {
    console.log(this.status);
    if (this.status || this.selectedStock) {
      let data: any = {};
      if (this.status) data.status = this.status;
      if (this.selectedStock) data.stock = this.selectedStock;
      this.modalController.dismiss(data, 'success');
    }
  }

  stockModal(item: any) {}
  stockChange(ev: any) {
    console.log(ev.detail.value);
    this.selectedStock = ev.detail.value;
  }
}
