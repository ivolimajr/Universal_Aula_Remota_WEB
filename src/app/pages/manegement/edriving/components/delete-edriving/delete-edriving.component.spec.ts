import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEdrivingComponent } from './delete-edriving.component';

describe('DeleteEdrivingComponent', () => {
  let component: DeleteEdrivingComponent;
  let fixture: ComponentFixture<DeleteEdrivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEdrivingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEdrivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
