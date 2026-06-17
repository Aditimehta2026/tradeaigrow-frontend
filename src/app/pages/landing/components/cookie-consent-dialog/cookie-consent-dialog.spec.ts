import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentDialog } from './cookie-consent-dialog';

describe('CookieConsentDialog', () => {
  let component: CookieConsentDialog;
  let fixture: ComponentFixture<CookieConsentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieConsentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieConsentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
