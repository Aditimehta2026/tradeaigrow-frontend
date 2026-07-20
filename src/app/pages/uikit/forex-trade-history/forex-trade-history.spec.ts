import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForexTradeHistory } from './forex-trade-history';

describe('ForexTradeHistory', () => {
  let component: ForexTradeHistory;
  let fixture: ComponentFixture<ForexTradeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForexTradeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForexTradeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
