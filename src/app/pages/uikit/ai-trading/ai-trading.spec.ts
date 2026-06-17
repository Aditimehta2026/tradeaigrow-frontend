import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTrading } from './ai-trading';

describe('AiTrading', () => {
  let component: AiTrading;
  let fixture: ComponentFixture<AiTrading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTrading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTrading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
