import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityTrading } from './commodity-trading';

describe('CommodityTrading', () => {
  let component: CommodityTrading;
  let fixture: ComponentFixture<CommodityTrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityTrading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityTrading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
