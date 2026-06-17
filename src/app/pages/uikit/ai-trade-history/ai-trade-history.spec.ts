import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTradeHistory } from './ai-trade-history';

describe('AiTradeHistory', () => {
  let component: AiTradeHistory;
  let fixture: ComponentFixture<AiTradeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTradeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTradeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
