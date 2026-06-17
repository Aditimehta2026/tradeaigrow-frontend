import { TestBed } from '@angular/core/testing';

import { Withdraw } from './withdraw';

describe('Withdraw', () => {
  let service: Withdraw;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Withdraw);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
