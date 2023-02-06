import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() filterData: any;
  status: any;
  selectedItem = 'status';
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log(this.filterData);
    if (this.filterData?.status) {
      this.status = this.filterData?.status;
    }
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

  submit() {
    console.log(this.status);
    if (this.status) {
      let data = {
        status: this.status,
      };
      this.modalController.dismiss(data, 'success');
    }
  }
}
