import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.scss'],
})
export class StockCardComponent implements OnInit {
  @Input() stockItem: any;
  constructor() {}

  ngOnInit() {}
}
