import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchParametersComponent } from './pitch-parameters.component';

describe('PitchParametersComponent', () => {
  let component: PitchParametersComponent;
  let fixture: ComponentFixture<PitchParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
