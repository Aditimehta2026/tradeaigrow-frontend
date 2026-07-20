import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForexTradeForm } from './forex-trade-form';

describe('ForexTradeForm', () => {
  let component: ForexTradeForm;
  let fixture: ComponentFixture<ForexTradeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForexTradeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForexTradeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
