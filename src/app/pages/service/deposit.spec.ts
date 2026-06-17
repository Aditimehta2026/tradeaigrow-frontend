import { TestBed } from '@angular/core/testing';

import { Deposit } from './deposit';

describe('Deposit', () => {
  let service: Deposit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deposit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
