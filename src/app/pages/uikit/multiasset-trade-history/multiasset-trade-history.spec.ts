import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiassetTradeHistory } from './multiasset-trade-history';

describe('MultiassetTradeHistory', () => {
  let component: MultiassetTradeHistory;
  let fixture: ComponentFixture<MultiassetTradeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiassetTradeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiassetTradeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
