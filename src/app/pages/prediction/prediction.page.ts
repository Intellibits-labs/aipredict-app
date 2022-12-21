import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover, ModalController, PopoverController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { AddPredictModalComponent } from 'src/app/shared/add-predict-modal/add-predict-modal.component';
import { PredictActionModalComponent } from 'src/app/shared/predict-action-modal/predict-action-modal.component';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.page.html',
  styleUrls: ['./prediction.page.scss'],
})
export class PredictionPage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;
  predictions: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.getPredictions();
  }

  getPredictions() {
    this.dataService.getMethod(HttpApi.getPrediction).subscribe({
      next: (res) => {
        console.log(res);
        this.predictions = res.results;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  async addpredict() {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: AddPredictModalComponent,
      mode: 'md',
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }
  async actionClick(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: PredictActionModalComponent,
      event: ev,
      componentProps: { predictData: item },
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
  }
}