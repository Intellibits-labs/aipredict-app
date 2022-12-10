import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class LoaderService {
  loading: any;

  constructor(private loader: LoadingController) {}
  async presentLoading() {
    this.loading = await this.loader.create({
      message: "Please wait...",
      spinner: "crescent"
    });
    await this.loading.present();

    // const { role, data } = await this.loading.onDidDismiss();
    console.log("Loading dismissed!");
  }
  dismiss() {
    this.loader.dismiss();
  }
}
