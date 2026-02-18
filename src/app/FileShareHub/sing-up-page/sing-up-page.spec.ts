import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingUpPage } from './sing-up-page';

describe('SingUpPage', () => {
  let component: SingUpPage;
  let fixture: ComponentFixture<SingUpPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingUpPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingUpPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
