import { TestBed } from '@angular/core/testing';

import { ShortlistService } from './shortlist.service';

describe('ShortlistService', () => {
  let service: ShortlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
