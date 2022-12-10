import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'toastGlobal',
      translucent: true,
      color: 'primary',
      mode: 'md',
    });
    toast.present();
  }
}
