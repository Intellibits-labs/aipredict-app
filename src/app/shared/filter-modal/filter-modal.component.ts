import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss();
  }
  onClick() {}
}
