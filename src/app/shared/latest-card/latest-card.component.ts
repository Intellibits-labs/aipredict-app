import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'latest-card',
  templateUrl: './latest-card.component.html',
  styleUrls: ['./latest-card.component.scss'],
})
export class LatestCardComponent implements OnInit {
  @Input() latestItem: any;
  constructor() {}

  ngOnInit() {}
}
