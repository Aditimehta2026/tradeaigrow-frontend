import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceHeader } from './account-balance-header';

describe('AccountBalanceHeader', () => {
  let component: AccountBalanceHeader;
  let fixture: ComponentFixture<AccountBalanceHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBalanceHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountBalanceHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
