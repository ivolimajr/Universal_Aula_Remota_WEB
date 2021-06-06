import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfcComponent } from './cfc.component';

describe('CfcComponent', () => {
  let component: CfcComponent;
  let fixture: ComponentFixture<CfcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
