import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepParametersComponent } from './step-parameters.component';

describe('StepParametersComponent', () => {
  let component: StepParametersComponent;
  let fixture: ComponentFixture<StepParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
