import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'predictor-item',
  templateUrl: './predictor-item.component.html',
  styleUrls: ['./predictor-item.component.scss'],
})
export class PredictorItemComponent implements OnInit {
  @Input() predictor: any;
  constructor() {}

  ngOnInit() {}
}
