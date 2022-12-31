import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-predict-action-modal',
  templateUrl: './predict-action-modal.component.html',
  styleUrls: ['./predict-action-modal.component.scss'],
})
export class PredictActionModalComponent implements OnInit {
  @Input() predictData: any;
  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  onClick(item: any) {
    this.popoverController.dismiss(item, 'success');
  }
}
