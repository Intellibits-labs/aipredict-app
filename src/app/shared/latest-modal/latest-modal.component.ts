import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';

@Component({
  selector: 'app-latest-modal',
  templateUrl: './latest-modal.component.html',
  styleUrls: ['./latest-modal.component.scss'],
})
export class LatestModalComponent implements OnInit {
  @Input() latestItem: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('latestItem ', this.latestItem);
  }
  dismiss() {
    this.modalController.dismiss();
  }
}
