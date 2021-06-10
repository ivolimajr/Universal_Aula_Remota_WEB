import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdministrativeModalComponentComponent } from './edit-administrative-modal-component.component';

describe('EditAdministrativeModalComponentComponent', () => {
  let component: EditAdministrativeModalComponentComponent;
  let fixture: ComponentFixture<EditAdministrativeModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdministrativeModalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdministrativeModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
