import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStudentModalComponentComponent } from './edit-student-modal-component.component';

describe('EditStudentModalComponentComponent', () => {
  let component: EditStudentModalComponentComponent;
  let fixture: ComponentFixture<EditStudentModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStudentModalComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStudentModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
