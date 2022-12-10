import { TestBed } from '@angular/core/testing';

import { AutoinputService } from './autoinput.service';

describe('AutoinputService', () => {
  let service: AutoinputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoinputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
