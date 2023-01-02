import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover, ModalController, PopoverController } from '@ionic/angular';
import { HttpApi } from 'src/app/core/general/http/http-api';
import { DataService } from 'src/app/core/general/service/data.service';
import { LoaderService } from 'src/app/core/general/service/loader.service';
import { AddPredictModalComponent } from 'src/app/shared/add-predict-modal/add-predict-modal.component';
import { LatestModalComponent } from 'src/app/shared/latest-modal/latest-modal.component';
import { PredictActionModalComponent } from 'src/app/shared/predict-action-modal/predict-action-modal.component';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.page.html',
  styleUrls: ['./prediction.page.scss'],
})
export class PredictionPage implements OnInit {
  @ViewChild('popover') popover!: IonPopover;
  predictionArray: any = [];

  page = 1;

  totalPages = 0;
  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private popoverController: PopoverController,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.getPredictions();
  }

  getPredictions(page = '1', ev: any = null) {
    this.loader.presentLoading().then(() => {
      this.dataService
        .getMethod(
          HttpApi.getPrediction + '?sortBy=createdAt:desc&limit=15&page=' + page
        )
        .subscribe({
          next: (res) => {
            console.log('🚀 ~ file: home.page.ts:51 ~ HomePage ~  ~ res', res);
            this.totalPages = res.totalPages;
            this.page = res.page;
            this.predictionArray.push(...res.results);
            this.loader.dismiss();
            if (ev) {
              ev.target.complete();
              if (res.totalPages == res.page) {
                ev.target.disabled = true;
              }
            }
          },
          error: (e) => {
            console.error(e);
            this.loader.dismiss();
          },
        });
    });
  }

  loadData(ev: any) {
    console.log(ev);
    this.page++;
    this.getPredictions(this.page.toString(), ev);
  }
  doRefresh(event: any) {
    this.predictionArray = [];
    console.log('Begin async operation');
    this.getPredictions('1', event);
  }

  searchKey(ev: any) {
    console.log(ev.target.value);
    let searchV = ev.target.value;
    if (searchV) {
      this.searchClick(searchV);
    }
  }
  searchClick(value: any) {
    console.log(value);
    this.predictionArray = [];
    if (value) {
      this.loader.presentLoading().then(() => {
        this.dataService.getMethod(HttpApi.searchPredction + value).subscribe({
          next: (res) => {
            console.log('🚀 ~ 55 ~ SearchResultPage ~ res', res);
            this.totalPages = res.totalPages;
            this.page = res.page;
            this.predictionArray = res.results;
            this.loader.dismiss();
          },
          error: (e) => {
            console.error(e.message);
            this.loader.dismiss();
          },
        });
      });
    }
  }

  async latestModal(item: any) {
    const modal = await this.modalController.create({
      cssClass: 'my-alert-class',
      component: LatestModalComponent,
      mode: 'md',
      componentProps: { latestItem: item },
    });
    modal.onDidDismiss().then((data) => {
      if (data.role == 'success') {
      }
    });
    await modal.present();
  }
}
