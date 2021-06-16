import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCursoModalComponent } from './edit-curso-modal.component';

describe('EditCursoModalComponent', () => {
  let component: EditCursoModalComponent;
  let fixture: ComponentFixture<EditCursoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCursoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCursoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
