import { TestBed } from '@angular/core/testing';

import { AItrading } from './aitrading';

describe('AItrading', () => {
  let service: AItrading;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AItrading);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
