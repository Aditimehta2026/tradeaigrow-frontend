import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalHistory } from './withdrawal-history';

describe('WithdrawalHistory', () => {
  let component: WithdrawalHistory;
  let fixture: ComponentFixture<WithdrawalHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
