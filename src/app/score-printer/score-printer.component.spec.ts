import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePrinterComponent } from './score-printer.component';

describe('ScorePrinterComponent', () => {
  let component: ScorePrinterComponent;
  let fixture: ComponentFixture<ScorePrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorePrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorePrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
