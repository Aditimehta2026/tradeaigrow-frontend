import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotTradeHistory } from './spot-trade-history';

describe('SpotTradeHistory', () => {
  let component: SpotTradeHistory;
  let fixture: ComponentFixture<SpotTradeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotTradeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotTradeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
