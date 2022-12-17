import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-predict-action-modal',
  templateUrl: './predict-action-modal.component.html',
  styleUrls: ['./predict-action-modal.component.scss'],
})
export class PredictActionModalComponent implements OnInit {
  @Input() predictData: any;
  constructor() {}

  ngOnInit() {}
}
