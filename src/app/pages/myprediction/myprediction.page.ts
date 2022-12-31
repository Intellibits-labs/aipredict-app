import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonPopover,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoaderService } from 'src/app/core/general/service/loader.service';
import { AddPredictModalComponent } from 'src/app/shared/add-predict-modal/add-predict-modal.component';
import { PredictActionModalComponent } from 'src/app/shared/predict-action-modal/predict-action-modal.component';

@Component({
  selector: 'app-myprediction',
  templateUrl: './myprediction.page.html',
  styleUrls: ['./myprediction.page.scss'],
})
export class MypredictionPage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;
  predictions: any = [];
  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private popoverController: PopoverController,
    private loader: LoaderService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getPredictions();
  }

  getPredictions() {
    this.loader.presentLoading().then(() => {
      this.dataService
        .getMethod(HttpApi.getPredictionMy + '?sortBy=createdAt:desc')
        .subscribe({
          next: (res) => {
            console.log(res);
            this.predictions = res.results;
            this.loader.dismiss();
          },
          error: (error) => {
            console.log(error.message);
            this.loader.dismiss();
          },
        });
    });
  }
  async addpredict(idEdit = false, item: any = {}) {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: AddPredictModalComponent,
      mode: 'md',
      componentProps: { isData: item, isEdit: idEdit },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
        this.getPredictions();
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
    popover.onDidDismiss().then((data) => {
      if (data.role == 'success') {
        console.log(data.data);
        if (data.data == 'Edit') {
          this.addpredict(true, item);
        } else if (data.data == 'Archive') {
        } else if (data.data == 'Delete') {
          this.deleteAlert(item);
        }
      }
    });
    await popover.present();
  }

  async deleteAlert(item: any) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      message: 'Do you want to Delete!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'YES',
          role: 'confirm',
          handler: () => {
            this.dataService
              .getMethod(HttpApi.deletePrediction + item.id)
              .subscribe({
                next: (res) => {
                  console.log(res);
                  this.getPredictions();
                  this.loader.dismiss();
                },
                error: (error) => {
                  console.log(error.message);
                  this.loader.dismiss();
                },
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
