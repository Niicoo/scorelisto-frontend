import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedConverterComponent } from './advanced-converter.component';

describe('AdvancedConverterComponent', () => {
  let component: AdvancedConverterComponent;
  let fixture: ComponentFixture<AdvancedConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedConverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
