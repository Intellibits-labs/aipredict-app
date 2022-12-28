import { TestBed } from '@angular/core/testing';

import { CompareSellingPriceService } from './compare-selling-price.service';

describe('CompareSellingPriceService', () => {
  let service: CompareSellingPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareSellingPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
