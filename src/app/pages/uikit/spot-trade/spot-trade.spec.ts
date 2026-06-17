import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotTrade } from './spot-trade';

describe('SpotTrade', () => {
  let component: SpotTrade;
  let fixture: ComponentFixture<SpotTrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotTrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotTrade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
