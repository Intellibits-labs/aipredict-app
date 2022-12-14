import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpApi } from '../core/general/http/http-api';
import { DataService } from '../core/general/service/data.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  userData: any;
  constructor(
    public modalController: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getUserData();
  }
  getUserData() {
    this.dataService.getMethod(HttpApi.me).subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res;
        console.log(this.userData.picture);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
