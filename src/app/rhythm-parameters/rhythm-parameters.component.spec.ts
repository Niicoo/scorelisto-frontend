import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhythmParametersComponent } from './rhythm-parameters.component';

describe('RhythmParametersComponent', () => {
  let component: RhythmParametersComponent;
  let fixture: ComponentFixture<RhythmParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhythmParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhythmParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
