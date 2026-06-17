import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationNewRegister } from './verification-new-register';

describe('VerificationNewRegister', () => {
  let component: VerificationNewRegister;
  let fixture: ComponentFixture<VerificationNewRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationNewRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationNewRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
