import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  idClick(element: any) {
    console.log(element);

    document
      .getElementById(element)
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  desclaimer() {}
}
