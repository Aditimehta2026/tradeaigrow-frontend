import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDeposit } from './admin-create-deposit';

describe('AdminCreateDeposit', () => {
  let component: AdminCreateDeposit;
  let fixture: ComponentFixture<AdminCreateDeposit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDeposit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateDeposit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
