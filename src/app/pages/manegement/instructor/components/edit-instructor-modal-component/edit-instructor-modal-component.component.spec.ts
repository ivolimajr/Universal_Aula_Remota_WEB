import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstructorModalComponentComponent } from './edit-instructor-modal-component.component';

describe('EditInstructorModalComponentComponent', () => {
  let component: EditInstructorModalComponentComponent;
  let fixture: ComponentFixture<EditInstructorModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInstructorModalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstructorModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
