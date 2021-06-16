import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTurmasModalComponent } from './edit-turmas-modal.component';

describe('EditTurmasModalComponent', () => {
  let component: EditTurmasModalComponent;
  let fixture: ComponentFixture<EditTurmasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTurmasModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTurmasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
